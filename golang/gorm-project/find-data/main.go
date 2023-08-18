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

type APIUser struct {
	Name string
	Age  uint8
}

func main() {
	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN: "root:Aa602107@tcp(localhost:3306)/ginclass?charset=utf8mb4&parseTime=True&loc=Local",
	}), &gorm.Config{
		SkipDefaultTransaction: false,
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "sl_", // 表名前缀，那么User表示't_users',
			SingularTable: true,  // 使用单数表明，启用该项时，User表为't_user'
		},
		DisableForeignKeyConstraintWhenMigrating: true, //如果设置为true，在创建表时不会创建一个物理外键，会创建逻辑外键。物理外键会导致查表时变得缓慢。
	})

	if err != nil {
		fmt.Println(err)
	}

	db.AutoMigrate(&UserInfo{})

	u := UserInfo{}
	fmt.Println(u)
	var us []UserInfo
	fmt.Println(us)

	// 查询第一条
	// db.First(&u)

	// take和first区别在于first会根据主键升序查询，take则不会。
	// db.Take(&u)

	// 查询最后一条
	// db.Last(&u)

	// 查询多条，默认查询所有
	// db.Find(&us)

	// 根据条件查询，where可以传字符串、结构体、map。
	// db.Where("name = ?", "牛爷爷").First(&u)

	// 多条件查询
	// db.Where("age > ?", 18).Or("name = ?", "%图%").Find(&us)

	// 查询某个字段不等于xx的数据
	// db.Where("name <> ?", "图图").Find(&us)

	// 模糊查询
	// db.Where("name LIKE ?", "%图%").Find(&us)

	// 只查询某个字段
	// db.Select("age").Where("age < ?", 20).Find(&us)

	// 只查询某个字段外的数据，比如查age，返回的数据都不包含age
	// db.Omit("age").Find(&us)

	// 智能选择字段，也就是说只返回某些字段。首先要定义一个结构体，在查询时会自动选择该结构体里的字段。
	// 需要注意的是，使用智能选择字段时，需要给gorm提供一个源结构体模型。下面的例子中的`UserInfo`是源结构体，
	// 而`APIUser`结构体中有两个字段`name`和`age`，当查询的时候，自动会选择`APIUser`中的两个字段做返回。
	var au []APIUser
	db.Model(&UserInfo{}).Find(&au)
	fmt.Println(au)
}
