import { axios } from "@pipedream/platform";
import {
  MAPPINGS_OPTIONS,
  PASSWORD_ALGORITHM_OPTIONS,
  STATE_OPTIONS,
  STATUS_OPTIONS,
} from "./common/constants.mjs";
import { snakeCaseToTitleCase } from "./common/utils.mjs";

export default {
  type: "app",
  app: "onelogin",
  propDefinitions: {
    groupId: {
      type: "integer",
      label: "Group ID",
      description: "The ID of the Group in OneLogin that the user will be assigned to",
      async options({ prevContext }) {
        const {
          data, pagination,
        } = await this.listGroups({
          params: {
            after_cursor: prevContext?.nextCursor,
          },
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextCursor: pagination?.after_cursor,
          },
        };
      },
    },
    roleIds: {
      type: "integer[]",
      label: "Role IDs",
      description: "A list of OneLogin Role IDs the user will be assigned to",
      async options({ prevContext }) {
        const {
          data, pagination,
        } = await this.listRoles({
          params: {
            after_cursor: prevContext?.nextCursor,
          },
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextCursor: pagination?.after_cursor,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({ page }) {
        const data = await this.listUsers({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, username, email,
        }) => ({
          label: `${username || email}`,
          value,
        }));
      },
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "The type of event to emit",
      async options({ page }) {
        const { data } = await this.listEventTypes({
          params: {
            page,
          },
        });

        return data.map(({
          id: value, name, description,
        }) => ({
          label: `${snakeCaseToTitleCase(name)}: ${description}`,
          value,
        }));
      },
    },
    username: {
      type: "string",
      label: "Username",
      description: "The user's username (required if email is not provided)",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user's email address (required if username is not provided)",
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "The user's first name",
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The user's last name",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password to set for the user",
      secret: true,
    },
    passwordConfirmation: {
      type: "string",
      label: "Password Confirmation",
      description: "Required if the password is being set",
      secret: true,
    },
    passwordAlgorithm: {
      type: "string",
      label: "Password Algorithm",
      description: "Use this when importing a password that's already hashed. [See the documentation](https://developers.onelogin.com/api-docs/2/users/create-user) for further information",
      options: PASSWORD_ALGORITHM_OPTIONS,
    },
    salt: {
      type: "string",
      label: "Salt",
      description: "The salt value used with the `Password Algorithm`",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The user's job title",
    },
    department: {
      type: "string",
      label: "Department",
      description: "The user's department",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The user's company",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Free text related to the user",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The [E.164](https://en.wikipedia.org/wiki/E.164) format phone number for a user",
    },
    state: {
      type: "string",
      label: "State",
      description: "The user's state",
      options: STATE_OPTIONS,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The user's status",
      options: STATUS_OPTIONS,
    },
    directoryId: {
      type: "integer",
      label: "Directory ID",
      description: "The ID of the OneLogin Directory the user will be assigned to",
    },
    trustedIdpId: {
      type: "integer",
      label: "Trusted IDP ID",
      description: "The ID of the OneLogin Trusted IDP the user will be assigned to",
    },
    samaccountname: {
      type: "string",
      label: "SAM Account Name",
      description: "The user's Active Directory username",
    },
    memberOf: {
      type: "string",
      label: "Member Of",
      description: "The user's directory membership",
    },
    userPrincipalName: {
      type: "string",
      label: "User Principal Name",
      description: "The principle name of the user",
    },
    distinguishedName: {
      type: "string",
      label: "Distinguished Name",
      description: "The distinguished name of the user",
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "The ID of the user in an external directory",
    },
    openidName: {
      type: "string",
      label: "OpenID Name",
      description: "The name configured for use in other applications that accept OpenID for sign-in",
    },
    invalidLoginAttempts: {
      type: "integer",
      label: "Invalid Login Attempts",
      description: "The number of sequential invalid login attempts the user has made",
    },
    preferredLocaleCode: {
      type: "string",
      label: "Preferred Locale Code",
      description: "The 2-character language locale for the user, such as `en` for English or `es` for Spanish.",
    },
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "An object to contain any other custom attributes you have configured",
    },
    mappings: {
      type: "string",
      label: "Mappings",
      description: "Controls how mappings will be applied to the user on creation.",
      options: MAPPINGS_OPTIONS,
    },
    validatePolicy: {
      type: "boolean",
      label: "Validate Policy",
      description: "Will passwords validate against the User Policy?",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.onelogin.com/api`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/1/groups",
        ...opts,
      });
    },
    listRoles(opts = {}) {
      return this._makeRequest({
        path: "/1/roles",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/2/users",
        ...opts,
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/2/users",
        ...opts,
      });
    },
    updateUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/2/users/${userId}`,
        ...opts,
      });
    },
    listEvents(opts = {}) {
      return this._makeRequest({
        path: "/1/events",
        ...opts,
      });
    },
    listEventTypes(opts = {}) {
      return this._makeRequest({
        path: "/1/events/types",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let count = 0;
      let nextCursor = null;

      do {
        params.after_cursor = nextCursor;
        const {
          data,
          pagination: { after_cursor },
        } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        nextCursor = after_cursor;
      } while (nextCursor);
    },
  },
};
