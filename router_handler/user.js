/**
 * 定义和用户相关的路由处理函数，功 /router/user.js 模块尽心调用
 */

// 导入数据库操作模块
const db = require('../db/index')
const bcrypt = require('bcryptjs')
// 生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 获取到客户端提高到服务器的用户信息
  const userinfo = req.body
  console.log(userinfo.username)

  // 对表单中的数据进行合法性校验
  // if (!userinfo.username || !userinfo.password) {
  //   // return res.send({ status: 1, message: '用户名和密码不正确' })
  //   return res.cc('用户名和密码不正确')
  // }

  // 定义 sql 语句
  const sqlStr = 'select * from ev_users where username=?'
  // 执行 sql 语句并根据结果判断用户名是否被占用
  db.query(sqlStr, userinfo.username, (err, results) => {
    // 执行 sql 语句失败
    if (err) {
      // return res.send({ status: 1, message: err.message })
      return res.cc(err)
    }

    // 用户名被占用
    if (results.length > 0) {
      // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名' })
      return res.cc('用户名被占用，请更换其他用户名')
    }

    // 用户名可用，继续后续流程
    // 对用户的密码，进行 bcrype 加密，返回值是加密以后的密码字符串
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    // 定义插入用户的 SQL 语句 
    const sql = 'insert into ev_users set ?'

    // 调用 db.query() 执行 SQL 语句
    db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
      // 判断 sql 语句是否执行成功
      if (err) return res.cc(err)
      // 判断影响行数是否为 1
      if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
      // 注册成功
      res.send({ status: 0, message: '注册成功' })
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单传递过来的数据
  const userInfo = req.body
  // 定义 sql 语句
  const sql = `select * from ev_users where username=?`
  // 执行 sql 语句，根据用户名查询用户的信息
  db.query(sql, userInfo.username, (err, results) => {
    // 指定 sql 失败
    if (err) return res.cc(err)
    // 执行 sql 语句成功，但是获取到的数据条数不等于 1
    if (results.length !== 1) return res.cc('登录失败')

    // 判断用户名和密码是否正确
    // 将用户输入的密码和数据库中存储的密码进行比较
    const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
    // 根据对比后的结果进行判断
    if (!compareResult) return res.cc('登录失败！')

    // 登录成功以后，给用户返回 token 值
    // 剔除 user 返回的 头像和密码 信息，
    const user = { ...results[0], password: '', user_pic: '' }

    // 生成 Token 字符串内容
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})

    // 将生成的 Token 字符串响应给客户端
    res.send({
      status: 0,
      message: '登录成功！',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer ' + tokenStr,
    })
  })
}
