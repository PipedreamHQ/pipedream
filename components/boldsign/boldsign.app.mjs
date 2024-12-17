import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "boldsign",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Required Props
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the BoldSign template to use.",
    },
    // Optional Props
    title: {
      type: "string",
      label: "Title",
      description: "The title of the document.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "A message to include with the document.",
      optional: true,
    },
    roles: {
      type: "string[]",
      label: "Roles",
      description: "Roles assigned to the signers.",
      optional: true,
    },
    brandId: {
      type: "string",
      label: "Brand ID",
      description: "The brand ID for customizing the document.",
      optional: true,
      async options() {
        const brands = await this.listBrands();
        return brands.map((brand) => ({
          label: brand.name,
          value: brand.id,
        }));
      },
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Labels for categorizing documents.",
      optional: true,
    },
    disableEmails: {
      type: "boolean",
      label: "Disable Emails",
      description: "Disable sending emails to recipients.",
      optional: true,
    },
    disableSMS: {
      type: "boolean",
      label: "Disable SMS",
      description: "Disable sending SMS to recipients.",
      optional: true,
    },
    hitDocumentId: {
      type: "string",
      label: "Hit Document ID",
      description: "Hit Document ID.",
      optional: true,
    },
    enableAutoReminder: {
      type: "boolean",
      label: "Enable Auto Reminder",
      description: "Enable automatic reminders.",
      optional: true,
    },
    reminderDays: {
      type: "integer",
      label: "Reminder Days",
      description: "Number of days between reminders.",
      optional: true,
    },
    reminderCount: {
      type: "integer",
      label: "Reminder Count",
      description: "Number of reminder attempts.",
      optional: true,
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "CC recipients for the document.",
      optional: true,
    },
    expiryDays: {
      type: "integer",
      label: "Expiry Days",
      description: "Number of days before document expires.",
      optional: true,
    },
    enablePrintAndSign: {
      type: "boolean",
      label: "Enable Print and Sign",
      description: "Allow signers to print and sign document.",
      optional: true,
    },
    enableReassign: {
      type: "boolean",
      label: "Enable Reassign",
      description: "Allow signers to reassign the document.",
      optional: true,
    },
    enableSigningOrder: {
      type: "boolean",
      label: "Enable Signing Order",
      description: "Enable signing order for the document.",
      optional: true,
    },
    disableExpiryAlert: {
      type: "boolean",
      label: "Disable Expiry Alert",
      description: "Disable alerts before document expiry.",
      optional: true,
    },
    documentInfo: {
      type: "string[]",
      label: "Document Info",
      description: "Custom information fields for the document.",
      optional: true,
    },
    onBehalfOf: {
      type: "string",
      label: "On Behalf Of",
      description: "Send document on behalf of another user.",
      optional: true,
    },
    roleRemovalIndices: {
      type: "integer[]",
      label: "Role Removal Indices",
      description: "Indices of roles to remove from the template.",
      optional: true,
    },
    documentDownloadOption: {
      type: "string",
      label: "Document Download Option",
      description: "Option for document download configuration.",
      optional: true,
    },
    formGroups: {
      type: "string[]",
      label: "Form Groups",
      description: "Groups of form fields in the document.",
      optional: true,
    },
    files: {
      type: "string[]",
      label: "Files",
      description: "Files to include in the document.",
      optional: true,
    },
    fileUrls: {
      type: "string[]",
      label: "File URLs",
      description: "URLs of files to include in the document.",
      optional: true,
    },
    recipientNotificationSettings: {
      type: "string",
      label: "Recipient Notification Settings",
      description: "Settings for recipient notifications.",
      optional: true,
    },
    removeFormfields: {
      type: "boolean",
      label: "Remove Formfields",
      description: "Remove existing form fields from the document.",
      optional: true,
    },
    enableAuditTrailLocalization: {
      type: "boolean",
      label: "Enable Audit Trail Localization",
      description: "Enable localization for audit trails.",
      optional: true,
    },
    // Event Props
    sentBy: {
      type: "string",
      label: "Sent By",
      description: "The sender of the document.",
      optional: true,
      async options() {
        const sentByOptions = await this.listSenderIdentities();
        return sentByOptions.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "Recipients of the document.",
      optional: true,
    },
    searchKey: {
      type: "string",
      label: "Search Key",
      description: "Search key for documents.",
      optional: true,
    },
    brandIds: {
      type: "string[]",
      label: "Brand IDs",
      description: "Brand IDs associated with the document.",
      optional: true,
      async options() {
        const brandIdsOptions = await this.listBrands();
        return brandIdsOptions.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the document.",
      optional: false,
    },
    transmitType: {
      type: "string",
      label: "Transmit Type",
      description: "Type of transmission for the document.",
      optional: false,
    },
  },
  methods: {
    // Log authentication keys
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    // Base URL for BoldSign API
    _baseUrl() {
      return "https://api.boldsign.com/v1";
    },
    // Generic method to make API requests
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
          "X-API-KEY": this.$auth.api_key,
          "Content-Type": "application/json;odata.metadata=minimal;odata.streaming=true",
          "accept": "application/json",
        },
      });
    },
    // Fetch options for 'sentBy' prop
    async listSenderIdentities(opts = {}) {
      return this._makeRequest({
        path: "/sender-identities/list-identities",
        ...opts,
      });
    },
    // Fetch options for 'brandIds' and 'brandId' props
    async listBrands(opts = {}) {
      return this._makeRequest({
        path: "/branding/list-brands",
        ...opts,
      });
    },
    // Method to send document for e-signature using a template
    async sendDocument() {
      const data = {
        template_id: this.templateId,
        title: this.title,
        message: this.message,
        roles: this.roles,
        brandid: this.brandId,
        labels: this.labels,
        disableemails: this.disableEmails,
        disablesms: this.disableSMS,
        hitdocumentid: this.hitDocumentId,
        enableautoreminder: this.enableAutoReminder,
        reminderdays: this.reminderDays,
        remindercount: this.reminderCount,
        cc: this.cc,
        expirydays: this.expiryDays,
        enableprintandsign: this.enablePrintAndSign,
        enablereassign: this.enableReassign,
        enablesigningorder: this.enableSigningOrder,
        disableexpiryalert: this.disableExpiryAlert,
        documentinfo: this.documentInfo,
        onbehalfof: this.onBehalfOf,
        roleremovalindices: this.roleRemovalIndices,
        documentdownloadoption: this.documentDownloadOption,
        formgroups: this.formGroups,
        files: this.files,
        fileurls: this.fileUrls,
        recipientnotificationsettings: this.recipientNotificationSettings,
        removeformfields: this.removeFormfields,
        enableaudittraillocalization: this.enableAuditTrailLocalization,
      };

      // Ensure that at least one of 'files' or 'fileUrls' is provided
      if (!this.files && !this.fileUrls) {
        throw new Error("At least one of 'files' or 'fileUrls' must be provided.");
      }

      // Remove undefined properties
      Object.keys(data).forEach(
        (key) => data[key] === undefined && delete data[key],
      );

      return this._makeRequest({
        method: "POST",
        path: "/template/send",
        data,
        params: {
          templateId: this.templateId,
        },
      });
    },
    // Emit event when document status changes to 'completed'
    async emitDocumentCompleted() {
      if (this.status === "completed") {
        this.$emit("documentCompleted", {
          sentBy: this.sentBy,
          recipients: this.recipients,
          searchKey: this.searchKey,
          labels: this.labels,
          brandIds: this.brandIds,
          status: this.status,
        });
      }
    },
    // Emit event when document is sent
    async emitDocumentSent() {
      if (this.transmitType === "sent") {
        this.$emit("documentSent", {
          sentBy: this.sentBy,
          recipients: this.recipients,
          searchKey: this.searchKey,
          labels: this.labels,
          brandIds: this.brandIds,
          transmitType: this.transmitType,
        });
      }
    },
    // Emit event when document status changes to 'declined'
    async emitDocumentDeclined() {
      if (this.status === "declined") {
        this.$emit("documentDeclined", {
          sentBy: this.sentBy,
          recipients: this.recipients,
          searchKey: this.searchKey,
          labels: this.labels,
          brandIds: this.brandIds,
          status: this.status,
        });
      }
    },
  },
};
