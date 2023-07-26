package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

//func main() {
//	fmt.Println("commencing countdown.")
//	tick := time.Tick(1 * time.Second)
//	for countdown := 10; countdown > 0; countdown-- {
//		fmt.Println(countdown)
//		<-tick
//	}
//	lanunch()
//}
//
//
//func main() {
//	abort := make(chan struct{})
//	go func() {
//		os.Stdin.Read(make([]byte, 1))
//		abort <- struct{}{}
//	}()
//	fmt.Println("commencing coundown. Press return to abort.")
//	select {
//	case <-time.After(10 * time.Second):
//	// 不做任何操作
//	case <-abort:
//		fmt.Println("Launch aborted!")
//		return
//	}
//	lanunch()
//}

//	func main() {
//		ch := make(chan int, 1)
//		for i := 0; i < 10; i++ {
//			select {
//			case x := <-ch:
//				fmt.Println(x)
//			case ch <- i:
//			}
//		}
//	}
/*func lanunch() {
	fmt.Println("Lift off!")
}
func main() {
	abort := make(chan struct{})
	go func() {
		os.Stdin.Read(make([]byte, 1))
		abort <- struct{}{}
	}()

	fmt.Println("commencing countdown. Press return to abort.")

	tick := time.Tick(1 * time.Second)
	for countdown := 10; countdown > 0; countdown-- {
		fmt.Println(countdown)
		select {
		case <-tick:
		case <-abort:
			fmt.Println("launch aborted")
		}
	}
	lanunch()
}*/

func walkDir(dir string, fileSizes chan<- int64) {
	for _, entry := range dirents(dir) {
		if entry.IsDir() {
			subdir := filepath.Join(dir, entry.Name())
			walkDir(subdir, fileSizes)
		} else {
			fileSizes <- entry.Size()
		}
	}
}

func dirents(dir string) []os.FileInfo {
	entries, err := ioutil.ReadDir(dir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "du1: %v\n", err)
		return nil
	}
	return entries
}

func main() {
	flag.Parse()
	roots := flag.Args()
	if len(roots) == 0 {
		roots = []string{"."}
	}
	fileSizes := make(chan int64)
	go func() {
		for _, root := range roots {
			walkDir(root, fileSizes)
		}
		close(fileSizes)
	}()

	var nfiles, nbytes int64
	for size := range fileSizes {
		nfiles++
		nbytes += size
	}
	printDiskUsage(nfiles, nbytes)
}

func printDiskUsage(nfiles, nbytes int64) {
	fmt.Printf("%d files %.1f GB\n", nfiles, float64(nbytes)/1e9)
}
