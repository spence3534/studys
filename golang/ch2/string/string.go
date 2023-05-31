package main

import "fmt"

func main() {
	/*
		fmt.Println(len(s))     // 12
		fmt.Println(s[0], s[7]) // 104 119

		c := s[len(s)]
		fmt.Println(c) // panic: runtime error: index out of range [12] with length 12 */
	/* fmt.Println(s[0:6]) // hello, */
	/* fmt.Println(s[:5]) // hello
	fmt.Println(s[7:]) // world
	fmt.Println(s[:])  // hello, world */
	/* fmt.Println("再见" + s[5:]) // 再见, world */
	s := "hello, world"
	t := s
	s += ", hello, human"
	fmt.Println(s) // hello, world, hello, human
	fmt.Println(t) // hello, world
	//s[1] = 'E' // cannot assign to s[1] (strings are immutable)
}
