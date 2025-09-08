import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "snipe_it",
  propDefinitions: {
    modelId: {
      type: "integer",
      label: "Model",
      description: "Select the model for this asset",
      async options({ page }) {
        const { rows } = await this.listModels({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return rows?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    statusId: {
      type: "integer",
      label: "Status",
      description: "Select the status label for this asset",
      async options({ page }) {
        const { rows } = await this.listStatusLabels({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return rows?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    assetTag: {
      type: "string",
      label: "Asset Tag",
      description: "The asset tag for the asset",
      optional: true,
    },
    name: {
      type: "string",
      label: "Asset Name",
      description: "The name of the asset",
      optional: true,
    },
    image: {
      type: "string",
      label: "Image",
      description: "Base64 encoded image. Eg. `data:@[mime];base64,[base64encodeddata]`.",
      optional: true,
    },
    serial: {
      type: "string",
      label: "Serial Number",
      description: "The serial number of the asset",
      optional: true,
    },
    purchaseDate: {
      type: "string",
      label: "Purchase Date",
      description: "The purchase date of the asset (YYYY-MM-DD format)",
      optional: true,
    },
    purchaseCost: {
      type: "string",
      label: "Purchase Cost",
      description: "The purchase cost of the asset",
      optional: true,
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "The order number of the asset",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the asset",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Whether the asset is archived",
      optional: true,
    },
    warrantyMonths: {
      type: "integer",
      label: "Warranty Months",
      description: "The warranty period in months",
      optional: true,
    },
    depreciate: {
      type: "boolean",
      label: "Depreciate",
      description: "Whether the asset is depreciated",
      optional: true,
    },
    supplierId: {
      type: "integer",
      label: "Supplier",
      description: "Select the supplier for this asset",
      optional: true,
      async options({ page }) {
        const { rows } = await this.listSuppliers({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return rows?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    requestable: {
      type: "boolean",
      label: "Requestable",
      description: "Whether this asset can be requested by users",
      optional: true,
    },
    lastAuditDate: {
      type: "string",
      label: "Last Audit Date",
      description: "The date of the last audit for this asset (YYYY-MM-DD format)",
      optional: true,
    },
    locationId: {
      type: "integer",
      label: "Location",
      description: "Select the location where this asset is located",
      optional: true,
      async options({ page }) {
        const { rows } = await this.listLocations({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return rows?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    byod: {
      type: "boolean",
      label: "BYOD",
      description: "Whether this asset is a BYOD device.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields for the asset",
      optional: true,
    },
    hardwareId: {
      type: "integer",
      label: "Hardware Asset",
      description: "Select the hardware asset to retrieve details for",
      async options({ page }) {
        const { rows } = await this.listHardware({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return rows?.map(({
          id: value, name, asset_tag: assetTag,
        }) => ({
          label: name
            ? `${name} (${assetTag || `ID: ${value}`})`
            : assetTag || `Asset ID: ${value}`,
          value,
        })) || [];
      },
    },
    userId: {
      type: "integer",
      label: "User",
      description: "Select the user to retrieve assigned assets for",
      async options({ page }) {
        const { rows } = await this.listUsers({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return rows?.map(({
          id: value, name, username, email,
        }) => ({
          label: name
            ? `${name} (${email || username})`
            : email || username || `User ID: ${value}`,
          value,
        })) || [];
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username for the user (required for login)",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password for the user account",
      secret: true,
    },
    passwordConfirmation: {
      type: "string",
      label: "Password Confirmation",
      description: "The password confirmation for the user account",
      secret: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user",
      optional: true,
    },
    activated: {
      type: "boolean",
      label: "Activated",
      description: "Whether the user account is activated",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the user",
      optional: true,
    },
    jobtitle: {
      type: "string",
      label: "Job Title",
      description: "The job title of the user",
      optional: true,
    },
    managerId: {
      type: "integer",
      label: "Manager",
      description: "Select the manager for this user",
      optional: true,
      async options({ page }) {
        const { rows } = await this.listUsers({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return rows?.map(({
          id: value, name, username, email,
        }) => ({
          label: name
            ? `${name} (${email || username})`
            : email || username || `User ID: ${value}`,
          value,
        })) || [];
      },
    },
    employeeNum: {
      type: "string",
      label: "Employee Number",
      description: "The employee number of the user",
      optional: true,
    },
    companyId: {
      type: "integer",
      label: "Company",
      description: "Select the company for this user",
      optional: true,
      async options({ page }) {
        const { rows } = await this.listCompanies({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return rows?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    twoFactorEnrolled: {
      type: "boolean",
      label: "Two Factor Enrolled",
      description: "Whether the user is enrolled in two-factor authentication",
      optional: true,
    },
    twoFactorOptIn: {
      type: "boolean",
      label: "Two Factor Opt In",
      description: "Whether the user has opted in to two-factor authentication",
      optional: true,
    },
    departmentId: {
      type: "integer",
      label: "Department",
      description: "Select the department for this user",
      optional: true,
      async options({ page }) {
        const { rows } = await this.listDepartments({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return rows?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    remote: {
      type: "boolean",
      label: "Remote",
      description: "Whether or not the user is a remote worker",
      optional: true,
    },
    groupIds: {
      type: "string[]",
      label: "Groups",
      description: "Select the groups for this user",
      optional: true,
      async options({ page }) {
        const { rows } = await this.listGroups({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return rows?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    autoAssignLicenses: {
      type: "boolean",
      label: "Auto Assign Licenses",
      description: "Whether to automatically assign licenses to the user",
      optional: true,
    },
    vip: {
      type: "boolean",
      label: "VIP",
      description: "Whether this user is a VIP",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The user's start date (YYYY-MM-DD format)",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The user's end date (YYYY-MM-DD format)",
      optional: true,
    },
    licenseId: {
      type: "integer",
      label: "License",
      description: "Select the license to retrieve details for",
      async options({ page }) {
        const { rows } = await this.listLicenses({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return rows?.map(({
          id: value, name, product_key: productKey, manufacturer,
        }) => ({
          label: name
            ? `${name} ${productKey
              ? `(${productKey})`
              : ""} - ${manufacturer?.name || "No manufacturer"}`
            : productKey || `License ID: ${value}`,
          value,
        })) || [];
      },
    },
    lastCheckout: {
      type: "string",
      label: "Last Checkout",
      description: "The last checkout date of the asset (YYYY-MM-DD format)",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${this.$auth.api_url}/api/v1${path}`;
    },
    getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    async makeRequest({
      $ = this, path, ...args
    } = {}) {
      const response = await axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(),
        ...args,
      });

      if (response.status === "error") {
        throw JSON.stringify(response, null, 2);
      }

      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        ...args,
        method: "POST",
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        ...args,
        method: "PATCH",
      });
    },
    createHardware(args = {}) {
      return this.post({
        path: "/hardware",
        ...args,
      });
    },
    getHardware({
      hardwareId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/hardware/${hardwareId}`,
        ...args,
      });
    },
    updateHardware({
      hardwareId, ...args
    } = {}) {
      return this.patch({
        path: `/hardware/${hardwareId}`,
        ...args,
      });
    },
    listHardware(args = {}) {
      return this.makeRequest({
        path: "/hardware",
        ...args,
      });
    },
    listModels(args = {}) {
      return this.makeRequest({
        path: "/models",
        ...args,
      });
    },
    listStatusLabels(args = {}) {
      return this.makeRequest({
        path: "/statuslabels",
        ...args,
      });
    },
    listSuppliers(args = {}) {
      return this.makeRequest({
        path: "/suppliers",
        ...args,
      });
    },
    listLocations(args = {}) {
      return this.makeRequest({
        path: "/locations",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this.makeRequest({
        path: "/users",
        ...args,
      });
    },
    getUserAssets({
      userId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/users/${userId}/assets`,
        ...args,
      });
    },
    createUser(args = {}) {
      return this.post({
        path: "/users",
        ...args,
      });
    },
    listDepartments(args = {}) {
      return this.makeRequest({
        path: "/departments",
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this.makeRequest({
        path: "/companies",
        ...args,
      });
    },
    listGroups(args = {}) {
      return this.makeRequest({
        path: "/groups",
        ...args,
      });
    },
    listLicenses(args = {}) {
      return this.makeRequest({
        path: "/licenses",
        ...args,
      });
    },
    getLicense({
      licenseId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/licenses/${licenseId}`,
        ...args,
      });
    },
  },
};
