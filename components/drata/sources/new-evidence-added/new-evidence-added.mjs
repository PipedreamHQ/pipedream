import drata from "../../drata.app.mjs";
import constants from "../../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/GRCPublicController_getMappedExternalEvidence/#tag/Controls/operation/GRCPublicController_getMappedExternalEvidence";

export default {
  key: "drata-new-evidence-added",
  name: "New Evidence for Control Added",
  description: `Emit a new event for every new evidence for a control. [See the documentation](${docsLink}).`,
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    drata,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    controlId: {
      propDefinition: [
        drata,
        "controlId",
      ],
    },
  },
  hooks: {
    async deploy() {
      console.log(this.controlId);
      const response = await this.drata.listEvidencesForControl({
        controlId: this.controlId,
        paginate: true,
        // this endpoint does not support custom sorting. It sorts by name
        params: {
          limit: constants.DEPLOY_LIMIT,
        },
      });

      this._setVisitedIds(response.data.map((evidence) => evidence.id));
      for (const evidence of response.data.slice(-constants.DEPLOY_LIMIT)) {
        this.$emit(evidence, {
          id: evidence.id,
          summary: `Historical evidence added event: ${evidence.name}`,
          ts: new Date(),
        });
      }
    },
  },
  methods: {
    _getVisitedIds() {
      return new Set(this.db.get("visitedIds"));
    },
    _setVisitedIds(visitedIds) {
      this.db.set("visitedIds", Array.from(visitedIds));
    },
  },
  async run() {
    const visitedIds = this._getVisitedIds();

    const response = await this.drata.listEvidencesForControl({
      controlId: this.controlId,
      paginate: true,
      params: {
        limit: constants.PAGINATION_LIMIT,
      },
    });

    for (const evidence of response.data) {
      if (!visitedIds.has(evidence.id)) {
        visitedIds.add(evidence.id);
        this.$emit(evidence, {
          id: evidence.id,
          summary: `New evidence added: ${evidence.name}`,
          ts: new Date(),
        });
      }
    }

    this._setVisitedIds(visitedIds);
  },
};
