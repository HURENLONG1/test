# less 使用
## 前提 
学会使用less
## 环境 
vscode
## 插件 
Easy LESS、	
Beautify css/sass/scss/less

设置：
1. ctrl+shift+p:setting.json
2. 插入
```json 
"less.compile": {
    "less.compile": {
    "compress": false, // true => remove surplus whitespace
    "sourceMap": true, // true => generate source maps (.css.map files)
    "out": "../css/" , // false => DON'T output .css files (overridable per-file, see below)
    "autoprefixer": "> 0%" // 经过测试只有0% 显示编译有其他的前缀，如果有其他方案欢迎讨论
  }
}

```
3. 在不需要编译的 less文件 头加入
```less
// out: false, compress: false, sourceMap: false
```
   
## 注意！
> less 的语法要求很严格
` @ : ; `该有的一个都不能少。
