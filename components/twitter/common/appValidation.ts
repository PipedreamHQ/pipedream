import app from "../app/twitter.app";

export default {
  props: {
    app: {
      ...app,
      reloadProps: true,
    },
  },
  async additionalProps(): Promise<any> {
    const tweetId = "1228393702244134912";
    const data = await this.getTweets({
      params: {
        ids: tweetId,
      },
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
