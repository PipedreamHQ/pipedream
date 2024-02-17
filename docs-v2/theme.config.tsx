import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import PipedreamLink from './components/PipedreamLink'
import PipedreamTextLogo from './components/PipedreamTextLogo'
import SlackLogo from './components/SlackLogo'

const config: DocsThemeConfig = {
  components: {
    'a': PipedreamLink,
  },
  logo: PipedreamTextLogo,
  logoLink: 'https://pipedream.com',
  project: {
    link: 'https://github.com/PipedreamHQ/pipedream',
  },
  chat: {
    link: 'https://pipedream.com/support',
    icon: SlackLogo,
  },
  docsRepositoryBase: 'https://github.com/PipedreamHQ/pipedream/docs',
  footer: {
    text: (
      <span>
        Pipedream, Inc. {new Date().getFullYear()} {' '}
      </span>
    )
  },
  primaryHue: 153,
  primarySaturation: 100,
}

export default config
