**Sorry For the Chinese, I'm not in the mood writing English.**

## 这个文件夹是做什么的？

从NCD.RisC和世界银行组织里下载的数据集是以csv格式保存的，而且数据结构也不符合我程序的设计，所以需要先进行转化。

大概思路是这样的：首先是在[CSVJSON](https://www.csvjson.com/csv2json)网站把csv转换成json（非常感谢这个网站，节省了很多功夫）。

随后我写了一个比上一次复杂一点的Node.js脚本，先按照我设计的数据结构把所有数据都处理好，然后导出到本地（序列化）。

这是我第二次写这个数据结构了。一方面原有的结构生成了几个散的数据集，泡泡图想调用的时候遇到了比较棘手的情况。二来我们之前就想要做总的BMI数据，这要求我们手动把两个性别的BMI加权一次。

再加上我发现ECMAScript 2016中引入了Map的概念（也就是C#中的Collection），藉由这个机会我就直接重构了数据集。

写了整个白天头有点晕，就直接把结构复制粘贴进来了。

### 生成数据集
需要Node.js，在这个文件下（data_calc）下运行`Node index.js`即可。

## 新的数据集结构
```JavaScript
{
  "ISO" = {
    Name: "",
    Mean: [],
    Underweight: [],
    Obesity: [],
    Severe: [],
    Morbid: [],
    GDPPerCapita: [],
    Population: []
  }
}
```
Map跟Object最大的区别在于，Map是可以用for each遍历的，Object则麻烦很多，不是引用jQuery就是用别的方法自己造轮子。

因为泡泡图要显示所有国家的BMI数据，Map能遍历的话就非常简单了。

新的数据集相比起之前四个小的，体积减少了接近一半。调用起来也会非常便利，`myMap.get("国家代码").属性[年份-1975]`即可。


### 网站下载的初始结构，这还只是男性的

~~~JSON
[
  {
    "ISO": "CHN",
    "Year": 1975,
    "Mean": 20.89856909,
    "Underweight": 0.112533087,
    "Obesity": 0.00243314,
    "Severe": 0.000023,
    "Morbid": 0.00000349
  },
  {
    "ISO": "CHN",
    "Year": 1976,
    "Mean": 20.95391576,
    "Underweight": 0.111109734,
    "Obesity": 0.002592483,
    "Severe": 0.0000245,
    "Morbid": 0.0000034
  },
]
~~~

