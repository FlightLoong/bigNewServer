// 导入数据库操作模块
const db = require('../db/index')

// 创建用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 定义查询用户信息的 sql 语句
  const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`

  // 调用 db.query() 执行 sql 语句
  db.query(sql, req.user.id, (err, results) => {
    // 执行 sql 语句失败
    if (err) return res.cc(err)

    // 执行的 sql 语句成功，但是查询的结果可能为空
    if (results.length !== 1) return res.cc('获取用户信息失败！')

    // 用户信息获取成功
    res.send({
      status: 0,
      message: '获取用户基本信息成功！',
      data: results[0],
    })
  })
}
