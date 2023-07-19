package main

import "fmt"

func main() {
	ch := make(chan string, 3)
	ch <- "a"
	ch <- "b"
	ch <- "c"
	fmt.Println(len(ch)) // 3

	fmt.Println(<-ch)    // a
	fmt.Println(len(ch)) // 2

	fmt.Println(<-ch)    // b
	fmt.Println(len(ch)) // 1

	fmt.Println(<-ch)    // c
	fmt.Println(len(ch)) // 0
}
