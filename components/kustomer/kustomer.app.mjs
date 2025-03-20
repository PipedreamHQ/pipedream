import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kustomer",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Required Props
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Unique identifier for the customer",
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "Unique identifier for the conversation",
    },
    // Optional Props for Conversation Creation
    externalId: {
      type: "string",
      label: "External ID",
      description: "External identifier",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the resource",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the conversation",
      optional: true,
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "Priority level (1-5)",
      optional: true,
      min: 1,
      max: 5,
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Direction of the conversation",
      optional: true,
    },
    replyChannel: {
      type: "string",
      label: "Reply Channel",
      description: "Channel to reply to",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the resource",
      optional: true,
      async options() {
        const tags = await this.listTags();
        return tags.map((tag) => ({
          label: tag.name,
          value: tag.id,
        }));
      },
    },
    assignedTeams: {
      type: "string[]",
      label: "Assigned Teams",
      description: "Teams assigned to the resource",
      optional: true,
      async options() {
        const teams = await this.listAssignedTeams();
        return teams.map((team) => ({
          label: team.name,
          value: team.id,
        }));
      },
    },
    suggestedTags: {
      type: "string[]",
      label: "Suggested Tags",
      description: "Suggested tags for the resource",
      optional: true,
    },
    sentiment: {
      type: "string",
      label: "Sentiment",
      description: "Sentiment associated with the conversation",
      optional: true,
    },
    suggestedShortcuts: {
      type: "string[]",
      label: "Suggested Shortcuts",
      description: "Suggested shortcuts for the conversation",
      optional: true,
    },
    subStatus: {
      type: "string",
      label: "Sub Status",
      description: "Sub-status of the conversation",
      optional: true,
    },
    snooze: {
      type: "object",
      label: "Snooze",
      description: "Snooze status",
      optional: true,
    },
    deleted: {
      type: "boolean",
      label: "Deleted",
      description: "Whether the conversation is deleted",
      optional: true,
    },
    ended: {
      type: "boolean",
      label: "Ended",
      description: "Whether the conversation has ended",
      optional: true,
    },
    endedAt: {
      type: "string",
      label: "Ended At",
      description: "Datetime when the conversation ended",
      optional: true,
    },
    endedReason: {
      type: "string",
      label: "Ended Reason",
      description: "Reason why the conversation ended",
      optional: true,
    },
    endedBy: {
      type: "string",
      label: "Ended By",
      description: "Identifier of who ended the conversation",
      optional: true,
    },
    endedByType: {
      type: "string",
      label: "Ended By Type",
      description: "Type of entity that ended the conversation",
      optional: true,
    },
    locked: {
      type: "boolean",
      label: "Locked",
      description: "Whether the conversation is locked",
      optional: true,
    },
    rev: {
      type: "integer",
      label: "Revision",
      description: "Revision number",
      optional: true,
    },
    defaultLang: {
      type: "string",
      label: "Default Language",
      description: "Default language for the resource",
      optional: true,
    },
    queue: {
      type: "string",
      label: "Queue",
      description: "Queue information",
      optional: true,
    },
    // Optional Props for Customer Creation and Update
    company: {
      type: "string",
      label: "Company",
      description: "Company of the customer",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Username of the customer",
      optional: true,
    },
    signedUpAt: {
      type: "string",
      label: "Signed Up At",
      description: "Signup datetime",
      optional: true,
    },
    lastActivityAt: {
      type: "string",
      label: "Last Activity At",
      description: "Last activity datetime",
      optional: true,
    },
    lastCustomerActivityAt: {
      type: "string",
      label: "Last Customer Activity At",
      description: "Last customer activity datetime",
      optional: true,
    },
    lastSeenAt: {
      type: "string",
      label: "Last Seen At",
      description: "Last seen datetime",
      optional: true,
    },
    avatarUrl: {
      type: "string",
      label: "Avatar URL",
      description: "URL to the avatar",
      optional: true,
    },
    externalIds: {
      type: "string[]",
      label: "External IDs",
      description: "External identifiers",
      optional: true,
    },
    sharedExternalIds: {
      type: "string[]",
      label: "Shared External IDs",
      description: "Shared external identifiers",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Emails of the customer",
      optional: true,
    },
    sharedEmails: {
      type: "string[]",
      label: "Shared Emails",
      description: "Shared emails",
      optional: true,
    },
    phones: {
      type: "string[]",
      label: "Phones",
      description: "Phone numbers of the customer",
      optional: true,
    },
    sharedPhones: {
      type: "string[]",
      label: "Shared Phones",
      description: "Shared phone numbers",
      optional: true,
    },
    whatsApps: {
      type: "string[]",
      label: "WhatsApps",
      description: "WhatsApp numbers of the customer",
      optional: true,
    },
    facebookIds: {
      type: "string[]",
      label: "Facebook IDs",
      description: "Facebook IDs of the customer",
      optional: true,
    },
    instagramIds: {
      type: "string[]",
      label: "Instagram IDs",
      description: "Instagram IDs of the customer",
      optional: true,
    },
    socials: {
      type: "string[]",
      label: "Socials",
      description: "Social media accounts",
      optional: true,
    },
    sharedSocials: {
      type: "string[]",
      label: "Shared Socials",
      description: "Shared social media accounts",
      optional: true,
    },
    urls: {
      type: "string[]",
      label: "URLs",
      description: "Associated URLs",
      optional: true,
    },
    locations: {
      type: "string[]",
      label: "Locations",
      description: "Customer locations",
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Locale of the customer",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "Time zone of the customer",
      optional: true,
    },
    birthdayAt: {
      type: "string",
      label: "Birthday At",
      description: "Birthday datetime",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Gender of the customer",
      optional: true,
    },
    createdAt: {
      type: "string",
      label: "Created At",
      description: "Creation datetime",
      optional: true,
    },
    importedAt: {
      type: "string",
      label: "Imported At",
      description: "Import datetime",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.kustomerapp.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.access_token}`,
          "Content-Type": "application/json",
        },
        ...otherOpts,
      });
    },
    // Conversation Methods
    async createConversation(opts = {}) {
      const {
        customerId,
        externalId,
        name,
        status,
        priority,
        direction,
        replyChannel,
        tags,
        assignedTeams,
        defaultLang,
        queue,
      } = opts;
      const data = {
        customer: customerId,
        externalId,
        name,
        status,
        priority,
        direction,
        replyChannel,
        tags,
        assignedTeams,
        defaultLang,
        queue,
      };
      return this._makeRequest({
        method: "POST",
        path: "/conversations",
        data,
      });
    },
    async updateConversation(opts = {}) {
      const {
        conversationId,
        externalId,
        name,
        direction,
        priority,
        satisfaction,
        satisfactionLevel,
        suggestedShortcuts,
        status,
        replyChannel,
        subStatus,
        snooze,
        tags,
        suggestedTags,
        sentiment,
        assignedUsers,
        assignedTeams,
        deleted,
        ended,
        endedAt,
        endedReason,
        endedBy,
        endedByType,
        locked,
        rev,
        defaultLang,
        queue,
      } = opts;
      const data = {
        externalId,
        name,
        direction,
        priority,
        satisfaction,
        satisfactionLevel,
        suggestedShortcuts,
        status,
        replyChannel,
        subStatus,
        snooze,
        tags,
        suggestedTags,
        sentiment,
        assignedUsers,
        assignedTeams,
        deleted,
        ended,
        endedAt,
        endedReason,
        endedBy,
        endedByType,
        locked,
        rev,
        defaultLang,
        queue,
      };
      return this._makeRequest({
        method: "PUT",
        path: `/conversations/${conversationId}`,
        data,
      });
    },
    // Customer Methods
    async createCustomer(opts = {}) {
      const {
        name,
        company,
        externalId,
        username,
        signedUpAt,
        lastActivityAt,
        lastCustomerActivityAt,
        lastSeenAt,
        avatarUrl,
        externalIds,
        sharedExternalIds,
        emails,
        sharedEmails,
        phones,
        sharedPhones,
        whatsApps,
        facebookIds,
        instagramIds,
        socials,
        sharedSocials,
        urls,
        locations,
        locale,
        timeZone,
        tags,
        sentiment,
        birthdayAt,
        gender,
        createdAt,
        importedAt,
        rev,
        defaultLang,
      } = opts;
      const data = {
        name,
        company,
        externalId,
        username,
        signedUpAt,
        lastActivityAt,
        lastCustomerActivityAt,
        lastSeenAt,
        avatarUrl,
        externalIds,
        sharedExternalIds,
        emails,
        sharedEmails,
        phones,
        sharedPhones,
        whatsApps,
        facebookIds,
        instagramIds,
        socials,
        sharedSocials,
        urls,
        locations,
        locale,
        timeZone,
        tags,
        sentiment,
        birthdayAt,
        gender,
        createdAt,
        importedAt,
        rev,
        defaultLang,
      };
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data,
      });
    },
    async updateCustomer(opts = {}) {
      const {
        customerId,
        name,
        company,
        externalId,
        username,
        signedUpAt,
        lastActivityAt,
        lastCustomerActivityAt,
        lastSeenAt,
        avatarUrl,
        externalIds,
        sharedExternalIds,
        emails,
        sharedEmails,
        phones,
        sharedPhones,
        whatsApps,
        facebookIds,
        instagramIds,
        socials,
        sharedSocials,
        urls,
        locations,
        locale,
        timeZone,
        tags,
        sentiment,
        birthdayAt,
        gender,
        createdAt,
        importedAt,
        rev,
        defaultLang,
      } = opts;
      const data = {
        name,
        company,
        externalId,
        username,
        signedUpAt,
        lastActivityAt,
        lastCustomerActivityAt,
        lastSeenAt,
        avatarUrl,
        externalIds,
        sharedExternalIds,
        emails,
        sharedEmails,
        phones,
        sharedPhones,
        whatsApps,
        facebookIds,
        instagramIds,
        socials,
        sharedSocials,
        urls,
        locations,
        locale,
        timeZone,
        tags,
        sentiment,
        birthdayAt,
        gender,
        createdAt,
        importedAt,
        rev,
        defaultLang,
      };
      return this._makeRequest({
        method: "PUT",
        path: `/customers/${customerId}`,
        data,
      });
    },
    // Listing Methods
    async listTags(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/tags",
        ...opts,
      });
    },
    async listAssignedTeams(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/teams",
        ...opts,
      });
    },
    async listAssignedUsers(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/users",
        ...opts,
      });
    },
    // Event Emission Methods
    async emitConversationCreateEvent(name, url) {
      return {
        name,
        url,
        event: "kustomer.conversation.create",
      };
    },
    async emitCustomerCreateEvent(name, url) {
      return {
        name,
        url,
        event: "kustomer.customer.create",
      };
    },
    async emitMessageCreateEvent(name, url) {
      return {
        name,
        url,
        event: "kustomer.message.create",
      };
    },
    async emitConversationUpdateEvent(name, url) {
      return {
        name,
        url,
        event: "kustomer.conversation.update",
      };
    },
    async emitCustomerUpdateEvent(name, url) {
      return {
        name,
        url,
        event: "kustomer.customer.update",
      };
    },
    // Pagination Method
    async paginate(fn, ...opts) {
      let results = [];
      let hasMore = true;
      let page = 1;
      while (hasMore) {
        const response = await fn({
          page,
          ...opts,
        });
        if (response.length === 0) {
          hasMore = false;
        } else {
          results = results.concat(response);
          page += 1;
        }
      }
      return results;
    },
  },
};
