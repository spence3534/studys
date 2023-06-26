package main

import (
	"fmt"
	"math"
)

func hypot(x, y float64) (result float64) {
	return math.Sqrt(x*x + y*y)
}

func main() {
	fmt.Println(add(1, 3))   // 4
	fmt.Println(sub(1, 3))   // -2
	fmt.Println(first(1, 3)) // 1
	fmt.Println(zero(1, 3))  // 0
}

func add(x int, y int) int   { return x + y }
func sub(x, y int) (z int)   { z = x - y; return }
func first(x int, _ int) int { return x }
func zero(int, int) int      { return 0 }
