// 导入 express 模块
const express = require('express')

// 创建 express 的服务器实例
const app = express()

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

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

// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 指定端口并启动 web 服务器
app.listen(8000, () => {
  console.log('api server running at http://127.0.0.1:8000')
})
