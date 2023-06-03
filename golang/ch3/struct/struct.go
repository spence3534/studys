package main

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

var dilbert Employee

func main() {
	fmt.Println(EmployeeByID(dilbert.ManagerID).Position)

	id := dilbert.ID
	EmployeeByID(id).Salary = 0
}

func EmployeeByID(id int) *Employee {
	return &dilbert
}
