package main

import (
	"bufio"
	"fmt"
	"log"
	"os"

	"github.com/gorilla/websocket"
)

func main() {
	dl := websocket.Dialer{}
	conn, _, err := dl.Dial("ws://127.0.0.1:8090", nil)
	if err != nil {
		log.Println(err)
		return
	}
	go send(conn)

	for {
		m, p, e := conn.ReadMessage()
		if e != nil {
			break
		}
		fmt.Println(m, string(p))
	}

}

func send(conn *websocket.Conn) {
	for {
		r := bufio.NewReader(os.Stdin)
		l, _, _ := r.ReadLine()
		conn.WriteMessage(websocket.TextMessage, l)
	}
}
