package main

import "fmt"

/* func main() {
	s := new(string)
	fmt.Println("s变量在这", *s)
	*s = "here"
	fmt.Println(*s) // here
} */

func main() {
	fmt.Println(delta(10, 2)) // -2
}

func delta(old, new int) int {
	return new - old
}
