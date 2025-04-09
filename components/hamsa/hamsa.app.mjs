import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hamsa",
  propDefinitions: {
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "The URL of the video to be transcribed.",
    },
    voiceId: {
      type: "string",
      label: "Voice ID",
      description: "The voice ID for Text to Speech conversion.",
    },
    text: {
      type: "string",
      label: "Text for TTS",
      description: "The text you want to convert to speech. Minimum 5 words required.",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL to receive the webhook notifications.",
    },
    aiParts: {
      type: "string[]",
      label: "AI Parts",
      description: "Parts for AI content in marketing, e.g., introduction, titles, etc.",
      async options() {
        return [
          {
            label: "Introduction",
            value: "introduction",
          },
          {
            label: "Titles",
            value: "titles",
          },
          {
            label: "Summary",
            value: "summary",
          },
          {
            label: "Web Article SEO Friendly",
            value: "webArticleSEOFriendly",
          },
          {
            label: "Key Topics With Bullets",
            value: "keyTopicsWithBullets",
          },
          {
            label: "Keywords",
            value: "keywords",
          },
          {
            label: "Threads By Instagram",
            value: "threadsByInstagram",
          },
          {
            label: "FAQ",
            value: "faq",
          },
          {
            label: "Facebook Post",
            value: "facebookPost",
          },
          {
            label: "YouTube Description",
            value: "youtubeDescription",
          },
          {
            label: "Twitter Thread",
            value: "twitterThread",
          },
          {
            label: "LinkedIn Post",
            value: "linkedInPost",
          },
        ];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tryhamsa.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Token ${this.$auth.api_key}`,
        },
      });
    },
    async transcribeVideo({
      mediaUrl, webhookUrl, webhookAuth,
    }) {
      return this._makeRequest({
        path: "/jobs/transcribe",
        data: {
          mediaUrl,
          processingType: "async",
          webhookUrl,
          webhookAuth,
          model: "Hamsa-General-V2.0",
          language: "ar",
        },
      });
    },
    async generateTTS({
      voiceId, text, webhookUrl, webhookAuth,
    }) {
      return this._makeRequest({
        path: "/jobs/text-to-speech",
        data: {
          voiceId,
          text,
          webhookUrl,
          webhookAuth,
        },
      });
    },
    async createAIContent({ aiParts }) {
      return this._makeRequest({
        path: "/jobs/ai-content",
        data: {
          aiParts,
        },
      });
    },
  },
};
