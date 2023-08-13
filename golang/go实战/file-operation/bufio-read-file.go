package main

// bufio读取文件
/*func main() {
	f, err := os.OpenFile("./test.txt", os.O_CREATE|os.O_RDWR, 0777)
	if err != nil {
		fmt.Println(err)
		return
	}

	b := bufio.NewReader(f)
	for {
		str, err := b.ReadString('\n')
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		fmt.Println(str)
	}
}*/

/*
// 读取整个文件
func main() {
	f, err := os.OpenFile("./test.txt", os.O_CREATE|os.O_RDWR, 0777)
	if err != nil {
		return
	}
	defer f.Close()
	b, err := io.ReadAll(f)
	fmt.Println(string(b))
}
*/

/*func main() {
	f, err := os.OpenFile("./test.txt", os.O_CREATE|os.O_RDWR, 0777)
	if err != nil {
		return
	}
	defer f.Close()
	b, _ := os.ReadFile("./test.txt")
	fmt.Println(string(b))
}*/
