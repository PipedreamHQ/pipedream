import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "callingly-call-completed",
  name: "Call Completed (Instant)",
  description: "Emit new event when a call is completed in Callingly. [See the documentation](https://help.callingly.com/article/38-callingly-api-documentation#Create-a-Webhook-fv07m)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    callDirection: {
      type: "string",
      label: "Call Direction",
      description: "Filter by call direction",
      optional: true,
      options: [
        {
          label: "Outbound",
          value: "outbound",
        },
        {
          label: "Inbound",
          value: "inbound",
        },
      ],
    },
    callStatus: {
      type: "string",
      label: "Call Status",
      description: "Filter by call status",
      optional: true,
      options: [
        {
          label: "Completed",
          value: "completed",
        },
        {
          label: "Missed",
          value: "missed",
        },
        {
          label: "Offline",
          value: "offline",
        },
      ],
    },
    callLeadStatus: {
      type: "string",
      label: "Call Lead Status",
      description: "Filter by call lead status",
      optional: true,
      options: [
        {
          label: "Contacted",
          value: "contacted",
        },
        {
          label: "Missed",
          value: "missed",
        },
        {
          label: "Removed",
          value: "removed",
        },
        {
          label: "Voicemail",
          value: "voicemail",
        },
      ],
    },
  },
  methods: {
    ...common.methods,
    getEvent() {
      return "call_completed";
    },
    getOtherOpts() {
      return {
        call_direction: this.callDirection,
        call_status: this.callStatus,
        call_lead_status: this.callLeadStatus,
      };
    },
    generateMeta(call) {
      const ts = Date.parse(call.created_at) || Date.now();
      return {
        id: `${call.id}-${ts}`,
        summary: `Call completed: ${call.lead?.phone_number} - ${call.status}`,
        ts,
      };
    },
  },
  sampleEmit,
};
