import { axios } from "@pipedream/platform";
import diabatixColdstream from "../../diabatix_coldstream.app.mjs";

export default {
  key: "diabatix_coldstream-simulation-completed",
  name: "Simulation Completed (Coldstream)",
  description: "Emits an event when a thermal simulation has been successfully completed in Coldstream with a status of 2. [See the documentation](https://coldstream.readme.io/reference)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    diabatixColdstream,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    organizationId: {
      propDefinition: [
        diabatixColdstream,
        "organizationId",
        async (opts) => {
          const { data } = await diabatixColdstream.getCurrentUserOrganizations(opts);
          return data.map((org) => ({
            label: org.name,
            value: org.id,
          }));
        },
      ],
    },
    caseStatus: {
      propDefinition: [
        diabatixColdstream,
        "caseStatus",
      ],
      default: [
        2,
      ],
    },
  },
  methods: {
    _getLastEmittedTimestamp() {
      return this.db.get("lastEmittedTimestamp") || 0;
    },
    _setLastEmittedTimestamp(timestamp) {
      this.db.set("lastEmittedTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const params = {
        status: [
          2,
        ],
        PageSize: 50,
      };
      const { data: cases } = await this.diabatixColdstream.listOrganizationCases({
        organizationId: this.organizationId,
        params,
      });

      // Sort cases by updated date in descending order
      cases.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      cases.slice(0, 50).forEach((caseItem) => {
        this.$emit(caseItem, {
          id: caseItem.id,
          summary: `Simulation Completed: ${caseItem.name}`,
          ts: Date.parse(caseItem.updatedAt),
        });
      });

      // Store the timestamp of the last emitted event
      if (cases.length > 0) {
        const lastEmittedTimestamp = Date.parse(cases[0].updatedAt);
        this._setLastEmittedTimestamp(lastEmittedTimestamp);
      }
    },
  },
  async run() {
    const lastEmittedTimestamp = this._getLastEmittedTimestamp();
    const params = {
      status: [
        2,
      ],
      PageSize: 50,
    };
    const { data: cases } = await this.diabatixColdstream.listOrganizationCases({
      organizationId: this.organizationId,
      params,
    });

    cases.forEach((caseItem) => {
      const caseTimestamp = Date.parse(caseItem.updatedAt);
      if (caseTimestamp > lastEmittedTimestamp) {
        this.$emit(caseItem, {
          id: caseItem.id,
          summary: `Simulation Completed: ${caseItem.name}`,
          ts: caseTimestamp,
        });
      }
    });

    // Update the last emitted timestamp
    if (cases.length > 0) {
      const latestTimestamp = Date.parse(cases[0].updatedAt);
      this._setLastEmittedTimestamp(latestTimestamp);
    }
  },
};
