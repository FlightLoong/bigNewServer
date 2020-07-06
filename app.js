// 导入 express 模块
const express = require('express')

// 创建 express 的服务器实例
const app = express()
const joi = require('@hapi/joi')

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 在所有路由之前，封装 res.cc 函数
app.use((req, res, next) => {
  // status 的默认值为 1，表示失败的情况
  // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = (err, status = 1) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }

  next()
})

// 导入全局的配置文件
const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')
// 使用 .unless 方法指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 导入并注册用户路由模块
const userRouter = require('./router/user')
// 导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
// 导入并使用文章路由模块
const articleRouter = require('./router/article')
app.use('/api', userRouter)
app.use('/my', userinfoRouter)
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', artCateRouter)
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter)

// 错误中间件
app.use((err, req, res, next) => {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 在身份认证失败后，捕获并处理 Token 认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知错误
  res.cc(err)
})

// 指定端口并启动 web 服务器
app.listen(3000, () => {
  console.log('api server running at http://127.0.0.1:3000')
})
