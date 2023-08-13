package main

import (
	"io"
	"os"
)

// 文件复制操作
func main() {
	f1, _ := os.OpenFile("./test.txt", os.O_CREATE|os.O_RDWR, 0777)
	f2, _ := os.OpenFile("./testCopy.txt", os.O_CREATE|os.O_RDWR, 0777)
	// Copy方法只是把f1里面的内容写到f2中，如果两个文件的内容不一样，会把同等位置的内容覆盖调。
	io.Copy(f2, f1)
}
