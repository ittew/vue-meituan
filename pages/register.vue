<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a
          href="/"
          class="site-logo" />
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <el-button
              type="primary"
              size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
     <section>
      <el-form
        label-width="100px"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        size="small"
        :inline-message=true
        class="demo-ruleForm">
        <el-form-item
          label="昵称"
          prop="name">
          <el-input  v-model="ruleForm.name"/>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email">
          <el-input v-model="ruleForm.email" class="email"></el-input>
          <el-button
            size="mini"
            round
            @click="sendMsg">{{statusText}}</el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="code">
          <el-input
            v-model="ruleForm.code"
            maxlength="4" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="pwd">
          <el-input
            v-model="ruleForm.pwd"
            type="password" />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="cpwd">
          <el-input
            v-model="ruleForm.cpwd"
            type="password" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="register">同意以下协议并注册</el-button>
          <div class="error">{{ error }}</div>
        </el-form-item>
        <el-form-item>
          <a
            class="f1"
            href="http://www.meituan.com/about/terms"
            target="_blank">《美团网用户协议》</a>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import { setTimeout } from 'timers';
export default {
  layout: 'blank',
  data() {
    return {
      statusText: '发送验证码',
      statusMsg: '',
      error: '',
      isUsable: true,
      ruleForm: {
        name: 'tew',
        email: '873077939@qq.com',
        code: '',
        pwd: '',
        cpwd: '',
      },
      rules: {
        name: [{
          required: true,
          type: 'string',
          message: '请输入昵称',
          trigger: 'blur'
        }],
        email:[{
          required: true,
          type: 'email',
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '创建密码',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }],
        cpwd: [{
          required: true,
          message: '确认密码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'))
            } else if (value !== this.ruleForm.pwd){
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    sendMsg () {
      const self = this
      let namePass
      let emailPass
      if (!self.isUsable){
        return false
      }
      this.$refs.ruleForm.validateField('name', (valid) => {
        namePass = valid
      })
      self.statusMsg = ''
      if (namePass) {
        return false
      }
      this.$refs.ruleForm.validateField('email', (valid) => {
        emailPass = valid
      })

      if(!namePass && !emailPass){
        self.$axios.post('/users/verify', {
          username: encodeURIComponent(self.ruleForm.name),
          email: self.ruleForm.email
        }).then(({status, data}) => {
          if (status === 200 && data.code === 0  ) {
            self.isUsable = false
            let count = 9
            self.statusText = `${count--}s`
            let timerId = setInterval(() => {
              self.statusText = `${count--}s`
              if(count === 0 ){
                self.statusText = '重新发送'
                clearInterval(timerId)
                self.isUsable = true
              }
            }, 1000)
          } else {
            self.statusMsg = data.msg
          }
        })
      }
    },
    register () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$axios.post('/users/signup', {
            username: encodeURIComponent(this.ruleForm.name),
            password: CryptoJS.MD5(this.ruleForm.pwd).toString(),
            email: this.ruleForm.email,
            code: this.ruleForm.code
          }).then(({status, data}) => {
            if (status === 200) {
              if (data && data.code === 0){
                location.href = '/login'
              } else {
                this.error = data.msg
              }
            } else {
              this.error = `服务器出错，错误码${status}`
            }
            setTimeout(() => {
              this.error = ''
            }, 1500)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/css/register/index.scss";
</style>
