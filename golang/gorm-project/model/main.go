package model

import (
	"database/sql"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
	"time"
)

type Model struct {
	// 设置主键
	UUID uint      `gorm:"primaryKey"`
	Time time.Time `gorm:"column:my_time"` // 指定字段名
}

// 以一个匿名结构体融合进来之后，整个结构体都会被继承
// 添加embedded标签告诉gorm只是把结构体嵌套进去，不做任何关联，embeddedPrefix标签为嵌套进来的字段加前缀xxx

type TestUser struct {
	Model        Model `gorm:"embedded;embeddedPrefix:sl_"`
	Name         string
	Email        *string `gorm:"default: 820792395@qq.com"` // 设置字段默认值
	Age          uint8   `gorm:"comment:年龄"`                // 备注字段名
	Birthday     *time.Time
	MemberNumber sql.NullString
	ActivatedAt  sql.NullTime
}

func main() {
	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN: "root:Aa602107@tcp(localhost：3306)/ginclass?charset=utf8&parseTime=True&loc=Local",
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
	db.AutoMigrate(&TestUser{})
}
