import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendoso",
  propDefinitions: {
    groupId: {
      type: "integer",
      label: "Group",
      description: "The ID of the Group.",
      async options() {
        const data = await this.listGroups();

        return data.map(({ id: value, name: label }) => ({
          label,
          value,
        }));
      },
    },
    recipientUsers: {
      type: "string[]",
      label: "Recipient Users",
      description:
        "The array of gift recipient users. If not provided, links can be redeemed by anyone.",
      async options({ groupId }) {
        const data = await this.listUsers({
          groupId,
        });

        return data.map(({ email }) => email);
      },
    },
    template: {
      type: "integer",
      label: "Template",
      description: "The ID of the Template.",
      async options() {
        const data = await this.listTemplates();
        let result;
        if (typeof data === "string") {
          result = data.replace(/(},)(?!.*\1)/gs, "}");
          result = JSON.parse(result);
        } else {
          result = data;
        }

        return result.custom_template.map(({ id: value, name: label }) => ({
          label,
          value,
        }));
      },
    },
    touchId: {
      type: "integer",
      label: "Touch ID",
      description: "The ID of the Touch.",
      async options({ groupId }) {
        const data = await this.listTouches(groupId);

        return data.map(({ id: value, name: label }) => ({
          label,
          value,
        }));
      },
    },
    trackingId: {
      type: "string",
      label: "Tracking Id",
      description: "The tracking code for the send.",
      async options() {
        const data = await this.listSendGifts();

        return data.map(({ tracking_code: value, touch_name: label }) => ({
          label,
          value,
        }));
      },
    },
    via: {
      type: "string",
      label: "Via",
      description: "Specify you want to generate gift links.",
    },
    viaFrom: {
      type: "string",
      label: "Via From",
      description: "Specify the name of your Company or Application.",
    },
    sendId: {
      type: "string",
      label: "Send ID",
      description: "The ID of the send.",
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact.",
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign.",
    },
    webhookId: {
      type: "string",
      label: "Webhook ID",
      description: "The ID of the webhook.",
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user.",
    },
    reportId: {
      type: "string",
      label: "Report ID",
      description: "The ID of the report.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date for filtering (YYYY-MM-DD format).",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date for filtering (YYYY-MM-DD format).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return.",
      optional: true,
      default: 50,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of results to skip.",
      optional: true,
      default: 0,
    },
  },
  methods: {
    _apiUrl() {
      return "https://app.sendoso.com/api/v3";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({ $ = this, path, ...opts }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };
      return axios($, config);
    },
    createEgiftLinks({ $, ...data }) {
      return this._makeRequest({
        $,
        path: "egift_links",
        method: "POST",
        data,
      });
    },
    getCurrentUser($ = this) {
      return this._makeRequest({
        $,
        path: "me",
      });
    },
    sendGift({ $, ...data }) {
      return this._makeRequest({
        $,
        path: "send.json",
        method: "POST",
        data,
      });
    },
    sendBulkEmail({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "send/bulk_email_addresses",
        method: "POST",
        data,
      });
    },
    getSentGifts() {
      return this._makeRequest({
        path: "sent_gifts.json",
      });
    },
    getSendStatus({ $, trackingId }) {
      return this._makeRequest({
        $,
        path: `gifts/status/${trackingId}`,
      });
    },
    listGroups() {
      return this._makeRequest({
        path: "groups.json",
      });
    },
    listSendGifts() {
      return this._makeRequest({
        path: "sent_gifts.json",
      });
    },
    listTemplates() {
      return this._makeRequest({
        path: "user_custom_templates.json",
      });
    },
    listTouches(groupId) {
      return this._makeRequest({
        path: `groups/${groupId}/group_touches.json`,
      });
    },
    listUsers({
      groupId, ...opts
    }) {
      return this._makeRequest({
        path: `groups/${groupId}/members.json`,
        ...opts,
      });
    },
    // Send Management Methods
    listSends({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "sends",
        params,
      });
    },
    getSend({
      $, sendId,
    }) {
      return this._makeRequest({
        $,
        path: `sends/${sendId}`,
      });
    },
    updateSend({
      $, sendId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `sends/${sendId}`,
        method: "PUT",
        data,
      });
    },
    cancelSend({
      $, sendId,
    }) {
      return this._makeRequest({
        $,
        path: `sends/${sendId}/cancel`,
        method: "POST",
      });
    },
    resendGift({
      $, sendId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `sends/${sendId}/resend`,
        method: "POST",
        data,
      });
    },
    // Touch Management Methods
    createTouch({
      $, groupId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `groups/${groupId}/touches`,
        method: "POST",
        data,
      });
    },
    getTouch({
      $, touchId,
    }) {
      return this._makeRequest({
        $,
        path: `touches/${touchId}`,
      });
    },
    updateTouch({
      $, touchId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `touches/${touchId}`,
        method: "PUT",
        data,
      });
    },
    deleteTouch({
      $, touchId,
    }) {
      return this._makeRequest({
        $,
        path: `touches/${touchId}`,
        method: "DELETE",
      });
    },
    duplicateTouch({
      $, touchId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `touches/${touchId}/duplicate`,
        method: "POST",
        data,
      });
    },
    // Contact Management Methods
    listContacts({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "contacts",
        params,
      });
    },
    createContact({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "contacts",
        method: "POST",
        data,
      });
    },
    getContact({
      $, contactId,
    }) {
      return this._makeRequest({
        $,
        path: `contacts/${contactId}`,
      });
    },
    updateContact({
      $, contactId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `contacts/${contactId}`,
        method: "PUT",
        data,
      });
    },
    deleteContact({
      $, contactId,
    }) {
      return this._makeRequest({
        $,
        path: `contacts/${contactId}`,
        method: "DELETE",
      });
    },
    searchContacts({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "contacts/search",
        params,
      });
    },
    importContacts({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "contacts/import",
        method: "POST",
        data,
      });
    },
    exportContacts({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "contacts/export",
        params,
      });
    },
    // Group Management Methods
    createGroup({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "groups",
        method: "POST",
        data,
      });
    },
    getGroup({
      $, groupId,
    }) {
      return this._makeRequest({
        $,
        path: `groups/${groupId}`,
      });
    },
    updateGroup({
      $, groupId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `groups/${groupId}`,
        method: "PUT",
        data,
      });
    },
    deleteGroup({
      $, groupId,
    }) {
      return this._makeRequest({
        $,
        path: `groups/${groupId}`,
        method: "DELETE",
      });
    },
    addGroupMembers({
      $, groupId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `groups/${groupId}/members`,
        method: "POST",
        data,
      });
    },
    removeGroupMember({
      $, groupId, memberId,
    }) {
      return this._makeRequest({
        $,
        path: `groups/${groupId}/members/${memberId}`,
        method: "DELETE",
      });
    },
    // Template Management Methods
    createTemplate({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "templates",
        method: "POST",
        data,
      });
    },
    getTemplate({
      $, templateId,
    }) {
      return this._makeRequest({
        $,
        path: `templates/${templateId}`,
      });
    },
    updateTemplate({
      $, templateId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `templates/${templateId}`,
        method: "PUT",
        data,
      });
    },
    deleteTemplate({
      $, templateId,
    }) {
      return this._makeRequest({
        $,
        path: `templates/${templateId}`,
        method: "DELETE",
      });
    },
    duplicateTemplate({
      $, templateId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `templates/${templateId}/duplicate`,
        method: "POST",
        data,
      });
    },
    // Campaign Management Methods
    listCampaigns({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "campaigns",
        params,
      });
    },
    createCampaign({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "campaigns",
        method: "POST",
        data,
      });
    },
    getCampaign({
      $, campaignId,
    }) {
      return this._makeRequest({
        $,
        path: `campaigns/${campaignId}`,
      });
    },
    updateCampaign({
      $, campaignId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `campaigns/${campaignId}`,
        method: "PUT",
        data,
      });
    },
    deleteCampaign({
      $, campaignId,
    }) {
      return this._makeRequest({
        $,
        path: `campaigns/${campaignId}`,
        method: "DELETE",
      });
    },
    launchCampaign({
      $, campaignId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `campaigns/${campaignId}/launch`,
        method: "POST",
        data,
      });
    },
    pauseCampaign({
      $, campaignId,
    }) {
      return this._makeRequest({
        $,
        path: `campaigns/${campaignId}/pause`,
        method: "POST",
      });
    },
    getCampaignStats({
      $, campaignId, params,
    }) {
      return this._makeRequest({
        $,
        path: `campaigns/${campaignId}/stats`,
        params,
      });
    },
    // Webhook Management Methods
    listWebhooks({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "webhooks",
        params,
      });
    },
    createWebhook({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "webhooks",
        method: "POST",
        data,
      });
    },
    getWebhook({
      $, webhookId,
    }) {
      return this._makeRequest({
        $,
        path: `webhooks/${webhookId}`,
      });
    },
    updateWebhook({
      $, webhookId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `webhooks/${webhookId}`,
        method: "PUT",
        data,
      });
    },
    deleteWebhook({
      $, webhookId,
    }) {
      return this._makeRequest({
        $,
        path: `webhooks/${webhookId}`,
        method: "DELETE",
      });
    },
    testWebhook({
      $, webhookId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `webhooks/${webhookId}/test`,
        method: "POST",
        data,
      });
    },
    // Analytics & Reporting Methods
    getSendAnalytics({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "analytics/sends",
        params,
      });
    },
    getCampaignAnalytics({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "analytics/campaigns",
        params,
      });
    },
    getTouchAnalytics({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "analytics/touches",
        params,
      });
    },
    getUserAnalytics({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "analytics/users",
        params,
      });
    },
    getEngagementMetrics({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "analytics/engagement",
        params,
      });
    },
    getROIMetrics({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "analytics/roi",
        params,
      });
    },
    listReports({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "reports",
        params,
      });
    },
    generateCustomReport({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "reports",
        method: "POST",
        data,
      });
    },
    getReport({
      $, reportId,
    }) {
      return this._makeRequest({
        $,
        path: `reports/${reportId}`,
      });
    },
    exportAnalyticsReport({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "reports/export",
        method: "POST",
        data,
      });
    },
    // Address Management Methods
    validateAddress({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "addresses/validate",
        method: "POST",
        data,
      });
    },
    confirmAddress({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "addresses/confirm",
        method: "POST",
        data,
      });
    },
    suggestAddresses({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "addresses/suggest",
        method: "POST",
        data,
      });
    },
    // Catalog Management Methods
    listCatalogItems({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "catalog/items",
        params,
      });
    },
    getCatalogItem({
      $, itemId,
    }) {
      return this._makeRequest({
        $,
        path: `catalog/items/${itemId}`,
      });
    },
    searchCatalog({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "catalog/search",
        params,
      });
    },
    listCatalogCategories({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "catalog/categories",
        params,
      });
    },
    // eGift Management Methods
    listEgiftLinks({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "egift_links",
        params,
      });
    },
    getEgiftLink({
      $, linkId,
    }) {
      return this._makeRequest({
        $,
        path: `egift_links/${linkId}`,
      });
    },
    deleteEgiftLink({
      $, linkId,
    }) {
      return this._makeRequest({
        $,
        path: `egift_links/${linkId}`,
        method: "DELETE",
      });
    },
    resendEgiftLink({
      $, linkId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `egift_links/${linkId}/resend`,
        method: "POST",
        data,
      });
    },
    // User Management Methods
    listAllUsers({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "users",
        params,
      });
    },
    getUser({
      $, userId,
    }) {
      return this._makeRequest({
        $,
        path: `users/${userId}`,
      });
    },
    updateUserPreferences({
      $, userId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `users/${userId}/preferences`,
        method: "PUT",
        data,
      });
    },
    getUserPermissions({
      $, userId,
    }) {
      return this._makeRequest({
        $,
        path: `users/${userId}/permissions`,
      });
    },
    // Integration Management Methods
    listIntegrations({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "integrations",
        params,
      });
    },
    getIntegrationStatus({
      $, integrationId,
    }) {
      return this._makeRequest({
        $,
        path: `integrations/${integrationId}/status`,
      });
    },
    // Recipient Management Methods
    listRecipients({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "recipients",
        params,
      });
    },
    getRecipient({
      $, recipientId,
    }) {
      return this._makeRequest({
        $,
        path: `recipients/${recipientId}`,
      });
    },
  },
};
