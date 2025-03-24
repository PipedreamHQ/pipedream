import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "uptimerobot",
  propDefinitions: {
    alertContact: {
      type: "string",
      label: "Alert Contact",
      description: "The alert contacts to be notified when the monitor goes up/down.",
      async options({
        prevContext: { offset = 1 },
        filter = ({ status }) => String(status) === constants.ALERT_CONTACT_STATUS.ACTIVE.value,
      }) {
        if (offset === null) {
          return [];
        }
        const { alert_contacts: alertContacts } = await this.getAlertContacts({
          data: {
            limit: constants.DEFAULT_LIMIT,
            offset,
          },
        });
        return {
          options: alertContacts
            .filter(filter)
            .map(({
              id, value, type: alertContactType,
            }) => ({
              label: `${value} (${constants.ALERT_CONTACT_TYPE_VALUE_MAP[alertContactType]})`,
              value: id,
            })),
          context: {
            offset: alertContacts.length === constants.DEFAULT_LIMIT
              ? offset + constants.DEFAULT_LIMIT
              : null,
          },
        };
      },
    },
    friendlyName: {
      type: "string",
      label: "Friendly Name",
      description: "A friendly name for the monitor.",
    },
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The ID of the monitor.",
      async options({ prevContext: { offset = 0 } }) {
        if (offset === null) {
          return [];
        }
        const { monitors } = await this.getMonitors({
          data: {
            limit: constants.DEFAULT_LIMIT,
            offset,
          },
        });
        return {
          options: monitors.map(({
            id: value, friendly_name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            offset: monitors.length === constants.DEFAULT_LIMIT
              ? offset + constants.DEFAULT_LIMIT
              : null,
          },
        };
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "The desired status to change the monitor to.",
      options: [
        {
          label: "Pause",
          value: "0",
        },
        {
          label: "Resume",
          value: "1",
        },
      ],
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Cache-Control": "no-cache",
      };
    },
    getAuthData(data) {
      return {
        ...data,
        api_key: this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, data, headers, ...args
    } = {}) {
      const response = await axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        data: this.getAuthData(data),
      });

      if (response.stat !== "ok") {
        throw new Error(JSON.stringify(response, null, 2));
      }

      return response;
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    getAlertContacts(args = {}) {
      return this.post({
        path: "/getAlertContacts",
        ...args,
      });
    },
    getMonitors(args = {}) {
      return this.post({
        path: "/getMonitors",
        ...args,
      });
    },
    updateMonitor(args = {}) {
      return this.post({
        path: "/editMonitor",
        ...args,
      });
    },
  },
};
