import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ayrshare",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "Unique title for the new profile",
    },
    messagingActive: {
      type: "boolean",
      label: "Messaging Active",
      description: "Enable messaging functionality for this profile",
      optional: true,
    },
    hideTopHeader: {
      type: "boolean",
      label: "Hide Top Header",
      description: "Hide the top header text on the account linking page",
      optional: true,
    },
    topHeader: {
      type: "string",
      label: "Top Header",
      description: "Custom header text shown on the social linking page",
      optional: true,
    },
    subHeader: {
      type: "string",
      label: "Sub Header",
      description: "Custom sub-header text shown below the header on the linking page",
      optional: true,
    },
    disableSocial: {
      type: "string[]",
      label: "Disable Social",
      description: "List of social platforms to disable for this profile",
      options: constants.SOCIAL_NETWORKS,
      optional: true,
    },
    team: {
      type: "boolean",
      label: "Team",
      description: "Set to true to invite the user as a team member",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address to send the team invitation to",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Custom internal tags to help categorize the profile",
      optional: true,
    },
    profileKey: {
      type: "string",
      label: "Profile Key",
      description: "Unique key returned after profile creation",
    },
    profileToDelete: {
      type: "string",
      label: "Title",
      description: "Unique title of the profile that will be deleted. Must be informed only if `profileKey` is not provided",
      optional: true,
      async options() {
        const response = await this.getProfiles();
        const profiles = response.profiles;
        return profiles.map((profiles) => ({
          label: profiles.title,
          value: profiles.title,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ayrshare.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async createUser(args = {}) {
      return this._makeRequest({
        path: "/profiles",
        method: "post",
        ...args,
      });
    },
    async updateUser(args = {}) {
      return this._makeRequest({
        path: "/profiles",
        method: "patch",
        ...args,
      });
    },
    async deleteUser(args = {}) {
      return this._makeRequest({
        path: "/profiles",
        method: "delete",
        ...args,
      });
    },
    async getProfiles(args = {}) {
      return this._makeRequest({
        path: "/profiles",
        ...args,
      });
    },
  },
};
