import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vapi",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Emit new event when a voicebot starts a conversation
    voicebotIds: {
      type: "string[]",
      label: "Voicebot IDs",
      description: "Filter events by specific voicebot IDs (optional)",
      optional: true,
      async options() {
        const assistants = await this.listAssistants();
        return assistants.map((assistant) => ({
          label: assistant.name,
          value: assistant.id,
        }));
      },
    },
    // Emit new event when a voicebot sends/receives a message during a conversation
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "Filter events by specific conversation ID (optional)",
      optional: true,
    },
    // Emit new event when a specific intent is detected during a conversation
    intentToMonitor: {
      type: "string",
      label: "Intent to Monitor",
      description: "Specify the intent to monitor during conversations",
    },
    filterVoicebotId: {
      type: "string[]",
      label: "Filter by Voicebot ID",
      description: "Optionally filter by specific voicebot IDs",
      optional: true,
      async options() {
        const assistants = await this.listAssistants();
        return assistants.map((assistant) => ({
          label: assistant.name,
          value: assistant.id,
        }));
      },
    },
    // Upload a new file
    file: {
      type: "any",
      label: "File",
      description: "The file to upload",
    },
    // Start a new conversation with an assistant
    name: {
      type: "string",
      label: "Conversation Name",
      description: "Name of the new conversation (optional)",
      optional: true,
    },
    assistantId: {
      type: "string",
      label: "Assistant ID",
      description: "ID of the assistant to start a conversation with or update (optional for starting, required for updating)",
      optional: true,
      async options() {
        const assistants = await this.listAssistants();
        return assistants.map((assistant) => ({
          label: assistant.name,
          value: assistant.id,
        }));
      },
    },
    squadId: {
      type: "string",
      label: "Squad ID",
      description: "ID of the squad to assign to the conversation (optional)",
      optional: true,
      async options() {
        const squads = await this.listSquads();
        return squads.map((squad) => ({
          label: squad.name,
          value: squad.id,
        }));
      },
    },
    phoneNumberId: {
      type: "string",
      label: "Phone Number ID",
      description: "ID of the phone number to use for the conversation (optional)",
      optional: true,
      async options() {
        const phoneNumbers = await this.listPhoneNumbers();
        return phoneNumbers.map((phone) => ({
          label: phone.name || phone.id,
          value: phone.id,
        }));
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "ID of the customer for the conversation (optional)",
      optional: true,
    },
    // Update configuration settings for a specific assistant
    transcriber: {
      type: "string",
      label: "Transcriber",
      description: "Options for the assistant’s transcriber (optional)",
      optional: true,
      async options() {
        return [
          {
            label: "Talkscriber",
            value: "talkscriber",
          },
          {
            label: "Deepgram",
            value: "deepgram",
          },
          {
            label: "AzureSpeech",
            value: "azurespeech",
          },
        ];
      },
    },
    model: {
      type: "string",
      label: "Model",
      description: "Options for the assistant’s LLM (optional)",
      optional: true,
      async options() {
        return [
          {
            label: "Grok-Beta",
            value: "grok-beta",
          },
          {
            label: "OpenAI-GPT-4",
            value: "openai-gpt-4",
          },
          {
            label: "Anthropic-Claude",
            value: "anthropic-claude",
          },
        ];
      },
    },
    voice: {
      type: "string",
      label: "Voice",
      description: "Options for the assistant’s voice (optional)",
      optional: true,
      async options() {
        return [
          {
            label: "Tavus Voice 1",
            value: "tavus-voice-1",
          },
          {
            label: "ElevenLabs Voice A",
            value: "elevenlabs-voice-a",
          },
          {
            label: "Deepgram Voice X",
            value: "deepgram-voice-x",
          },
        ];
      },
    },
    firstMessage: {
      type: "string",
      label: "First Message",
      description: "The first message the assistant will say or a URL to an audio file (optional)",
      optional: true,
    },
    firstMessageMode: {
      type: "string",
      label: "First Message Mode",
      description: "Mode for the first message (optional)",
      optional: true,
      async options() {
        return [
          {
            label: "Assistant Speaks First",
            value: "assistant-speaks-first",
          },
          {
            label: "Assistant Waits for User",
            value: "assistant-waits-for-user",
          },
          {
            label: "Assistant Speaks First with Model Generated Message",
            value: "assistant-speaks-first-with-model-generated-message",
          },
        ];
      },
    },
    hipaaEnabled: {
      type: "boolean",
      label: "HIPAA Enabled",
      description: "Enable HIPAA compliance settings (optional)",
      optional: true,
    },
    clientMessages: {
      type: "string[]",
      label: "Client Messages",
      description: "Messages to send to Client SDKs (optional)",
      optional: true,
    },
    serverMessages: {
      type: "string[]",
      label: "Server Messages",
      description: "Messages to send to Server URL (optional)",
      optional: true,
    },
    silenceTimeoutSeconds: {
      type: "integer",
      label: "Silence Timeout Seconds",
      description: "Seconds of silence before ending the call (optional, min:10, max:3600)",
      optional: true,
      min: 10,
      max: 3600,
    },
    backgroundSound: {
      type: "string",
      label: "Background Sound",
      description: "Background sound in the call (optional)",
      optional: true,
      async options() {
        return [
          {
            label: "Office",
            value: "office",
          },
          {
            label: "Off",
            value: "off",
          },
        ];
      },
    },
    backgroundDenoisingEnabled: {
      type: "boolean",
      label: "Background Denoising Enabled",
      description: "Enable background noise filtering (optional)",
      optional: true,
    },
    modelOutputInMessagesEnabled: {
      type: "boolean",
      label: "Model Output in Messages Enabled",
      description: "Use model’s output in conversation history (optional)",
      optional: true,
    },
    transportConfigurations: {
      type: "string[]",
      label: "Transport Configurations",
      description: "Transport provider configurations (optional)",
      optional: true,
    },
    credentials: {
      type: "string[]",
      label: "Credentials",
      description: "Dynamic credentials for assistant calls (optional)",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the assistant or conversation (optional)",
      optional: true,
    },
    voicemailDetection: {
      type: "string",
      label: "Voicemail Detection",
      description: "Settings to configure voicemail detection (optional)",
      optional: true,
      async options() {
        return [
          {
            label: "Twilio",
            value: "twilio",
          },
          {
            label: "None",
            value: "none",
          },
        ];
      },
    },
    endCallMessage: {
      type: "string",
      label: "End Call Message",
      description: "Message to say when ending the call (optional)",
      optional: true,
    },
    endCallPhrases: {
      type: "string[]",
      label: "End Call Phrases",
      description: "Phrases that trigger call termination (optional)",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Metadata to store on the assistant (optional)",
      optional: true,
    },
    analysisPlan: {
      type: "object",
      label: "Analysis Plan",
      description: "Plan for analysis of assistant’s calls (optional)",
      optional: true,
    },
    artifactPlan: {
      type: "object",
      label: "Artifact Plan",
      description: "Plan for artifacts generated during calls (optional)",
      optional: true,
    },
    messagePlan: {
      type: "object",
      label: "Message Plan",
      description: "Plan for predefined messages during the call (optional)",
      optional: true,
    },
    startSpeakingPlan: {
      type: "object",
      label: "Start Speaking Plan",
      description: "Plan for when the assistant should start talking (optional)",
      optional: true,
    },
    stopSpeakingPlan: {
      type: "object",
      label: "Stop Speaking Plan",
      description: "Plan for when the assistant should stop talking on interruption (optional)",
      optional: true,
    },
    monitorPlan: {
      type: "object",
      label: "Monitor Plan",
      description: "Plan for real-time monitoring of calls (optional)",
      optional: true,
    },
    credentialIds: {
      type: "string[]",
      label: "Credential IDs",
      description: "Credentials to use for assistant calls (optional)",
      optional: true,
      async options() {
        const creds = await this.listCredentials();
        return creds.map((cred) => ({
          label: cred.name,
          value: cred.id,
        }));
      },
    },
    server: {
      type: "object",
      label: "Server",
      description: "Webhook server settings (optional)",
      optional: true,
    },
  },
  methods: {
    // Existing method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.vapi.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($ || this, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    // List Assistants
    async listAssistants(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/assistant",
        params: opts,
      });
    },
    // List Squads
    async listSquads(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/squad",
        params: opts,
      });
    },
    // List Phone Numbers
    async listPhoneNumbers(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/phone-number",
        params: opts,
      });
    },
    // List Credentials
    async listCredentials(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/credentials",
        params: opts,
      });
    },
    // Upload File
    async uploadFile(fileData) {
      const formData = new FormData();
      formData.append("file", fileData);
      return this._makeRequest({
        method: "POST",
        path: "/file",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    // Start Conversation
    async startConversation(data) {
      const conversationData = {
        name: this.name,
        assistantId: this.assistantId,
        squadId: this.squadId,
        phoneNumberId: this.phoneNumberId,
        customerId: this.customerId,
      };
      return this._makeRequest({
        method: "POST",
        path: "/conversation",
        data: conversationData,
      });
    },
    // Update Assistant Configuration
    async updateAssistant(id, data) {
      return this._makeRequest({
        method: "PATCH",
        path: `/assistant/${id}`,
        data,
      });
    },
    // Paginate Helper
    async paginate(fn, opts = {}) {
      let allResults = [];
      let page = opts.page || 1;
      let limit = opts.limit || 100;
      let hasMore = true;

      while (hasMore) {
        const response = await fn({
          ...opts,
          page,
        });
        allResults = allResults.concat(response.results);
        if (response.results.length < limit) {
          hasMore = false;
        } else {
          page += 1;
        }
      }
      return allResults;
    },
  },
};
