package main

import (
	"fmt"
	"sync"
)

var (
	mu      sync.RWMutex
	balance int
)

func Deposit(amount int) {
	mu.Lock()
	balance = balance + amount
	mu.Unlock()
}

func Balance() int {
	mu.RLock()
	defer mu.RUnlock()
	return balance
}

func Withdraw(amount int) bool {
	Deposit(-amount)
	if Balance() < 0 {
		deposit(amount)
		return false
	}
	return true
}

func deposit(amount int) {
	balance += amount
}

func main() {
	var b bool = Withdraw(500)
	fmt.Println(b)
}
