import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/utils.mjs";

export default {
  type: "app",
  app: "clerk",
  propDefinitions: {
    backupCodes: {
      type: "string[]",
      label: "Backup Codes",
      description: "If Backup Codes are configured on the instance, you can provide them to enable it on the newly created user without the need to reset them. You must provide the backup codes in plain format or the corresponding bcrypt digest.",
    },
    createdAt: {
      type: "string",
      label: "Created At",
      description: "A custom date/time denoting when the user signed up to the application, specified in RFC3339 format (e.g. `2012-10-20T07:15:20.902Z`).",
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "The ID of the user as used in your external systems or your previous authentication solution. Must be unique across your instance.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name to assign to the user.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name to assign to the user.",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The plaintext password to give to the user. Must be at least 8 characters long, and can not be in any list of hacked passwords.",
      secret: true,
    },
    primaryEmailAddressId: {
      type: "string",
      label: "Primary Email Address Id",
      description: "The ID of the email address to set as primary. It must be verified, and present on the current user.",
      async options({ userId }) {
        const { email_addresses } = await this.getUser({
          userId,
        });

        return email_addresses.map(({
          id: value, email_address: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    primaryPhoneNumberId: {
      type: "string",
      label: "Primary Phone Number Id",
      description: "The ID of the phone number to set as primary. It must be verified, and present on the current user.",
      async options({ userId }) {
        const { phone_numbers } = await this.getUser({
          userId,
        });

        return phone_numbers.map(({
          id: value, phone_number: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    primaryWeb3WalletId: {
      type: "string",
      label: "Primary Web3 Wallet Id",
      description: "The ID of the web3 wallets to set as primary. It must be verified, and present on the current user.",
      async options({ userId }) {
        const { web3_wallets } = await this.getUser({
          userId,
        });

        return web3_wallets.map(({
          id: value, web3_wallet: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    privateMetadata: {
      type: "object",
      label: "Private Metadata",
      description: "Metadata saved on the user, that is only visible to your Backend API.",
    },
    publicMetadata: {
      type: "object",
      label: "Public Metadata",
      description: "Metadata saved on the user, that is visible to both your Frontend and Backend APIs.",
    },
    skipPasswordChecks: {
      type: "boolean",
      label: "Skip Password Checks",
      description: "When set to `true` all password checks are skipped. It is recommended to use this method only when migrating plaintext passwords to Clerk. Upon migration the user base should be prompted to pick stronger password.",
    },
    totpSecret: {
      type: "string",
      label: "TOTP Secret",
      description: "In case TOTP is configured on the instance, you can provide the secret to enable it on the newly created user without the need to reset it.",
    },
    unsafeMetadata: {
      type: "object",
      label: "Unsafe Metadata",
      description: "Metadata saved on the user, that can be updated from both the Frontend and Backend APIs. `Note: Since this data can be modified from the frontend, it is not guaranteed to be safe.`",
    },
    userId: {
      type: "string",
      label: "User Id",
      description: "The Id of the user.",
      async options({ page }) {
        const data = await this.listUsers({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          id: value, email_addresses: email,
        }) => ({
          label: email[0].email_address,
          value,
        }));
      },
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username to give to the user. It must be unique across your instance.",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.clerk.com/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.secret_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createUser(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "users",
        ...args,
      });
    },
    createUserInvitation(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "invitations",
        ...args,
      });
    },
    deleteUser({
      userId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `users/${userId}`,
        ...args,
      });
    },
    getUser({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `users/${userId}`,
        ...args,
      });
    },
    listUserMemberships({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `users/${userId}/organization_memberships`,
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "users",
        ...args,
      });
    },
    updateUser({
      userId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `users/${userId}`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let length = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const { data } = await fn({
          params,
          ...args,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        length = data.length;

      } while (length);
    },
  },
};
