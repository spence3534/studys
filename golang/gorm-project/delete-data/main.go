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

	u := UserInfo{}
	// var us []UserInfo

	// 删除单条数据，软删除。
	// db.Where("name = ?", "图图").Delete(&u)

	// 永久删除
	db.Unscoped().Where("name LIKE ?", "%图%").Delete(&u)
}
