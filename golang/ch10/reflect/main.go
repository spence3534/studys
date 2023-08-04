package main

import (
	"fmt"
	"reflect"
)

func main() {
	n := 1
	/* f := 3.14
	b := true */

	n1 := reflect.TypeOf(n).Kind()
	fmt.Print(n1 == reflect.Int)
}
