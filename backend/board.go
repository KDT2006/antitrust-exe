package main

import (
	"encoding/json"
	"log"
	"math/rand"

	"github.com/gorilla/websocket"
)

type PlaceColor string

const (
	PlaceColorBrown     PlaceColor = "brown"
	PlaceColorLightBlue PlaceColor = "lightBlue"
	PlaceColorPink      PlaceColor = "pink"
	PlaceColorOrange    PlaceColor = "orange"
	PlaceColorRed       PlaceColor = "red"
	PlaceColorYellow    PlaceColor = "yellow"
	PlaceColorGreen     PlaceColor = "green"
	PlaceColorDarkBlue  PlaceColor = "darkBlue"
)

type PlayerRole string

const (
	PlayerRoleCompetitor PlayerRole = "competitor"
	PlayerRoleMonopolist PlayerRole = "monopolist"
)

type CardType string

const (
	CardTypeCompetitor CardType = "competitor"
	CardTypeMonopolist CardType = "monopolist"
)

type Player struct {
	Username           string          `json:"username"`
	Role               PlayerRole      `json:"role"`
	Position           int             `json:"position"`
	Exp                int             `json:"exp"`
	HasJailFree        bool            `json:"hasJailFree"`
	JailAttempts       int             `json:"jailAttempts"`
	OwnedPlaces        map[Place]int   `json:"ownedPlaces"`
	HasExtraTurn       bool            `json:"hasExtraTurn"`
	ConsecutiveDoubles int             `json:"consecutiveDoubles"`
	Conn               *websocket.Conn `json:"-"`
}

type Place struct {
	Name           string     `json:"name"`
	Description    string     `json:"description"`
	Price          int        `json:"price"`
	Rent           int        `json:"rent"`
	Color          PlaceColor `json:"color"`
	Owner          string     `json:"owner"`
	NumServers     int        `json:"numServers"`
	PriceOfServers int        `json:"priceOfServers"`
	Rent1Servers   int        `json:"rent1Servers"`
	Rent2Servers   int        `json:"rent2Servers"`
	Rent3Servers   int        `json:"rent3Servers"`
	Rent4Servers   int        `json:"rent4Servers"`
	Rent5Servers   int        `json:"rent5Servers"`
}

type Card struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Board struct {
	Players []*Player `json:"players"`

	Places          []Place  `json:"places"`
	CurrentPlayer   string   `json:"currentPlayer"`
	CompetitorCards []Card   `json:"competitorCards"`
	MonopolistCards []Card   `json:"monopolistCards"`
	Jail            []string `json:"jail"`
}

type Game struct {
	BroadcastCh  chan []byte `json:"-"`
	Board        Board       `json:"board"`
	HostUsername string      `json:"hostUsername"`
}

var Places = []Place{
	{
		Name:        "VS Code",
		Description: "The best Code Editor.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorBrown,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Emacs",
		Description: "Neovim's older brother.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorLightBlue,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Sockets",
		Description: "Connect anything, anywhere.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorPink,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Pipes",
		Description: "Pass it along!",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorOrange,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Message Queues",
		Description: "Keep it moving!",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorRed,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Shared Memory",
		Description: "What's mine is yours.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorYellow,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Burnout",
		Description: "panic(\"Ahhhhhhhh!\")",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Data Corruption",
		Description: "Bits flipped, dreams crushed.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorDarkBlue,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "HTML",
		Description: "The backbone of the web.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorBrown,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "CSS",
		Description: "Make it pretty.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorLightBlue,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "115",
		Description: "Hello, world!",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Python",
		Description: "Simple yet powerful.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Ocaml",
		Description: "Pattern matching",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Java",
		Description: "Write once, run anywhere.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "OOP",
		Description: "Classy code.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "116",
		Description: "Hello, world 2!",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "250",
		Description: "Trees Everywhere",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Hashmap",
		Description: "O(1) lookups",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Leetcode",
		Description: "Practice makes perfect.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "C",
		Description: "The original.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Go",
		Description: "Go for glory!",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "331",
		Description: "You thought 250 was hard...",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Algorithms",
		Description: "The art of the possible.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "474",
		Description: "BackPropagation!",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "341",
		Description: "Its All 1s And 0s",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "379",
		Description: "Kris is the GOAT! ",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Mips",
		Description: "The old school.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "439",
		Description: "Unleash the Quantum Leap!",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "486",
		Description: "Go Distributed. Go Far.",
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "System crash",
		Description: "System crash / Infinite Loop - Combined jail space (System crash for monopolists, Infinite Loop for competitors)",
		Price:       0,
		Rent:        0,
		Color:       "",
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "Code Errors",
		Description: "Just visiting - no action",
		Price:       0,
		Rent:        0,
		Color:       "",
		Owner:       "",
		NumServers:  0,
	},
}

