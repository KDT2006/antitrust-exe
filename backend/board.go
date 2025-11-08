package main

import (
	"sync"
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

type Player struct {
	Username     string `json:"username"`
	Position     int    `json:"position"`
	Money        int    `json:"money"`
	HasJailFree  bool   `json:"hasJailFree"`
	JailAttempts int    `json:"jailAttempts"`
	// Conn         *websocket.Conn `json:"-"`
}

type Property struct {
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Price       int        `json:"price"`
	Rent        int        `json:"rent"`
	Color       PlaceColor `json:"color"`
	Owner       string     `json:"owner"`
	NumServers  int        `json:"numServers"`
}

type Card struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Board struct {
	Players []Player   `json:"players"`
	Mu      sync.Mutex `json:"-"`

	Properties    []Property `json:"properties"`
	CurrentPlayer string     `json:"currentPlayer"`
	Cards         []Card     `json:"cards"`
	Jail          []string   `json:"jail"`
}

type Game struct {
	BroadcastCh chan []byte `json:"-"`
	Board       Board       `json:"board"`
}

var Properties = []Property{
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
		Description: "", // TODO
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
		Description: "", // TODO
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
		Description: "", // TODO
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
		Description: "", // TODO
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "341",
		Description: "", // TODO
		Price:       100,
		Rent:        10,
		Color:       PlaceColorGreen,
		Owner:       "",
		NumServers:  0,
	},
	{
		Name:        "379",
		Description: "", // TODO
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
}
