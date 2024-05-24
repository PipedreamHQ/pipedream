import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "fly_io",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App Name",
      description: "The name of the app",
      async options({
        mapper = ({
          id: value, name: label,
        }) => ({
          value,
          label,
        }),
      }) {
        const { apps } = await this.listApps({
          params: {
            org_slug: this.getOrgSlug(),
          },
        });
        return apps.map(mapper);
      },
    },
    machineId: {
      type: "string",
      label: "Machine ID",
      description: "The ID of the machine",
      async options({ appName }) {
        const machines = await this.listMachines({
          appName,
        });
        return machines.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getOrgSlug() {
      return this.$auth.org_slug;
    },
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.access_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listApps(args = {}) {
      return this._makeRequest({
        path: "/apps",
        ...args,
      });
    },
    listMachines({
      appName, ...args
    } = {}) {
      return this._makeRequest({
        path: `/apps/${appName}/machines`,
        ...args,
      });
    },
    listEvents({
      appName, machineId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/apps/${appName}/machines/${machineId}/events`,
        ...args,
      });
    },
  },
};