// initializeCardDecks initializes the competitor and monopolist card decks
func initializeCardDecks() ([]Card, []Card) {
	competitorCards := []Card{
		{Name: "move_to_nearest_ipc", Description: "Move to nearest IPC"},
		{Name: "move_to_emacs", Description: "Move to Emacs"},
		{Name: "move_to_start", Description: "Move to Start and collect 100 EXP"},
		{Name: "collect_xp_card_1", Description: "Collect 50 EXP"},
		{Name: "collect_xp_card_2", Description: "Collect 75 EXP"},
		{Name: "collect_xp_card_3", Description: "Collect 25 EXP"},
		{Name: "collect_xp_card_4", Description: "Collect 50 EXP"},
		{Name: "dice_based_card_1", Description: "Roll dice, if sum >= 8 collect 75 EXP"},
		{Name: "pay_xp_card_1", Description: "Pay 50 EXP"},
		{Name: "pay_xp_card_2", Description: "Pay 75 EXP"},
	}

	monopolistCards := []Card{
		{Name: "move_to_quantum_computing", Description: "Move to Quantum Computing"},
		{Name: "collect_xp_card_5", Description: "All monopolists collect 25 EXP"},
		{Name: "collect_xp_card_6", Description: "Collect 75 EXP"},
		{Name: "collect_xp_card_7", Description: "Collect 50 EXP"},
		{Name: "collect_xp_card_8", Description: "Collect 25 EXP from each competitor"},
		{Name: "pay_xp_card_3", Description: "Pay 25 EXP"},
		{Name: "pay_xp_card_4", Description: "Pay 75 EXP"},
		{Name: "pay_xp_card_5", Description: "Pay 25 EXP"},
		{Name: "go_to_prison_card_1", Description: "Go to System crash"},
		{Name: "go_to_prison_card_2", Description: "Go to System crash"},
	}

	return competitorCards, monopolistCards
}

