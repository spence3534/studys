package main

import (
	"fmt"
	"time"
)

var balance int

func Deposit(amount int) {
	balance = balance + amount
}

func Balance() int {
	return balance
}

func main() {
	go func() {
		Deposit(200)
		fmt.Println("=", Balance())
	}()

	go Deposit(100)
	time.Sleep(time.Minute)
}
