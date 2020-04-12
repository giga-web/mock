登录
GET /api/auth/login
#headers
[
  {
    "token": 'fafoslj9f4s4f5asfas454fdsf', // 主键
  }
]
#params
{
  id: 1, // 主键
  name: "abc", // 名称
  code: null, // 编码
  list: [1,2,3], // 列表
  listmore: [[1],[2],[3]], // 列表更多
}
#response
{
  code: 0, // 主键
  "data": {
    pagesize: 1, // 主键
    entities: [ // 实体列表
      {
        id: 1, // 主键
        name: "长沙" // 名称
      },
    ]
  },
  message: "success" // 消息
}
#desc
发动机附加费

============================================================

登录
GET /api/auth/login
#headers
#params
{
  id: 1, // 主键
}
#response
{
  id: 1, // 主键
}
#desc
发动机附加费