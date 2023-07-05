/* package main

import (
	"fmt"
	"os"
	"sort"
	"text/tabwriter"
	"time"
)

type Track struct {
	Title  string
	Artist string
	Album  string
	Year   int
	Length time.Duration
}

var tracks = []*Track{
	{"GO", "Delilah", "From the roots up", 2012, legnth("3m38s")},
	{"GO", "Moby", "Moby", 1992, legnth("3m37s")},
	{"GO Ahead", "Alicia Keys", "As I Am", 2007, legnth("4m36s")},
	{"Ready 2 GO", "Martin Solveig", "Smash", 2011, legnth("4m24s")},
}

func legnth(s string) time.Duration {
	d, err := time.ParseDuration(s)
	if err != nil {
		panic(s)
	}
	return d
}

func printTracks(tracks []*Track) {
	const format = "%v\t%v\t%v\t%v\t%v\t\n"
	tw := new(tabwriter.Writer).Init(os.Stdout, 0, 8, 2, ' ', 0)
	fmt.Fprintf(tw, format, "Title", "Artist", "Album", "Year", "Length")
	fmt.Fprintf(tw, format, "-----", "-----", "-----", "-----", "-----")
	for _, t := range tracks {
		fmt.Fprintf(tw, format, t.Title, t.Artist, t.Album, t.Year, t.Length)
	}
	tw.Flush()
}

type byArtist []*Track

func (x byArtist) Len() int { return len(x) }
func (x byArtist) Less(i, j int) bool {
	return x[i].Artist < x[j].Artist
}
func (x byArtist) Swap(i, j int) {
	x[i], x[j] = x[j], x[i]
}

func Sort(data byArtist) {
	for pass := 1; pass < data.Len(); pass++ {
		for i := 0; i < data.Len()-pass; i++ {
			if data.Less(i+1, i) {
				data.Swap(i, i+1)
			}
		}
	}
}

type customSort struct {
	t    []*Track
	less func(x, y *Track) bool
}

func (x customSort) Len() int {
	return len(x.t)
}

func (x customSort) Less(i, j int) bool {
	return x.less(x.t[i], x.t[j])
}

func (x customSort) Swap(i, j int) {
	x.t[i], x.t[j] = x.t[j], x.t[i]
}

func main() {
	//sort.Sort(customSort{tracks, func(x, y *Track) bool {
	//	if x.Title != y.Title {
	//		return x.Title < y.Title
	//	}
	//	if x.Year != y.Year {
	//		return x.Year < y.Year
	//	}
	//	if x.Length != y.Length {
	//		return x.Length < y.Length
	//	}
	//	return false
	//}})
	//printTracks(byArtist(tracks))

	values := []int{3, 1, 4, 2}
	fmt.Println(sort.IntsAreSorted(values)) // false
	sort.Ints(values)
	fmt.Println(values)                     // [1 2 3 4]
	fmt.Println(sort.IntsAreSorted(values)) // true
	sort.Sort(sort.Reverse(sort.IntSlice(values)))
	fmt.Println(values)                     // [4 3 2 1]
	fmt.Println(sort.IntsAreSorted(values)) // false
}
*/