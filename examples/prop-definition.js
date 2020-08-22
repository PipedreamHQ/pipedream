const rss = {
  type: "app",
  app: "rss",
  propDefinitions: {
    urlDef: {
      type: "string",
      label: "RSS URL",
      description: "Enter a URL for an RSS feed."
    },
  }
}

module.exports = {
  name: 'Prop Definition Example',
  description: `This component captures an RSS URL and logs it`,
  version: '0.1',
  props: {
    rss,
    url: { propDefinition: [rss, "urlDef"] },
  },
  async run() {
      console.log(this.url)
  }, 
}