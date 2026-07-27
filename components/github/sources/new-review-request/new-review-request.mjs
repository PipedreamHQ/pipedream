import common from "../common/common-polling.mjs";

const MAX_RESULTS = 1000;

export default {
  ...common,
  key: "github-new-review-request",
  name: "New Review Request",
  description: "Emit new events when you or a team you're a member of are requested to review a pull request across repositories accessible to the connected account. [See the documentation](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests#search-by-pull-request-review-status-and-reviewer)",
  version: "0.2.10",
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
    _getActiveReviewRequestIds() {
      return this.db.get("activeReviewRequestIds") || [];
    },
    _setActiveReviewRequestIds(ids) {
      this.db.set("activeReviewRequestIds", ids);
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
      const login = await this.retrieveUserLogin();
      return this.github.searchIssueAndPullRequests({
        query: `is:open is:pr review-requested:${login} sort:updated-desc`,
        maxResults: MAX_RESULTS,
      });
    },
    async getAndProcessData(maxEmits = 0) {
      const previousIds = this._getActiveReviewRequestIds();
      const previousIdSet = new Set(previousIds);
      const items = await this.getItems();
      const currentIds = new Set(items.map((item) => this.getItemId(item)));
      const nextIds = new Set(previousIds.filter((id) => currentIds.has(id)));
      let amountEmits = 0;

      this._setActiveReviewRequestIds(Array.from(nextIds));

      for (const item of items) {
        const itemId = this.getItemId(item);
        if (previousIdSet.has(itemId)) {
          continue;
        }
        if (maxEmits && amountEmits >= maxEmits) {
          nextIds.add(itemId);
          this._setActiveReviewRequestIds(Array.from(nextIds));
          continue;
        }

        const pullRequest = await this.github.getFromUrl({
          url: item.pull_request.url,
        });
        this.$emit(pullRequest, {
          id: `${itemId}-${item.updated_at}`,
          ...this.getItemMetadata(item),
        });
        nextIds.add(itemId);
        this._setActiveReviewRequestIds(Array.from(nextIds));
        amountEmits++;
      }
    },
    getItemMetadata(item) {
      return {
        summary: `New review request: "${item.title ?? item.id}"`,
        ts: Date.parse(item.updated_at),
      };
    },
  },
};
