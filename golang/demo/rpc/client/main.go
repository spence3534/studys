package main

import (
	"fmt"
	"log"
	"net/rpc"
	"time"
)

type Req struct {
	NumOne, NumTwo int
}

type Res struct {
	Num int
}

func main() {
	req := Req{NumOne: 10, NumTwo: 20}
	var res Res
	client, err := rpc.DialHTTP("tcp", "localhost:8888")
	if err != nil {
		log.Fatal("dialing", err)
	}
	ca := client.Go("Server.Add", req, &res, nil)

	for {
		select {
		case <-ca.Done:
			fmt.Println("收到远程方法的返回", res)
			return
		default:
			time.Sleep(1 * time.Second)
			fmt.Println("在等待时做一些操作")
		}
	}

	// <-ca.Done

	// 同步方法 client.Call("Server.Add", req, &res)
	// fmt.Println("远程方法返回的东西", res)
}
