package main

import "fmt"

/* func main() {
	months := []string{1: "january", 2: "february", 3: "march", 4: "april", 5: "may", 6: "june", 7: "july", 8: "august", 9: "september", 10: "october", 11: "november", 12: "december"}

	Q2 := months[4:7]
	summer := months[6:9]
	fmt.Println(Q2)     // [april may june]
	fmt.Println(summer) // [june july august]

	for _, s := range summer {
		for _, q := range Q2 {
			if s == q {
				fmt.Println("重复元素为", s) // 重复元素为 june
			}
		}
	}

	fmt.Println(summer[:20]) // panic: runtime error: slice bounds out of range [:20] with capacity 7
	endlessSummer := summer[:6]
	fmt.Println(endlessSummer) // [june july august september october november]

	var runes []rune
	for _, v := range "hello, world" {
		runes = append(runes, v)
	}
	fmt.Printf("%q\n", runes) // ['h' 'e' 'l' 'l' 'o' ',' ' ' 'w' 'o' 'r' 'l' 'd']
} */

/* func main() {
	var x, y []int
	for i := 0; i < 10; i++ {
		y = appendInt(x, i)
		fmt.Printf("%d cap=%d\t%v\n", i, cap(y), y)
		// 0 cap=1	[0]
		// 1 cap=2	[0 1]
		// 2 cap=4	[0 1 2]
		// 3 cap=4	[0 1 2 3]
		// 4 cap=8	[0 1 2 3 4]
		// 5 cap=8	[0 1 2 3 4 5]
		// 6 cap=8	[0 1 2 3 4 5 6]
		// 7 cap=8	[0 1 2 3 4 5 6 7]
		// 8 cap=16	[0 1 2 3 4 5 6 7 8]
		// 9 cap=16	[0 1 2 3 4 5 6 7 8 9]
		x = y
	}
} */

// func main() {
// 	var x []int
// 	x = append(x, 1)
// 	x = append(x, 1, 2, 3)
// 	x = append(x, 1, 2, 3, 4, 5, 6)
// 	x = append(x, x...)

// 	fmt.Println(x) // [1 1 2 3 1 2 3 4 5 6 1 1 2 3 1 2 3 4 5 6]
// }

// func main() {
// 	txt := []string{"1", "2", "", "3", "", "4"}
// 	fmt.Printf("%q\n", nonempty(txt)) // ["1" "2" "3" "4"]
// 	fmt.Printf("%q\n", txt)           // ["1" "2" "3" "4" "" "4"]
// }

func main() {
	s := []int{5, 6, 7, 8, 9}
	fmt.Println(remove(s, 2)) // [5 6 9 8]
}

func remove(slice []int, i int) []int {
	slice[i] = slice[len(slice)-1]
	return slice[:len(slice)-1]
}

func nonempty(strings []string) []string {
	i := 0
	for _, s := range strings {
		if s != "" {
			strings[i] = s
			i++
		}
	}
	return strings[:i]
}

func anotherNonempty(strings []string) []string {
	out := strings[:0]
	for _, v := range strings {
		if v != "" {
			out = append(out, v)
		}
	}
	return out
}

func appendInt(x []int, y int) []int {
	var z []int
	zlen := len(x) + 1
	if zlen <= cap(x) {
		// 如果slice还有存储空间，那么就设置slice的内容
		z = x[:zlen]
	} else {
		// slice已经没有存储空间了，给它分配一个容量扩大一倍的新数组
		zcap := zlen
		if zcap < 2*len(x) {
			zcap = 2 * len(x)
		}
		z = make([]int, zlen, zcap)
		copy(z, x) // 内置的copy函数
	}
	z[len(x)] = y
	return z
}

func reverse(s []int) {
	for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
		s[i], s[j] = s[j], s[i]
	}
}

func equal(x, y []string) bool {
	if len(x) != len(y) {
		return false
	}

	for i := range x {
		if x[i] != y[i] {
			return false
		}
	}
	return true
}
