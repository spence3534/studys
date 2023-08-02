# 包和go工具

## 导入路径

每一个包都通过一个唯一的字符串进行标识，它称为导入路径，它们用在`import`声明中。

```go
import (
  "fmt"
  "math/rand"
  "encoding/json"
  "golang.org/x/net/html"
  "github.com/go-sql-driver/mysql"
)
```

对于共享或公开的包，导入路径需要全局唯一。为了避免冲突，除了标准库中的包之外，其他包的导入路径应该以互联网域名作为路径，这样也方便查找包。比如上面的例子导入Go团队维护的一个HTML解析器和一个流行的第三方MySQL数据驱动程序。

## 包的声明

在每一个Go源文件的开头都要进行包声明。主要的目的是当该包被其他包引入时作为其默认的标识符（叫做包名）。

例如，`math/rand`包中每个文件的开头都是`package rand`，这样当你导入这个包时，可以访问它的成员，比如`rand.Int`、`rand.Float64`等。

```go
package main

import (
  "fmt"
  "math/rand"
)

func main() {
  fmt.Println(rand.Int())
}
```

通常，包名是导入路径的最后一段，因此即使两个包的导入路径不同，它们依然可能有一个相同的包名。例如，`math/rand`包和`crypto/rand`包的包名都是`rand`。稍后将看到如果同时导入两个有相同包名的包。

关于“最后一段”的惯例，有三个例外。第一个例外是，包对应一个可执行程序，也就是`main`包，这时`main`包本身的导入路径是无关紧要的。名为`main`的包是给`go build`构建命令的一个信息，这个包编译完之后必须调用
连接器生成一个可执行程序。

第二个例外是：目录中可能有一些文件名以`_test.go`结尾，包名中会出现以`_test`结尾。这样一个目录中有两个包：一个普通包，加上一个外部测试包。`_test`后缀告诉`go test`两个包都要构建，并且指明文件属于哪个包。
外部测试包用来避免测试代码中的循环导入依赖。

第三个例外，一些依赖管理工具会在包导入路径的尾部追加版本号后缀，如`gopkg.in/yaml.v2`。包名不包含后缀，因此这个情况下包名为`yaml`。

## 导入声明

可以在一个Go源文件包声明语句之后，其他非导入声明语句之前，包含零到多个导入包声明语句。每个导入可以单独指定一条导入路径，也可以通过圆括号括起来的列表一次导入多个包。下面两种方式是等价的，但第二种更常见。

```go
import "fmt"
import "os"

import (
  "fmt"
  "os"
)
```

导入的包可以通过空行进行分组；这类分组通常表示不同领域和方面的包。导入顺序不重要，但按照惯例每一组都按照字母进行排序。

```go
import (
  "fmt"
  "html/template"
  "os"

  "golang.org/x/net/html"
  "golang.org/x/net/ipv4"
)
```

如果需要把两个名字一样的包（如`math/rand`和`crypto/rand`）导入到第三个包中，导入声明就必须至少为其中一个指定一个代替名字来避免冲突。这叫**重命名导入**。

```go
import (
  "crypto/rand"
  mrand "math/rand"
)
```

代替名字仅影响当前文件。其他文件（即便是同一个包中的文件）可以使用默认名字来导入包，或者一个替代名字也可以。

重命名导入在没有冲突时也是非常有用的。如果有时用到自动生成的代码，导入的包名非常长，使用一个替代名字可能更方便。同样的缩写名字要一直用下去，以避免产生混淆。使用一个替代名字有助于规避常见的局部变量冲突。
例如，如果一个文件可以包含许多以`path`命名的变量，我们就可以使用`pathpkg`这个名字导入一个标准的`path`包。

每个导入声明从当前包向导入的包建立一个依赖。如果这些依赖形成一个循环，`go build`工具会报错。

## 空导入

如果导入的包的名字没有在文件中使用，会导致编译错误。但有时候我们只想利用导入包而产生的副作用：它会计算包级变量的初始化表达式和执行导入包的`init`初始化函数。为了防止“未使用的导入”错误，我们可以用下划线_来重命名导入包。通常情况下，空白标识不能被引用。

