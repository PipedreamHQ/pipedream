import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import greenhouse from "../../greenhouse.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "greenhouse-new-candidate-application",
  name: "New Candidate Application",
  description: "Emit new event when a candidate submits a new application.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    greenhouse,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    candidateId: {
      propDefinition: [
        greenhouse,
        "candidateId",
      ],
    },
  },
  methods: {
    _getLastApplications() {
      return this.db.get("lastApplications") || [];
    },
    _setLastApplications(created) {
      this.db.set("lastApplications", created);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New candidate application with Id: ${item.id}`,
        ts: new Date(),
      };
    },
  },
  async run() {
    const lastApplications = this._getLastApplications();
    const { applications } = await this.greenhouse.getCandidate(this.candidateId);

    const newApplications = applications.filter((item) => !lastApplications.includes(item.id));

    for (const application of newApplications) {
      this.$emit(application, this.generateMeta(application));
    }

    this._setLastApplications(applications.map((item) => item.id));
  },
  sampleEmit,
};
