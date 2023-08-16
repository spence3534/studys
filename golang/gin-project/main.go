package main

type Person struct {
	Username, Id string
}

type Login struct {
	Username, Password string
}

// ----------------- gin中的请求方法以及获取参数 -----------------
/*func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		id := c.Query("id")
		username := c.Query("username")
		// 如果某个参数没传，get请求可以使用defaultQuery方法
		// password := c.DefaultQuery("password", "1234")
		userInfo := Person{username, id}
		fmt.Println(userInfo)
		c.JSON(200, gin.H{
			"message": "返回成功",
			"data":    userInfo,
		})
	})

	r.POST("/form", func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.PostForm("password")
		// 如果某个参数没传，post请求可以使用defaultpostfrom方法
		// id := c.DefaultPostForm("id", "1234")
		userInfo := Login{username, password}
		c.JSON(200, gin.H{
			"message": "返回成功",
			"data":    userInfo,
		})
	})

	r.DELETE("/delete/userInfo", func(c *gin.Context) {
		id := c.Query("id")
		username := c.Query("username")
		fmt.Println(id, username)
		userInfo := Person{username, id}

		c.JSON(200, gin.H{
			"message": "删除成功",
			"data":    userInfo,
		})
	})

	r.PUT("/getData", func(c *gin.Context) {
		id := c.Query("id")
		username := c.Query("username")
		userInfo := Person{username, id}
		c.JSON(200, gin.H{
			"message": "查询成功",
			"data":    userInfo,
		})
	})

	r.Run(":8090") // listen and serve on 0.0.0.0:8080
}*/

// ----------------- gin处理前端返回的json结构 -----------------
// 如果需要校验参数是否传递，可以给一个字段tag加上binding:"required"标识，在"required, xxx"中以逗号分割并且自定义名字可以实现一个参数自定义校验器

/*type LoginParams struct {
	Name string `json:"name"`
	Age  int    `json:"age" uri:"age" form:"age" binding:"required,bigAge"`
	Sex  bool   `json:"sex"`
}

// 自定义参数校验器
func bigAge(fl validator.FieldLevel) bool {
	v := fl.Field().Interface().(int)
	if v <= 18 {
		return false
	}
	return true
}

func main() {
	r := gin.Default()

	// 注册自定义校验器
	v, ok := binding.Validator.Engine().(*validator.Validate)
	if ok {
		v.RegisterValidation("bigAge", bigAge)
	}

	r.POST("/login", func(c *gin.Context) {
		var l LoginParams
		// 解析json
		err := c.ShouldBindJSON(&l)
		// 解析uri参数
		// err := c.ShouldBindUri(&l)
		// 解析url上?后面的参数
		// err := c.ShouldBindQuery(&l)
		if err != nil {
			// 加了必传字段如有未传字段，可以调用err.Error()方法把错误返回给前端
			//c.JSON(200, gin.H{
			//	"msg":  err.Error(),
			//	"data": gin.H{},
			//})
			c.JSON(200, gin.H{
				"msg":  "报错了",
				"data": err.Error(),
			})
		} else {
			c.JSON(200, gin.H{
				"msg":  "返回成功",
				"data": l,
			})
		}

	})

	r.Run(":8090")
}*/

//----------------- gin上传文件以及将文件返回给前端 -----------------

/*
	func main() {
		r := gin.Default()
		r.POST("/uploadFile", func(c *gin.Context) {
			file, err := c.FormFile("file")
			if err != nil {
				fmt.Println(err)
			} else {
				c.JSON(200, gin.H{
					"msg":  "上传成功",
					"data": file,
				})
				c.SaveUploadedFile(file, "./"+file.Filename)
			}

		})
		r.Run(":8090")
	}
*/

// ----------------- go原生上传文件 -----------------
/*func main() {
	r := gin.Default()
	r.POST("/uploadFile", func(c *gin.Context) {
		file, _ := c.FormFile("file")
		// 获取文件同时获取附带一些参数
		// name := c.PostForm("name")
		in, _ := file.Open()
		defer in.Close()

		out, _ := os.Create("./" + file.Filename)
		defer out.Close()
		io.Copy(out, in)
		c.Writer.Header().Add("Content-Disposition", fmt.Sprintf("attachment; filename=%s", file.Filename))
		c.File("./" + file.Filename)
	})
	r.Run(":8090")
}*/

// ----------------- go上传多文件 -----------------

/*func main() {
	r := gin.Default()
	r.POST("/uploadFile", func(c *gin.Context) {
		form, _ := c.MultipartForm()
		files := form.File["file"]

		for _, file := range files {
			log.Println(file.Filename)
			in, _ := file.Open()
			defer in.Close()

			out, _ := os.Create("./" + file.Filename)
			defer out.Close()
			io.Copy(out, in)
		}
		c.JSON(200, gin.H{
			"msg":  "上传成功",
			"data": files,
		})
	})
	r.Run(":8090")
}*/
