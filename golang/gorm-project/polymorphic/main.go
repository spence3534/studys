package main

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// gorm中的多态：允许一个表中的记录在关联到另一个表时，可以关联到多个不同的表。
// 允许一个表中的记录可以和多个不同类型的目标表关联。这种关联允许你在一个表中引用多个不同的实体类型，而
// 不必给每种类型都创建一种独立的关联表
// 想象一下：你有一个评论系统，可以让大家在文章和图片上留下评论。但是，你不想为文章和图片分别创建两张评论表，
// 这样会变得很乱。这是多态关联就派上用场了。

// 现在，你希望能够在这两种不同类型的内容上留下评论，但不想分别给文章和图片创建评论表。这就是多态关联的作用。

type Article struct {
	ID      uint
	Title   string
	Comment Comment `gorm:"polymorphic:Commentable"`
}

type Image struct {
	ID      uint
	URL     string
	Comment Comment `gorm:"polymorphic:Commentable"`
}

type Comment struct {
	ID              uint
	Body            string
	CommentableID   uint
	CommentableType string
}

func main() {
	db, _ := gorm.Open(mysql.New(mysql.Config{
		DSN: "root:Aa602107@tcp(localhost:3306)/ginclass?charset=utf8&parseTime=True&loc=Local",
	}), &gorm.Config{
		SkipDefaultTransaction:                   false,
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	db.AutoMigrate(&Article{}, &Image{}, &Comment{})

	a := Article{
		Title: "后端文章",
		Comment: Comment{
			Body: "后端深似海",
		},
	}

	//i := Image{
	//	URL: "http//:baidu.com",
	//	Comment: Comment{
	//		Body: "这张图片真好看",
	//	},
	//}

	db.Create(&a)
}
