import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "mailerlite",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email of the subscriber",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the subscriber",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Subscriber type. Defaults to `active`",
      optional: true,
      default: "active",
      options({ type }) {
        switch (type) {
        case "create":
          return constants.CREATE_TYPE_OPTIONS;
        case "update":
          return constants.UPDATE_TYPE_OPTIONS;
        case "subscriber":
          return constants.SUBSCRIBER_TYPE_OPTIONS;
        }
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Limit to campaigns with the specified status. Defaults to `sent`",
      optional: true,
      options: constants.STATUS_OPTIONS,
    },
    subscriber: {
      type: "string",
      label: "Subscriber",
      description: "Subscriber to update",
      async options({
        group, type = "active", prevContext,
      }) {
        const limit = constants.PAGE_LIMIT;
        const { offset = 0 } = prevContext;
        const params = {
          type,
          limit,
          offset,
        };
        const subscribers = await this.listSubscribers({
          group,
          params,
        });
        return {
          options: subscribers.map((subscriber) => ({
            label: subscriber.email,
            value: subscriber.id,
          })),
          context: {
            offset: offset + limit,
          },
        };
      },
    },
    group: {
      type: "string",
      label: "Group",
      description: "Group to add subscriber to",
      async options({ prevContext }) {
        const limit = constants.PAGE_LIMIT;
        const { offset = 0 } = prevContext;
        const params = {
          limit,
          offset,
        };
        const groups = await this.listGroups({
          params,
        });
        return {
          options: groups.map((group) => ({
            label: group.name,
            value: group.id,
          })),
          context: {
            offset: offset + limit,
          },
        };
      },
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Subscriber fields to update",
      optional: true,
      async options() {
        const fields = await this.listFields();
        return fields.map((field) => ({
          label: field.title,
          value: field.key,
        }))
        // API does not support updating email through updateSubscriber
          .filter((field) => field.value !== "email");
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://connect.mailerlite.com/api";
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...args,
      });
    },
    async listGroups(opts = {}) {
      const { data } = await this._makeRequest({
        path: "/groups",
        ...opts,
      });
      return data;
    },
    async listSubscribers({
      group, params = {}, ...opts
    }) {
      const { type = "active" } = params;
      delete params.type;
      params["filter[status]"] = type;
      const { data } = await this._makeRequest({
        path: group
          ? `/groups/${group}/subscribers`
          : "/subscribers",
        params,
        ...opts,
      });
      return data;
    },
    async listFields(opts = {}) {
      const { data } = await this._makeRequest({
        path: "/fields",
        ...opts,
      });
      return data;
    },
    createSubscriber(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscribers",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    updateSubscriber({
      subscriber, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/subscribers/${subscriber}`,
        ...opts,
      });
    },
    addSubscriberToGroup({
      subscriber, group, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/subscribers/${subscriber}/groups/${group}`,
        ...opts,
      });
    },
    removeHook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
    removeSubscriberFromGroup({
      subscriber, group, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/subscribers/${subscriber}/groups/${group}`,
        ...opts,
      });
    },
  },
};
