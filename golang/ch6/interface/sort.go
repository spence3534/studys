package main

type Interface interface {
	Len() int
	Less(i, j int) bool
	Swap(i, j int)
}

type StringSlice []string

func (p StringSlice) Len() int {
	return len(p)
}

func (p StringSlice) Less(i, j int) bool {
	return p[i] < p[j]
}

func (p StringSlice) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}

/* func Sort(data Interface) {
	for pass := 1; pass < data.Len(); pass++ {
		for i := 0; i < data.Len()-pass; i++ {
			if data.Less(i+1, i) {
				data.Swap(i, i+1)
			}
		}
	}
}

func main() {
	data := []string{"dolphin", "dinosaur", "chimp", "bird"}
	a := StringSlice(data)
	fmt.Println(a)
	Sort(a)
	fmt.Println(data) // [bird chimp dinosaur dolphin]
} */
