import app from "../app/twitter.app";

export default {
  props: {
    app: {
      ...app,
      reloadProps: true,
    },
  },
  async additionalProps(): Promise<any> {
    const data = await this.getTweets({
      validateStatus: () => true,
    });
    this.app.throwError(data);
    return {};
  },
  methods: {
    getTweets(args = {}) {
      return this.app._httpRequest({
        url: "/tweets",
        ...args,
      });
    },
  },
};
