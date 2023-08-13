package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	// mux是一个路由包
	r := mux.NewRouter()

	r.HandleFunc("/index/{title}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		title := vars["title"]

		fmt.Fprintf(w, "当前访问的页面为index，参数为: %s\n", title)
	})
	r.HandleFunc("/my-page/{title}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		title := vars["title"]
		fmt.Fprintf(w, "当前访问的页面为my-page，参数为: %s\n", title)
	})

	// 限制特定的请求方法
	r.HandleFunc("/delete/{title}", deleteFunc).Methods("DELETE")
	r.HandleFunc("/create/{title}", createFunc).Methods("POST")
	r.HandleFunc("/read/{title}", readFunc).Methods("GET")
	r.HandleFunc("/update/{title}", UpdateFunc).Methods("PUT")

	// 限制特定的域名访问
	r.HandleFunc("/getQuery/{query}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		fmt.Fprintf(w, "只能通过固定域名访问，参数为: %s\n", vars["title"])
	}).Host("www.tutu.com")

	// 限制特定的协议访问https
	r.HandleFunc("/safeGet/{query}", func(w http.ResponseWriter, r *http.Request) {
		fmt.Print("只能通过https访问")
	}).Schemes("https")

	http.ListenAndServe(":99", r)
}

func deleteFunc(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	fmt.Fprintf(w, "执行删除操作，参数为: %s\n", vars["title"])
}

func createFunc(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	fmt.Fprintf(w, "执行创建操作，参数为: %s\n", vars["title"])
}

func readFunc(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	fmt.Fprintf(w, "执行获取操作，参数为: %s\n", vars["title"])
}

func UpdateFunc(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	fmt.Fprintf(w, "执行更新操作，参数为: %s\n", vars["title"])
}
