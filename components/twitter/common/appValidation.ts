import app from "../app/twitter.app";

export default {
  props: {
    app: {
      ...app,
      reloadProps: true,
    },
  },
  async additionalProps(): Promise<any> {
    const q = "Pipedream";
    const data = await this.getRecentTweets({
      params: {
        query: q,
      },
      validateStatus: () => true,
    });

    this.app.throwError(data);
    return {};
  },
  methods: {
    getRecentTweets(args = {}) {
      return this.app._httpRequest({
        url: "/tweets/search/recent",
        ...args,
      });
    },
  },
};
