package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Allow all origins for development
		// In production, you should check the origin properly
		return true
	},
}

// Server is the main server struct
type Server struct {
	ListenAddr string
	httpServer *http.Server

	games map[string]*Game
	mu    sync.RWMutex
}

type MessageType string

const (
	MessageTypeMove       MessageType = "move"
	MessageTypeGameStart  MessageType = "gameStart"
	MessageTypePlayerJoin MessageType = "playerJoin"
	MessageTypeBoardState MessageType = "boardState"
	MessageTypeWinner     MessageType = "winner"
	MessageTypeProperties MessageType = "properties"
	MessageTypeCards      MessageType = "cards"
)

// Message is the message sent from the client to the server and also server to client
type Message struct {
	Type string `json:"type"`
	Data any    `json:"data"`
}

// MoveMessage is the message sent from the client to the server to move a player
type MoveMessage struct {
	Username    string
	DiceAmount1 int
	DiceAmount2 int
}

// BoardsMessage is the message sent from the server to the client to send the properties
type PropertiesMessage struct {
	Places []Place `json:"places"`
}

// PropertyPurchaseRequest is the message sent from the server to the client to request a property purchase
type PropertyPurchaseRequest struct {
	PropertyName string `json:"propertyName"`
	Accepted     bool   `json:"accepted"`
}

// WinnerMessage is the message sent from the server to the client to send the winner
type WinnerMessage struct {
	Winner string `json:"winner"`
}

// GameStartMessage is the message sent from the server to the client when the game starts
type GameStartMessage struct {
	Message string `json:"message"`
}

// PlayerJoinMessage is the message sent from the server to the client when a player joins
type PlayerJoinMessage struct {
	Username        string `json:"username"`
	PlayersJoined   int    `json:"playersJoined"`
	RequiredPlayers int    `json:"requiredPlayers"`
}

// CardsMessage is the message sent from the server to the client to send cards
type CardsMessage struct {
	Cards []Card `json:"cards"`
}

// NewServer creates a new server
func NewServer(listenAddr string) *Server {
	return &Server{
		ListenAddr: listenAddr,
		games:      make(map[string]*Game),
	}
}

// Run starts the server and the http listener
func (s *Server) Run() error {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", s.handleHealth)
	mux.HandleFunc("POST /games", s.handleCreateGame)
	mux.HandleFunc("OPTIONS /games", s.handleOptions)
	mux.HandleFunc("GET /games/{gameId}/join", s.handleJoinGame)
	mux.HandleFunc("OPTIONS /games/{gameId}/join", s.handleOptions)

	s.httpServer = &http.Server{
		Addr:    s.ListenAddr,
		Handler: mux,
	}

	log.Println("Server started on", s.ListenAddr)

	return s.httpServer.ListenAndServe()
}

// Testing health endpoint
func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w, r)
	respondWithJSON(w, r, http.StatusOK, map[string]string{"status": "ok"})
}

// handleCreateGame creates a new game and returns the game ID
func (s *Server) handleCreateGame(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers first
	setCORSHeaders(w, r)

	// Handle preflight OPTIONS request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	competitorCards, monopolistCards := initializeCardDecks()
	game := Game{
		BroadcastCh:     make(chan []byte),
		RequiredPlayers: 2, // Default to 2 players, can be made configurable later
		IsStarted:       false,
		Board: Board{
			Players:         []*Player{},
			Places:          Places,
			CompetitorCards: competitorCards,
			MonopolistCards: monopolistCards,
		},
	}

	gameID := generateGameID()

	s.mu.Lock()
	defer s.mu.Unlock()

	s.games[gameID] = &game
	go game.BroadcastLoop()

	respondWithJSON(w, r, http.StatusOK, map[string]string{"gameId": gameID})
}

