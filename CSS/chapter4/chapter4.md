## CSS 布局

### 浮动

浮动是一种最古老的布局方式。它的出现并不是为了解决布局问题，但是在没有`display: inline-block`和`display: table`出现之前，它是被用得最多的布局。浮动可以把一个元素拉到其容器的一侧，这样文档流就可能包围它。它也可以浮动到右侧。浮动元素会**脱离正常文档流**，并被拉到容器边缘。文档流会重新排序，但它会包围浮动元素现在所占据的空间。如果让多个元素向同一边浮动，它们会挨着排列。浮动的元素不会占据父元素空间

#### 清除浮动

清除浮动常见的几种方法如下。

- 用一个标签放到父元素的末尾中，并且给它加上一个`clear:both`（左右两侧不允许浮动元素）属性。`clear`属性还可以设置`left`和`right`值，这样只会清除向左或者向右浮动的元素。

```html
<style></style>

<main class="main clearfix">
  //...浮动元素

  <div style="clear: both"></div>
</main>
```

- 在父元素上多加给一个类选择器设置该类选择器伪元素`::after`和`::before`选择器。

```css
/* 第一版 会导致容器外边距折叠*/
.clearfix::after {
  content: " ";
  display: block;
  clear: both;
}

/* 第二版 考虑容器外边距不折叠 */
.clearfix::after,
.clearfix::before {
  display: table;
  content: " ";
}

.clearfix::after {
  clear: both;
}
```

### BFC

BFC （块级格式化上下文）是网页的一块区域，元素基于这块区域进行布局。BFC 会将内部的内容和外部的上下文隔离开。有 3 个特点。

- 内部所有元素的上下外边距。它们不会跟 BFC 外面的元素产生外边距折叠。
- 内部所有的浮动元素。
- 不会跟 BFC 外面的浮动元素重叠。

简单的说，BFC 里的内容不会跟外部的元素重叠或相互影响。

给元素创建 BFC 的方法如下。

- `float`：`left或right`，不是`none`即可。
- `overflow`：`hidden、auto`或`scroll`，不是`visible`即可。
- `display`：`inline-block`、`table-cell`、`table-caption`、`flex`、`inline-flex`、`gird`和`inline-grid`。具有这些属性的元素都是**块级容器**。
- `position`：`absolute`或`fixed`。

> `<html>`根元素也是一个 BFC。

用`overflow: auto`是创建 BFC 最简单的方式，当然你也可以用上面其他的方法。但是这得看情况。
