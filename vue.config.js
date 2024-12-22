const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}

  },
 

  devServer: {
    port: 8081,  
  },
  // compilerOptions: {
  //   isCustomElement: (tag) => tag.startsWith('v-'),
  // },
});
// process.env.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = true;



