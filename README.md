# asset-content-check-webpack-plugin

### 功能

用于检查打包后的代码是否包含指定内容

比如可以用来代码里是否添加指定统计代码等

### 说明

> 1、支持正则匹配文件名

> 2、支持正则匹配指定内容

> 3、可配置指定内容不存在时的错误抛出方式

### 参数

- `testFileArr` - 用于配置检查的文件、内容、错误提示语

  - `testFile` 必填，文件名，格式需为正则
  - `testContent` 必填，文件里是否包含的内容，格式需为正则
  - `outTip` 必填，指定内容不存在时的提示语

- `showErrorWay` - 非必填，默认 errors，配置指定内容不存在时的错误抛出方式(errors:打包结束后标红显示；warnings:打包结束后标黄显示；throwError:打包过程错误抛出，会中断打包)

### 使用

webpack.prod.config.js:

```js
const AssetContentCheckWebpackPlugin = require('asset-content-check-webpack-plugin')
plugins: [
  new AssetContentCheckWebpackPlugin({
    testFileArr: [
      {
        testFile: /\.html$/,
        testContent: /GTM-ABCDEFG/,
        outTip: '没有检测到gtm统计代码，请添加!',
      },
      {
        testFile: /\.min\.js$/,
        testContent: /reserVationSuccess/,
        outTip: '没有检测到gtm reserVationSuccess统计代码，请添加!',
      },
      {
        testFile: /\.min\.js$/,
        testContent: /reservationFail/,
        outTip: '没有检测到gtm reservationFail统计代码，请添加!',
      },
    ],
    showErrorWay: 'throwError',
  }),
]
```

> 有问题可联系作者https://blog.csdn.net/zhuzhuing_/article/details/118860588