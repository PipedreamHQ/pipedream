import { axios } from "@pipedream/platform";
import fogbugz from "../../fogbugz.app.mjs";

export default {
  key: "fogbugz-new-caseevent",
  name: "New Case Event",
  description: "Emit new event instantaneously when something significant happens to a case.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    fogbugz,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    caseNumber: {
      propDefinition: [
        fogbugz,
        "caseNumber",
      ],
    },
  },
  methods: {
    async emitCaseEvents(caseNumber) {
      const { cases } = await this.fogbugz.getCaseDetails({
        caseNumber,
      });
      for (const caseDetail of cases) {
        for (const event of caseDetail.events) {
          this.$emit(event, {
            id: event.ixBugEvent,
            summary: `${event.sVerb}`,
            ts: Date.parse(event.dt),
          });
        }
      }
    },
  },
  hooks: {
    async deploy() {
      // Emit historical events during deploy
      await this.emitCaseEvents(this.caseNumber);
    },
  },
  async run() {
    await this.emitCaseEvents(this.caseNumber);
  },
};
