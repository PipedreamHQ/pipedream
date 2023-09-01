import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_entra_id",
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Group",
      description: "Identifier of a group",
      async options({ prevContext }) {
        const args = prevContext?.nextLink
          ? {
            url: prevContext.nextLink,
          }
          : {};
        const response = await this.listGroups(args);
        const options = response.value?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User",
      description: "Identifier of a user",
      async options({
        groupId, prevContext,
      }) {
        const args = {};
        if (prevContext?.nextLink) {
          args.url = prevContext.nextLink;
        }
        const response = groupId
          ? await this.listGroupMembers({
            ...args,
            groupId,
          })
          : await this.listUsers(args);
        const options = response.value?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The name to display in the address book for the user.",
    },
    mail: {
      type: "string",
      label: "Email",
      description: "The SMTP address for the user, for example, `jeff@contoso.onmicrosoft.com`.",
    },
    mailNickname: {
      type: "string",
      label: "Mail Nickname",
      description: "The mail alias for the user.",
    },
    userPrincipleName: {
      type: "string",
      label: "User Principle Name",
      description: "The user principal name (someuser@contoso.com). It's an Internet-style login name for the user based on the Internet standard RFC 822. By convention, this should map to the user's email name. The general format is alias@domain, where domain must be present in the tenant's collection of verified domains. The verified domains for the tenant can be accessed from the verifiedDomains property of [organization](https://learn.microsoft.com/en-us/graph/api/resources/organization?view=graph-rest-1.0). NOTE: This property cannot contain accent characters. Only the following characters are allowed `A - Z`, `a - z`, `0 - 9`, `' . - _ ! # ^ ~.` For the complete list of allowed characters, see [username policies](https://learn.microsoft.com/en-us/azure/active-directory/authentication/concept-sspr-policy#userprincipalname-policies-that-apply-to-all-user-accounts).",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password for the user. This property is required when a user is created. It can be updated, but the user will be required to change the password on the next login. The password must satisfy minimum requirements as specified by the user's passwordPolicies property. By default, a strong password is required.",
    },
    forceChangePasswordNextSignIn: {
      type: "boolean",
      label: "Force Change Password Next Sign In",
      description: "`true` if the user must change her password on the next login; otherwise false.",
      optional: true,
      default: false,
    },
    forceChangePasswordNextSignInWithMfa: {
      type: "boolean",
      label: "Force Change Password Next Sign In With MFA",
      description: "If `true`, at next sign-in, the user must perform a multi-factor authentication (MFA) before being forced to change their password. The behavior is identical to forceChangePasswordNextSignIn except that the user is required to first perform a multi-factor authentication before password change. After a password change, this property will be automatically reset to `false`. If not set, default is `false`.",
      optional: true,
      default: false,
    },
    accountEnabled: {
      type: "boolean",
      label: "Account Enabled",
      description: "`true` if the account is enabled; otherwise, `false`.",
      optional: true,
      default: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ConsistencyLevel: "eventual",
      };
    },
    _makeRequest({
      $ = this,
      path,
      url,
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listGroups(args = {}) {
      return this._makeRequest({
        path: "/groups",
        ...args,
      });
    },
    listGroupMembers({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/members`,
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    createUser(args = {}) {
      return this._makeRequest({
        path: "/users",
        method: "POST",
        ...args,
      });
    },
    updateUser({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `/users/${userId}`,
        method: "PATCH",
        ...args,
      });
    },
    addMemberToGroup({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/members/$ref`,
        method: "POST",
        ...args,
      });
    },
    removeMemberFromGroup({
      groupId, userId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/members/${userId}/$ref`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
