package main

import (
	"html/template"
	"log"
	"os"
)

func main() {
	const templ = `<p>A: {{.A}}</p><p>B: {{.B}}</p>`
	t := template.Must(template.New("escape").Parse(templ))
	var data struct {
		A string
		B template.HTML
	}

	data.A = "<b>hello!</b>"
	data.B = "<b>hello!</b>"
	if err := t.Execute(os.Stdout, data); err != nil {
		log.Fatal(err)
	}
}

/*

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

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

const IssuesURL = "https://api.github.com/search/issues"

const templ = `{{.TotalCount}} issues:
{{range .Items}}---------------------
Number: {{.Number}}
User:  {{.User.Login}}
Title: {{.Title | printf "%.64s"}}
Age: {{.CreatedAt | daysAgo}} days {{end}}`

func daysAgo(t time.Time) int {
	return int(time.Since(t).Hours() / 24)
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
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		resp.Body.Close()
		return nil, err
	}

	resp.Body.Close()
	return &result, nil
}

var report = template.Must(template.New("issuelist").Parse(`
<h1>{{.TotalCount}}</h1>
<table>
	<tr style="text-align: left">
		<th>#</th>
		<th>State</th>
		<th>User</th>
		<th>Title</th>
	</tr>
	{{range .Items}}
	<tr>
		<td><a href='{{.HTMLURL}}'>{{.Number}}</a></td>
		<td>{{.State}}</td>
		<td><a href='{{.User.HTMLURL}}'>{{.User.Login}}</a></td>
		<td><a href='{{.HTMLURL}}'>{{.Title}}</a></td>
	</tr>
	{{end}}
</table>
`))

func main() {
	var arr = []string{"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"}
	result, err := SearchIssues(arr)
	if err != nil {
		log.Fatal(err)
	}

	if err := report.Execute(os.Stdout, result); err != nil {
		log.Fatal(err)
	}
}
*/
