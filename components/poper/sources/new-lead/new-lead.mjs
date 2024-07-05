import { axios } from "@pipedream/platform";
import poper from "../../poper.app.mjs";

export default {
  key: "poper-new-lead",
  name: "New Lead from Poper Popup",
  description: "Emit new event when a new lead is obtained from Poper popups. [See the documentation](https://help.poper.ai/portal/en/kb/articles/view-popup-responses)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    poper,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    poperId: {
      propDefinition: [
        poper,
        "poperId",
      ],
    },
  },
  methods: {
    _getLastLeadId() {
      return this.db.get("lastLeadId");
    },
    _setLastLeadId(id) {
      this.db.set("lastLeadId", id);
    },
  },
  hooks: {
    async deploy() {
      await this.emitNewLeads();
    },
    async activate() {
      await this.emitNewLeads();
    },
    async deactivate() {
      // No specific deactivation logic required
    },
  },
  async run() {
    await this.emitNewLeads();
  },
  async emitNewLeads() {
    const poperId = this.poperId;
    const responses = await this.poper.getPopupResponses({
      poperId,
    });
    const lastLeadId = this._getLastLeadId();
    let newLastLeadId = lastLeadId;

    for (const response of responses.responses) {
      if (!lastLeadId || response.id > lastLeadId) {
        this.$emit(response, {
          summary: `New lead from Poper ID: ${poperId}`,
          id: response.id,
          ts: Date.now(),
        });
        newLastLeadId = response.id;
      }
    }

    if (newLastLeadId !== lastLeadId) {
      this._setLastLeadId(newLastLeadId);
    }
  },
};
