package main

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

// Belongs To 属于关系:表示一个模型属于另一个模型。在数据库中表示，一个表中包含一个外键，该外键是另一个表中的主键关联。
// 首先，创建两个表，一个是人的表，一个是护照的表。人的表中有一个护照ID作为外键（也就是护照表的主键），和护照表中的主键所关联。
// 白话讲解：每个人“属于”一个护照，这是从属关系。这个“护照id”就像是一个指示一样，通过人的护照id就知道这个人属于哪个护照
// belongsTo的外键通常位于“属于”一侧的表中，指向另一侧的表。
/*type Person struct {
	gorm.Model
	Name       string
	PassPort   PassPort
	PassPortID uint
}

type PassPort struct {
	gorm.Model
	Number string
}

func main() {
	db, _ := gorm.Open(mysql.New(mysql.Config{
		DSN: "root:Aa602107@tcp(localhost:3306)/ginclass?charset=utf8&parseTime=True&loc=Local",
	}), &gorm.Config{
		SkipDefaultTransaction: false,
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "sl_",
			SingularTable: true,
		},
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	// 此时会创建两个表，此时你会发现`person`表中会多出一个`passport_id`字段
	db.AutoMigrate(&Person{})

	// 我们来创建一条图图这个人的数据，你会发现不仅在`person`表中创建数据，`passport`的表也创建了一条护照信息的数据
	//p := Person{
	//	Name: "小美",
	//	PassPort: PassPort{
	//		Number: "78910",
	//	},
	//}
	//
	//db.Create(&p)

	// 使用Preload方法查询person的关联数据，预加载PassPort字段值，PassPort字段是Person的关联字段
	// var p Person
	// db.Model(&Person{}).Preload("PassPort").First(&p, 4)
}*/

// Has One 拥有关系：表示一个模型拥有另一个模型。在数据库中表示，一个表的每个记录和另一表的一个记录关联。这是一种所有权关系，
// 其中一个表的记录具有一个关联的记录。
// 白话讲解：每个护照都拥有一个人的信息，通过这些信息就知道该护照是谁的。
// HasOne的外键通常位于“拥有”一侧的表中，指向另一侧的表。

type Person struct {
	gorm.Model
	Name       string
	PassPortID uint
}

type PassPort struct {
	gorm.Model
	Number string
	Person Person
}

func main() {
	db, _ := gorm.Open(mysql.New(mysql.Config{
		DSN: "root:Aa602107@tcp(localhost:3306)/ginclass?charset=utf8&parseTime=True&loc=Local",
	}), &gorm.Config{
		SkipDefaultTransaction: false,
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "sl_",
			SingularTable: true,
		},
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	//var pa PassPort
	//db.Model(&PassPort{}).Preload("Person").First(&pa, 4)

	pa := PassPort{
		Model: gorm.Model{
			ID: 4,
		},
	}

	//pe := Person{
	//	Model: gorm.Model{
	//		ID: 4,
	//	},
	//}
	//
	//pe2 := Person{
	//	Model: gorm.Model{
	//		ID: 5,
	//	},
	//}

	// 添加关联模式
	// 给这个人办理护照，那么这个护照就属于这个人的了。
	//pa := PassPort{Model: gorm.Model{ID: 4}}
	//db.Model(&pe).Association("PassPort").Append(&pa)

	// 这个人不想要护照了，那么就删除了
	// db.Model(&pe).Association("PassPort").Delete(&pe)

	// 然后过了几年护照过期了，得换护照了。那么得替换一个新的护照给他
	// db.Model(&pe).Association("PassPort").Replace(&pa, &pa2)

	// 过了n年后，这个人已经升天了，那么就得清除掉这些信息了
	// db.Model(&pe).Association("PassPort").Clear()

	// 现在用护照和人建立关系，把护照分配给人
	// db.Model(&pa).Association("Person").Append(&pe)

	// 但是护照的主人，不想要这个号码。
	// db.Model(&pa).Association("Person").Delete(&pe)

	// 然后这个护照号码就换到别人那里去了
	// db.Model(&pa).Association("Person").Replace(&pe, &pe2)

	// 最后这个护照去到新的主人手里，新的主人也不想要，就还回给了办理护照的部门
	db.Model(&pa).Association("Person").Clear()
	// db.Create(&p)
}