```go
import _ "image/png" // 注册解码器
```

这叫做空白导入（也叫匿名导入）。它通常用来实现一个编译时机制，然后通过在`main`主程序入口选择性地导入附加的包。让我们来看看怎么使用它，然后看它是如何工作的。

标准库的`image`包导出了`Decode`函数，它从`io.Reader`读取数据，并且识别使用哪一种图像格式来编码数据，调用适当的解码器，返回`image.Image`对象作为结果。使用`image.Decode`可以构建一个简单的图像转换器，读取某一种格式的对象，然后输出为另外一个格式：

```go
package main

import (
  "fmt"
  "image"
  "image/jpeg"
  _ "image/png" // 注册png解码器
  "io"
  "os"
)

func main() {
  if err := toJPEG(os.Stdin, os.Stdout); err != nil {
    fmt.Fprintf(os.Stderr, "jpeg: %v\n", err)
  }
}

func toJPEG(in io.Reader, out io.Writer) error {
  img, kind, err := image.Decode(in)
  if err != nil {
    return err
  }
  fmt.Fprintln(os.Stderr, "Input format=", kind)
  return jpeg.Encode(out, img, &jpeg.Options{Quality: 95})
}
```

如果我们把`gopl.io/ch3/mandelbrot`的输出导入到这个程序的标准输入，它将解码输入的`PNG`格式图像，然后转换为JPEG格式的图像输出。

```go
go build ./mandelbrot
go build ./empty-imp
./mandelbrot | ./empty-imp >mandelbrot.jpg
Input format= png
```

要注意`image/png`包的空白导入语句。如果没有这一行语句，程序依然可以编译和运行，但它不能正确识别和解码PNG格式的图像：

```go
go build ./empty-imp
./mandelbrot | ./empty-imp >mandelbrot.jpg
jpeg: image: unknown forma
```

下面来解释它是如何工作的。标准库还提供了GIF、PNG、JPEG等格式的解码库，用户自己可以提供其他格式的，但为了使可执行程序简短，除非明确需要，否则解码器不会被包含进应用程序。`image.Decode`函数
在解码时会查询支持的格式列表，每个格式驱动列表的每个入口指定了四件事情：格式的名称；一个用于描述这种图像数据开头部分模式的字符串，用于解码器检测识别；一个`Decode`函数用于完成解码图像工作；一个
`DecodeConfig`函数用于解码图像大小和颜色空间的信息。每个驱动入口是通过调用`image.RegisterFormat`函数注册，一般是在每个格式包的`init`初始化函数中调用，例如`image/png`包是这样注册的:

```go
package png
func Decode(r io.Reader) { image.Image, error }
func DecodeConfig(r io.Reader) { image.Config, error }

func init() {
  const pngHeader = "\x89PNG\r\n\x1a\n"
  image.RegisterFormat("png", pngHeader, Decode, DecodeConfig)
}
```

最终效果是，主程序只需要匿名导入特定图像土洞包就可以用`image.Decode`解码对应格式的图像了。

`database/sql`包使用类似的机制让用户按需加入想要的数据库驱动程序。例如：

```go
import (
  "database/sql"
  _ "github.com/lib/pq"
  _ "github.com/go-sql-driver/mysql"
)
```

## 包和命名

当创建一个包时，一般要短小的包名，但也不能太短导致难以理解。标准库中最常用的包有`bufio`、`bytes`、`flag`、`fmt`、`http`、`json`等等。

尽可能让命名描述性且无歧义。例如，类似`imageutil`或`ioutilist`的工具包命名已经够简洁了，就无须再命名`util`了。要尽量避免包名使用可能被经常用于局部变量的名字，这样可能导致用户重命名导入包，例如前面看到的`path`包。

包名一般采用单数的形式。标准库的`bytes`、`errors`和`strings`使用了复数形式，这是为了避免和预定义的类型冲突，同样还有`go/types`时为了避免和`type`关键字冲突。

