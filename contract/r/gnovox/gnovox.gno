package gnovox

import (
	"gno.land/p/demo/avl"
)

var (
	blogList      avl.Tree
)

func AddBlog(name string) {
	blogList.Set(name, true)
}

func GetBlogs() []string {
  var blogs []string

  blogList.ReverseIterate("", "", func(key string, value interface{}) bool {
    blogs = append(blogs, key)
    return false
  })

  return blogs
}
