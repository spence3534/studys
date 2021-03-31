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

`flex-direction`具有四个属性值。

- `row`: 在主轴方向从左到右排列子元素。

- `row-reverse`：在主轴方向从右到左排列子元素。

- `column`：在主轴方向从上到下排列子元素（副轴从左到右）。

- `column-reverse`：在主轴方向从下到上排列子元素（副轴从右到左）。

#### flex-wrap 属性

`flex-wrap`有三个属性值。

- `nowrap`：子元素超出容器宽度时也不换行。
- `wrap`：子元素超出容器宽度时进行换行。
- `wrap-reverse`：子元素超出容器宽度时以相反的顺序换行。

#### flex-flow 属性

`flex-flow`是`flex-direction`和`flex-wrap`的缩写。

```css
.flex-item {
  flex-flow: row wrap;
}
```

#### justify-content 属性

`justify-content`有五个属性。控制子元素在主轴上对齐方式。

- `flex-start`：从左到右
- `flex-end`：从右到左
- `center`：居中对齐
- `space-between`：左右两端对齐，子元素之间的间隔相等
- `space-around`：左右两端的子元素间隔相等，中间的子元素的间隔是两边子元素间隔一倍。

#### align-items 属性

`align-items`也有五个属性值。控制子元素在副轴上的对齐方式。

- `stretch`：默认值，子元素没有设置高度的情况下，让所有子元素填满容器高度。
- `flex-start`：从上到下
- `flex-end`：从下到上
- `center`：元素居中
- `baseline`：让元素根据每个子元素的第一行字对齐。

#### align-content 属性

父元素设置了`flex-wrap`并且子元素在换行的情况下，`align-content`才生效。它具有六个属性值，用于控制子元素在**副轴**上的每行间距。处理的方式和`justify-content`一样。

- `flex-start`：从上到下
- `flex-end`：从下到上
- `center`：居中对齐
- `space-between`：上下两端对齐，子元素之间的间隔相等
- `space-around`：上下两端的子元素间隔相等，中间的子元素的间隔是两边子元素间隔一倍。
- `stretch`：初始值，子元素之间的间隔占满整个容器。

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

`flex-shrink`可以让每个子元素进行收缩防止溢出。值为`0`时，不会进行收缩。大于`0`时，则收缩并且不会溢出。值越大的元素收缩越多。

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

#### align-self 属性

`align-self`属性控制子元素在容器中的副轴方向的对齐方式，默认值为`auto`。它跟`align-items`效果还有属性值都一样。

#### order 属性

`order`可以控制子元素的顺序排列。从主轴的起点开始，初始值为`0`，如果一个子元素设置为`-1`，它会移动到最前面。指定为`1`，则会移动到最后面。
