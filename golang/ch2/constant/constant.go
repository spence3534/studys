package main

import "fmt"

func main() {
	/* const name = "图图"
	fmt.Println(name) */

	/* const (
		name   = "图图"
		height = 175
		weight = 140
	) */
	/* const nodelay time.Duration = 0
	const timeout = 10 * nodelay
	fmt.Printf("%T %[1]v\n", nodelay)
	fmt.Printf("%T %[1]v\n", timeout) */
	/* const (
		a = 1
		b
		c = 2
		d
	)
	fmt.Println(a, b, c, d) // 1 1 2 2 */

	/* type Weekday int

	const (
		sunday Weekday = iota
		monday
		tuesday
		wednesday
		thursday
		friday
		saturday
	) */
	/* var x float32 = math.Pi
	var y float64 = math.Pi
	var z complex128 = math.Pi
	fmt.Println(x, y, z) */
	/* const pi64 float64 = math.Pi

	var x float32 = float32(pi64)
	var y float64 = pi64
	var z complex128 = complex128(pi64) */
	/* 	var f float64 = 212
	   	fmt.Println((f - 32) * 5 / 9)     // 100
	   	fmt.Println(5 / 9 * (f - 32))     // 0
	   	fmt.Println(5.0 / 9.0 * (f - 32)) // 100 */

	/* var f float64 = 3 + 0i // untyped complex -> float64
	f = 2                  // untyped integer -> float64
	f = 1e123              // untyped floating-point -> float64
	f = 'a'                // untyped rune -> float64 */
	i := 0      // int
	r := '\000' // rune
	f := 0.0    // float64
	c := 0i     // complex128
	fmt.Println(i, r, f, c)
}
