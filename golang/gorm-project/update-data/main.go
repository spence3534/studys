package main

import (
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
	db, _ := gorm.Open(mysql.New(mysql.Config{
		DSN: "root:Aa602107@tcp(localhost:3306)/ginclass?charset=utf8mb4&parseTime=True&loc=Local",
	}), &gorm.Config{
		SkipDefaultTransaction: false,
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "sl_", // 表名前缀，那么User表示't_users',
			SingularTable: true,  // 使用单数表明，启用该项时，User表为't_user'
		},
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	var us []UserInfo

	// Update:只更新某个字段
	// db.Model(&UserInfo{}).Where("name LIKE ?", "%图%").Update("name", "SpenceLee")

	// Save: Save操作不常用，因为它会根据主键进行更新，如果没有传入主键那就就创建一条数据。而且无论如何都会更新，包括所有的内容和零值
	// dbres := db.Model(&UserInfo{}).Where("name = ?", "SpenceLee").Find(&us)
	// Save操作在没有传主键时，只有通过for循环进行更新
	//for k := range us {
	//	us[k].Name = "图图"
	//}
	//
	//dbres.Save(&us)

	// updates操作如果传入的是结构体，零值不会参入更新，如果传入的是map则会更新零值
	// db.First(&UserInfo{}).Updates(&UserInfo{Name: "SpenceLee", Age: 0})
	//db.First(&UserInfo{}).Updates(map[string]interface{}{
	//	"Name": "",
	//	"Age":  0,
	//})

	// 批量更新，先查后更新
	db.Find(&us).Updates(map[string]interface{}{
		"name": "图图",
		"age":  0,
	})
}
