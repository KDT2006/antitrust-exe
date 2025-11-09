package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/gorilla/websocket"
)

type MessageType string

const (
	MessageTypeMove MessageType = "move"
)

// MoveMessage is the message sent from the client to the server to move a player
type MoveMessage struct {
	Username   string
	DiceAmount int
}

// Message is the message sent from the client to the server
type Message struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

func main() {
	if len(os.Args) < 4 {
		fmt.Println("Usage: go run ws_tester.go <server_url> <game_id> <username>")
		fmt.Println("Example: go run ws_tester.go localhost:4000 123456 player1")
		os.Exit(1)
	}

	serverURL := os.Args[1]
	gameID := os.Args[2]
	username := os.Args[3]

	// Connect to WebSocket
	wsURL := strings.Replace(serverURL, "http://", "ws://", 1)
	if !strings.HasPrefix(wsURL, "ws://") {
		wsURL = "ws://" + wsURL
	}

	url := fmt.Sprintf("%s/games/%s/join?username=%s", wsURL, gameID, username)
	log.Println("Connecting to URL:", url)

	dialer := websocket.Dialer{}
	conn, _, err := dialer.Dial(url, nil)
	if err != nil {
		fmt.Printf("Error connecting: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close()

	fmt.Printf("Connected as %s\n", username)

	// Read initial message
	var msg json.RawMessage
	if err := conn.ReadJSON(&msg); err != nil {
		fmt.Printf("Error reading: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Received: %s\n", string(msg))

	// Send move message
	moveMsg := Message{
		Type: string(MessageTypeMove),
		Data: func() json.RawMessage {
			move := MoveMessage{Username: username, DiceAmount: 5}
			data, _ := json.Marshal(move)
			return data
		}(),
	}

	if err := conn.WriteJSON(moveMsg); err != nil {
		fmt.Printf("Error sending: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Sent move message\n")

	// Listen for messages
	for {
		var msg json.RawMessage
		if err := conn.ReadJSON(&msg); err != nil {
			fmt.Printf("Error: %v\n", err)
			break
		}
		fmt.Printf("Received: %s\n", string(msg))
	}
}
