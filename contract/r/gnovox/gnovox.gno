package gnovox

import (
  "gno.land/p/demo/avl"
  "gno.land/p/demo/json"
  "gno.land/p/demo/ufmt"
)

var (
  blogList      avl.Tree
)

func AddBlog(name string) {
  blogList.Set(name, true)
}

func GetBlogs() string {
  jsonResponse := json.ArrayNode("", []*json.Node{})
  blogList.ReverseIterate("", "", func(key string, value interface{}) bool {
    node := json.ObjectNode("", map[string]*json.Node{
      "name": json.StringNode("name", key),
    })
    jsonResponse.AppendArray(node)
    return false
  })

  b, err := json.Marshal(jsonResponse)
  if err != nil {
    ufmt.Errorf("error: %v", err)
  }

  return string(b)
}
