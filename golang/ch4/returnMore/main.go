package main

import "fmt"

func getNum(x, y, z int) (int, int, int) {
	return x, y, z
}

func sum(x, y, z int) (t int) {
	return x + y*z
}

func main() {
	fmt.Println(sum(getNum(10, 20, 30))) // 610
}
