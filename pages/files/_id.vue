<template>
  <div class="files">
    <Table
      :columns="columns"
      :data="files"
      :loading="loading"
      class="files-list"
    >
      <!-- <template slot="id" slot-scope="{ row }">
        <nuxt-link :to="'/files/' + row.id">{{ row.id }}</nuxt-link>
      </template> -->
      <template slot="filename" slot-scope="{ row }">
        <Tooltip content="点击打开图片" placement="top">
          <a :href="row.link" target="_blank">{{ row.originFilename }}</a>
        </Tooltip>
      </template>
      <template slot="img" slot-scope="{ row }">
        <div class="preview">
          <Tooltip content="点击图片预览" placement="left">
            <img
              :src="row.link + '?inc=false'"
              :alt="row.filename"
              @click="showImage(row.link)"
            />
          </Tooltip>
        </div>
      </template>
      <template slot="operation" slot-scope="{ row, index }">
        <div class="operation">
          <Button
            v-clipboard:copy="copy(row.link)"
            v-clipboard:success="onCopy"
            type="primary"
          >
            复制链接
          </Button>
          <br />
          <Button type="error" @click="deleteImage(row.filename, index)">
            删除图片
          </Button>
        </div>
      </template>
    </Table>
    <Page
      :total="pages"
      :page-size="50"
      show-elevator
      class="page"
      @on-change="pageHandler"
    />
    <Modal v-model="modalVisible" width="800" :footer-hide="true">
      <div class="modal-content">
        <img :src="showImg + '?inc=false'" />
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
        { title: 'Filename', slot: 'filename' },
        { title: 'Img', slot: 'img' },
        { title: 'Count', key: 'count', width: '80px', align: 'center' },
        { title: 'Operation', slot: 'operation', align: 'center' }
      ],
      loading: true,
      modalVisible: false,
      pages: 0,
      userId: this.$route.params.id,
      username: '',
      showImg: '',
      files: []
    }
  },
  mounted() {
    this.getFiles(this.userId)
  },
  methods: {
    async getFiles(id, offset = 0, limit = 50) {
      try {
        const data = await this.$api.getFiles(id, offset, limit)
        this.pages = data.pages
        this.files = data.records
        this.username = data.username
        this.loading = false
      } catch (error) {
        // console.log(error)
      }
    },
    async pageHandler(page) {
      this.loading = true
      await this.getfiles((page - 1) * 50, 50)
    },
    showImage(img) {
      this.showImg = img
      this.modalVisible = true
    },
    copy(link) {
      return process.env.baseUrl + link
    },
    onCopy(res) {
      this.$Message.success('复制成功')
    },
    async deleteImage(filename, index) {
      try {
        await this.$api.deleteImage(filename)
        this.files.splice(index, 1)
        this.$Message.success('删除成功')
      } catch (error) {
        // console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.files {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
}

.files-list {
  width: 80vw;
}

.page {
  margin: 20px auto;
}

.preview {
  width: 100%;
  max-height: 300px;
  text-align: center;
}

.preview img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

.modal-content {
  max-width: 100%;
  max-height: 100%;
  text-align: center;
}

.modal-content img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

.operation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
