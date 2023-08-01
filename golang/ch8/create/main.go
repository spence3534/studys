package main

import (
	"image"
	"sync"
)

var loadIconsOnce sync.Once
var icons map[string]image.Image

func Icon(name string) image.Image {
	loadIconsOnce.Do(loadIcons)
	return icons[name]
}
