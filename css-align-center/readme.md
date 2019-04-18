## CSS 居中

### 内联元素居中方案

#### 水平居中

- display: flex; justify-content: center;

#### 垂直居中

- 单行文本：height = line-height;
- 多行文本：display: table（父元素）; display: table-cell; vertical-align: middle;

### 块级元素居中方案

#### 水平居中

- 定宽：margin: auto;
- 不定宽：父元素 position: relative, left: 50%; 子元素 position: absolute; left: 50%;

#### 垂直居中

- 父元素 position: relative; 子元素 position: absolute; top: 50%; transform: translateY(-50%);