func (g *Game) handleMove(msg Message) {
	var move MoveMessage

	if err := json.Unmarshal(msg.Data, &move); err != nil {
		log.Println("Error unmarshalling move message:", err)
		return
	}

	// 1. Validation & Pre-Move Checks
	// Verify it's the player's turn
	if g.Board.CurrentPlayer != move.Username {
		log.Println("Not the player's turn:", move.Username)
		return
	}

	// Find the player object
	var player *Player
	for _, p := range g.Board.Players {
		if p.Username == move.Username {
			player = p
			break
		}
	}

	if player == nil {
		log.Println("Player not found:", move.Username)
		return
	}

	// Check if player is in System crash/Infinite Loop and handle getting out logic
	if g.isPlayerInPrisonOrPriceWar(player) {
		if !g.handlePrisonPriceWarExit(player, move) {
			// Player couldn't get out, turn ends - advance to next player
			g.Board.CurrentPlayer = g.getNextPlayer(player.Username)
			g.broadcastBoardState()
			return
		}
		// Player got out, continue with movement
	}

	// 2. Doubles Detection
	diceSum := move.DiceAmount1 + move.DiceAmount2
	isDoubles := move.DiceAmount1 == move.DiceAmount2
	isExtraTurn := g.isExtraTurnFromDoubles(player)

	// Clear extra turn flag at the start of the turn (it was set for this turn)
	if isExtraTurn {
		player.HasExtraTurn = false
	}

	// Anti-Monopoly: Track consecutive doubles
	// If player rolls doubles twice in a row, send them to jail
	if isDoubles {
		player.ConsecutiveDoubles++
		// Anti-Monopoly rule: Can roll doubles once, go to jail on second time
		if player.ConsecutiveDoubles >= 2 {
			// Send player to jail for rolling doubles twice
			g.sendPlayerToJail(player, "go_to_prison")
			player.ConsecutiveDoubles = 0
			player.HasExtraTurn = false // Clear extra turn flag
			// Turn ends, advance to next player
			g.Board.CurrentPlayer = g.getNextPlayer(player.Username)
			g.broadcastBoardState()
			return
		}
	} else {
		// Reset consecutive doubles counter if not doubles
		player.ConsecutiveDoubles = 0
	}

	// 3. Movement Execution
	currentPosition := player.Position
	boardSize := len(g.Board.Places)
	newPosition := (currentPosition + diceSum) % boardSize
	passedStart := newPosition < currentPosition

	player.Position = newPosition

	// 4. Start Space Handling
	if passedStart || newPosition == 0 {
		// player gets 100 EXP for passing Go!
		player.Exp += 100
	}

	// 5. Landing Space Resolution
	g.resolveLandingSpace(player, newPosition)

	// 6. Post-Move Processing
	if isDoubles && !isExtraTurn {
		// Grant extra turn (flag for next move)
		// Anti-Monopoly: Can roll doubles once (one extra turn)
		g.setExtraTurnFlag(player)
		g.Board.CurrentPlayer = player.Username
	} else {
		// Advance to next player's turn
		g.Board.CurrentPlayer = g.getNextPlayer(player.Username)
	}

	// 8. State Update & Broadcasting
	g.broadcastBoardState()
}

// Helper function to check if player is in System crash or Infinite Loop
func (g *Game) isPlayerInPrisonOrPriceWar(player *Player) bool {
	// Check if current position is the combined jail space (System crash for monopolists, Infinite Loop for competitors)
	spaceName := g.Board.Places[player.Position].Name
	return spaceName == "System crash" || spaceName == "Infinite Loop" || spaceName == "Jail"
}

// Helper function to handle System crash/Infinite Loop exit logic
func (g *Game) handlePrisonPriceWarExit(player *Player, move MoveMessage) bool {
	// Check if player can get out (doubles roll, pay $50, or forced after 2 turns)
	player.JailAttempts++

	// Try doubles first
	if move.DiceAmount1 == move.DiceAmount2 {
		// Player leaves jail
		g.Board.Jail = g.removePlayerFromJail(g.Board.Jail, player.Username)
		player.JailAttempts = 0
		return true
	}

	// After 2 attempts, force exit (pay $50)
	if player.JailAttempts >= 2 {
		// Player pays the fine
		if player.Exp >= 50 {
			player.Exp -= 50
			g.Board.Jail = g.removePlayerFromJail(g.Board.Jail, player.Username)
			player.JailAttempts = 0
			return true
		} else {
			// Player can't pay, handle bankruptcy
			g.handleBankruptcy(player)
			return false
		}
	}

	// Player stays in jail
	return false
}

