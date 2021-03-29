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

- 在父元素上设置伪元素`::after`和`::before`选择器。

```css
/* 第一版 会导致外边距折叠*/
.clearfix::after {
  content: " ";
  display: block;
  clear: both;
}

/* 第二版 考虑外边距不折叠*/
.clearfix::after,
.clearfix::before {
  display: table;
  content: " ";
}

.clearfix::after {
  clear: both;
}
```
