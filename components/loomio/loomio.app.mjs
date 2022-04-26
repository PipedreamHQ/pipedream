import { axios } from "@pipedream/platform";

export const DEFAULT_BASE_URL = "https://www.loomio.org";

export default {
  name: "loomio",
  version: "0.0.1",
  type: "app",
  props: {
    email: { type: "string" },
    password: { type: "string", secret: true },
    group_id: {
      type: "integer",
      // TODO: load possible groups using other props
    },
    base_url: {
      type: "string",
      description: "Base url for loomio",
      default: DEFAULT_BASE_URL,
    },
  },
  methods: {
    getGroupId() {
      return this.group_id;
    },
    getBaseUrl() {
      return this.base_url || DEFAULT_BASE_URL;
    },
    async getCookie($) {
      const res = await axios($, {
        method: 'POST',
        url: this.getBaseUrl() + "/api/v1/sessions",
        body: {
          user: {
            email: this.email,
            password: this.password,
          }
        }
      });
      return res.headers["set-cookie"].join("; ");
    },
  },
};
