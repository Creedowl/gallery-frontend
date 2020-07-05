<template>
  <div class="register">
    <h1>注册</h1>
    <Form ref="registerForm" :model="registerForm" :rules="registerRules">
      <FormItem prop="username">
        <Input v-model="registerForm.username" placeholder="用户名" type="text">
          <Icon slot="prepend" type="ios-person-outline" />
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input
          v-model="registerForm.password"
          placeholder="密码"
          type="password"
        >
          <Icon slot="prepend" type="ios-lock-outline" />
        </Input>
      </FormItem>
      <FormItem prop="passwordAgain">
        <Input
          v-model="registerForm.passwordAgain"
          placeholder="再输入一次密码"
          type="password"
        >
          <Icon slot="prepend" type="ios-lock-outline" />
        </Input>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          long
          :loading="loading"
          @click="handleRegister()"
        >
          注册
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  data() {
    const checkPassword = (rule, value, callback) => {
      this.$refs.registerForm.validateField('passwordAgain')
      callback()
    }
    const checkPasswordAgain = (rule, value, callback) => {
      if (value !== this.registerForm.password)
        callback(new Error('The two input passwords do not match!'))
      callback()
    }
    return {
      registerForm: {
        username: '',
        password: '',
        passwordAgain: ''
      },
      registerRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [
          { required: true, trigger: 'blur', min: 6, max: 20 },
          { validator: checkPassword, trigger: 'blur' }
        ],
        passwordAgain: [
          { required: true, trigger: 'blur', min: 6, max: 20 },
          { validator: checkPasswordAgain, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    async handleRegister() {
      this.loading = true
      const valid = await this.$refs.registerForm.validate()
      if (!valid) {
        this.$Message.error('表单校验失败')
      } else {
        try {
          await this.$api.register(this.registerForm)
          this.$Message.success('注册成功，请重新登录')
          this.$router.push('/login')
        } catch (error) {
          this.$Message.error('注册失败 ' + error.response.data.message)
        }
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.register {
  width: 400px;
  display: flex;
  flex-direction: column;
  text-align: center;
}
</style>
