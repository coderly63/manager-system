module.exports = {
  chainWebpack: config => {
    //ζε
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress',
      })
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    //θΏθ‘
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}