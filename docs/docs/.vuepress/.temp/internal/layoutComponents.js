import { defineAsyncComponent } from 'vue'

export const layoutComponents = {
  "404": defineAsyncComponent(() => import(/* webpackChunkName: "layout-404" */"/Users/pierce/dev/pipedream/docs/node_modules/@vuepress/theme-default/lib/client/layouts/404.vue")),
  "Layout": defineAsyncComponent(() => import(/* webpackChunkName: "layout-Layout" */"/Users/pierce/dev/pipedream/docs/node_modules/@vuepress/theme-default/lib/client/layouts/Layout.vue")),
}
