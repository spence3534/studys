## FlexBox

### 弹性容器属性

flex 布局的容器有以下几个属性。

- `flex-direction`
- `flex-wrap`
- `flex-flow`：以上两个属性的缩写
- `justify-content`
- `align-items`
- `align-content`

#### flex-direction 属性

### 弹性子元素属性

#### flex 属性

`flex`属性是`flex-grow`、`flex-shrink`、`flex-basis`缩写。

```css
.flex-item {
  flex: 1;
}
```

`flex: 1`代表着`flex-grow: 1`、`flex-shrink: 1`、`flex-basis: 0%`。

#### flex-basis 属性

`flex-basis`属性是用来设置子元素的初始大小，可以设置任何的`width`值，包括`px`、`em`和百分比。初始值为`auto`。

#### flex-grow 属性

每个子元素的`flex-basis`值设置好之后，它们的总宽度（包括外边距）可能没有将容器填满，也就是说容器还有剩余部分。多出来的一部分会按照`flex-grow`的值分配给每个子元素，`flex-grow`的值为正整数。如果一个子元素的`flex-grow`值是`0`，它的宽度就不会超过`flex-basis`的值。如果不是`0`，这些元素就会增长到所有的剩余部分被分配完。简单的说，子元素会填满容器的宽度。

`flex-grow`的值越大，子元素就会占更大的位置。

#### flex-shrink 属性

`flex-shrink`可以让每个子元素进行收缩防止溢出。值为`0`时，不会进行收缩。大于`0`时，则收缩并且不溢出。值越大的元素收缩越多。

```css
/* 等价于flex: 1 1 33.33% */
.item {
  flex: 33.33%;
}

/* 等价于flex: 1 1 66.66% */
.flex-item {
  flex: 66.66%;
}
```
