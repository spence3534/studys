package main

import (
	"fmt"
	"io"
	"os"
)

// 读文件操作
func main() {
	f, err := os.OpenFile("./test.txt", os.O_CREATE|os.O_RDWR, 0777)
	if err != nil {
		fmt.Println(err)
	}
	z := 0
	for {
		b := make([]byte, 2014)
		n, err := f.Read(b)
		z++
		if z < 5 {
			// 从某个位置开始读文件，seek有两个参数一个是偏移量，第二个是从文件的哪个部分开始。
			f.Seek(-12, io.SeekEnd)
		}

		if err != nil {
			fmt.Println(err, "已读完") // err返回EOF标识表示已读完
			return
		}
		fmt.Println(string(b), n)
	}
	defer f.Close()
}
