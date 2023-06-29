package main

import "fmt"

type Point struct {
	X float64
	Y float64
}

func (p *Point) scaleBy(factor float64) {
	p.X *= factor
	p.Y *= factor
}

func main() {
	p := &Point{X: 100, Y: 150}
	(*p).scaleBy(0.5)
	fmt.Println(p.X, p.Y) // 50 75
}
