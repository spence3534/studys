package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

// go中的客户端get请求
/*func main() {
	client := new(http.Client)
	req, _ := http.NewRequest("GET", "http://localhost:8080/test", nil)
	res, _ := client.Do(req)
	body := res.Body
	b, _ := io.ReadAll(body)
	fmt.Println(string(b))
}
*/

// go中客户端post请求方法
func main() {
	bodyjson := bytes.NewBuffer([]byte("{\"username\":\"Spence Lee\"}"))
	client := new(http.Client)
	req, _ := http.NewRequest("POST", "http://localhost:8080/test", bodyjson)
	req.Header["test"] = []string{"test1", "test2"}
	res, _ := client.Do(req)
	body := res.Body
	b, _ := io.ReadAll(body)
	fmt.Println("发送参数" + string(b))
}
