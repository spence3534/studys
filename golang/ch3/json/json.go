package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type Movie struct {
	Title  string
	Year   int  `json:"released"`
	Color  bool `json:"color, omitemply"`
	Actors []string
}

var movies = []Movie{
	{Title: "casblanca", Year: 1942, Color: false, Actors: []string{"Humphery Bogart", "Ingrid Bergman"}},
	{Title: "Cool Hand Luke", Year: 1967, Color: true, Actors: []string{"Paul Newman"}},
	{Title: "Bullitt", Year: 1968, Color: true, Actors: []string{"Steve McQueen", "Jacqueline Bisset"}},
}

const IssuesURL = "https://api.github.com/search/issues"

type IssuesSearchResult struct {
	TotalCount int `json: "total_count"`
	Items      []*Issue
}

type Issue struct {
	Number    int
	HTMLURL   string `json: html_url`
	Title     string
	State     string
	User      *User
	CreatedAt time.Time `json: "create_at"`
	Body      string    // markdown格式
}

type User struct {
	Login   string
	HTMLURL string `json: html_url`
}

func SearchIssues(terms []string) (*IssuesSearchResult, error) {
	q := url.QueryEscape(strings.Join(terms, " "))
	resp, err := http.Get(IssuesURL + "?q=" + q)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		resp.Body.Close()
		return nil, fmt.Errorf("search query failed: %s", resp.Status)
	}

	var result IssuesSearchResult
	if err := json.NewDecoder(resp.Body).Decode(result); err != nil {
		resp.Body.Close()
		return nil, err
	}

	resp.Body.Close()
	return &result, nil
}

func main() {
	var arr = []string{"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"}
	result, err := SearchIssues(arr)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%d issues: \n", result.TotalCount)
	for _, item := range result.Items {
		fmt.Printf("#%-5d %9.9s %.55s\n", item.Number, item.User.Login, item.Title)
	}
}
