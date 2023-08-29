package main

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"time"
)

type MyClaims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func main() {
	// 加密的key
	mySigningKey := []byte("AllYourbase")
	// token配置
	c := MyClaims{
		Username: "图图",
		StandardClaims: jwt.StandardClaims{
			// 生效时间
			NotBefore: time.Now().Unix() - 60,
			// 过期时间
			ExpiresAt: time.Now().Unix() + 5,
			// 签发人
			Issuer: "图图",
		},
	}

	// 生成token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)

	// 加密token，ss就可以提供给前端了
	ss, err := token.SignedString(mySigningKey)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(ss)

	// token解密
	t, e := jwt.ParseWithClaims(ss, &MyClaims{}, func(token *jwt.Token) (interface{}, error) {
		return mySigningKey, nil
	})

	// token过期判断
	if e != nil {
		fmt.Printf("%s", e)
	}

	// 使用
	fmt.Println(t.Claims.(*MyClaims).Username)
}