现在让我们看看如何命名包的成员。由于是通过包的导入名字引入包内的成员，例如`fmt.Prinln`，同时包含了包名和成员名信息。因此，我们一般并不需要关注`Println`的具体内容，因为`fmt`包已经包含了这个信息。当设计一个包的时候，
需要考虑包名和成员名两个部分如何很好地配合。看下面的例子:

```go
bytes.Equal   flag.Int   http.Get   json.Marshal
```

我们可以看到一些常用的命名模式。`strings`包提供了和字符串相关的诸多操作:

```go
package strings

func Index(needle, haystack string) int

type Replacer struct{ /* ... */ }
func NewReplacer(oldnew ...string) *Replacer

type Reader struct{ /* ... */ }
func NewReader(s string) *Reader
```

包名`strings`并没有出现在任何成员名字中。因为用户会这样引用这些成员`strings.Index`、`strings.Replacer`等。

其他一些包，可能只描述了单一的数据类型，例如`html/template`和`math/rand`等，只暴露一个主要的数据结构和跟它相关的方法，还有一个以`New`命名的函数用于创建实例。

```go
package rand

type Rand struct {  }
func New(source Source) *Rand
```

这可能造成重复，例如在`template.Template`或`rand.Rand`中，这也是为什么这类包名通常比较短。

在其他极端情况下，像`net/http`这样的包有很多的名字，但没有很多的结构，因为它们执行复杂的任务。尽管有超过20种类型和更多的函数，但是包中最重要的成员使用最简单的命名: Get、Post、Handle、Error、Client、Server。

## go工具

go工具将不同种类的工具集合并为一个命名集。它是一个包管理器，用于包的查询，计算包的依赖关系、从远程版本控制下载它们等任务。它也是一个构建系统，计算文件等依赖关系，然后调用编辑器、汇编器和链接器构建程序，虽然它故意被设计成没有标准的make命名那么复杂，它
也是一个单元测试和基准测试的驱动程序。

它的命令行接口使用“瑞士军刀”风格，有十几个字命令，其中一些我们已经见过。例如get、run、build和fmt。可以运行go help来查看内置文档的索引。仅仅为了引用，下面列出最常用的命令。

```go
$ go

The commands are:

  bug         start a bug report
  build       compile packages and dependencies
  clean       remove object files and cached files
  doc         show documentation for package or symbol
  env         print Go environment information
  fix         update packages to use new APIs
  fmt         gofmt (reformat) package sources
  generate    generate Go files by processing source
  get         add dependencies to current module and install them
  install     compile and install packages and dependencies
  list        list packages or modules
  mod         module maintenance
  work        workspace maintenance
  run         compile and run Go program
  test        test packages
  tool        run specified go tool
  version     print Go version
  vet         report likely mistakes in packages

Use "go help <command>" for more information about a command.
```

为了达到零配置的设计目标，Go的工具箱很多都依赖各种约定。例如，根据给定的源文件的名称，Go语言的工具可以找到源文件对应的包，因为每个目录只包含了单一的包，并且包的导入路径和工作区的目录结构是对应的。给定一个包的导入路径，Go语言的工具可以找到与之对应
的存储着实体文件的目录。它还可以根据导入路径找到存储代码的仓库的远程服务器URL。

### 工作区结构

对于大部分的Go语言用户，只需要配置一个名叫`GOPATH`的环境变量，用来指定当前工作目录即可。当需要切换到不同工作区时，只需要更新`GOPATH`即可。

`GOPATH`有三个子目录。`src`子目录包含源文件。每一个包放在一个目录中，该目录相对于`$GOPATH/src`的名字是包的导入路径，如`gopl.io/ch1/helloworld`。注意，一个`GOPATH`工作空间在`src`下包含很多个源代码版本控制仓库，例如`gopl.io`或`golang.org`。
pkg子目录是构建工具存储编译后的包的位置，bin子目录放置可执行程序。

第二个环境变量`GOROOT`用来指定Go的安装目录，还有它自带的标准包的位置。`GOROOT`的目录结构和`GOPATH`类似，因此存放`fmt`包的源码对应目录应该为`$GOROOT/src/fmt`。用户一般不需要设置`GOROOT`，默认情况下Go安装工具会将其设置为安装的目录路径。

