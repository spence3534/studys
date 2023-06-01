package main

import "fmt"

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

func main() {
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
	fmt.Println(equal(map[string]int{"A": 0}, map[string]int{"B": 42})) // true
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
