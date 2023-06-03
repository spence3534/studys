package main

import (
	"fmt"
)

// func main() {
// 	names := make(map[string]int)
// 	fmt.Println(names) // map[]

// 	// 使用map字面量创建一个带有初始化键值对元素的字典
// 	ages := map[string]int{
// 		"图图": 25,
// 		"小美": 23,
// 	}

// 	fmt.Println(ages) // map[图图:25 小梅:23]

// 	fmt.Println(ages["图图"]) //25

// 	delete(ages, "图图")
// 	fmt.Println(ages) // map[小美:23]

// 	fmt.Println(ages["图爸爸"]) // 0
// }

// func main() {
// 	ages := map[string]int{
// 		"小美": 23,
// 		"图图": 25,
// 	}
// 	for name, age := range ages {
// 		fmt.Println(name, age)
// 		// 小美 23
// 		// 图图 25
// 	}
// }

//func main() {
// ages := map[string]int{
// 	"图图": 25,
// 	"小美": 23,
// }

// anotherAges := map[string]int{
// 	"图图2": 23,
// 	"小美":  23,
// }

/* threeAges := map[string]int{
	"图图": 25,
	"小美": 23,
} */
// fmt.Println(equal(ages, anotherAges))                               // false
// fmt.Println(equal(map[string]int{"A": 0}, map[string]int{"B": 42})) // true
// }

/* func main() {
	seen := make(map[string]bool)
	input := bufio.NewScanner(os.Stdin)
	for input.Scan() {
		line := input.Text()
		if !seen[line] {
			seen[line] = true
			fmt.Println(line)
		}
	}

	if err := input.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "dedup: %v\n", err)
		os.Exit(1)
	}
} */

/* func main() {
	var m = make(map[string]int)

	var k = func(list []string) string {
		return fmt.Sprintf("%q", list)
	}

	var Add = func(list []string) {
		m[k(list)]++
	}

	var Count = func(list []string) int {
		return m[k(list)]
	}
} */

/* func main() {
	counts := make(map[rune]int)
	var utflen [utf8.UTFMax + 1]int
	invalid := 0

	in := bufio.NewReader(os.Stdin)
	for {
		r, n, err := in.ReadRune()
		if err == io.EOF {
			break
		}

		if err != nil {
			fmt.Fprintf(os.Stderr, "charcout: %v\n", err)
			os.Exit(1)
		}

		if r == unicode.ReplacementChar && n == 1 {
			invalid++
			continue
		}
		counts[r]++
		utflen[n]++
	}

	fmt.Printf("rune\tcount\n")
	for c, n := range counts {
		fmt.Printf("%q\t%d\n", c, n)
	}
	fmt.Print("\nlen\tcount\n")
	for i, n := range utflen {
		if i > 0 {
			fmt.Printf("%d\t%d\n", i, n)
		}
	}
	if invalid > 0 {
		fmt.Printf("\n%d invalid UTF-8 characters\n", invalid)
	}
} */

var graph = make(map[string]map[string]bool)

func addEdge(from, to string) {
	edges := graph[from]
	if edges == nil {
		edges = make(map[string]bool)
		graph[from] = edges
	}
	edges[to] = true
}

func hasEdge(from, to string) bool {
	return graph[from][to]
}

func equal(x, y map[string]int) bool {
	if len(x) != len(y) {
		return false
	}

	for k, xv := range x {
		if yv := y[k]; xv != y[k] {
			fmt.Println(xv, y[k], yv)
			return false
		}
	}
	return true
}
