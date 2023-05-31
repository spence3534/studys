package main

import (
	"fmt"
	"strconv"
)

func main() {
	/* fmt.Println(basename("a/b/c.go")) // c
	fmt.Println(basename("c.d.go"))   // c.d
	fmt.Println(basename("abc"))      // abc */
	/* fmt.Println(comma("123456789")) // 123,456,789 */

	/* s := "abc"
	b := []byte(s)
	s2 := string(b)
	fmt.Println(b)  // [97 98 99]
	fmt.Println(s2) // abc */
	/* x := 123
	y := fmt.Sprintf("%d", x)
	fmt.Println(y, strconv.Itoa(x))             // 123 123
	fmt.Println(strconv.FormatInt(int64(x), 2)) // 1111011
	s := fmt.Sprintf("x=%b", x)
	fmt.Println(s) // x=1111011 */
	x, err := strconv.Atoi("123")
	y, err := strconv.ParseInt("123", 10, 64)
	fmt.Println(x, y, err) // 123 123 <nil>
}

/* func basename(s string) string {
	for i := len(s) - 1; i >= 0; i-- {
		if s[i] == '/' {
			s = s[i+1:]
			break
		}
	}

	for i := len(s) - 1; i >= 0; i-- {
		if s[i] == '.' {
			s = s[:i]
			break
		}
	}
	return s
} */

/* func basename(s string) string {
	slash := strings.LastIndex(s, "/")
	s = s[slash+1:]
	if dot := strings.LastIndex(s, "."); dot >= 0 {
		s = s[:dot]
	}
	return s
} */

/* func comma(s string) string {
	n := len(s)
	if n <= 3 {
		return s
	}
	return comma(s[:n-3]) + "," + s[n-3:]
} */
