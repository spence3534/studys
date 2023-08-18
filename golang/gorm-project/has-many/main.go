package main

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

// 一对多关系：例如一个部门有多个人

type Department struct {
	gorm.Model
	Name    string
	Persons []Person
}

type Person struct {
	gorm.Model
	DepartmentID uint
	Name         string
	Position     Position
}

// 每个人都拥有一个职位

type Position struct {
	gorm.Model
	PositionType string
	PersonID     uint
}

//type Position struct {
//
//}

func main() {
	db, _ := gorm.Open(mysql.New(mysql.Config{
		DSN: "root:Aa602107@tcp(localhost:3306)/ginclass?charset=utf8&parseTime=True&loc=Local",
	}), &gorm.Config{
		SkipDefaultTransaction: false,
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true,
		},
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	//p := Person{
	//	Model: gorm.Model{
	//		ID: 1,
	//	},
	//	Name: "图图",
	//}
	//
	//p2 := Person{
	//	Model: gorm.Model{
	//		ID: 2,
	//	},
	//	Name: "小美",
	//}
	//
	//d := Department{
	//	Model: gorm.Model{
	//		ID: 1,
	//	},
	//	Name:    "开发部",
	//	Persons: []Person{p, p2},
	//}

	var department Department

	// 把department部门下关联的信息查询出来
	// db.Preload("Persons").First(&department)

	// 带条件的预加载
	// db.Preload("Persons", "name = ?", "图图").First(&department)
	// 第二种带条件的预加载方式，Preload方法第二个参数可接收一个自定义SQL函数，一般用于复杂条件操作
	//db.Preload("Persons", func(db *gorm.DB) *gorm.DB {
	//	return db.Where("name = ?", "图图")
	//}).First(&department)

	// 嵌套预加载，把每个人的职位都查出来，并且也会把部门下的人也查出来。
	// db.Preload("Persons.Position").First(&department)
	// 带有条件查询的嵌套预加载，且查询条件只适用于当前那一层。比如查询`Persons`表中`name`为图图的字段。那么只会查这一层，而`Persons`下的`Position`虽然被查出来了，但是值是为零值。
	// db.Preload("Persons.Position", "position_type = ?", "前端开发").Preload("Persons", "name = ?", "图图").First(&department)

	// 在预加载时，如果预加载的那个最后的信息是一对一关系并且想要拿到它的所属的关系上的某个参数作为条件来作为最外层序号带出来的信息的查询条件的话就可以这么写
	// joins的用法：比如在预加载一个用户的信息时，把这个用户的所有职位也一起查询出来。可能有些人就有多个职位是吧。
	db.Preload("Persons", func(db *gorm.DB) *gorm.DB {
		return db.Joins("Position").Where("name = ?", "图图")
	}).First(&department)
	fmt.Println(department)

	//db.AutoMigrate(&Department{}, &Person{})

	//db.AutoMigrate(&Position{})

	// 先给他们建立关系
	//pe1 := Person{
	//	Model: gorm.Model{ID: 1},
	//}
	//
	//pe2 := Person{
	//	Model: gorm.Model{ID: 2},
	//}
	//
	//p1 := Position{
	//	Model:        gorm.Model{ID: 1},
	//	PositionType: "前端开发",
	//}
	//
	//p2 := Position{
	//	Model:        gorm.Model{ID: 2},
	//	PositionType: "UI设计",
	//}
	//
	//db.Model(&pe1).Association("Position").Append(&p1)
	//db.Model(&pe2).Association("Position").Append(&p2)

	//db.Create(&d)
}
