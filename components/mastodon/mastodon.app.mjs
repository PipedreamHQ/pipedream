import { axios } from "@pipedream/platform";
import standardAxios from "axios";
import {
  API_V1,
  API_V2,
  DEFAULT_PAGE_SIZE,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "mastodon",
  propDefinitions: {
    list: {
      type: "string",
      label: "List",
      description: "ID of the list",
      async options({ prevContext }) {
        const params = {
          limit: DEFAULT_PAGE_SIZE,
        };
        if (prevContext.maxId) {
          params.max_id = prevContext.maxId;
        }
        const lists = await this.listLists({
          params,
        });
        const options = lists?.map((list) => ({
          label: list.title,
          value: list.id,
        })) || [];
        return {
          options,
          context: {
            maxId: lists[lists.length - 1]?.id,
          },
        };
      },
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of the Status in the database. The Status ID can be extracted from the link that copied from `Copy link to post` button on the status with the pattern `https://mastodon-domain/@username/[Status ID]`",
    },
    userStatusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of the Status in the database",
      async options({
        prevContext, pinned = null,
      }) {
        const params = {
          limit: DEFAULT_PAGE_SIZE,
        };
        if (pinned !== null) {
          params.pinned = pinned;
        }
        if (prevContext.maxId) {
          params.max_id = prevContext.maxId;
        }
        const statuses = await this.listStatuses({
          params,
        });
        const options = statuses?.map((status) => ({
          value: status.id,
          label: status.content.replace(/<[^>]*>/g, "").slice(0, 30),
        })) || [];
        return {
          options,
          context: {
            maxId: statuses[statuses.length - 1]?.id,
          },
        };
      },
    },
    bookmarkedStatusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of the Status in the database",
      async options({ prevContext }) {
        const args = {};
        if (prevContext.link) {
          args.url = this.getPrevLink(prevContext.link);
        }
        const {
          data: statuses, headers,
        } = await this.listBookmarkedStatuses(args);
        return {
          options: statuses?.map((status) => ({
            value: status.id,
            label: status.content.replace(/<[^>]*>/g, "").slice(0, 30),
          })) || [],
          context: {
            link: headers?.link,
          },
        };
      },
    },
    favoriteStatusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of the Status in the database",
      async options({ prevContext }) {
        const args = {};
        if (prevContext.link) {
          args.url = this.getPrevLink(prevContext.link);
        }
        const {
          data: statuses, headers,
        } = await this.listFavoriteStatuses(args);
        return {
          options: statuses?.map((status) => ({
            value: status.id,
            label: status.content.replace(/<[^>]*>/g, "").slice(0, 30),
          })) || [],
          context: {
            link: headers?.link,
          },
        };
      },
    },
    local: {
      type: "boolean",
      label: "Local",
      description: "Show only local statuses? Defaults to false.",
      optional: true,
      default: false,
    },
    remote: {
      type: "boolean",
      label: "Remote",
      description: "Show only remote statuses? Defaults to false.",
      optional: true,
      default: false,
    },
    onlyMedia: {
      type: "boolean",
      label: "Only Media",
      description: "Show only statuses with media attached? Defaults to false.",
      optional: true,
      default: false,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The text content of the status",
    },
    sensitive: {
      type: "boolean",
      label: "Sensitive",
      description: "Mark status as sensitive? Defaults to false",
      optional: true,
      default: false,
    },
    spoilerText: {
      type: "string",
      label: "Spoiler Text",
      description: "Text to be shown as a warning or subject before the actual content. Statuses are generally collapsed behind this field",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max Results",
      description: `The maximum number of results to return. Defaults to ${DEFAULT_PAGE_SIZE}.`,
      optional: true,
      default: DEFAULT_PAGE_SIZE,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.site_domain}/api`;
    },
    _accessToken() {
      const { access_token: token } = this.$auth;
      return token.startsWith("\t")
        ? token.substring(1)
        : token;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this._accessToken()}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      return axios($, config);
    },
    async _makeStandardAxiosRequest({
      path, url, params, ...args
    }) {
      const config = {
        url,
        headers: this._headers(),
        ...args,
      };
      if (!url) {
        config.url = `${this._baseUrl()}${path}`;
        config.params = params;
      }
      return standardAxios(config);
    },
    getPrevLink(link) {
      const links = link.split(",");
      const prevLink = links.filter((l) => l.includes("rel=\"prev\""))[0];
      return prevLink.substring(
        prevLink.indexOf("<") + 1,
        prevLink.lastIndexOf(">"),
      );
    },
    async verifyAccountCredentials(args = {}) {
      return this._makeRequest({
        path: `${API_V1}/accounts/verify_credentials`,
        ...args,
      });
    },
    async listLists(args = {}) {
      return this._makeRequest({
        path: `${API_V1}/lists`,
        ...args,
      });
    },
    async viewHomeTimeline(args = {}) {
      return this._makeRequest({
        path: `${API_V1}/timelines/home`,
        ...args,
      });
    },
    async viewListTimeline({
      listId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/timelines/list/${listId}`,
        ...args,
      });
    },
    async viewPublicTimeline(args = {}) {
      return this._makeRequest({
        path: `${API_V1}/timelines/public`,
        ...args,
      });
    },
    async viewHashtagTimeline({
      hashtag, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/timelines/tag/${hashtag}`,
        ...args,
      });
    },
    async search(args = {}) {
      return this._makeRequest({
        path: `${API_V2}/search`,
        ...args,
      });
    },
    async getStatus({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}`,
        ...args,
      });
    },
    async postStatus(args = {}) {
      return this._makeRequest({
        path: `${API_V1}/statuses`,
        method: "POST",
        ...args,
      });
    },
    async deleteStatus({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}`,
        method: "DELETE",
        ...args,
      });
    },
    async favoriteStatus({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}/favourite`,
        method: "POST",
        ...args,
      });
    },
    async unfavoriteStatus({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}/unfavourite`,
        method: "POST",
        ...args,
      });
    },
    async boostStatus({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}/reblog`,
        method: "POST",
        ...args,
      });
    },
    async unboostStatus({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}/unreblog`,
        method: "POST",
        ...args,
      });
    },
    async bookmarkStatus({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}/bookmark`,
        method: "POST",
        ...args,
      });
    },
    async unbookmarkStatus({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}/unbookmark`,
        method: "POST",
        ...args,
      });
    },
    async muteConversation({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}/mute`,
        method: "POST",
        ...args,
      });
    },
    async unmuteConversation({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}/unmute`,
        method: "POST",
        ...args,
      });
    },
    async pinStatus({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}/pin`,
        method: "POST",
        ...args,
      });
    },
    async unPinStatus({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}/unpin`,
        method: "POST",
        ...args,
      });
    },
    async editStatus({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}`,
        method: "PUT",
        ...args,
      });
    },
    async listStatuses(args = {}) {
      const { id } = await this.verifyAccountCredentials();
      return this._makeRequest({
        path: `${API_V1}/accounts/${id}/statuses`,
        ...args,
      });
    },
    async listBookmarkedStatuses(args = {}) {
      return this._makeStandardAxiosRequest({
        path: `${API_V1}/bookmarks`,
        ...args,
      });
    },
    async listFavoriteStatuses(args = {}) {
      return this._makeStandardAxiosRequest({
        path: `${API_V1}/favourites`,
        ...args,
      });
    },
    async listFavoritedBy({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}/favourited_by`,
        ...args,
      });
    },
    async listBoostedBy({
      statusId, ...args
    }) {
      return this._makeRequest({
        path: `${API_V1}/statuses/${statusId}/reblogged_by`,
        ...args,
      });
    },
    async getAccountsFollowing(args = {}) {
      const { id } = await this.verifyAccountCredentials();
      return this._makeRequest({
        path: `${API_V1}/accounts/${id}/following`,
        ...args,
      });
    },
    async paginate(resourceFn, args, max = DEFAULT_PAGE_SIZE, resourceType = null) {
      const items = [];
      let done = false;
      args.params = {
        ...args.params,
        limit: DEFAULT_PAGE_SIZE,
      };
      do {
        const response = await resourceFn(args);
        const results = resourceType
          ? response[resourceType]
          : response;
        items.push(...results);
        args.params.max_id = results[results.length - 1]?.id;

        if (results.length < args.params.limit) {
          done = true;
        }
      } while (items.length < max && !done);

      if (items.length > max) {
        items.length = max;
      }
      return items;
    },
  },
};
