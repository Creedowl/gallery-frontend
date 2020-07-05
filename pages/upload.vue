<template>
  <div class="container">
    <div class="preview">
      <img v-if="img" :src="img" alt="preview" />
    </div>
    <div class="upload">
      <Upload
        action="/"
        :before-upload="handleUpload"
        :format="['jpg', 'jpeg', 'png', 'gif', 'webp']"
      >
        <Button icon="ios-cloud-upload-outline">
          选择图片
        </Button>
      </Upload>
    </div>
    <div v-if="img" class="operation">
      <Button type="primary" @click="upload()">上传</Button>
      <Button type="error" @click="del()">删除</Button>
    </div>
    <a v-if="link" :href="link" target="_blank">{{ filename }}</a>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      file: null,
      img: null,
      link: null,
      filename: null
    }
  },
  methods: {
    handleUpload(file) {
      const form = new FormData()
      const reader = new FileReader()
      form.append('file', file)
      this.file = form
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.img = reader.result
      }
      return false
    },
    async upload() {
      try {
        const res = await this.$api.uploadImage(this.file)
        this.link = process.env.baseUrl + res.link
        this.filename = res.originFilename
        this.$Message.success('上传成功')
      } catch (error) {
        // console.log(error)
      }
    },
    del() {
      this.file = null
      this.img = null
      this.link = null
      this.filename = null
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.preview {
  max-width: 800px;
  max-height: 800px;
}

.preview img {
  max-width: 100%;
  max-height: 100%;
}
</style>