// Helper function to resolve landing space effects
func (g *Game) resolveLandingSpace(player *Player, position int) {
	space := g.Board.Places[position]
	spaceType := g.getSpaceType(position)

	switch spaceType {
	case "sightseeing":
		// Sightseeing Corner (first corner): No action, continue normally
		return

	case "unowned_property":
		// Unowned Property: Player can buy (client decision or auto-decline)
		propertyPurchaseRequest := PropertyPurchaseRequest{
			PropertyName: space.Name,
			Accepted:     false,
		}
		if err := player.Conn.WriteJSON(propertyPurchaseRequest); err != nil {
			log.Println("Error writing property purchase request to player:", err)
			return
		}
		var response PropertyPurchaseRequest
		if err := player.Conn.ReadJSON(&response); err != nil {
			log.Println("Error reading property purchase response from player:", err)
			return
		}
		if response.Accepted {
			space.Owner = player.Username
			player.Exp -= space.Price
		} else {
			// player declined the purchase
			return
		}

	case "owned_property":
		// Owned Property: Calculate and pay rent
		g.handleRentPayment(player, &space)
		return

	case "competitor_card", "monopolist_card":
		// Competitor/Monopolist Card Space: Draw and resolve card
		g.handleCardSpace(player, spaceType)
		return

	case "go_to_prison", "go_to_price_war":
		// Go to System crash / Go to Infinite Loop: Move player to jail
		g.sendPlayerToJail(player, spaceType)
		return

	case "income_tax":
		// Income Tax: Calculate and pay
		g.handleIncomeTax(player)
		return

	case "property_tax":
		// Property Tax: player loses 75 EXP
		if player.Exp >= 75 {
			player.Exp -= 75
		} else {
			g.handleBankruptcy(player)
		}
		return

	case "anti_monopoly_foundation":
		// Anti-Monopoly Foundation: Roll 1 die or pay
		g.handleAntiMonopolyFoundation(player)
		return

	default:
		// Regular property space
		if space.Owner != "" && space.Owner != player.Username {
			g.handleRentPayment(player, &space)
		}
	}
}

// Helper function to get space type
func (g *Game) getSpaceType(position int) string {
	// Returns: "sightseeing", "unowned_property", "owned_property",
	// "competitor_card", "monopolist_card", "go_to_prison" (System crash), "go_to_price_war" (Infinite Loop),
	// "income_tax", "property_tax", "anti_monopoly_foundation", etc.

	space := g.Board.Places[position]

	// Simple detection based on name (placeholder)
	switch space.Name {
	case "Income Tax":
		return "income_tax"
	case "Property Tax":
		return "property_tax"
	case "Anti-Monopoly Foundation":
		return "anti_monopoly_foundation"
	case "Go to Prison", "Go to System crash":
		return "go_to_prison"
	case "Go to Price War", "Go to Infinite Loop":
		return "go_to_price_war"
	case "Competitor Card", "Competitor":
		return "competitor_card"
	case "Monopolist Card", "Monopolist":
		return "monopolist_card"
	case "Code Errors":
		return "sightseeing" // Just visiting, no action
	default:
		if space.Owner == "" {
			return "unowned_property"
		}
		return "owned_property"
	}
}

// Helper function to handle rent payment
func (g *Game) handleRentPayment(player *Player, space *Place) {
	if space.Owner == "" || space.Owner == player.Username {
		return
	}

	// Find owner
	var owner *Player
	for _, p := range g.Board.Players {
		if p.Username == space.Owner {
			owner = p
			break
		}
	}

	if owner == nil {
		return
	}

	// Check if owner is in System crash/Infinite Loop (monopolists can't collect)
	if g.isPlayerInPrisonOrPriceWar(owner) {
		if owner.Role == PlayerRoleMonopolist {
			return
		} else {
			// check if competitor can pay rent
			rent := g.calculateRent(space)
			if player.Exp >= rent {
				player.Exp -= rent
				owner.Exp += rent
			} else {
				// Handle bankruptcy
				g.handleBankruptcy(player)
			}
		}
	}

	// Calculate rent based on owner's role and buildings
	rent := g.calculateRent(space)

	// Transfer rent payment
	if player.Exp >= rent {
		player.Exp -= rent
		owner.Exp += rent
	} else {
		// Handle bankruptcy
		g.handleBankruptcy(player)
	}
}

// Helper function to calculate rent
func (g *Game) calculateRent(space *Place) int {
	switch space.NumServers {
	case 0:
		return space.Rent
	case 1:
		return space.Rent1Servers
	case 2:
		return space.Rent2Servers
	case 3:
		return space.Rent3Servers
	case 4:
		return space.Rent4Servers
	case 5:
		return space.Rent5Servers
	default:
		return 0
	}
}

