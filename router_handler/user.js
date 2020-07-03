/**
 * 定义和用户相关的路由处理函数，功 /router/user.js 模块尽心调用
 */

// 导入数据库操作模块
const db = require('../db/index')
const bcrypt = require('bcryptjs')

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
  res.send('login Ok')
}
