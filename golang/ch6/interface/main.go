package main

import (
	"bytes"
	"fmt"
	"io"
)

const debug = true

func main() {
	var buf *bytes.Buffer
	var wri io.Writer
	if debug {
		buf = new(bytes.Buffer)
	}
	fmt.Println(buf)
	fmt.Println(wri)
	f(buf)
}

func f(out io.Writer) {
	if out != nil {
		/* fmt.Println(out.Write([]byte("done!\n"))) */
		// panic: runtime error: invalid memory address or nil pointer dereference
	}
}
