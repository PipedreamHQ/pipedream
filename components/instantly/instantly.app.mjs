import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "instantly",
  version: "0.0.{{ts}}",
  propDefinitions: {
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Type of event to emit",
      options: [
        {
          label: "Email Sent",
          value: "email_sent",
        },
        {
          label: "Email Bounced",
          value: "email_bounced",
        },
        {
          label: "Email Opened",
          value: "email_opened",
        },
        {
          label: "Email Link Clicked",
          value: "email_link_clicked",
        },
        {
          label: "Reply Received",
          value: "reply_received",
        },
        {
          label: "Lead Unsubscribed",
          value: "lead_unsubscribed",
        },
        {
          label: "Campaign Completed",
          value: "campaign_completed",
        },
        {
          label: "Account Error",
          value: "account_error",
        },
        {
          label: "Lead Not Interested",
          value: "lead_not_interested",
        },
        {
          label: "Lead Neutral",
          value: "lead_neutral",
        },
        {
          label: "Lead Meeting Booked",
          value: "lead_meeting_booked",
        },
        {
          label: "Lead Meeting Completed",
          value: "lead_meeting_completed",
        },
        {
          label: "Lead Closed",
          value: "lead_closed",
        },
        {
          label: "Lead Out of Office",
          value: "lead_out_of_office",
        },
        {
          label: "Lead Wrong Person",
          value: "lead_wrong_person",
        },
      ],
    },
    campaign: {
      type: "string",
      label: "Campaign",
      description: "Select a campaign",
      async options() {
        const campaigns = await this.listCampaigns();
        return campaigns.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        }));
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign",
      async options() {
        const campaigns = await this.listCampaigns();
        return campaigns.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "List of tags to add",
    },
    leads: {
      type: "string[]",
      label: "Leads",
      description: "List of leads to add to the campaign, as JSON strings",
    },
    skipIfInWorkspace: {
      type: "boolean",
      label: "Skip if in Workspace",
      description: "Skip lead if it exists in any campaigns in the workspace",
      optional: true,
    },
    skipIfInCampaign: {
      type: "boolean",
      label: "Skip if in Campaign",
      description: "Skip lead if it exists in the campaign",
      optional: true,
    },
    email: {
      type: "string",
      label: "Lead Email",
      description: "Email address of the lead",
    },
    newStatus: {
      type: "string",
      label: "New Status",
      description: "New status to assign to the lead",
      options: [
        {
          label: "Active",
          value: "Active",
        },
        {
          label: "Completed",
          value: "Completed",
        },
        {
          label: "Unsubscribed",
          value: "Unsubscribed",
        },
        {
          label: "Interested",
          value: "Interested",
        },
        {
          label: "Meeting Booked",
          value: "Meeting Booked",
        },
        {
          label: "Meeting Completed",
          value: "Meeting Completed",
        },
        {
          label: "Closed",
          value: "Closed",
        },
        {
          label: "Out of Office",
          value: "Out of Office",
        },
        {
          label: "Not Interested",
          value: "Not Interested",
        },
        {
          label: "Wrong Person",
          value: "Wrong Person",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.instantly.ai/api/v1";
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
    async listCampaigns(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/campaign/list",
        params: {
          api_key: this.$auth.api_key,
          skip: 0,
          limit: 0,
          ...opts.params,
        },
        ...opts,
      });
    },
    async addTagsToCampaign(opts = {}) {
      const {
        campaignId, tags,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/tags/assign-or-unassign-a-tag",
        data: {
          api_key: this.$auth.api_key,
          campaign_id: campaignId,
          resource_type: 2,
          resource_ids: [
            campaignId,
          ],
          labels: tags,
        },
        ...opts,
      });
    },
    async addLeadsToCampaign(opts = {}) {
      const {
        leads, campaignId, skipIfInWorkspace = true, skipIfInCampaign = true,
      } = opts;
      const leadsData = leads.map((lead) => JSON.parse(lead));
      return this._makeRequest({
        method: "POST",
        path: "/lead/add",
        data: {
          api_key: this.$auth.api_key,
          campaign_id: campaignId,
          leads: leadsData,
          skip_if_in_workspace: skipIfInWorkspace,
          skip_if_in_campaign: skipIfInCampaign,
        },
        ...opts,
      });
    },
    async updateLeadStatus(opts = {}) {
      const {
        email, newStatus, campaignId,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/lead/update-lead-status",
        data: {
          api_key: this.$auth.api_key,
          email: email,
          new_status: newStatus,
          campaign_id: campaignId,
        },
        ...opts,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
