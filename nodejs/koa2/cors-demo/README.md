### 一、解决浏览器跨域问题的方法有很多种
1) 通过后端设置 http Access-Control-* 相关响应头
2) 通过 Jsonp
3) 通过 nginx 反向代理

关于这三种解决跨域方法的介绍可以看我的另外一篇文章： [如何解决前端跨域问题](https://simplecodecx.github.io/blog/20181209/8d45a80b.html)

本文主要讲基于 nodejs koa2 实现第一种跨域方案，并设计成 koa2 中间件

### 二、跨域中间件实现的功能
1) 支持跨域 cookie
2) 支持指定的跨域 http 请求头，比如 accesstoken 等
2) 对预检结果进行缓存,缓存时间设置为1天（即86400秒）
3) 当http method 为 OPTIONS时，为预检时，此时直接返回空响应体,对应的 http 状态码为 204

### 三、koa-cors 中间件代码

koa-cors.js

```javascript
const URL = require('url');
/**
 * 关键点：
 * 1、如果需要支持 cookies,
 *    Access-Control-Allow-Origin 不能设置为 *,
 *    并且 Access-Control-Allow-Credentials 需要设置为 true
 *    (注意前端请求需要设置 withCredentials = true)
 * 2、当 method = OPTIONS 时, 属于预检(复杂请求), 当为预检时, 可以直接返回空响应体, 对应的 http 状态码为 204
 * 3、通过 Access-Control-Max-Age 可以设置预检结果的缓存, 单位(秒)
 * 4、通过 Access-Control-Allow-Headers 设置需要支持的跨域请求头
 * 5、通过 Access-Control-Allow-Methods 设置需要支持的跨域请求方法
 */
module.exports = async function (ctx, next) {
  const origin = URL.parse(ctx.get('origin') || ctx.get('referer') || '');
  if (origin.protocol && origin.host) {
    ctx.set('Access-Control-Allow-Origin', `${origin.protocol}//${origin.host}`);
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
    ctx.set('Access-Control-Allow-Headers', 'X-Requested-With, User-Agent, Referer, Content-Type, Cache-Control,accesstoken');
    ctx.set('Access-Control-Max-Age', '86400');
    ctx.set('Access-Control-Allow-Credentials', 'true');
  }
  if (ctx.method !== 'OPTIONS') {
    // 如果请求类型为非预检请求，则进入下一个中间件（包括路由中间件等）
    await next();
  } else {
    // 当为预检时，直接返回204,代表空响应体
    ctx.body = '';
    ctx.status = 204;
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

### 四、使用方法

app.js
```javascript
const cors = require('./middlewares/koa-cors');
app.use(cors); // 跨域
```

### 五、运行项目

```javascript
运行服务端:
cd server
npm run dev

运行客户端:
cd client 
npm run dev
```

参考文档：

[Access-Control-Allow-Headers](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)

[credentials](https://developer.mozilla.org/zh-CN/docs/Web/API/Request/credentials)

[Access-Control-Allow-Credentials](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)

[Access-Control-Max-Age](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Max-Age)