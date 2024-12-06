import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "attractwell",
  propDefinitions: {
    tag: {
      type: "string",
      label: "Tag",
      description: "The name of the tag.",
      optional: true,
      async options() {
        const tags = await this.listContactTags();
        return tags.map(({ tag: value }) => value);
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The id of the campaign.",
      optional: true,
      async options() {
        const campaigns = await this.listCampaigns();
        return campaigns.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    vaultId: {
      type: "string",
      label: "Vault ID",
      description: "The id of the vault.",
      optional: true,
      async options() {
        const vaults = await this.listVaults();
        return vaults.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    followUpPlanId: {
      type: "string",
      label: "Follow-Up Plan ID",
      description: "The id of the follow-up plan.",
      optional: true,
      async options() {
        const followUpPlans = await this.listFollowUpPlans();
        return followUpPlans.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    automationId: {
      type: "string",
      label: "Automation ID",
      description: "The id of the automation.",
      optional: true,
      async options() {
        const automations = await this.listAutomations();
        return automations.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    classId: {
      type: "string",
      label: "Class ID",
      description: "The id of the class.",
      optional: true,
      async options({ page }) {
        const classes = await this.listClasses({
          params: {
            page,
          },
        });
        return classes.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    lessonId: {
      type: "string",
      label: "Lesson ID",
      description: "The id of the lesson.",
      optional: true,
      async options({ page }) {
        const classLessons = await this.listClassLessons({
          params: {
            page,
          },
        });
        return classLessons.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
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
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listContactTags(args = {}) {
      return this._makeRequest({
        path: "/contacts/tags",
        ...args,
      });
    },
    listCampaigns(args = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...args,
      });
    },
    listVaults(args = {}) {
      return this._makeRequest({
        path: "/vaults",
        ...args,
      });
    },
    listFollowUpPlans(args = {}) {
      return this._makeRequest({
        path: "/follow-up-plans",
        ...args,
      });
    },
    listAutomations(args = {}) {
      return this._makeRequest({
        path: "/automations",
        ...args,
      });
    },
    listClasses(args = {}) {
      return this._makeRequest({
        path: "/classes",
        ...args,
      });
    },
    listClassLessons(args = {}) {
      return this._makeRequest({
        path: "/classes/lessons",
        ...args,
      });
    },
  },
};
