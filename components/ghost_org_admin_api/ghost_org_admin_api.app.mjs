import { axios } from "@pipedream/platform";
import jwt from "jsonwebtoken";

export default {
  type: "app",
  app: "ghost_org_admin_api",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the new member.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The member name.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Some personal note about the member",
      optional: true,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "The labels to assign to the member",
      optional: true,
    },
    member: {
      type: "string",
      label: "Member",
      description: "The member to be edited.",
      async options({ page }) {
        const limit = 15;
        const res = await this.getMembers(limit, page + 1);
        const members = res.members?.map((member) => ({
          label: member.email,
          value: member.id,
        }));
        return members;
      },
    },
  },
  methods: {
    _getBaseURL() {
      return `${this.$auth.admin_api_url}/ghost/api/v3/admin`;
    },
    async _getHeader() {
      const token = await this._getToken();
      return {
        Authorization: `Ghost ${token}`,
      };
    },
    _getToken() {
      const key = this.$auth.admin_api_key;
      const [
        id,
        secret,
      ] = key.split(":");
      return jwt.sign({}, Buffer.from(secret, "hex"), {
        keyid: id,
        algorithm: "HS256",
        expiresIn: "5m",
        audience: "/v3/admin/",
      });
    },
    async createHook(event, targetUrl) {
      const data = {
        webhooks: [
          {
            event,
            target_url: targetUrl,
          },
        ],
      };
      const res = await this.makeHttpRequest("post", "/webhooks", data);
      if (!res?.data?.webhooks?.[0]?.id) {
        console.log(res.data);
        throw new Error("No webhook id was returned by Ghost. Please try again.");
      }

      return res.data.webhooks[0].id;
    },
    async deleteHook(hookId) {
      if (!hookId) {
        console.warn("No hookId provided. No webhook deleted");
      }
      await this.makeHttpRequest("delete", `/webhooks/${hookId}`);
    },
    async makeHttpRequest(method, path, data, params) {
      const config = {
        method,
        url: this._getBaseURL() + path,
        headers: await this._getHeader(),
        data,
        params,
      };
      return await axios(this, config);
    },
    async createMember(data) {
      return this.makeHttpRequest("post", "/members", {
        members: [
          data,
        ],
      });
    },
    async updateMember(id, data) {
      return this.makeHttpRequest("put", `/members/${id}`, {
        members: [
          data,
        ],
      });
    },
    async getMembers(limit, page) {
      return this.makeHttpRequest("get", "/members", null, {
        limit,
        page,
      });
    },
  },
};
