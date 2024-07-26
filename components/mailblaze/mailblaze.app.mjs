import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mailblaze",
  propDefinitions: {
    listUid: {
      type: "string",
      label: "List UID",
      description: "The UID of the mailing list",
      async options({ page }) {
        const { data } = await this.listLists({
          params: {
            page: page + 1,
          },
        });

        return data.records.map(({
          general: {
            list_uid: value, name: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    subscriberUid: {
      type: "string",
      label: "subscriber UID",
      description: "The UID of the subscriber",
      async options({
        page, listUid,
      }) {
        const { data } = await this.listSubscribers({
          params: {
            page: page + 1,
          },
          listUid,
        });

        return data.records.map(({
          subscriber_uid: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://control.mailblaze.com/api";
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.api_key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    addSubscriber({
      listUid, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/lists/${listUid}/subscribers`,
        ...opts,
      });
    },
    updateSubscriber({
      listUid, subscriberUid, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/lists/${listUid}/subscribers/${subscriberUid}`,
        ...opts,
      });
    },
    getFields({ listUid }) {
      return this._makeRequest({
        path: `/lists/${listUid}/fields`,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/lists",
        ...opts,
      });
    },
    listSubscribers({
      listUid, ...opts
    }) {
      return this._makeRequest({
        path: `/lists/${listUid}/subscribers`,
        ...opts,
      });
    },
  },
};