// Helper function to handle card space
func (g *Game) handleCardSpace(player *Player, cardType string) {
	// Draw top card from appropriate deck (Competitor or Monopolist)
	// Resolve card effects (may move player, collect/pay money, etc.)
	// Place card at bottom of deck

	cardTypeEnum := CardType(cardType)
	card := g.drawCard(cardTypeEnum)
	if card != nil {
		g.resolveCardEffect(player, card)
		g.returnCardToDeck(cardTypeEnum, card)
	}
}

// Helper function to draw a card
func (g *Game) drawCard(cardType CardType) *Card {
	switch cardType {
	case CardTypeCompetitor:
		card := &g.Board.CompetitorCards[0]
		g.Board.CompetitorCards = append(g.Board.CompetitorCards[1:], g.Board.CompetitorCards[0])
		return card
	case CardTypeMonopolist:
		card := &g.Board.MonopolistCards[0]
		g.Board.MonopolistCards = append(g.Board.MonopolistCards[1:], g.Board.MonopolistCards[0])
		return card
	default:
		return nil
	}
}

// Helper function to resolve card effect (placeholder for card module)
func (g *Game) resolveCardEffect(player *Player, card *Card) {
	// Match card by name and execute effect
	switch card.Name {
	// Movement cards
	case "move_to_nearest_ipc":
		g.moveToNearestPlace(player, "IPC")

	case "move_to_emacs":
		g.moveToPlace(player, "Emacs")

	case "move_to_start":
		g.moveToPlace(player, "Start")
		// Collect from Start (100 EXP for passing Go)
		player.Exp += 100

	case "move_to_quantum_computing":
		g.moveToPlace(player, "Quantum Computing")

	// Dice-based cards
	case "dice_based_card_1":
		dice1 := rand.Intn(6) + 1
		dice2 := rand.Intn(6) + 1
		diceSum := dice1 + dice2
		if diceSum >= 8 {
			player.Exp += 75
		}
		// If 7 or less, nothing happens...

	// Collect XP cards
	case "collect_xp_card_1":
		player.Exp += 50

	case "collect_xp_card_2":
		player.Exp += 75

	case "collect_xp_card_3":
		player.Exp += 25

	case "collect_xp_card_4":
		player.Exp += 50

	case "collect_xp_card_5":
		// All monopolists collect 25 XP
		for _, p := range g.Board.Players {
			if p.Role == PlayerRoleMonopolist {
				p.Exp += 25
			}
		}

	case "collect_xp_card_6":
		player.Exp += 75

	case "collect_xp_card_7":
		player.Exp += 50

	case "collect_xp_card_8":
		// Collect 25 XP from each competitor
		for _, p := range g.Board.Players {
			if p.Role == PlayerRoleCompetitor && p.Username != player.Username {
				if p.Exp >= 25 {
					p.Exp -= 25
					player.Exp += 25
				} else {
					// Competitor can't pay full amount, take what they have
					player.Exp += p.Exp
					p.Exp = 0
				}
			}
		}

	// Pay XP cards
	case "pay_xp_card_1":
		if player.Exp >= 50 {
			player.Exp -= 50
		} else {
			g.handleBankruptcy(player)
		}

	case "pay_xp_card_2":
		if player.Exp >= 75 {
			player.Exp -= 75
		} else {
			g.handleBankruptcy(player)
		}

	case "pay_xp_card_3":
		if player.Exp >= 25 {
			player.Exp -= 25
		} else {
			g.handleBankruptcy(player)
		}

	case "pay_xp_card_4":
		if player.Exp >= 75 {
			player.Exp -= 75
		} else {
			g.handleBankruptcy(player)
		}

	case "pay_xp_card_5":
		if player.Exp >= 25 {
			player.Exp -= 25
		} else {
			g.handleBankruptcy(player)
		}

	// System crash/Infinite Loop cards
	case "go_to_prison_card_1":
		g.sendPlayerToJail(player, "go_to_prison")

	case "go_to_prison_card_2":
		g.sendPlayerToJail(player, "go_to_prison")

	default:
		// Unknown card, log it
		log.Printf("Unknown card effect: %s", card.Name)
	}
}

// Helper function to move player to a specific place by name
func (g *Game) moveToPlace(player *Player, placeName string) {
	for i, place := range g.Board.Places {
		if place.Name == placeName {
			player.Position = i
			return
		}
	}
	log.Printf("Place not found: %s", placeName)
}

