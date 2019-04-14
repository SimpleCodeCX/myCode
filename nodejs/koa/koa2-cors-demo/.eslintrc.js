// https://eslint.org/docs/rules/
module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "block-scoped-var": 0, // 在块级作用域外访问块内定义的变量是否报错提示
    "no-console": 2, // 禁止使用console
    "no-const-assign": 2, // 禁止修改const声明的变量
    "no-dupe-keys": 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
    "no-var": 2,//禁用var，用let和const代替
    "prefer-const": 2, // 对于声明后从未重新分配的变量，需要const声明
    "linebreak-style": [
      "error",
      "windows"
    ],
    "indent": [0], //缩进风格
    "quotes": [
      "error",
      "single",
      {
        "allowTemplateLiterals": true
      }
    ],
    "semi": [
      "error",
      "always"
    ],
    "semi-spacing": [2, { "before": false, "after": true }],//分号前后空格
    "eqeqeq": 2
  }
};