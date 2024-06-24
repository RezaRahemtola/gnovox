package gnovox

import (
	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
	"gno.land/p/demo/gnovox"
)

var (
	blogList      avl.Tree // slug -> *Blog
)

func AddBlog(slug, title string) {
	b := gnovox.NewBlog(title)
	blogList.Set(slug, &b)
}

func GetBlogs() string {
	jsonResponse := json.ArrayNode("", []*json.Node{})

	blogList.ReverseIterate("", "", func(slug string, value interface{}) bool {
		blog := value.(*gnovox.Blog)
		node := json.ObjectNode("", map[string]*json.Node{
			"slug": json.StringNode("slug", slug),
			"title": json.StringNode("title", blog.Title),
		})
		jsonResponse.AppendArray(node)
		return false
	})

	b, err := json.Marshal(jsonResponse)
	checkErr(err)

	return string(b)
}

func Render(path string) string {
	return "not implemented"
}
