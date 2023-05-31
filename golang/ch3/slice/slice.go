package main

import "fmt"

func main() {
	/* months := []string{1: "january", 2: "february", 3: "march", 4: "april", 5: "may", 6: "june", 7: "july", 8: "august", 9: "september", 10: "october", 11: "november", 12: "december"}

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
	fmt.Println(endlessSummer) // [june july august september october november] */
	var runes []rune
	for _, v := range "hello, world" {
		runes = append(runes, v)
	}
	fmt.Printf("%q\n", runes) // ['h' 'e' 'l' 'l' 'o' ',' ' ' 'w' 'o' 'r' 'l' 'd']
}

/* func reverse(s []int) {
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
} */
