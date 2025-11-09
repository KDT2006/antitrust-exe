package main

import "log"

func main() {
	server := NewServer(":4000")
	log.Fatal(server.Run())
}
