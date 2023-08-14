package main

import (
	"bufio"
	"fmt"
	"net"
	"os"
)

// 客户端通过tcp连接服务端
/*func main() {
	tcpAddr, _ := net.ResolveTCPAddr("tcp", ":8888")
	net.DialTCP("tcp", nil, tcpAddr)
}*/

// 客户端向服务端发送消息
/*func main() {
	tcpAddr, _ := net.ResolveTCPAddr("tcp", ":8888")
	conn, _ := net.DialTCP("tcp", nil, tcpAddr)
	conn.Write([]byte("申请出战"))
}*/

// 命令行发送文本
func main() {
	tcpAddr, _ := net.ResolveTCPAddr("tcp", ":8888")
	conn, _ := net.DialTCP("tcp", nil, tcpAddr)
	reader := bufio.NewReader(os.Stdin)

	// 长连接
	for {
		bytes, _, _ := reader.ReadLine()
		conn.Write(bytes)

		// 接收服务端返回的信息
		rb := make([]byte, 1024)
		rn, _ := conn.Read(rb)
		fmt.Println(string(rb[0:rn]))
	}
}
