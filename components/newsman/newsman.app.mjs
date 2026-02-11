import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "newsman",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of a list",
      async options() {
        const lists = await this.listLists();
        return lists?.map(({
          list_id: value, list_name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    subscriberId: {
      type: "string",
      label: "Subscriber ID",
      description: "The ID of a subscriber",
      async options({
        listId, page,
      }) {
        const subscribers = await this.listSubscribers({
          params: {
            list_id: listId,
            status: "",
            since: "",
            start_page: page,
            limit: 100,
          },
        });
        return subscribers?.map(({
          abonat_id: value, email: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    segmentId: {
      type: "string",
      label: "Segment ID",
      description: "The ID of a segment",
      async options({ listId }) {
        const segments = await this.listSegments({
          params: {
            list_id: listId,
          },
        });
        return segments?.map(({
          segment_id: value, segment_name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the subscriber",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the subscriber",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://ssl.newsman.app/api/1.2/rest/${this.$auth.user_id}/${this.$auth.api_key}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        ...opts,
      });
    },
    getSubscriber(opts = {}) {
      return this._makeRequest({
        path: "/subscriber.get.json",
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/list.all.json",
        ...opts,
      });
    },
    listSegments(opts = {}) {
      return this._makeRequest({
        path: "/segment.all.json",
        ...opts,
      });
    },
    listSubscribers(opts = {}) {
      return this._makeRequest({
        path: "/list.getSubscribers.json",
        ...opts,
      });
    },
    createSubscriber(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscriber.saveSubscribe.json",
        ...opts,
      });
    },
    addSubscriberToSegment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscriber.addToSegment.json",
        ...opts,
      });
    },
    updateSubscriber(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscriber.update.json",
        ...opts,
      });
    },
  },
};
