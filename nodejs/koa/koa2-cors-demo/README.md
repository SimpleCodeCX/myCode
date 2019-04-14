### 一、解决浏览器跨域问题的方法有很多种
1) 通过后端设置 http Access-Control-* 相关响应头
2) 通过 Jsonp
3) 通过 nginx 反向代理

关于这三种解决跨域方法的介绍可以看我的另外一篇文章： [如何解决前端跨域问题](https://simplecodecx.github.io/blog/20181209/8d45a80b.html)

本文主要讲基于 nodejs koa2 实现第一种跨域方案，并设计成 koa2 中间件

### 二、封装 koa2 跨域中间件

koa-cors.js

```javascript
const URL = require('url');

module.exports = async function (ctx, next) {
  const origin = URL.parse(ctx.get('origin') || ctx.get('referer') || '');
  if (origin.protocol && origin.host) {
    ctx.set('Access-Control-Allow-Origin', `${origin.protocol}//${origin.host}`);
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
    ctx.set('Access-Control-Allow-Headers', 'X-Requested-With, User-Agent, Referer, Content-Type, Cache-Control,accesstoken'); // 添加允许 http header
    ctx.set('Access-Control-Max-Age', '86400'); // 设置预检结果的缓存时间
    ctx.set('Access-Control-Allow-Credentials', 'true');
  }
  if (ctx.method !== 'OPTIONS') {
    // 如果请求类型为非预检请求，则进入下一个中间件（包括路由中间件等）
    await next();
  } else {
    ctx.body = '';
    ctx.status = 204; // 204 http 状态码，代表空响应体
  }
};
```

#### Access-Control-Allow-Origin：

Access-Control-Allow-Origin 可以设置为 `*` 通配符，也可以指定具体的地址比如：`https://developer.mozilla.org`。

当把 Access-Control-Allow-Origin 设置为 `*` 时，表示允许所有资源访问，但是此时不支持带 credentials 的请求，

因此为了实现允许所有资源访问且支持带 credentials 的请求，将其设置为 `${origin.protocol}//${origin.host}`（即动态获取访问者地址）

#### Access-Control-Allow-Headers

默认支持 Accept、Accept-Language、Content-Language、Content-Type (只支持 application/x-www-form-urlencoded, multipart/form-data, or text/plain)。

如果请求头需要添加自定义的 http header 比如 access_token ,那么需要将 access_token 添加进数组中

#### Access-Control-Allow-Credentials

简单的理解就是支持 cookie


#### Access-Control-Max-Age

设置 OPTIONS 请求(预检请求)的返回结果的缓存时间, 单位s

>关于 OPTIONS 请求：
>在非简单请求且跨域的情况下，浏览器会发起 options 预检请求。
>可以参考我的另一篇文章：[关于浏览器预检请求](https://simplecodecx.github.io/blog/20190414/76328cc8.html)

### 三、使用方法

app.js
```javascript
const cors = require('./middlewares/koa-cors');
app.use(cors); // 跨域
```

### 四、运行项目

```javascript
npm run dev
```

端口号: 8080




参考文档：

[Access-Control-Allow-Headers](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)

[credentials](https://developer.mozilla.org/zh-CN/docs/Web/API/Request/credentials)

[Access-Control-Allow-Credentials](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)

[Access-Control-Max-Age](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Max-Age)