// Helper function to move player to nearest place by name (forward direction)
func (g *Game) moveToNearestPlace(player *Player, placeName string) {
	currentPos := player.Position
	boardSize := len(g.Board.Places)
	nearestPos := -1

	// Search forward from current position
	for i := range boardSize {
		checkPos := (currentPos + i) % boardSize
		if g.Board.Places[checkPos].Name == placeName {
			nearestPos = checkPos
			break
		}
	}

	if nearestPos >= 0 {
		player.Position = nearestPos
		// Check if passed Start
		if nearestPos < currentPos {
			player.Exp += 100
		}
	} else {
		log.Printf("Place not found: %s", placeName)
	}
}

// Helper function to return card to deck (placeholder for card deck module)
func (g *Game) returnCardToDeck(cardType CardType, card *Card) {
	if card == nil {
		return
	}
	switch cardType {
	case CardTypeCompetitor:
		// Place card at bottom of deck
		g.Board.CompetitorCards = append(g.Board.CompetitorCards, *card)
	case CardTypeMonopolist:
		// Place card at bottom of deck
		g.Board.MonopolistCards = append(g.Board.MonopolistCards, *card)
	default:
		return
	}
}

// Helper function to send player to jail
func (g *Game) sendPlayerToJail(player *Player, spaceType string) {
	// Move player to the combined jail space (System crash/Infinite Loop)
	jailPosition := g.findJailPosition(player.Role)
	if jailPosition >= 0 {
		player.Position = jailPosition
		player.JailAttempts = 0
		g.Board.Jail = append(g.Board.Jail, player.Username)
	}
}

// Helper function to find jail position
func (g *Game) findJailPosition(role PlayerRole) int {
	// Find the combined jail space (System crash for monopolists, Infinite Loop for competitors)
	// Both roles go to the same space
	for i, place := range g.Board.Places {
		if place.Name == "System crash" || place.Name == "Infinite Loop" || place.Name == "Jail" {
			return i
		}
	}
	return -1
}

// Helper function to handle income tax
func (g *Game) handleIncomeTax(player *Player) {
	// Calculate: 10% of (unmortgaged properties + building costs + cash with role modifier)
	percentageTax := g.calculatePercentageTax(player)

	// Player chooses (or auto-choose cheaper)
	if player.Exp >= percentageTax {
		player.Exp -= percentageTax
	} else {
		g.handleBankruptcy(player)
	}
}

// Helper function to calculate percentage tax
func (g *Game) calculatePercentageTax(player *Player) int {
	totalValue := 0
	for place, serverCount := range player.OwnedPlaces {
		totalValue += place.Price
		totalValue += place.PriceOfServers * serverCount
	}
	totalValue += player.Exp

	return int(float64(totalValue) * 0.1)
}

// Helper function to handle Anti-Monopoly Foundation
func (g *Game) handleAntiMonopolyFoundation(player *Player) {
	switch player.Role {
	case PlayerRoleCompetitor:
		diceRoll := rand.Intn(6) + 1
		switch diceRoll {
		case 1:
			player.Exp += 25
		case 2:
			player.Exp += 50
		default:
			// nothing happens
		}
	case PlayerRoleMonopolist:
		player.Exp -= 160
	}
}

// Helper function to handle bankruptcy
func (g *Game) handleBankruptcy(player *Player) {
	// For MVP: simple removal
	if player.Exp < 0 {
		// Resolve the properties the player owns from OwnedPlaces map
		if player.OwnedPlaces != nil {
			for place := range player.OwnedPlaces {
				// Find the matching place in the board and clear it
				for i := range g.Board.Places {
					if g.Board.Places[i].Name == place.Name {
						g.Board.Places[i].Owner = ""
						g.Board.Places[i].NumServers = 0
						break
					}
				}
			}
			// Clear the player's OwnedPlaces map
			player.OwnedPlaces = make(map[Place]int)
		}

		// Also clear any places from the board that have this player as owner (for consistency)
		for i := range g.Board.Places {
			if g.Board.Places[i].Owner == player.Username {
				g.Board.Places[i].Owner = ""
				g.Board.Places[i].NumServers = 0
			}
		}

		// Remove player
		g.Board.Players = g.removePlayerFromSlice(g.Board.Players, player.Username)

		// Check win conditions
		g.checkWinConditions()
	}
}