`go env`命令用于查看Go工具涉及的所有环境变量的值，包括未设置环境变量的默认值。`GOOS`环境变量用于指定目标操作系统（例如android、Linux、windows），`GOARCH`环境变量用于指定处理器的类型，例如`arm64`、386或arm等。虽然`GOPATH`环境变量是唯一必须要设置的，
但是其他环境变量也会偶尔用到。

```go
GO111MODULE="on"
GOARCH="amd64"
GOBIN=""
GOCACHE="/Users/xxx/Library/Caches/go-build"
GOENV="/Users/xxx/Library/Application Support/go/env"
GOEXE=""
GOEXPERIMENT=""
GOFLAGS=""
GOHOSTARCH="amd64"
GOHOSTOS="darwin"
GOINSECURE=""
GOMODCACHE="/Users/xxx/gobook/pkg/mod"
GONOPROXY=""
GONOSUMDB=""
GOOS="darwin"
GOPATH="/Users/xxx/gobook"
```

### 下载包

使用Go语言工具箱的go命令，不仅可以根据包导入路径找到本地工作区的包，甚至可以从网上找到和更新包。

使用`go get`命令可以下载一个单一的包或者用`...`下载整个子目录里面的每个包。

在`go get`完成包的下载之后，然后就是安装包或包对应的可执行的程序。

使用`go get -u`可以把它访问的所有包更新到最新版本。如果没有这个标识，存在本地的包不会更新。

### 包的构建

`go build`命令编译每一个命令行参数中的包。如果包是一个库，则忽略输出结果；如果包的名字是`main`，`go build`将调用链接器在当前目录创建一个可执行程序；以导入路径的最后一段作为可执行程序的名字。

由于每个目录只包含一个包，因此每个对应可执行程序或者叫`Unix`术语中的命令中的包，会要求放在一个独立的目录中，这些目录有时候会放在名叫cmd目录的子目录下面，例如用于提供Go文档服务的`golang.org/x/tools/cmd/godoc`命令就是放在`cmd`子目录。

每个包可以由它们的导入路径指定，就像前面看到的那样，或者用一个相对目录的路径名指定，相对路径必须以`.`或`..`开头。如果没有指定参数，那么默认指定为当前目录对应的包。

包也可以使用一个文件列表来指定，一般用于构建一些小程序或做一些临时性的实验。如果是`main`包，将会以第一个Go源文件的基础文件名作为最终的可执行程序的名字。

```go
touch quoteargs.go

// quoteargs文件代码如下
package main

import (
 "fmt"
 "os"
)

func main() {
 fmt.Printf("%q\n", os.Args[1:])
}


go build ./quoteargs.go

./quoteargs one "two three" four\ five

//输出 ["one" "two three" "four five"]
```

特别是对于这类一次性运行的程序，我们希望尽快的构建并运行它。`go run`命令实际上结合了构建和运行的两个步骤

```go
go run quoteargs.go 1 "2 3 4" 5 6

//输出 ["1" "2 3 4" "5" "6"]
```

第一行的参数列表中，第一个不是以`.go`结尾的将作为可执行程序的参数运行。

默认情况下，`go build`命令构建指定的包和它依赖的包，然后丢弃除了最后的可执行文件之外所有的中间编译结果。

`go install`和`go build`很相似，但是它会保存每个包的编译结果，而不是把它们丢弃。被编译的包会保存在`$GOPATH/pkg`目录下，目录路径和src目录路径对应，可执行程序被保存到`$GOPATH/bin`目录。还有，`go install`和`go build`命令都不会
重新编译没有发生变化的包，这使得后续构建更快捷。为了方便编译依赖的包，`go build -i`把安装每个目标所依赖的包。

### 包的文档化

`go doc`命令输出指定的内容的声明和整个文档注释，该实体可能是一个包:

```go
go doc fmt

package fmt // import "fmt"

Package fmt implements formatted I/O with functions analogous to C's printf and
scanf. The format 'verbs' are derived from C's but are simpler.

# Printing

The verbs:

General:

  %v the value in a default format
    when printing structs, the plus flag (%+v) adds field names
  %#v a Go-syntax representation of the value
  %T a Go-syntax representation of the type of the value
  %% a literal percent sign; consumes no value

Boolean:

  %t the word true or false
```

