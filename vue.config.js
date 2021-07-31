
module.exports = {
  css: {
    sourceMap: false,
    loaderOptions: {
      // 给 scss-loader 传递选项
      scss: {
        // 注入 `sass` 的 `common` `variables` 到全局
        prependData: `
                @import "~@/assets/style/common.scss";
                @import "~@/assets/style/variables.scss";
                 `,
      },
    },
  },

  //alias别名
  configureWebpack: {
    resolve: {
      alias: {
        'style': '@/assets/style',
        'components': '@/components',
        'api': '@/api'
      },
    },
  },
}
