package main

import (
	"fmt"
	"io"
	"net/http"
)

type Person struct {
	Username string
}

// 创建一个服务
/*func main() {
	http.HandleFunc("/test", handler)
	http.ListenAndServe(":8080", nil)
}*/

// 接收客户端发送的请求
/*func handler(res http.ResponseWriter, req *http.Request) {
	res.Write([]byte("我收到了你的返回"))
}*/

// mux是把http独立出来，这样做的目的更灵活
func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/test", handler)
	http.ListenAndServe(":8080", mux)
}

func handler(res http.ResponseWriter, req *http.Request) {
	switch req.Method {
	case "GET":
		res.Write([]byte("我收到了你的GET请求"))
		break
	case "POST":
		// 接收post请求再解析json
		/*var person Person
		b, _ := io.ReadAll(req.Body)
		err := json.Unmarshal([]byte(string(b)), &person)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(person.Username)*/
		// 修改请求头部信息以及状态码
		/*header := res.Header()
		header["test"] = []string{"test1", "test2"}
		res.WriteHeader(http.StatusNotFound)*/
		b, _ := io.ReadAll(req.Body)
		// 获取客户端的header内容
		fmt.Println(req.Header["Test"])
		res.Write(b)
		break
	default:
		res.Write([]byte("无名请求"))
	}
}
