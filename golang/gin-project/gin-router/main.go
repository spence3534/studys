package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
)

//func main() {
//	r := gin.Default()
//
//	// 创建路由分组
//	v1 := r.Group("v1")
//
//	v1.GET("/index", func(c *gin.Context) {
//		fmt.Println("我在分组方法内部")
//		c.JSON(200, gin.H{
//			"code":    200,
//			"message": "请求成功",
//			"data":    true,
//		})
//	})
//
//	r.Run(":8090")
//}

// ----------------- 使用中间件 -----------------

// 自定义中间件方法
func middle() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("我在方法前, 我是1")
		c.Next()
		fmt.Println("我在方法后, 我是1")
	}
}

func middleTwo() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("我在方法前, 我是2")
		c.Next()
		fmt.Println("我在方法后, 我是2")
	}
}

func main() {
	r := gin.Default()

	// 使用中间件
	v1 := r.Group("v1").Use(middle(), middleTwo())

	v1.GET("/index", func(c *gin.Context) {
		fmt.Println("我在分组方法内部")
		c.JSON(200, gin.H{
			"data":    true,
			"message": "请求成功",
			"code":    200,
		})
	})

	r.Run(":8090")
}