// Helper function to check win conditions (placeholder for win condition module)
func (g *Game) checkWinConditions() {
	if len(g.Board.Players) == 1 {
		// Send winner message to the player
		winnerMsg := WinnerMessage{
			Winner: g.Board.Players[0].Username,
		}
		winnerJSON, err := json.Marshal(winnerMsg)
		if err != nil {
			log.Println("Error marshalling winner message:", err)
			return
		}

		g.BroadcastCh <- winnerJSON
	} else {
		// take the player with the most money
		mostMoneyPlayer := g.Board.Players[0]
		for _, player := range g.Board.Players {
			if player.Exp > mostMoneyPlayer.Exp {
				mostMoneyPlayer = player
			}
		}
		winnerMsg := WinnerMessage{
			Winner: mostMoneyPlayer.Username,
		}
		winnerJSON, err := json.Marshal(winnerMsg)
		if err != nil {
			log.Println("Error marshalling winner message:", err)
			return
		}
		g.BroadcastCh <- winnerJSON
	}

	// End the game after sending winner message
	// Close all player connections
	for _, player := range g.Board.Players {
		if player.Conn != nil {
			player.Conn.Close()
		}
	}

	// Close the broadcast channel to end the BroadcastLoop
	close(g.BroadcastCh)
}

// Helper function to check if this is an extra turn from doubles
func (g *Game) isExtraTurnFromDoubles(player *Player) bool {
	return player.HasExtraTurn
}

// Helper function to set extra turn flag
func (g *Game) setExtraTurnFlag(player *Player) {
	player.HasExtraTurn = true
}

// Helper function to broadcast board state
func (g *Game) broadcastBoardState() {
	boardJSON, err := json.Marshal(g.Board)
	if err != nil {
		log.Println("Error marshalling board state:", err)
		return
	}

	select {
	case g.BroadcastCh <- boardJSON:
	default:
		// Channel full, skip broadcast
		log.Println("Broadcast channel full, skipping")
	}
}

// BroadcastLoop broadcasts the game state to all players
func (g *Game) BroadcastLoop() {
	for msg := range g.BroadcastCh {
		for i := len(g.Board.Players) - 1; i >= 0; i-- {
			player := g.Board.Players[i]
			err := player.Conn.WriteJSON(msg)
			if err != nil {
				log.Println("Error broadcasting message to player:", err)
				player.Conn.Close()
				// Remove player from slice
				g.Board.Players = append(g.Board.Players[:i], g.Board.Players[i+1:]...)
				continue
			}
		}
	}
}

// removePlayerFromSlice removes a player from a slice of players
func (g *Game) removePlayerFromSlice(slice []*Player, username string) []*Player {
	newSlice := make([]*Player, 0, len(slice)-1)
	for _, p := range slice {
		if p.Username != username {
			newSlice = append(newSlice, p)
		}
	}
	return newSlice
}

// removePlayerFromJail removes a player from the jail slice
func (g *Game) removePlayerFromJail(slice []string, username string) []string {
	newSlice := make([]string, 0, len(slice)-1)
	for _, p := range slice {
		if p != username {
			newSlice = append(newSlice, p)
		}
	}
	return newSlice
}

// getNextPlayer gets the next player in the game
func (g *Game) getNextPlayer(username string) string {
	// Find the current player and return the next one
	for i, p := range g.Board.Players {
		if p.Username == username {
			if i == len(g.Board.Players)-1 {
				// Wrap around to the first player
				return g.Board.Players[0].Username
			}
			return g.Board.Players[i+1].Username
		}
	}

	// If player not found, return the first player
	if len(g.Board.Players) > 0 {
		return g.Board.Players[0].Username
	}
	return ""
}
