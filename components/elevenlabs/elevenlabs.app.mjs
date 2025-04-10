import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "elevenlabs",
  propDefinitions: {
    historyItemId: {
      type: "string",
      label: "History Item ID",
      description: "History item ID to be used.",
      async options({ prevContext }) {
        const {
          history, last_history_item_id: lastId,
        } = await this.listHistoryItems({
          params: {
            start_after_history_item_id: prevContext.lastId,
          },
        });

        return {
          options: history.map(({
            history_item_id: value, voice_name, text,
          }) => ({
            label: `${voice_name} - ${(text.length > 50)
              ? text.slice(0, 49) + "&hellip;"
              : text}`,
            value,
          })),
          context: {
            lastId,
          },
        };
      },
    },
    voiceId: {
      type: "string",
      label: "Voice ID",
      description: "Identifier of the voice that will be used.",
      async options() {
        const { voices } = await this.listVoices();

        return voices.map(({
          voice_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    modelId: {
      type: "string",
      label: "Model ID",
      description: "Identifier of the model that will be used. Default: `eleven_monolingual_v1`",
      async options() {
        const models = await this.listModels();

        return models.map(({
          model_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    phoneNumberId: {
      type: "string",
      label: "Phone Number ID",
      description: "Identifier of a phone number to use for the agent",
      async options() {
        const phoneNumbers = await this.listPhoneNumbers();
        return phoneNumbers?.map(({
          phone_number_id: value, phone_number: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "Identifier of an agent to use for the outbound call",
      async options({ prevContext }) {
        const {
          agents, next_cursor: cursor,
        } = await this.listAgents({
          params: {
            cursor: prevContext?.cursor,
            page_size: 30,
          },
        });
        const options = agents?.map(({
          agent_id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
        return {
          options,
          context: {
            cursor,
          },
        };
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.elevenlabs.io/v1";
    },
    _getHeaders(args = {}) {
      return {
        "Accept": "application/json",
        "xi-api-key": this.$auth.api_key,
        ...args,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(headers),
        ...opts,
      };

      return axios($, config);
    },
    downloadHistoryItems(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "history/download",
        returnFullResponse: true,
        responseType: "stream",
        ...args,
      });
    },
    getAudioFromHistoryItem({
      historyItemId, ...args
    }) {
      return this._makeRequest({
        path: `history/${historyItemId}/audio`,
        responseType: "stream",
        ...args,
      });
    },
    listModels(args = {}) {
      return this._makeRequest({
        path: "models",
        ...args,
      });
    },
    listHistoryItems(args = {}) {
      return this._makeRequest({
        path: "history",
        ...args,
      });
    },
    listVoices(args = {}) {
      return this._makeRequest({
        path: "voices",
        ...args,
      });
    },
    addVoice(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "voices/add",
        ...args,
      });
    },
    textToSpeech({
      voiceId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `text-to-speech/${voiceId}/stream`,
        returnFullResponse: true,
        responseType: "stream",
        ...args,
      });
    },
    listPhoneNumbers(args = {}) {
      return this._makeRequest({
        path: "convai/phone-numbers/",
        ...args,
      });
    },
    listAgents(args = {}) {
      return this._makeRequest({
        path: "convai/agents",
        ...args,
      });
    },
    createAgent(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "convai/agents/create",
        ...args,
      });
    },
    makeOutboundCall(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "convai/twilio/outbound_call",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let lastPage = false;
      let count = 0;

      do {
        const {
          history,
          last_history_item_id: lastId,
          has_more: hasMore,
        } = await fn({
          params,
        });
        for (const d of history) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        params.start_after_history_item_id = lastId;
        lastPage = hasMore;

      } while (lastPage);
    },
  },
};
