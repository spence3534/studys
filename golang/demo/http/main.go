package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/index", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "hello, you've requested: %s\n", r.URL.Path)
	})
	http.ListenAndServe(":99", nil)
}
