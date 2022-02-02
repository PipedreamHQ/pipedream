import type { ThemeObject } from '@vuepress/core'
import { path } from '@vuepress/utils'


const localTheme: ThemeObject = {
  name: 'vuepress-theme-local',
  extends: '@vuepress/theme-default',
  alias: {
    '@theme/NavbarItems.vue': path.resolve(__dirname, './components/NavbarItems.vue'),
  },
}

export default localTheme
