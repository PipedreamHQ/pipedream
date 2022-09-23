import { axios } from "@pipedream/platform";

export const DEFAULT_BASE_URL = "https://www.loomio.org";

export default {
  name: "loomio",
  version: "0.0.1",
  type: "app",
  props: {
    base_url: {
      label: 'Base URL',
      type: "string",
      description: "Base url for loomio",
      'default': DEFAULT_BASE_URL,
    },
    api_key: { type: "string", secret: true, label: 'API Key' },
    group_id: {
      label: 'Group ID',
      type: "integer",
      async options({ $ }) {
        return (await this.getMemberships($)).map(group => ({value: group.id, label: group.full_name}));
      },
    },
  },
  methods: {
    getGroupId() {
      return this.group_id;
    },
    getApiKey() {
      return this.api_key;
    },
    getBaseUrl() {
      return (this.base_url || DEFAULT_BASE_URL) + '/api/b1';
    },
    async getMemberships($) {
      const res = await axios($, { url: this.getBaseUrl() + "/memberships?api_key=" + this.api_key });
      return res.groups;
    },
  },
};
