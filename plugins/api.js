export default ({ $axios }, inject) => {
  const api = {
    register(userinfo) {
      return $axios.$post('/auth/register', userinfo)
    },
    getUsers(current = 0, size = 50) {
      return $axios.$get('/users/', { params: { current, size } })
    },
    getUser(id) {
      return $axios.$get(`/users/${id}`)
    },
    getFiles(id, current = 0, size = 50) {
      return $axios.$get(`/files/${id}`, { params: { current, size } })
    },
    deleteImage(filename) {
      return $axios.$delete(`/s/${filename}`)
    },
    uploadImage(file) {
      return $axios.$post('/upload', file)
    },
    updateUserInfo(id, userinfo) {
      return $axios.$put(`/users/${id}`, userinfo)
    }
  }
  inject('api', api)
}
