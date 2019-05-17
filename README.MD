# 信息可视化大作业Demo

这是我本科的最后一份要动手的小组项目。正所谓有始有终，就想把demo写好，给本科四年画上完美句号。

计划在交作业时，会申请个短期的国内VPS，因为国内访问Github速度不够快。Github上的代码和Github Pages会做存档用。

我本想用C#来写，但因为要用到D3.js来做可视化，最后折衷选择了TypeScript。

不能直接在本地打开index.html，因为浏览器[同源政策](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)的原因。按照下面步骤执行npm run之后，会在本地建立服务器，根据提示访问本地端口就可以了。

D3.js的库我是直接在html里引用的，当前版本是D3 v5。假如将来有一天D3库更新导致代码坏了……那就坏了吧。

希望在读的你喜欢这份Demo。

Credit: [flag-icon-css](https://github.com/lipis/flag-icon-css)

不知道要怎么把这套国旗icon跟npm以及webpack(这是重点)整合起来，就直接手动复制源文件了。笨方法也是个方法。

## 下载安装

~~~Shell
git clone
npm install
~~~

## 编译和运行

~~~Shell
npm build
npm run
~~~
