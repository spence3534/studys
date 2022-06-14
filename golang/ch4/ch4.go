package main

import (
	"fmt"
	"os"
)

// for
func main() {
	forFunc()
}

func forFunc() {
	var s, sep string
	for i := 1; i < len(os.Args); i++ {
		s += sep + os.Args[i]
		sep = " "
	}
	fmt.Println(s, "进入11111111")
}

// if...else...
/* func main() {
	var isShow bool = false
	if !isShow {
		fmt.Println("进入true")
	} else {
		fmt.Println("进入false")
	}
} */

// switch
/* func main() {
	fmt.Println(noTagSwitch(1))
	tagSwitch(false)
}

func noTagSwitch(x int) int {
	switch {
	case x == 1:
		return 1
	default:
		return 0
	}
}

func tagSwitch(y bool) {
	var a int = 1
	switch y {
	case true:
		a++
	default:
		a--
	}
	fmt.Println(a)
} */
