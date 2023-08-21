package main

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// 一个人可以扮演多个角色

type User struct {
	gorm.Model
	UserName string
	Roles    []Role `gorm:"many2many:user_roles"`
}

// 一个角色也可以由多个人来扮演

type Role struct {
	gorm.Model
	Name  string
	Users []User `gorm:"many2many:user_roles"`
}

func main() {
	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN: "root:Aa602107@tcp(localhost:3306)/ginclass?charset=utf8&parseTime=True&loc=Local",
	}), &gorm.Config{
		SkipDefaultTransaction:                   false,
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		fmt.Println(err)
	}

	// 创建两个表，此时你会发现多出来一个`user_roles`表，这个表就是记录多对多的关联关系
	db.AutoMigrate(&User{}, &Role{})

	//r := Role{
	//	Model: gorm.Model{
	//		ID: 2,
	//	},
	//	Name: "go开发",
	//}
	//r1 := Role{
	//	Model: gorm.Model{
	//		ID: 1,
	//	},
	//	Name: "前端开发",
	//}
	//u := User{
	//	UserName: "小美",
	//	Roles:    []Role{r, r1},
	//}

	// 创建一个关联数据，你会发现在`user_roles`表中，多出来了两条数据。因为图图不仅做前端，他还会go开发对把。
	// 接下来我们再创建一个小美，小美不仅会UI设计，也会前端开发。
	// db.Create(&u)

	// 使用Preload把图图的职位查出来
	// db.Preload("Roles").Find(&user)

	// 有时候我们想查某个人下的职位，但是我不想要这个人，只要他的职位。可以开启关联模式进行查询
	// 首先要知道从哪个人身上查，那么我们先创建一个模型，然后再去查职位。把结果输出到一个结构体变量上。
	var roles []Role
	//db.Model(&user).Association("Roles").Find(&roles)

	// 有时候我想知道哪些人是同一个职位时，可以在前面加上预加载方法即可。结果返回了小美是前端开发，图图是前端开发和go开发
	// db.Model(&user).Preload("Users").Association("Roles").Find(&roles)

	// 现在我们再创建一个图爸爸。
	//u := User{
	//	UserName: "图爸爸",
	//}

	//db.Create(&u)
	// 而图爸爸进来没有职位，那么我们让他去干ui和go开发。
	u := User{
		Model: gorm.Model{
			ID: 3,
		},
	}
	//db.Model(&u).Association("Roles").Append(&r, &r1)

	// 然而图爸爸进来没几天，发现ui设计很无聊，然后就不干ui了
	// db.Model(&u).Association("Roles").Delete(&r1)

	// 过了几天发现，他想和图图一样做前端，不想做go开发了。
	// db.Model(&u).Association("Roles").Replace(&r, &r1)

	// 过了一段时间之后，图爸爸发现哪个岗位都不好做，结果跑路了。
	db.Model(&u).Association("Roles").Clear()

	fmt.Println(roles)
}
