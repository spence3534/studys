package main

import "fmt"

func main() {
	a := [2]int{1, 2}
	b := [...]int{1, 2}
	c := [2]int{1, 3}
	fmt.Println(a == b, a == c, b == c) // true false false

	d := [3]int{1, 2}
	fmt.Println(d) // 编译错误：无法比较 [2]int == [3]int
}

/* func zero(ptr *[32]byte) {
	for _, v := range ptr {
		ptr[v] = 0
	}
} */

/* func zero(ptr *[32]byte) {
	*ptr = [32]byte{}
} */
