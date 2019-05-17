# 信息可视化大作业Demo

这是我本科的最后一份要动手的小组项目。正所谓有始有终，就想把demo写好，给本科四年画上完美句号。

[观看在线Demo](https://colin0154.github.io/InfoVizDemo/)：承载在本项目的GitHub Pages上。

我本想用C#来写，但因为要用到D3.js来做可视化，最后折衷选择了TypeScript。

关于数据的处理，可以看``data_calc``这个文件夹

尽管是个静态网页，但也不能直接在本地打开index.html，因为浏览器的[同源政策](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)会阻碍加载运行所需的数据集。按照下面步骤执行npm run之后，会在本地建立服务器，根据提示访问本地端口就可以了。

希望在读的你喜欢这份Demo。

Credit: [flag-icon-css](https://github.com/lipis/flag-icon-css)

不知道要怎么把这套国旗icon跟npm以及webpack(这是重点)整合起来，就直接手动复制源文件了。笨方法也是个方法。

## 下载安装

~~~Shell
git clone https://github.com/colin0154/InfoVizDemo.git
npm install
~~~

## 编译和运行

~~~Shell
npm build
npm run
~~~
