package compete

/* var balance int

func Deposit(amount int) {
	balance = balance + amount
}

func Balance() int {
	return balance
}

func main() {
	go func() {
		Deposit(200)
		fmt.Println("=", Balance())
	}()

	go Deposit(100)
	time.Sleep(time.Minute)
}
*/

/*
	 func main() {
		var x []int
		go func() {
			x = make([]int, 10)
			fmt.Print(x)
		}()

		go func() {
			x = make([]int, 100000)
			fmt.Print(x)
		}()
		time.Sleep(time.Minute)

}
*/

type Cake struct{ state string }

func baker(cooked chan<- *Cake) {
	for {
		cake := new(Cake)
		cake.state = "cooked"
		cooked <- cake
	}
}

func icer(iced chan<- *Cake, cooked <-chan *Cake) {
	for cake := range cooked {
		cake.state = "iced"
		iced <- cake
	}
}