打印一个包成员或方法:

```go
go doc fmt.Printf


package fmt // import "fmt"

func Printf(format string, a ...any) (n int, err error)
  Printf formats according to a format specifier and writes to standard
  output. It returns the number of bytes written and any write error
  encountered.
```

### 包的查询

`go list`命令可以查询可用包的信息。通过最简单的方式，可以测试包是否在工作区中。如果存在，就打印它的路径:

```go
go list github.com/go-sql-driver/mysql

// 不存在
no required module provides package github.com/go-sql-driver/mysql; to add it:
go get github.com/go-sql-driver/mysql
```

`go list`命令的参数可以包含“...”通配符，表示匹配任意的包的导入路径。我们可以用它来列出工作区中的所有包:

```go
archive/tar
archive/zip
bufio
bytes
cmd/addr2line
cmd/api
...many more...
```

或者一个指定的子目录下的所有包:

```go
go list ./ch1/...

gopl.io/ch1/new-func
gopl.io/ch1/pointer
gopl.io/ch1/statement
gopl.io/ch1/type
gopl.io/ch1/variable
```

或者是某个主题相关的所有包:

```go
go list ...xml...

encoding/xml
gopl.io/ch7/xmlselect
```

`go list`命令还可以获取每个包完整的元信息，而不仅仅只是导入路径，这些元信息可以以不同格式提供给用户。其中`-json`命令行参数表示用`JSON`格式打印每个包的元信息。

```go
go list -json hash

{
  "Dir": "/usr/local/opt/go/libexec/src/hash",
  "ImportPath": "hash",
  "Name": "hash",
  "Doc": "Package hash provides interfaces for hash functions.",
  "Target": "/usr/local/opt/go/libexec/pkg/darwin_amd64/hash.a",
  "Root": "/usr/local/opt/go/libexec",
  "Match": [
    "hash"
  ],
  "Goroot": true,
  "Standard": true,
  "GoFiles": [
    "hash.go"
  ],
  "Imports": [
    "io"
  ],
  "Deps": [
    "errors",
    "internal/abi",
    "internal/bytealg",
    "internal/cpu",
    "internal/goarch",
    "internal/goexperiment",
    "internal/goos",
    "internal/race",
    "internal/reflectlite",
    "internal/unsafeheader",
    "io",
    "runtime",
    "runtime/internal/atomic",
    "runtime/internal/math",
    "runtime/internal/sys",
    "sync",
    "sync/atomic",
    "unsafe"
  ],
  "XTestGoFiles": [
    "example_test.go",
    "marshal_test.go"
  ],
  "XTestImports": [
    "bytes",
    "crypto/md5",
    "crypto/sha1",
    "crypto/sha256",
    "crypto/sha512",
    "encoding",
    "encoding/hex",
    "fmt",
    "hash",
    "hash/adler32",
    "hash/crc32",
    "hash/crc64",
    "hash/fnv",
    "log",
    "testing"
  ]
}
```

`-f`命令行参数可以让用户通过`text/template`包提供的模板语言来定制输出格式。

```go
go list -f '{{join .Deps " "}}' strconv

errors internal/abi internal/bytealg internal/cpu internal/goarch internal/goexperiment internal/goos internal/reflectlite internal/unsafeheader math math/bits runtime runtime/internal/atomic runtime/internal/math runtime/internal/sys unicode/utf8 unsafe
```

下面的命令打印`compress`子目录下所有包的导入包列表:

```go
$ go list -f '{{.ImportPath}} -> {{join .Imports " "}}' compress/...
compress/bzip2 -> bufio io sort
compress/flate -> bufio fmt io math sort strconv
compress/gzip -> bufio compress/flate errors fmt hash hash/crc32 io time
compress/lzw -> bufio errors fmt io
compress/zlib -> bufio compress/flate errors fmt hash hash/adler32 io
```

`go list`对于一次性的交互查询和构建、测试脚本都非常有用。
