package main

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

type UserInfo struct {
	gorm.Model
	Name string
	Age  uint8
}

func main() {
	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN: "root:Aa602107@tcp(localhost:3306)/ginclass?charset=utf8&parseTime=True&loc=Local",
	}), &gorm.Config{
		SkipDefaultTransaction: false,
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "sl_",
			SingularTable: true,
		},
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	if err != nil {
		fmt.Println(err)
	}

	db.AutoMigrate(&UserInfo{})

	// 创建一条数据
	//dbres := db.Create(&UserInfo{
	//	Name: "图图",
	//	Age:  18,
	//})

	// 批量创建
	dbres := db.Create(&[]UserInfo{
		{Name: "图图", Age: 18},
		{Name: "小美", Age: 18},
		{Name: "牛爷爷", Age: 60},
		{Name: "图爸爸", Age: 45},
		{Name: "图妈妈", Age: 40},
	})

	if dbres.Error != nil {
		fmt.Println("创建失败", dbres.Error)
	} else {
		fmt.Println("创建数据成功", dbres.RowsAffected)
	}
}
