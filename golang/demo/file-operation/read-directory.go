package main

import (
	"fmt"
	"os"
)

// 读取文件夹
func main() {
	d, err := os.ReadDir("./")
	fmt.Println(err)
	// fmt.Println(d, err)
	for _, v := range d {
		fmt.Println(v.Type())
		fmt.Println(v.Name())
		fmt.Println(v.IsDir())
		fmt.Println(v.Info())
	}
}
