package gnovox

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
	"gno.land/p/demo/gnovox"
)

var (
	users      avl.Tree // address -> *User
)

func AddUser(username string) error {
	caller := std.GetOrigCaller()

	if _, found := users.Get(caller.String()); found {
		// TODO: also check username
		return ErrUserExist
	}

	u := gnovox.NewUser(caller, username)
	users.Set(caller.String(), &u)
	return nil
}

func UpdateUser(username string) error {
	caller := std.GetOrigCaller()

	// TODO: check that username isn't already taken
	value, found := users.Get(caller.String());
	if found == false {
		return ErrUserNotFound
	}
	currentUser := value.(*gnovox.User)
	u := gnovox.UpdateUser(*currentUser, username)
	users.Set(caller.String(), &u)
	return nil
}

func GetUserByAddress(address std.Address) string {
	if value, found := users.Get(address.String()); found {
		u := value.(*gnovox.User)
		jsonResponse := u.Json()

		b, err := json.Marshal(jsonResponse)
		checkErr(err)

		return string(b)
	}
	panic(ErrUserNotFound)
	return ""
}

func GetUsers() string {
	jsonResponse := json.ArrayNode("", []*json.Node{})

	users.ReverseIterate("", "", func(address string, value interface{}) bool {
		u := value.(*gnovox.User)
		jsonNode := u.Json()
		jsonResponse.AppendArray(jsonNode)
		return false
	})

	b, err := json.Marshal(jsonResponse)
	checkErr(err)

	return string(b)
}

func Render(path string) string {
	return "not implemented"
}