// handleJoinGame joins a player to a game
func (s *Server) handleJoinGame(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for WebSocket handshake
	setCORSHeaders(w, r)

	// Get username from query parameter (WebSocket handshake uses GET, not POST)
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	s.mu.Lock()

	gameID := r.PathValue("gameId")
	game, ok := s.games[gameID]
	if !ok {
		http.Error(w, "Game not found", http.StatusNotFound)
		s.mu.Unlock()
		return
	}

	s.mu.Unlock()

	// websocket handling
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		http.Error(w, "Failed to upgrade to WebSocket", http.StatusInternalServerError)
		return
	}

	// Assign role: alternate between competitor and monopolist
	// First player is competitor, second is monopolist, etc.
	role := PlayerRoleCompetitor
	if len(game.Board.Players)%2 == 1 {
		role = PlayerRoleMonopolist
	}

	// create a new player instance
	player := Player{
		Username:           username,
		Role:               role,
		Position:           0,
		Exp:                2000,
		HasJailFree:        false,
		JailAttempts:       0,
		OwnedPlaces:        make(map[Place]int),
		HasExtraTurn:       false,
		ConsecutiveDoubles: 0,
		Conn:               conn,
	}

	game.Board.Players = append(game.Board.Players, &player)

	// send properties to the player
	propertiesMsg := Message{
		Type: string(MessageTypeProperties),
		Data: PropertiesMessage{
			Places: Places,
		},
	}

	propertiesJSON, err := json.Marshal(propertiesMsg)
	if err != nil {
		log.Println("Error marshalling properties message:", err)
	} else {
		game.BroadcastCh <- propertiesJSON
	}

	// send competitor and monopolist cards to the player
	competitorCardsMsg := Message{
		Type: string(MessageTypeCards),
		Data: CardsMessage{
			Cards: game.Board.CompetitorCards,
		},
	}

	competitorCardsJSON, err := json.Marshal(competitorCardsMsg)
	if err != nil {
		log.Println("Error marshalling competitor cards message:", err)
	} else {
		game.BroadcastCh <- competitorCardsJSON
	}

	// Notify all players that a new player joined
	playerJoinMsg := Message{
		Type: string(MessageTypePlayerJoin),
		Data: PlayerJoinMessage{
			Username:        username,
			PlayersJoined:   len(game.Board.Players),
			RequiredPlayers: game.RequiredPlayers,
		},
	}

	playerJoinJSON, err := json.Marshal(playerJoinMsg)
	if err != nil {
		log.Println("Error marshalling player join message:", err)
	} else {
		game.BroadcastCh <- playerJoinJSON
	}

	// Check if all required players have joined and start the game
	if !game.IsStarted && len(game.Board.Players) >= game.RequiredPlayers {
		game.IsStarted = true
		// Set first player as current player
		if game.Board.CurrentPlayer == "" && len(game.Board.Players) > 0 {
			game.Board.CurrentPlayer = game.Board.Players[0].Username
			log.Printf("Game started. Setting first player as current: %s", game.Board.CurrentPlayer)
		}

		// Notify all players that the game has started
		gameStartMsg := Message{
			Type: string(MessageTypeGameStart),
			Data: GameStartMessage{
				Message: "Game started!",
			},
		}

		gameStartJSON, err := json.Marshal(gameStartMsg)
		if err != nil {
			log.Println("Error marshalling game start message:", err)
		} else {
			game.BroadcastCh <- gameStartJSON
		}

		// Broadcast initial board state
		log.Printf("Broadcasting initial board state. CurrentPlayer: %s", game.Board.CurrentPlayer)
		game.broadcastBoardState()
	}

	// main message loop
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}

		var msg Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Println("Error unmarshalling message:", err)
			continue
		}

		switch msg.Type {
		case string(MessageTypeMove):
			game.handleMove(msg)
		}
	}
}

// handleOptions handles OPTIONS requests for CORS preflight
func (s *Server) handleOptions(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w, r)
	w.WriteHeader(http.StatusOK)
}

// setCORSHeaders sets CORS headers for cross-origin requests
func setCORSHeaders(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	if origin != "" {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Credentials", "true")
	} else {
		// If no origin header, allow all origins (for development)
		w.Header().Set("Access-Control-Allow-Origin", "*")
	}
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Access-Control-Max-Age", "3600")
}

// respondWithJSON writes the payload to the response writer as JSON
func respondWithJSON(w http.ResponseWriter, r *http.Request, statusCode int, payload interface{}) {
	// Ensure CORS headers are set
	setCORSHeaders(w, r)

	jsonResponse, err := json.Marshal(payload)
	if err != nil {
		http.Error(w, "Error marshalling JSON", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_, err = w.Write(jsonResponse)
	if err != nil {
		http.Error(w, "Error writing JSON", http.StatusInternalServerError)
		return
	}
}

// generateGameID generates a random 6-digit code for a game
func generateGameID() string {
	code := make([]string, 6)
	for i := range len(code) {
		code[i] = strconv.Itoa(rand.Intn(10))
	}

	return strings.Join(code, "")
}
