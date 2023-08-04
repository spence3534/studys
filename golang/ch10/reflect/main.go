package main

import "fmt"

func main() {
	a := 1
	b := 9
	goto TAGET

TAGET:
	b += a
	fmt.Printf("a is %v *** b is %v", a, b)
}
