import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dropmark",
  propDefinitions: {
    username: {
      type: "string",
      label: "Username",
      description: "Your Dropmark username",
    },
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The ID of the collection you want to retrieve",
    },
    personalKey: {
      type: "string",
      label: "Personal Key",
      description: "Your personal read-only token",
      secret: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
        },
      });
    },
    async getCollectionItems({
      username, collectionId, personalKey,
    }) {
      return this._makeRequest({
        path: `${username}.dropmark.com/${collectionId}.json`,
        params: {
          key: personalKey,
        },
      });
    },
    async getActivityFeed({
      username, personalKey,
    }) {
      return this._makeRequest({
        path: `${username}.dropmark.com/activity.json`,
        params: {
          key: personalKey,
        },
      });
    },
    async checkNewItemInCollection({
      username, collectionId, personalKey,
    }) {
      const items = await this.getCollectionItems({
        username,
        collectionId,
        personalKey,
      });
      // Logic to check and emit new items
    },
    async checkNewActivity({
      username, personalKey,
    }) {
      const activities = await this.getActivityFeed({
        username,
        personalKey,
      });
      // Logic to check and emit new activities
    },
  },
};
