package main

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name   string
	Avatar string
}

type UserTwo struct {
	Name string
}

// ----------------- gorm连接数据库以及创建表 -----------------
/*func main() {
	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN:               "root:Aa602107@tcp(localhost:3306)/ginclass?charset=utf8mb4&parseTime=True&loc=Local", // 数据库地址
		DefaultStringSize: 171, // 默认字符串长度
	}), &gorm.Config{
		SkipDefaultTransaction: false,
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "t_", // 表名前缀，那么User表示't_users',
			SingularTable: true, // 使用单数表明，启用该项时，User表为't_user'
		},
		DisableForeignKeyConstraintWhenMigrating: true, //如果设置为true，在创建表时不会创建一个物理外键，会创建逻辑外键。物理外键会导致查表时变得缓慢。
	})

	if err != nil {
		fmt.Println(err)
	}

	m := db.Migrator()

	// 是否存在表
	if m.HasTable(&User{}) {
		// 删除表
		m.DropTable(&User{})

		// 修改表名
		m.RenameTable(&User{}, &UserTwo{})
	} else {
		// 创建表
		m.CreateTable(&User{})
	}


	// 创建表
	db.AutoMigrate(&Person{})

	// 除了增之外，其他操作都要先查再删除或修改

	创建一条数据
	f := Person{Name: "小美",
		Age: 18,
		Sex: true}
	db.Create(&f)

	根据条件查询数据
	data := &Person{Name: "图图"}
	db.First(data)
	fmt.Println(data)

	f := Person{}
	查询所有数据
	db.Find(&f)
	根据条件查 询，一般推荐先用where条件操作后再进行查询，如果需要多个条件可以再xxx < ?后面加上一条sql语句或在Where()后面使用Or("xxx")方法即可
	db.Find(&f, "age < ?", 20)
	db.Where("age < ?", 20).Find(&f)
	fmt.Println(f)

	更新数据的某个字段
	db.Model(&f).Where("name = ?", "图图").Update("name", "图爸爸")

	使用updates时，如果传入的是一个结构体，不会更改未传的值。如果是map数据类型那么会将空属性修改掉。
	更新多个字段
	db.Model(&f).Where("name = ?", "图妈妈").Updates(Person{Name: "图妈妈", Age: 55, Sex: true})

	更新多条数据
	db.Model(&f).Where("id IN ?", []int{1, 7}).Updates(map[string]interface{}{
		"name": "图图",
		"age":  18,
	})

	删除操作，只会对数据做软删除，并不会在数据库中消失。
	db.Delete(&f, 1)

	删除多条
	db.Where("id IN ?", []int{1, 7}).Delete(&f)

	永久删除操作
	db.Where("name = ?", "图图").Unscoped().Delete(&f)
}*/

// ----------------- gorm设置表名/主键等操作 -----------------

// gorm:primaryKey为设置字段为主键
/*type User struct {
	gorm.Model
	// column:xxx为自定义列名，也就是字段名。type为设置字段的长度
	Name string `gorm:"primaryKey;column:user_name;type:varchar(100)"`
}

// 表的命名方法，支持条件判断

func (u User) TableName() string {
	return "user"
}

func main() {
	db, err := gorm.Open(mysql.Open("root:Aa602107@tcp(localhost:3306)/ginclass?charset=utf8mb4&parseTime=True&loc=Local"))
	if err != nil {
		fmt.Println(err)
	}
	db.AutoMigrate(&User{
		Name: "图图",
	})
	u := User{}
	db.Create(&u)
}*/

// ----------------- 数据库的复杂关系 -----------------
// 一对一关系：一个学生有一张idcard，idcard通过id是哪个学生的
// 一对多关系：学生有多个班级，班级也有多个学生，学生通过classid知道自己是在哪个班
// 多对多关系：学生有多个老师，老师有多个学生，老师通过studentid知道自己的学生，而学生通过teacherid知道自己的老师
