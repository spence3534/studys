package main

import "fmt"

func add(x, y int) (count int) {
	return x * y
}

func sum(add func(x, y int) int, n int) int {
	return add(10, 20) + n
}

func main() {
	var sum int = sum(add, 9)
	fmt.Println(sum)
}
