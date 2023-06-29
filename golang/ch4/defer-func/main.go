package main

import "fmt"

func main() {
	fmt.Println(triple(3))
	// double(3) = 6
	// 9
}

func double(x int) (result int) {
	defer func() {
		fmt.Printf("double(%d) = %d\n", x, result)
	}()
	return x + x
}

func triple(x int) (result int) {
	defer func() {
		result += x
	}()
	return double(x)
}
