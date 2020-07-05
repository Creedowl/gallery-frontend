import { Message } from 'view-design'

export default ({ $axios, app, redirect }, inject) => {
  // $axios.onRequest((config) => {
  //   if (store.getters['user/isAuthenticated']) {
  //     config.headers.common.Authorization =
  //       'Bearer ' + store.getters['user/user'].token
  //   }
  //   // config.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
  // })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    switch (code) {
      // case 400:
      //   redirect('/400')
      //   break
      case 403:
        if (error.response.data.message === 'Access Denied') {
          Message.error('登录过期')
          app.$auth.logout()
          redirect('/login')
        }
        break
      case 504:
        Message.error('网络异常')
        redirect('/')
        break
      default:
        break
    }
  })
}
