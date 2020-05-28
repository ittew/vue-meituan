import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import Passport from './utils/passport'
import Email from '../dbs/config'
import Axios from './utils/axios'

let router = new Router({
  prefix: '/users' // 定义接口前缀
})
let store = new Redis().client
// 注册
router.post('/signup', async (ctx) =>{
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body

  if (code) {
    // 将用户名和code做关联
    const saveCode = await store.hget(`nodemail:${username}`, 'code')
    const saveExpire = await store.hget(`nodemail:${username}`, 'expire')
    console.log(username,password,email,code, saveCode, saveExpire)
    if(code === saveCode){
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期， 请稍后再试'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }

  // let user = await User.find({username})
  // if (user.length) {
  //   ctx.body = {
  //     code: -1,
  //     msg: '已注册，请勿重复注册'
  //   }
  //   return
  // }

  // let newuser = await User.create({
  //   username,
  //   password,
  //   email
  // })

  // if (newuser) { // 自动登录
  //   let res = await Axios.post('/users/signin', {
  //     username,
  //     password
  //   })
  //   if (res.data && res.data.code === 0) {
  //     ctx.body = {
  //       code: 0,
  //       msg: '注册成功',
  //       user: res.data.user
  //     }
  //   } else {
  //     ctx.body = {
  //       code: -1,
  //       msg:'error'
  //     }
  //   }
  // } else {
  //   ctx.body = {
  //     code: -1,
  //     msg: '注册失败'
  //   }
  // }
})

// 登录
router.post('/singin', async(ctx, next) => {
  //
  return Passport.authenticate('local', function(err, user, info, status){
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if(user){
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      } else{
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

// 验证码验证
router.post('/verify', async(ctx, next) => {
  let username = ctx.request.body.username
  const saveExpire = await store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证码请求过于频繁， 1分钟内1次'
    }
    return false
  }
  let transpoter = nodeMailer.createTransport({
    host: Email.smtp.host,
    post: 587,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  let ko = {
    code: Email.smtp.code,
    expire: Email.smtp.expire,
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }

  let mailOptions = {
    from: `"认证邮件"<${Email.smtp.user}>`,
    to: ko.email,
    subject: 'meituan注册码',
    html: `您的验证码是${ko.code}`
  }
  await transpoter.sendMail(mailOptions, (error, info) =>{
    if (error) {
      return console.log(error)
    } else {
      store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送'
  }
})

// 退出
router.get('/exit', async(ctx, next) => {
  await ctx.logout()
  if (!ctx.isAuthenticated()) {
    ctx.body = { code: 0 }
  } else {
    ctx.body = { code: -1 }
  }
})

// 获取用户名
router.get('/getUser', async(ctx) =>{
  if (ctx.isAuthenticated()) {
    const { username, email } = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body =  {
      user: '',
      email: ''
    }
  }
})
export default router
