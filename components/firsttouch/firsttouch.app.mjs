import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

const FLOW_PAGE_SIZE = 100;

export default {
  type: "app",
  app: "firsttouch",
  propDefinitions: {
    flowId: {
      type: "string",
      label: "Flow",
      description: "The FirstTouch flow to add the contact to. Select one from the list, or enter a flow ID, e.g. `flow_plan_4c95d3e90d454ff4a50d0b4734c406e8`.",
      async options({ prevContext }) {
        // A previous page that returned no cursor means every flow is already listed.
        if (prevContext && "cursor" in prevContext && !prevContext.cursor) {
          return {
            options: [],
          };
        }
        const response = await this.listFlows({
          data: {
            limit: FLOW_PAGE_SIZE,
            cursor: prevContext?.cursor || undefined,
            orderBy: "created",
            orderDirection: "descending",
          },
        });
        const options = (response.items || []).map((flow) => ({
          label: flow.name
            ? `${flow.name}${flow.isDraft
              ? " [draft]"
              : ""}`
            : `(untitled draft, created ${String(flow.created || "").slice(0, 10)})`,
          value: flow.id,
        }));
        return {
          options,
          context: {
            cursor: response.hasMore
              ? response.cursor
              : null,
          },
        };
      },
    },
    teammateId: {
      type: "string",
      label: "Teammate",
      description: "A FirstTouch teammate. Select one from the list (it is loaded from your team members), or enter a user ID, e.g. `86632827-b7c3-4533-b2bb-04d6d9bda6cf`.",
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
      description: "Only replies to this teammate's LinkedIn account. Select one from the list, or enter an account ID, e.g. `lin_account_e8ab189f4baa42e6ac38e9830d379c54`. Leave empty for every account you can access.",
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
      description: "The FirstTouch Social Engagement signal to watch. Select one from the list, or enter a signal ID, e.g. `signal_prospect_source_931d05c6627a47f790b39d0d9437ca5f`.",
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
      description: "The contact's first name, e.g. `Jane`",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name, e.g. `Doe`",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address, e.g. `jane@acme.com`",
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
      description: "The teammate whose LinkedIn account sends. Select one from the list (it is loaded from your team members), or enter a user ID, e.g. `86632827-b7c3-4533-b2bb-04d6d9bda6cf`. Leave empty for the owner of the API key.",
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
      description: "Shown to the approver in FirstTouch: why this contact and where they came from, e.g. `Commented on our pricing post; VP Sales at a HubSpot customer`",
      optional: true,
    },
    requireApproval: {
      type: "boolean",
      label: "Require Approval",
      description: "When `true` (the default), the step waits in FirstTouch Tasks until someone approves it. Set to `false` to send without review.",
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
      const linkedInUrl = utils.normalizeProfileUrl(linkedinUrl);
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
