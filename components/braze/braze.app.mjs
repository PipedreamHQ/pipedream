import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "braze",
  propDefinitions: {
    userAliasName: {
      type: "string",
      label: "User Alias Name",
      description: "The name of the user alias. [See the docs here](https://www.braze.com/docs/api/objects_filters/user_alias_object#user-alias-object-specification).",
      async options() {
        const { users } = await this.userProfileByIdentifier({
          params: {
            fields_to_export: [
              "user_aliases",
            ],
          },
        });
        return users
          .flatMap(({ user_aliases }) => user_aliases)
          .map(({ alias_name }) => alias_name);
      },
    },
    userAliasLabel: {
      type: "string",
      label: "User Alias Label",
      description: "The label of the user alias. [See the docs here](https://www.braze.com/docs/api/objects_filters/user_alias_object#user-alias-object-specification).",
      async options() {
        const { users } = await this.userProfileByIdentifier({
          params: {
            fields_to_export: [
              "user_aliases",
            ],
          },
        });
        return users
          .flatMap(({ user_aliases }) => user_aliases)
          .map(({ alias_label }) => alias_label);
      },
    },
    userExternalId: {
      type: "string",
      label: "User External ID",
      description: "The external ID of the user. [See the docs here](https://www.braze.com/docs/user_guide/data_and_analytics/user_data_collection/user_profile_lifecycle/#user-aliases).",
      async options() {
        const { users } = await this.userProfileByIdentifier({
          params: {
            fields_to_export: [
              "external_id",
              "email",
            ],
          },
        });
        return users
          .map(({
            email: label, external_id: value,
          }) => ({
            label,
            value,
          }));
      },
    },
    brazeId: {
      type: "string",
      label: "Braze ID",
      description: "The Braze ID of the user.",
      async options() {
        const { users } = await this.userProfileByIdentifier({
          params: {
            fields_to_export: [
              "braze_id",
              "email",
            ],
          },
        });
        return users
          .map(({
            email: label, braze_id: value,
          }) => ({
            label,
            value,
          }));
      },
    },
  },
  methods: {
    getBaseUrl(versionPath) {
      const baseUrl = constants.BASE_URL
        .replace(constants.INSTANCE_DOMAIN_PLACEHOLDER, this.$auth.instance_domain)
        .replace(constants.REGION_PLACEHOLDER, this.$auth.region);
      return `${baseUrl}${versionPath || ""}`;
    },
    getUrl(path, versionPath) {
      return `${this.getBaseUrl(versionPath)}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, versionPath, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, versionPath),
        ...args,
      };

      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    userProfileByIdentifier(args = {}) {
      return this.create({
        path: "/users/export/ids",
        ...args,
      });
    },
  },
};
