<template>
  <Header>
    <Menu mode="horizontal" theme="dark" class="header_menu">
      <div class="logo">
        <span>Gallery 图床系统</span>
      </div>
      <div class="header-nav">
        <MenuItem name="home" to="/">
          <Icon type="ios-home-outline" size="20" custom="icon" />
          <span class="nav_text">首页</span>
        </MenuItem>
        <template v-if="!isAuthenticated">
          <Button
            shape="circle"
            icon="ios-contact"
            @click="$router.push('/login')"
          >
            <span>登录</span>
          </Button>
          <Button
            shape="circle"
            icon="md-person-add"
            @click="$router.push('/register')"
          >
            <span>注册</span>
          </Button>
        </template>
        <template v-else>
          <MenuItem name="uploadFile" to="/upload/">
            <Icon type="ios-cloud-upload-outline" size="20" custom="icon" />
            <span class="nav_text">上传图片</span>
          </MenuItem>
          <MenuItem name="fileList" :to="'/files/' + user.id">
            <Icon type="ios-list-box-outline" size="20" custom="icon" />
            <span class="nav_text">图片列表</span>
          </MenuItem>
          <template v-if="user.isAdmin">
            <MenuItem name="userList" to="/users/">
              <Icon type="ios-people-outline" size="20" custom="icon" />
              <span class="nav_text">用户列表</span>
            </MenuItem>
          </template>
          <Submenu name="user">
            <template slot="title">
              <Icon type="ios-person-outline" size="20" custom="icon" />
              <span class="nav_text">{{ user.username }}</span>
            </template>
            <MenuGroup title="用户">
              <MenuItem name="logout" @click.native="logout()">退出</MenuItem>
            </MenuGroup>
          </Submenu>
        </template>
      </div>
    </Menu>
  </Header>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  computed: {
    isAuthenticated() {
      return this.$auth.loggedIn
    },
    user() {
      return this.$auth.user
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
    }
  }
}
</script>

<style scoped>
.icon {
  font-weight: bold;
}

.header_menu {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 10%;
  z-index: auto;
}

.nav_text {
  font-weight: bold;
}

.logo {
  font-size: 2rem;
  color: white;
}
</style>
