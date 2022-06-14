package main

import "fmt"

// 常量boilingF是在包一级范围中声明的。因此，boilingF可在整个包对应的每个源文件中访问。
const boilingF = 212.0

func main() {
	var f = boilingF
	var c = (f - 32) * 5 / 9
	fmt.Printf("boilingF point = %g or %g\n", f, c)
	fmt.Printf("%gF = %gC\n", c, fToC(boilingF))
}

func fToC(f float64) float64 {
	return (f - 32) * 5 / 9
}
