package gnovox

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}
