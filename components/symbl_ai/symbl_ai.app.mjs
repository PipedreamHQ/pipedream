import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "symbl_ai",
  propDefinitions: {
    conversationId: {
      type: "string",
      label: "Conversation Id",
      description: "The Id of the Conversation",
      async options({ page }) {
        const limit = 100;
        const params = {
          limit,
          offset: limit * page,
          order: "desc",
        };
        const { conversations } = await this.getConversations({
          params,
        });
        return conversations.map((conversation) => ({
          label: conversation.name,
          value: conversation.id,
        }));
      },
    },
    memberId: {
      type: "string",
      label: "Member Id",
      description: "The unique identifier of the member in the Conversation.",
      async options({
        page, conversationId,
      }) {
        const limit = 50;
        const params = {
          limit,
          offset: limit * page,
          order: "desc",
        };
        const { members } = await this.getMembers({
          params,
          conversationId,
        });
        return members.map((member) => ({
          label: member.name,
          value: member.id,
        }));
      },
    },
    logo: {
      type: "string",
      label: "Logo",
      description: "URL of the custom logo to be used in the Summary UI.",
      optional: true,
    },
    favicon: {
      type: "string",
      label: "Favicon",
      description: "URL of the custom favicon to be used in the Summary UI.",
      optional: true,
    },
    background: {
      type: "string",
      label: "Background Color",
      description: "Background color to be used in the Summary UI. Hex Color Codes accepted.",
      optional: true,
    },
    topicsFilter: {
      type: "string",
      label: "Topics Filter Element Color",
      description: "Topics Filter Element color to be used in the Summary UI. Hex Color Codes accepted.",
      optional: true,
    },
    insightsFilter: {
      type: "string",
      label: "Insights Element Color",
      description: "Insights (Questions, Follow-ups, Action Items, etc) Filter Element color to be used in the Summary UI. Hex Color Codes accepted.",
      optional: true,
    },
    font: {
      type: "string",
      label: "Font",
      description: "The name of the font to be used in the Summary UI. All fonts available in the [Google Fonts](https://fonts.google.com/) are supported.",
      optional: true,
    },
    summaryURLExpiresIn: {
      type: "integer",
      label: "Expiration Time of the Summary UI",
      description: "Number of seconds set for expiration time of the Summary UI. Zero (0) will set the Summary UI to never expire. Default value is set to `2592000` (30 days).",
      optional: true,
      min: 0,
    },
    readOnly: {
      type: "boolean",
      label: "Read Only",
      description: "Disable the editing capabilities of the Summary UI. Default value is `false`.",
      optional: true,
    },
    enableCustomDomain: {
      type: "boolean",
      label: "Enable Custom Domain",
      description: "Enable generation of personalized URLs for the Summary UI.",
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "Type of the transcript content to be generated.",
      options: Object.values(constants.contentType),
    },
  },
  methods: {
    getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async makeRequest(customConfig) {
      const {
        $,
        path,
        url,
        ...otherConfig
      } = customConfig;

      const basePath = "https://api.symbl.ai/v1";

      const config = {
        url: url ?? `${basePath}${path}`,
        headers: this.getHeaders(),
        ...otherConfig,
      };
      try {
        return await axios($ || this, config);
      } catch (error) {
        this.throwFormattedError(error);
      }
    },
    throwFormattedError(error) {
      error = error.response;
      throw new Error(`${error.status} - ${error.statusText} - ${error.data.message}`);
    },
    async postVideoUrl({
      $,
      data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/process/video/url",
        data,
      });
    },
    async postAudioUrl({
      $,
      data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/process/audio/url",
        data,
      });
    },
    async getJobStatus({
      $,
      jobId,
    }) {
      return this.makeRequest({
        $,
        path: `/job/${jobId}`,
      });
    },
    async postSummaryUI({
      $,
      conversationId,
      data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: `/conversations/${conversationId}/experiences`,
        data,
      });
    },
    async getSpeechToText({
      $,
      conversationId,
      params,
    }) {
      return this.makeRequest({
        $,
        path: `/conversations/${conversationId}/messages`,
        params,
      });
    },
    async getActionItems({
      $,
      conversationId,
    }) {
      return this.makeRequest({
        $,
        path: `/conversations/${conversationId}/action-items`,
      });
    },
    async getFollowUps({
      $,
      conversationId,
    }) {
      return this.makeRequest({
        $,
        path: `/conversations/${conversationId}/follow-ups`,
      });
    },
    async getTopics({
      $,
      conversationId,
      params,
    }) {
      return this.makeRequest({
        $,
        path: `/conversations/${conversationId}/topics`,
        params,
      });
    },
    async getQuestions({
      $,
      conversationId,
    }) {
      return this.makeRequest({
        $,
        path: `/conversations/${conversationId}/questions`,
      });
    },
    async getConversations({
      $,
      params,
    }) {
      return this.makeRequest({
        $,
        path: "/conversations",
        params,
      });
    },
    async getEntities({
      $,
      conversationId,
    }) {
      return this.makeRequest({
        $,
        path: `/conversations/${conversationId}/entities`,
      });
    },
    async getAnalytics({
      $,
      conversationId,
    }) {
      return this.makeRequest({
        $,
        path: `/conversations/${conversationId}/analytics`,
      });
    },
    async getConversation({
      $,
      conversationId,
    }) {
      return this.makeRequest({
        $,
        path: `/conversations/${conversationId}`,
      });
    },
    async getSummary({
      $,
      conversationId,
      params,
    }) {
      return this.makeRequest({
        $,
        path: `/conversations/${conversationId}/summary`,
        params,
      });
    },
    async deleteConversation({
      $,
      conversationId,
    }) {
      return this.makeRequest({
        $,
        method: "delete",
        path: `/conversations/${conversationId}`,
      });
    },
    async getMembers({
      $,
      conversationId,
    }) {
      return this.makeRequest({
        $,
        path: `/conversations/${conversationId}/members`,
      });
    },
    async getTrackers({
      $,
      conversationId,
    }) {
      return this.makeRequest({
        $,
        path: `/conversations/${conversationId}/trackers-detected`,
      });
    },
    async putMember({
      conversationId, memberId, ...args
    }) {
      return this.makeRequest({
        method: "put",
        path: `/conversations/${conversationId}/members/${memberId}`,
        ...args,
      });
    },
    async putSpeakerEvents({
      conversationId, ...args
    }) {
      return this.makeRequest({
        method: "put",
        path: `/conversations/${conversationId}/speakers`,
        ...args,
      });
    },
    async postFormattedTranscript({
      $,
      conversationId,
      data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: `/conversations/${conversationId}/transcript`,
        data,
      });
    },
    async putConversation({
      conversationId, ...args
    }) {
      return this.makeRequest({
        method: "put",
        path: `/conversations/${conversationId}`,
        ...args,
      });
    },
  },
};
