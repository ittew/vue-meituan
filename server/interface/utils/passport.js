import passport from 'koa-passport'
import Localstorage from 'passport-local'
import User from '../../dbs/models/users'

passport.use(new Localstorage(async function(username, password, done){
  let res = await User.findOne({username})
  if (res!==null) {
    if (res.password === password) {
      return done(null, res)
    } else {
      return done(null, false, '密码错误')
    }
  } else {
    return done(null, false, '用户不存在')
  }
}))
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  return done(null, user)
})
export default passport
