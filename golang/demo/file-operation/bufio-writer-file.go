package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

// 使用bufio写入文件操作
func main() {
	f, err := os.OpenFile("./test.txt", os.O_RDWR|os.O_CREATE, 0777)
	if err != nil {
		return
	}

	w := bufio.NewWriter(f)
	r := bufio.NewReader(f)
	n := 0
	for {
		n++
		str, err := r.ReadString('\n')
		w.WriteString(strconv.Itoa(n) + " " + str)
		if err != nil {
			fmt.Println(err)
			break
		}
	}
	f.Seek(0, 0)
	w.Flush()
}
