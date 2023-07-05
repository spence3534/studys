package main

type ByteCounter int

func (c *ByteCounter) Write(p []byte) (int, error) {
	*c += ByteCounter(len(p)) // convert int to ByteCounter
	return len(p), nil
}

func main() {
	/* var w io.Writer
	w = os.Stdout
	f := w.(*os.File)
	c := w.(*bytes.Buffer) // panic: interface conversion: io.Writer is *os.File, not *bytes.Buffer
	fmt.Println(c, f)
	var w io.Writer
	w = os.Stdout
	rw := w.(io.ReadWriter)

	w = rw
	w = rw.(io.Writer)
	var w io.Writer = os.Stdout
	f, ok := w.(*os.File)      // true
	b, ok := w.(*bytes.Buffer) // false
	fmt.Println(f, ok)
	*/

}
