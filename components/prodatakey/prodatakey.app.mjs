import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "prodatakey",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      async options() {
        const organizations = await this.listOrganizations();
        return organizations.map((org) => ({
          label: org.name,
          value: org.id,
        }));
      },
    },
    dealerId: {
      type: "string",
      label: "Dealer ID",
      async options() {
        const dealers = await this.listDealers();
        return dealers.map((dealer) => ({
          label: dealer.name,
          value: dealer.id,
        }));
      },
    },
    credentialId: {
      type: "string",
      label: "Credential ID",
      async options({
        systemId, holderId,
      }) {
        const credentials = await this.listCredentials({
          systemId,
          holderId,
        });
        return credentials.map((credential) => ({
          label: credential.id,
          value: credential.id,
        }));
      },
    },
    systemId: {
      type: "string",
      label: "System ID",
    },
    holderId: {
      type: "string",
      label: "Holder ID",
    },
    name: {
      type: "string",
      label: "Name",
    },
    url: {
      type: "string",
      label: "URL",
    },
    scope: {
      type: "string",
      label: "Scope",
    },
    authenticationType: {
      type: "string",
      label: "Authentication Type",
    },
    events: {
      type: "string[]",
      label: "Events",
      optional: true,
    },
    authenticationUser: {
      type: "string",
      label: "Authentication User",
      optional: true,
    },
    authenticationPassword: {
      type: "string",
      label: "Authentication Password",
      optional: true,
    },
    secret: {
      type: "string",
      label: "Secret",
      optional: true,
    },
    useBluetoothCredentials: {
      type: "boolean",
      label: "Use Bluetooth Credentials",
      optional: true,
    },
    useTouchMobileApp: {
      type: "boolean",
      label: "Use Touch Mobile App",
      optional: true,
    },
    allowCredentialResets: {
      type: "boolean",
      label: "Allow Credential Resets",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://accounts.pdk.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listOrganizations(opts = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...opts,
      });
    },
    async listDealers(opts = {}) {
      return this._makeRequest({
        path: "/dealers",
        ...opts,
      });
    },
    async listCredentials(opts = {}) {
      const {
        systemId, holderId,
      } = opts;
      return this._makeRequest({
        path: `/systems/${systemId}/holders/${holderId}/credentials`,
      });
    },
    async createCustomer({
      dealerId, name, useBluetoothCredentials, useTouchMobileApp, allowCredentialResets, type,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/organizations/${dealerId}/children`,
        data: {
          name,
          useBluetoothCredentials,
          useTouchMobileApp,
          allowCredentialResets,
          type,
        },
      });
    },
    async retrieveOrganization({ organizationId }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}`,
      });
    },
    async retrieveCredential({
      systemId, holderId, credentialId,
    }) {
      return this._makeRequest({
        path: `/systems/${systemId}/holders/${holderId}/credentials/${credentialId}`,
      });
    },
    async emitEventCloudNodeConnected({
      organizationId, name, url, scope, authenticationType, authenticationUser, authenticationPassword, secret,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/events",
        data: {
          event_type: "cloudnode.connected",
          organization_id: organizationId,
          name,
          url,
          scope,
          authentication_type: authenticationType,
          authentication_user: authenticationUser,
          authentication_password: authenticationPassword,
          secret,
        },
      });
    },
    async emitEvent({
      organizationId, name, url, scope, authenticationType, events, authenticationUser, authenticationPassword, secret,
    }) {
      const eventPromises = events.map((event) => this._makeRequest({
        method: "POST",
        path: "/events",
        data: {
          event_type: event,
          organization_id: organizationId,
          name,
          url,
          scope,
          authentication_type: authenticationType,
          authentication_user: authenticationUser,
          authentication_password: authenticationPassword,
          secret,
        },
      }));
      return Promise.all(eventPromises);
    },
  },
};
