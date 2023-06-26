package main

import "fmt"

func main() {
	for i := 0; i < 100; i++ {
		fmt.Printf("%d\n", fibonaci(i))
	}
}

func fibonaci(i int) int {
	if i == 0 {
		return 0
	}

	if i == 1 {
		return 1
	}
	return fibonaci(i-1) + fibonaci(i-2)
}
