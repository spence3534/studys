package main

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// foreignKey的用法
//type User struct {
//	gorm.Model
//	UserName string
//	// 这里用UserID为外键关联order表，自定义外键，指定某个外键去做关联
//	Orders []Order `gorm:"foreignKey:UserID"`
//}
//
//type Order struct {
//	gorm.Model
//	UserID   uint
//	Total    float64
//	Customer string
//}

// references的用法
// 指定表中的某个字段的值来当作外键的值
//
//type User struct {
//	gorm.Model
//	UserName string
//	// 指定结构体的某个字段来当作userid外键的值
//	Orders []Order `gorm:"foreignKey:UserID;references:UserName"`
//}
//
//type Order struct {
//	gorm.Model
//	// 注意这里改为string类型，因为user表的外键userid的值是username
//	UserID   string
//	Total    float64
//	Customer string
//}

// 上面的两个字段在manytomany中使用
// 此时的主体变成了user_orders中间表，这个中间表的外键是username了，而引用则是订单中的订单id
// 现在我们在中间表用username和订单id做关联
// 修改外键名称和引用名

type User struct {
	gorm.Model
	UserName string
	Orders   []Order `gorm:"many2many:user_orders;foreignKey:UserName;joinForeignKey:NikeName;references:ID;joinReferences:UserOrderID"`
}

type Order struct {
	gorm.Model
	UserID   string
	Total    float64
	Customer string
}

func main() {
	db, _ := gorm.Open(mysql.New(mysql.Config{
		DSN: "root:Aa602107@tcp(localhost:3306)/ginclass?charset=utf8&parseTime=True&loc=Local",
	}), &gorm.Config{
		SkipDefaultTransaction:                   false,
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	db.AutoMigrate(&User{}, &Order{})

	user := User{
		UserName: "图图",
	}

	order := Order{
		Total:    150.0,
		Customer: "小美",
	}

	order1 := Order{
		Total:    200.0,
		Customer: "图爸爸",
	}

	db.Create(&user)

	// 开启关联模式，从user模型中把这两个订单的关系建立起来。
	db.Model(&user).Association("Orders").Append([]Order{order, order1})

	/*db.Create(&User{
		UserName: "小美",
		Roles: Role{
			RoleName: "ui设计",
		},
	})*/
}
