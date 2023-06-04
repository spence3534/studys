package main

import "fmt"

/*
import (

	"fmt"
	"time"

)

	type Employee struct {
		ID        int
		Name      string
		Address   string
		DoB       time.Time
		Position  string
		Salary    int
		ManagerID int
	}

	type AnotherEmployee struct {
		ID                      int
		Name, Address, Position string
		DoB                     time.Time
		Salary                  int
		ManagerID               int
	}

var dilbert Employee

	func main() {
		fmt.Println(EmployeeByID(dilbert.ManagerID).Position)

		id := dilbert.ID
		EmployeeByID(id).Salary = 0
	}

	func EmployeeByID(id int) *Employee {
		return &dilbert
	}

	type tree struct {
		value       int
		left, right *tree
	}

	func Sort(values []int) {
		var root *tree
		for _, v := range values {
			root = add(root, v)
		}
		appendValues(values[:0], root)
	}

	func appendValues(values []int, t *tree) []int {
		if t != nil {
			values = appendValues(values, t.left)
			values = appendValues(values, t.value)
			values = appendValues(values, t.right)
		}
		return values
	}

	func add(t *tree, value int) *tree {
		if t == nil {
			t = new(tree)
			t.value = value
			return t
		}

		if value < t.value {
			t.left = add(t.left, value)
		} else {
			t.right = add(t.right, value)
		}
		return t
	}
*/
/* type Point struct{ X, Y int }

func Scale(p Point, factor int) Point {
	return Point{p.X * factor, p.Y * factor}
}

func main() {
	fmt.Println(Scale(Point{100, 50}, 5)) // {500 250}
} */

type Person struct {
	name, sex string
}
type Tutu struct {
	Person
	age int
}

type XiaoMei struct {
	Tutu
	height int
}

func main() {
	var m XiaoMei
	m = XiaoMei{Tutu{Person{"小美", "女"}, 23}, 170}
	fmt.Printf("%#v\n", m) // {Tutu:main.Tutu{Person:main.Person{name:"小美", sex:"女"}, age:23}, height:170}

	m = XiaoMei{
		Tutu: Tutu{
			Person: Person{
				name: "图图",
				sex:  "男",
			},
			age: 25,
		},
		height: 175,
	}
	fmt.Printf("%#v\n", m) // {Tutu:main.Tutu{Person:main.Person{name:"图图", sex:"男"}, age:25}, height:175}

	m.age = 24
	fmt.Printf("%#v\n", m) // {Tutu:main.Tutu{Person:main.Person{name:"图图", sex:"男"}, age:24}, height:175}
}
