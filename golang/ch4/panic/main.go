package main

import "fmt"

func test() {
	defer func() {
		fmt.Println(recover()) // 宕机啦!!!
	}()
	defer recover()              // 无效recover
	defer fmt.Println(recover()) // nil
	defer func() {
		// 这里的代码块直接导致编辑器报错
		func() {
			println("defer inner") // defer inner
			recover()
		}()
	}()
	panic("宕机啦!!!")
}

func main() {
	test()
}
