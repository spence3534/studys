package main

//type Slice[T int | float32 | float64] []T
//
//var a Slice[int] = []int{1, 2, 3}
//
//func main() {
//	fmt.Println(a[2])
//}

//type MyMap[K int | string, V float32 | float64] map[K]V
//
//var a MyMap[string, float64] = map[string]float64{
//	"jack_score": 9.6,
//	"bob_score":  8.4,
//}
//
//func main() {
//	fmt.Println(a)
//}

// 泛型结构体
//type MyStruct[T int | string] struct {
//	Name string
//	Data T
//}

// 泛型接口
//type MyInterface[T int | float32 | string] interface {
//	Print(data T)
//}

// 泛型channel
//type MyChan[T int | string] chan T

//type WowStruct[T int | string, S []T] struct {
//	data     S
//	MaxValue T
//	MinValue T
//}
//
//var ws WowStruct[string, []string]

// 泛型套娃
// type Slice[T int | string | float32 | float64] []T

// 错误用法，因为Slice[T]的类型约束中没有unit、unit8类型
// type UnitSlice[T unit | unit8] Slice[T]

//type FloatSlice[T float32 | float64] Slice[T]
//
//type IntAndStringSlice[T int | string] Slice[T]
//type IntSlice[T int] IntAndStringSlice[T]
//
//type WowMap[T int | string] map[string]Slice[T]
//type WowMap2[T Slice[int] | Slice[string]] map[string]T

// 类型约束的两种选择，差别不大
//type WowStruct[T int | string] struct {
//	Name string
//	Data []T
//}
//
//type WowStruct2[T []int | []string] struct {
//	Name string
//	Data T
//}

// 泛型方法接收者
//type MySlice[T int | float32] []T
//
//func (m MySlice[T]) Sum() T {
//	var sum T
//	for _, value := range m {
//		sum += value
//	}
//	return sum
//}
//
//func main() {
//	var s MySlice[int] = []int{1, 2, 3, 4}
//	fmt.Println(s.Sum()) // 10
//
//	var s2 MySlice[float32] = []float32{1.0, 2.0, 3.0, 4.0, 5.0}
//	fmt.Println(s2.Sum()) // 15
//}

// 泛型队列
//type Queue[T interface{}] struct {
//	eles []T
//}
//
//func (q *Queue[T]) Put(v T) {
//	q.eles = append(q.eles, v)
//}
//
//func (q Queue[T]) Pop() (T, bool) {
//	var v T
//	if len(q.eles) == 0 {
//		return v, true
//	}
//
//	v = q.eles[0]
//	q.eles = q.eles[1:]
//	return v, len(q.eles) == 0
//}
//
//func main() {
//	que := Queue[int]{eles: []int{}}
//	for i := 0; i < 100; i++ {
//		que.Put(i)
//	}
//	fmt.Println(que.eles) // [0 1 2... 100]
//
//	fmt.Println(que.Pop()) // 0 false
//}
