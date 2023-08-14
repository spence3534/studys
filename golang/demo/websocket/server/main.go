package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var UP websocket.Upgrader
var conns []*websocket.Conn

// 服务器端websocket
func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":8090", nil)
}

func handler(rep http.ResponseWriter, req *http.Request) {
	conn, err := UP.Upgrade(rep, req, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	conns = append(conns, conn)
	for {
		m, p, e := conn.ReadMessage()
		if e != nil {
			break
		}
		for i := range conns {
			conns[i].WriteMessage(websocket.TextMessage, []byte("你说的是"+string(p)+"吗？"))
		}
		defer conn.Close()
		fmt.Println(m, string(p))
	}
	log.Println("服务关闭")
}
