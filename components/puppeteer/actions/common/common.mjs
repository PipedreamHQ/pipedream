export default {
  props: {
    url: {
      type: "string",
      label: "URL",
      description:
        "The URL of the page to scrape. For example, `https://example.com`.",
    },
  },
  methods: {
    normalizeUrl() {
      let url = this.url;
      if (!url.startsWith("http")) {
        url = `https://${url}`;
      }
      return url;
    },
  },
};
