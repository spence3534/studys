package main

import "fmt"

func main() {
	x := 1
	set(&x)
	fmt.Println(set(&x)) // 3
}

func set(a *int) int {
	*a++
	return *a
}
