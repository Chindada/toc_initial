module.exports = {
  runtimeCompiler: true,
  pwa: {
    iconPaths: {
      favicon32: 'img/icons/logo.ico',
      favicon16: 'img/icons/logo.ico'
    }
  },

  // devServer: {
  //   proxy: 'http://127.0.0.1:8887'
  // }
  devServer: {
    // proxy: 'http://192.168.10.233:8887', //LEO
    // proxy: 'http://192.168.10.99', //
    // proxy: 'http://61.220.105.112', //OEE+
    // proxy: 'http://192.168.10.195',
    proxy: 'http://127.0.0.1', //
    // proxy: 'http://192.168.10.129', //OEE+
    // sockHost: '192.168.10.129:8887',
    disableHostCheck: true
    // proxy: 'http://127.0.0.1:8887'
    // proxy: 'http://10.0.1.17'
  }
}
