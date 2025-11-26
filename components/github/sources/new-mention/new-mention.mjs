import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-mention",
  name: "New Mention",
  description: "Emit new event when you are @mentioned in a new commit, comment, issue or pull request. [See the documentation](https://docs.github.com/en/rest/activity/notifications?apiVersion=20.2.61-28#list-notifications-for-the-authenticated-user)",
  version: "0.2.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getUserLogin() {
      return this.db.get("userLogin");
    },
    _setUserLogin(userLogin) {
      this.db.set("userLogin", userLogin);
    },
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(value) {
      this.db.set("lastDate", value);
    },
    async retrieveUserLogin() {
      let login = this._getUserLogin();
      if (!login) {
        const user = await this.github.getAuthenticatedUser();
        login = user.login;
        this._setUserLogin(login);
      }
      return login;
    },
    async getItems() {
      const date = this._getLastDate();
      this._setLastDate(new Date().toISOString());
      return this.github.getFilteredNotifications({
        reason: "mention",
        data: {
          participating: true,
          all: true,
          ...(date && {
            since: date,
          }),
        },
      });
    },
    async getAndProcessData(maxEmits = 0) {
      const login = await this.retrieveUserLogin();
      const savedIds = this._getSavedIds();
      const items = await this.getItems();

      const urlData = new Map();
      let amountEmits = 0;

      const promises = items?.map((item) => (async () => {
        const url = item?.subject?.url;
        if (!urlData.has(url)) {
          urlData.set(url, await this.github.getFromUrl({
            url: item.subject.url,
          }));
        }
        const subject = urlData.get(url);
        const commentsUrl = subject.comments_url;
        if (!commentsUrl) return;

        if (!urlData.has(commentsUrl)) {
          urlData.set(commentsUrl, await this.github.getFromUrl({
            url: commentsUrl,
          }));
        }
        const comments = urlData.get(commentsUrl);
        comments?.filter?.((comment) => {
          return !savedIds.includes(comment.id) && comment.body?.includes(`@${login}`);
        }).forEach((comment) => {
          if (!maxEmits || (amountEmits < maxEmits)) {
            this.$emit(comment, {
              id: comment.id,
              summary: `New mention: ${comment.id}`,
              ts: Date.parse(comment.created_at),
            });
            amountEmits++;
          }
          savedIds.push(comment.id);
        });
      })());

      if (promises?.length) await Promise.allSettled(promises);

      this._setSavedIds(savedIds);
    },
  },
};
