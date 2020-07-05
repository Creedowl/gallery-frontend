<template>
  <div class="login">
    <h1>登录</h1>
    <Form ref="loginForm" :model="loginForm" :rules="loginRules">
      <FormItem prop="username">
        <Input v-model="loginForm.username" placeholder="用户名" type="text">
          <Icon slot="prepend" type="ios-person-outline" />
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input v-model="loginForm.password" placeholder="密码" type="password">
          <Icon slot="prepend" type="ios-lock-outline" />
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" long :loading="loading" @click="handleLogin()">
          登录
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', min: 3, max: 20 }]
      },
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      const valid = await this.$refs.loginForm.validate()
      if (!valid) {
        this.$Message.error('表单校验失败')
      } else {
        try {
          await this.$auth.loginWith('local', {
            data: this.loginForm
          })
          this.$Message.success('登录成功')
        } catch (error) {
          this.$Message.error('登录失败 ' + error.response.data.message)
        }
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.login {
  width: 400px;
  display: flex;
  flex-direction: column;
  text-align: center;
}
</style>
