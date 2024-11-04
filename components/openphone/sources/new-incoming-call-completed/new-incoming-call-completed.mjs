import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-new-incoming-call-completed",
  name: "New Incoming Call Completed",
  description: "Emit new event when an incoming call is completed, including calls not picked up or voicemails left. [See the documentation](https://www.openphone.com/docs/api-reference/calls/list-calls)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    openphone,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    phoneNumberId: {
      type: "string",
      label: "Phone Number ID",
      description: "The unique identifier of the OpenPhone number associated with the call.",
      async options() {
        const phoneNumbers = await this.openphone.listPhoneNumbers();
        return phoneNumbers.map((phone) => ({
          label: phone.formattedNumber,
          value: phone.id,
        }));
      },
    },
    recording: {
      propDefinition: [
        openphone,
        "recording",
      ],
    },
    transcription: {
      propDefinition: [
        openphone,
        "transcription",
      ],
    },
  },
  methods: {
    _getLastCreatedAt() {
      return this.db.get("lastCreatedAt") || null;
    },
    _setLastCreatedAt(createdAt) {
      this.db.set("lastCreatedAt", createdAt);
    },
    async _fetchCalls(params) {
      return this.openphone._makeRequest({
        path: "/v1/calls",
        params,
      });
    },
  },
  hooks: {
    async deploy() {
      const params = {
        phoneNumberId: this.phoneNumberId,
        maxResults: 50,
      };
      const calls = await this._fetchCalls(params);

      calls.forEach((call) => {
        if (
          call.direction === "incoming" &&
          call.status === "completed" &&
          !call.answeredAt
        ) {
          this.$emit(call, {
            id: call.id,
            summary: `New Incoming Call Completed: ${call.participants[0]}`,
            ts: Date.parse(call.createdAt),
          });
        }
      });

      if (calls.length > 0) {
        const lastCreatedAt = calls.reduce((max, call) =>
          Date.parse(call.createdAt) > max
            ? Date.parse(call.createdAt)
            : max, 0);
        this._setLastCreatedAt(lastCreatedAt);
      }
    },
  },
  async run() {
    const lastCreatedAt = this._getLastCreatedAt();
    const params = {
      phoneNumberId: this.phoneNumberId,
      createdAfter: lastCreatedAt
        ? new Date(lastCreatedAt).toISOString()
        : undefined,
      maxResults: 50,
    };
    const calls = await this._fetchCalls(params);

    calls.forEach((call) => {
      if (
        call.direction === "incoming" &&
        call.status === "completed" &&
        !call.answeredAt
      ) {
        this.$emit(call, {
          id: call.id,
          summary: `New Incoming Call Completed: ${call.participants[0]}`,
          ts: Date.parse(call.createdAt),
        });
      }
    });

    if (calls.length > 0) {
      const lastCreatedAt = calls.reduce((max, call) =>
        Date.parse(call.createdAt) > max
          ? Date.parse(call.createdAt)
          : max, 0);
      this._setLastCreatedAt(lastCreatedAt);
    }
  },
};
