## 开发环境
1. 先在vscode 中安装 eslint, prettier now 两个插件
2. 进入用户设置进行配置
```json
"eslint.options": {
    "configFile" : "E:/developer/work_test/xxx/.eslintrc"
},
"prettier.singleQuote": true,
"prettier.trailingComma": "es5",
"prettier.printWidth": 100,
"prettier.jsonEnable": [
    "json"
],
"files.eol": "\n",
```
configFile中配置你.eslintrc的所在位置

prettier是按照.prettierrc文件中的配置来的

files.eol设置是将页面行尾字符从CRLF变成LF