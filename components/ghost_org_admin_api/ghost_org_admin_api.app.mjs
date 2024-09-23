import { axios } from "@pipedream/platform";
import jwt from "jsonwebtoken";
import constants from "./common/constants.mjs";

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
        const res = await this.getMembers({
          params: {
            limit,
            page: page + 1,
          },
        });
        const members = res.members?.map((member) => ({
          label: member.email,
          value: member.id,
        }));
        return members;
      },
    },
  },
  methods: {
    getURL(path) {
      const { admin_api_url: domain } = this.$auth;
      return `${domain.includes("https://")
        ? ""
        : "https://"}${domain}${constants.VERSION_PATH}${path}`;
    },
    getHeader() {
      const token = this.getToken();
      return {
        "Authorization": `Ghost ${token}`,
        "Accept-Version": "v5.0",
      };
    },
    getToken() {
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
    async makeRequest({
      $ = this, path, ...args
    } = {}) {
      const config = {
        url: this.getURL(path),
        headers: this.getHeader(),
        ...args,
      };
      return axios($, config);
    },
    async createHook(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/webhooks",
        ...args,
      });
    },
    async deleteHook({
      hookId, ...args
    } = {}) {
      return this.makeRequest({
        method: "delete",
        path: `/webhooks/${hookId}`,
        ...args,
      });
    },
    async createPost(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/posts",
        ...args,
      });
    },
    async createMember(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/members",
        ...args,
      });
    },
    async updateMember({
      memberId, ...args
    } = {}) {
      return this.makeRequest({
        method: "put",
        path: `/members/${memberId}`,
        ...args,
      });
    },
    async getMembers(args = {}) {
      return this.makeRequest({
        path: "/members",
        ...args,
      });
    },
  },
};
