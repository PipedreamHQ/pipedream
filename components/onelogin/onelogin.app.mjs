import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "onelogin",
  propDefinitions: {
    // Required props for creating a new user
    firstname: {
      type: "string",
      label: "First Name",
      description: "User's first name.",
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "User's last name.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "User's email address.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "User's username.",
      optional: true,
    },
    // Optional props for creating/updating a user
    company: {
      type: "string",
      label: "Company",
      description: "Company the user is associated with.",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "Department the user works in.",
      optional: true,
    },
    directoryId: {
      type: "integer",
      label: "Directory ID",
      description: "ID of the directory (e.g., Active Directory, LDAP) from which the user was created.",
      optional: true,
    },
    distinguishedName: {
      type: "string",
      label: "Distinguished Name",
      description: "Synchronized from Active Directory.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "External ID that can be used to uniquely identify the user in another system.",
      optional: true,
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "Group to which the user belongs.",
      async options() {
        const groups = await this.listGroups();
        return groups.map((group) => ({
          label: group.name,
          value: group.id.toString(),
        }));
      },
      optional: true,
    },
    invalidLoginAttempts: {
      type: "integer",
      label: "Invalid Login Attempts",
      description: "Number of sequential invalid login attempts the user has made.",
      optional: true,
    },
    localeCode: {
      type: "string",
      label: "Locale Code",
      description: "Locale code representing a geographical, political, or cultural region.",
      optional: true,
    },
    memberOf: {
      type: "string",
      label: "Member Of",
      description: "Groups the user is a member of.",
      optional: true,
    },
    openidName: {
      type: "string",
      label: "OpenID Name",
      description: "OpenID URL that can be configured in other applications that accept OpenID for sign-in.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "User's phone number.",
      optional: true,
    },
    samaccountname: {
      type: "string",
      label: "SAMAccountName",
      description: "Synchronized from Active Directory.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "User's title.",
      optional: true,
    },
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "Custom attributes for the user.",
      optional: true,
    },
    // Props for updating an existing user
    updateUserId: {
      type: "string",
      label: "User ID",
      description: "Unique ID of the user to update.",
      async options() {
        const users = await this.listUsers();
        return users.map((user) => ({
          label: `${user.firstname} ${user.lastname} (${user.email})`,
          value: user.id.toString(),
        }));
      },
    },
    // Props for revoking user sessions
    revokeUserId: {
      type: "string",
      label: "User ID",
      description: "Unique ID of the user to revoke sessions for.",
      async options() {
        const users = await this.listUsers();
        return users.map((user) => ({
          label: `${user.firstname} ${user.lastname} (${user.email})`,
          value: user.id.toString(),
        }));
      },
    },
    // Props for User Created Event Trigger filters
    filterUserRole: {
      type: "string",
      label: "User Role",
      description: "Filter by user role.",
      async options() {
        const roles = await this.listRoles();
        return roles.map((role) => ({
          label: role.name,
          value: role.id.toString(),
        }));
      },
      optional: true,
    },
    filterGroup: {
      type: "string",
      label: "Group",
      description: "Filter by user group.",
      async options() {
        const groups = await this.listGroups();
        return groups.map((group) => ({
          label: group.name,
          value: group.id.toString(),
        }));
      },
      optional: true,
    },
    // Props for Login Attempt Event Trigger filters
    filterLoginSuccess: {
      type: "boolean",
      label: "Successful Attempts",
      description: "Filter to only include successful login attempts.",
      optional: true,
    },
    filterLoginFailure: {
      type: "boolean",
      label: "Failed Attempts",
      description: "Filter to only include failed login attempts.",
      optional: true,
    },
    // Props for Directory Sync Event Trigger filters
    directoryName: {
      type: "string",
      label: "Directory Name",
      description: "Filter by specific directory name.",
      async options() {
        const directories = await this.listDirectories();
        return directories.map((dir) => ({
          label: dir.name,
          value: dir.id.toString(),
        }));
      },
      optional: true,
    },
    syncStatus: {
      type: "string",
      label: "Sync Status",
      description: "Filter by sync status.",
      options: [
        {
          label: "Success",
          value: "success",
        },
        {
          label: "Failure",
          value: "failure",
        },
        {
          label: "In Progress",
          value: "in_progress",
        },
      ],
      optional: true,
    },
  },
  methods: {
    // Existing method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    // Base URL
    _baseUrl() {
      return "https://api.onelogin.com/api/1";
    },
    // Make Request
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        data,
        params,
        headers = {},
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        data: data,
        params: params,
        headers: {
          ...headers,
          "Authorization": `bearer:${this.$auth.access_token}`,
          "Content-Type": "application/json",
        },
        ...otherOpts,
      });
    },
    // Pagination Logic
    async paginate(fn, ...args) {
      const results = [];
      let page = 1;
      let hasNext = true;
      while (hasNext) {
        const response = await fn({
          page,
          ...args,
        });
        if (Array.isArray(response)) {
          results.push(...response);
          hasNext = false;
        } else {
          results.push(...response);
          hasNext = false;
        }
      }
      return results;
    },
    // List Groups
    async listGroups(opts = {}) {
      return this.paginate(async ({ page }) => {
        const response = await this._makeRequest({
          path: "/groups",
          params: {
            limit: 100,
            page,
            ...opts.params,
          },
        });
        return response;
      }, opts);
    },
    // List Roles
    async listRoles(opts = {}) {
      return this.paginate(async ({ page }) => {
        const response = await this._makeRequest({
          path: "/roles",
          params: {
            limit: 100,
            page,
            ...opts.params,
          },
        });
        return response;
      }, opts);
    },
    // List Users
    async listUsers(opts = {}) {
      return this.paginate(async ({ page }) => {
        const response = await this._makeRequest({
          path: "/users",
          params: {
            limit: 100,
            page,
            ...opts.params,
          },
        });
        return response;
      }, opts);
    },
    // List Directories
    async listDirectories(opts = {}) {
      return this.paginate(async ({ page }) => {
        const response = await this._makeRequest({
          path: "/directories",
          params: {
            limit: 100,
            page,
            ...opts.params,
          },
        });
        return response;
      }, opts);
    },
    // Create User
    async createUser(data, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        data,
        ...opts,
      });
    },
    // Update User
    async updateUser(userId, data, opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/users/${userId}`,
        data,
        ...opts,
      });
    },
    // Revoke User Sessions
    async revokeUserSessions(userId, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/users/${userId}/logout`,
        ...opts,
      });
    },
    // Emit User Created Event
    async emitUserCreatedEvent(filters) {
      // Implementation to emit event based on filters
      // This would typically involve setting up a webhook or listening to API events
    },
    // Emit Login Attempt Event
    async emitLoginAttemptEvent(filters) {
      // Implementation to emit event based on filters
      // This would typically involve setting up a webhook or listening to API events
    },
    // Emit Directory Sync Event
    async emitDirectorySyncEvent(filters) {
      // Implementation to emit event based on filters
      // This would typically involve setting up a webhook or listening to API events
    },
  },
  version: "0.0.ts",
};
