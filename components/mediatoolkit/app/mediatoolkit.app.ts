import { defineApp } from "@pipedream/types";
import { axios } from '@pipedream/platform'

export default defineApp({
  type: "app",
  app: "mediatoolkit",
  propDefinitions: {
    organizationId: {
      label: "Organization ID",
      description: "The organization ID",
      type: "string",
      async options() {
        const organizations = await this.getOrganizations()

        return organizations.map(organization => ({
          label: organization.name,
          value: organization.id
        }))
      }
    },
    groupId: {
      label: "Group ID",
      description: "The group ID",
      type: "string",
      async options({ organizationId }) {
        const groups = await this.getGroups({
          organizationId
        })

        return groups.map(group => ({
          label: group.name,
          value: group.id
        }))
      }
    }
  },
  methods: {
    _accessToken() {
      return this.$auth.access_token;
    },
    _apiUrl() {
      return "https://api.mediatoolkit.com";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        params: {
          ...args.params,
          access_token: this._accessToken(),
        },
      });
    },
    async getOrganizations(args = {}) {
      const response = await this._makeRequest({
        path: "/me/organizations",
        ...args
      })

      return response?.data?.organizations ?? []
    },
    async getGroups({ organizationId, ...args }) {
      const response = await this._makeRequest({
        path: `/organizations/${organizationId}/groups`,
        ...args
      })

      return response?.data?.groups ?? []
    },
    async getMentions({ organizationId, groupId, ...args }) {
      const response = await this._makeRequest({
        path: `/organizations/${organizationId}/groups/${groupId}/mentions`,
        ...args
      })

      return response?.data?.response ?? []
    }
  },
});