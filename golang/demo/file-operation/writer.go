package main

import (
	"fmt"
	"io"
	"os"
)

func main() {
	f, err := os.OpenFile("./test.txt", os.O_CREATE|os.O_RDWR, 0777)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()
	f.Seek(0, io.SeekEnd)
	// 写入文件方法
	f.Write([]byte("vue,react,uniapp"))
	for {
		b := make([]byte, 12)
		fmt.Println(string(b))
	}
}
