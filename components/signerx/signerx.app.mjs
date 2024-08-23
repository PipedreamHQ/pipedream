import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "signerx",
  propDefinitions: {
    packageId: {
      type: "string",
      label: "Package ID",
      description: "The ID of the package",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the recipient",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the recipient",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the recipient",
    },
    file: {
      type: "string",
      label: "File",
      description: "The file to upload",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the package/document",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.signerx.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async addRecipientToTemplate({
      packageId, email, firstName, lastName,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/packages/${packageId}/recipients`,
        data: {
          email,
          first_name: firstName,
          last_name: lastName,
        },
      });
    },
    async createDraftPackage({
      file, name,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/packages",
        data: {
          file,
          name,
        },
      });
    },
    async getPackagesByStatus(statusIds) {
      return this._makeRequest({
        method: "GET",
        path: "/packages",
        params: {
          status_ids: statusIds,
        },
      });
    },
    async emitNewPackageEvents(statusIds, eventName) {
      const packages = await this.getPackagesByStatus(statusIds);
      for (const pkg of packages) {
        this.$emit(pkg, {
          summary: `New package with status ${statusIds}`,
          id: pkg.id,
          ts: Date.now(),
          name: eventName,
        });
      }
    },
    async emitPublishedPackages() {
      return this.emitNewPackageEvents("published", "New Published Package");
    },
    async emitSignedPackages() {
      return this.emitNewPackageEvents("complete", "New Signed Package");
    },
    async emitNewlyCreatedPackages() {
      return this.emitNewPackageEvents("draft", "Newly Created Package");
    },
  },
};
