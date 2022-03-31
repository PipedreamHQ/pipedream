import { axios } from "@pipedream/platform";

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
  },
};
