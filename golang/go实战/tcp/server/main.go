package main

import (
	"fmt"
	"net"
)

// 服务端侦听客服端连接
func main() {
	tcpAddr, _ := net.ResolveTCPAddr("tcp", ":8888")
	listener, _ := net.ListenTCP("tcp", tcpAddr)
	for {
		conn, err := listener.AcceptTCP()
		if err != nil {
			fmt.Println(err)
			return
		}
		go handleConnection(conn)
	}
}

// 长连接侦听
func handleConnection(conn *net.TCPConn) {
	for {
		b := make([]byte, 1024)
		n, err := conn.Read(b)
		if err != nil {
			fmt.Println(err)
			break
		}
		fmt.Println(conn.RemoteAddr().String() + string(b[0:n]))

		// 向客户端返回信息
		str := "服务端收到了：" + string(b[0:n])
		conn.Write([]byte(str))
	}
}
