package main

import (
	"fmt"
	"os"
	"reflect"
)

func main() {
	stdout := reflect.ValueOf(os.Stdout).Elem() // *os.Stdout, 一个os.File变量
	fmt.Println(stdout.Type())                  // os.File
	fd := stdout.FieldByName("fd")
	fmt.Println(fd.CanAddr(), fd.CanSet()) // true false
}
