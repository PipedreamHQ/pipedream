import { axios } from "@pipedream/platform";

const PROFILE_PATTERN = /^(?:https?:\/\/)?(?:[a-z]{2,3}\.)?(?:www\.)?linkedin\.com\/in\/([^/?#\s]+)/i;

export default {
  type: "app",
  app: "firsttouch",
  propDefinitions: {
    flowId: {
      type: "string",
      label: "Flow",
      description: "The FirstTouch flow to add the contact to",
      async options() {
        const flows = await this.listAllFlows();
        return flows.map((flow) => ({
          label: flow.name
            ? `${flow.name}${flow.isDraft
              ? " [draft]"
              : ""}`
            : `(untitled draft, created ${String(flow.created || "").slice(0, 10)})`,
          value: flow.id,
        }));
      },
    },
    teammateId: {
      type: "string",
      label: "Teammate",
      description: "A FirstTouch teammate",
      optional: true,
      async options() {
        const { items = [] } = await this.listTeamMembers();
        return items.map((member) => ({
          label: `${member.name || member.email} (${member.email})`,
          value: member.userId,
        }));
      },
    },
    linkedinAccountId: {
      type: "string",
      label: "LinkedIn Account",
      description: "Only replies to this teammate's LinkedIn account. Leave empty for every account you can access.",
      optional: true,
      async options() {
        const { items = [] } = await this.listTeamMembers({
          data: {
            isLinkedinConnected: true,
          },
        });
        return items
          .filter((member) => member.linkedinAccount?.id)
          .map((member) => ({
            label: `${member.linkedinAccount.fullName || member.name} (${member.email})`,
            value: member.linkedinAccount.id,
          }));
      },
    },
    signalId: {
      type: "string",
      label: "Signal",
      description: "The FirstTouch Social Engagement signal to watch",
      async options() {
        const { signals = [] } = await this.listSignals();
        return signals.map((signal) => ({
          label: signal.name,
          value: signal.id,
        }));
      },
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn Profile URL",
      description: "The contact's LinkedIn profile URL, e.g. `https://www.linkedin.com/in/jane-doe`",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address",
      optional: true,
    },
    companyDomain: {
      type: "string",
      label: "Company Domain",
      description: "The contact's company domain, e.g. `acme.com`",
      optional: true,
    },
    senderId: {
      type: "string",
      label: "Send From",
      description: "The teammate whose LinkedIn account sends. Leave empty for the owner of the API key.",
      optional: true,
      async options() {
        const { items = [] } = await this.listTeamMembers();
        return items.map((member) => ({
          label: `${member.name || member.email} (${member.email})`,
          value: member.userId,
        }));
      },
    },
    reason: {
      type: "string",
      label: "Reason / Context",
      description: "Shown to the approver in FirstTouch: why this contact and where they came from",
      optional: true,
    },
    requireApproval: {
      type: "boolean",
      label: "Require Approval",
      description: "When true, the step waits in FirstTouch Tasks until someone approves it",
      optional: true,
      default: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://gateway.firsttouch.ai/api/public/tools";
    },
    _makeRequest({
      $ = this, tool, data = {}, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: `${this._baseUrl()}/${tool}`,
        headers: {
          "X-API-Key": this.$auth.api_key,
          "Content-Type": "application/json",
        },
        data,
        ...opts,
      });
    },
    normalizeProfileUrl(raw) {
      const value = String(raw ?? "").trim();
      const match = value.match(PROFILE_PATTERN);
      if (!match) {
        throw new Error(`"${value || "(blank)"}" is not a LinkedIn profile URL for a person. Use a URL like https://www.linkedin.com/in/jane-doe (company pages and post links do not work).`);
      }
      return `https://www.linkedin.com/in/${match[1]}`;
    },
    getCurrentUser(opts = {}) {
      return this._makeRequest({
        tool: "get_current_user",
        ...opts,
      });
    },
    listFlows(opts = {}) {
      return this._makeRequest({
        tool: "list_flow_plans",
        ...opts,
      });
    },
    async listAllFlows({ maxPages = 5 } = {}) {
      const flows = [];
      let cursor;
      for (let page = 0; page < maxPages; page++) {
        const response = await this.listFlows({
          data: {
            limit: 100,
            cursor,
            orderBy: "created",
            orderDirection: "descending",
          },
        });
        flows.push(...(response.items || []));
        if (!response.hasMore || !response.cursor) break;
        cursor = response.cursor;
      }
      const rank = (flow) => (flow.name
        ? 0
        : 2) + (flow.isDraft
        ? 1
        : 0);
      return flows.map((flow, index) => ({
        flow,
        index,
      }))
        .sort((a, b) => rank(a.flow) - rank(b.flow) || a.index - b.index)
        .map(({ flow }) => flow);
    },
    listTeamMembers(opts = {}) {
      return this._makeRequest({
        tool: "list_team_members",
        ...opts,
      });
    },
    listSignals(opts = {}) {
      return this._makeRequest({
        tool: "list_social_engagement_signals",
        ...opts,
      });
    },
    listTeamConnections(opts = {}) {
      return this._makeRequest({
        tool: "list_linkedin_team_connections",
        ...opts,
      });
    },
    listConversations(opts = {}) {
      return this._makeRequest({
        tool: "list_linkedin_unibox_conversations",
        ...opts,
      });
    },
    listEngagers(opts = {}) {
      return this._makeRequest({
        tool: "list_social_engagement_engagers",
        ...opts,
      });
    },
    addManualFlowEnrollment(opts = {}) {
      return this._makeRequest({
        tool: "add_manual_flow_enrollment",
        ...opts,
      });
    },
    createContactSequence(opts = {}) {
      return this._makeRequest({
        tool: "create_contact_sequence",
        ...opts,
      });
    },
    async startLinkedinStep({
      $, actionType, label, linkedinUrl, firstName, lastName, senderId,
      email, companyDomain, reason, requireApproval, extra = {},
    }) {
      const linkedInUrl = this.normalizeProfileUrl(linkedinUrl);
      const first = String(firstName ?? "").trim();
      const last = String(lastName ?? "").trim();
      if (!first || !last) {
        throw new Error("FirstTouch needs the contact's First Name and Last Name to start this step.");
      }
      return this.createContactSequence({
        $,
        data: {
          action: {
            type: actionType,
            assignedUserId: senderId || undefined,
            isHumanApprovalRequired: requireApproval !== false,
            ...extra,
          },
          contact: {
            firstName: first,
            lastName: last,
            email: email || undefined,
            linkedInUrl,
          },
          company: {
            domain: companyDomain || undefined,
          },
          sourceDescription: reason || `${label} from Pipedream`,
        },
      });
    },
  },
};
