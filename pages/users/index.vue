<template>
  <div class="users">
    <Table
      :columns="columns"
      :data="users"
      :loading="loading"
      class="user-list"
    >
      <template slot="username" slot-scope="{ row }">
        <Tooltip content="查看用户图片" placement="right">
          <nuxt-link :to="'/files/' + row.id">{{ row.username }}</nuxt-link>
        </Tooltip>
      </template>
      <template slot="privilege" slot-scope="{ row }">
        <Tag :color="row.isAdmin ? 'primary' : 'default'">
          {{ privilege[row.isAdmin ? 1 : 0] }}
        </Tag>
      </template>
      <template slot="status" slot-scope="{ row }">
        <Tag :color="row.locked ? 'error' : 'default'">
          {{ status[row.locked ? 1 : 0] }}
        </Tag>
      </template>
      <template slot="operation" slot-scope="{ row, index }">
        <Button type="info" @click="showModal(index)">修改密码</Button>
        <Button
          v-if="row.locked"
          type="warning"
          @click="changeLock(false, row.id, index)"
          >启用账号</Button
        >
        <Button v-else type="warning" @click="changeLock(true, row.id, index)"
          >禁用账号</Button
        >
        <Button
          v-if="row.isAdmin"
          type="primary"
          @click="changeIsAdmin(false, row.id, index)"
          >取消管理员</Button
        >
        <Button
          v-else
          type="primary"
          @click="changeIsAdmin(true, row.id, index)"
          >设为管理员</Button
        >
      </template>
    </Table>
    <Page
      :total="pages"
      :page-size="50"
      show-elevator
      class="page"
      @on-change="pageHandler"
    />
    <Modal v-model="modalVisible" :footer-hide="true">
      <div slot="header">
        <span>修改密码</span>
      </div>
      <div class="modal-content">
        <Form ref="loginForm" :model="loginForm" :rules="loginRules">
          <FormItem prop="newPassword">
            <Input
              v-model="loginForm.newPassword"
              placeholder="密码"
              type="text"
            >
              <Icon slot="prepend" type="ios-person-outline" />
            </Input>
          </FormItem>
          <FormItem>
            <Button type="primary" long @click="changePassword()">
              修改密码
            </Button>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      columns: [
        { title: 'ID', key: 'id', width: '80px', sortable: true },
        { title: 'Username', slot: 'username', align: 'center' },
        {
          title: 'Privilege',
          slot: 'privilege',
          width: '100px',
          align: 'center'
        },
        { title: 'Status', slot: 'status', width: '100px', align: 'center' },
        { title: 'Operation', slot: 'operation', align: 'center' }
      ],
      loginForm: {
        password: '',
        newPassword: ''
      },
      loginRules: {
        newPassword: [{ required: true, trigger: 'blur', min: 4, max: 20 }]
      },
      modalVisible: false,
      current: null,
      loading: true,
      pages: 0,
      users: [],
      privilege: ['普通用户', '管理员'],
      status: ['正常', '封禁']
    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    async getUsers(offset = 0, limit = 50) {
      try {
        const data = await this.$api.getUsers(offset, limit)
        this.pages = data.pages
        this.users = data.records
        this.loading = false
      } catch (error) {
        // console.log(error)
      }
    },
    async pageHandler(page) {
      this.loading = true
      await this.getfiles((page - 1) * 50, 50)
    },
    async changeLock(flag, id, index) {
      try {
        await this.$api.updateUserInfo(id, { locked: flag })
        this.users[index].locked = flag
        this.$Message.success('修改成功')
      } catch (error) {}
    },
    async changeIsAdmin(flag, id, index) {
      try {
        await this.$api.updateUserInfo(id, { isAdmin: flag })
        this.users[index].isAdmin = flag
        this.$Message.success('修改成功')
      } catch (error) {}
    },
    async changePassword() {
      try {
        await this.$api.updateUserInfo(this.current.id, this.loginForm)
        this.modalVisible = false
        this.$Message.success('修改成功')
      } catch (error) {}
    },
    showModal(index) {
      this.modalVisible = true
      this.current = this.users[index]
    }
  }
}
</script>

<style scoped>
.users {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
}

.user-list {
  width: 80vw;
}

.page {
  margin: 20px auto;
}
</style>
