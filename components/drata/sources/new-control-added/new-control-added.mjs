import drata from "../../drata.app.mjs";
import constants from "../../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/GRCPublicController_getControls/";

export default {
  key: "drata-new-control-added",
  name: "New Control Added",
  description: `Emit a new event for every new control. [See the documentation](${docsLink}).`,
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
  },
  hooks: {
    async deploy() {
      const response = await this.drata.listControls({
        paginate: true,
        // this endpoint does not support custom sorting. It sorts by name
        params: {
          limit: constants.DEPLOY_LIMIT,
        },
      });

      this._setVisitedIds(response.data.map((control) => control.id));
      for (const control of response.data.slice(-constants.DEPLOY_LIMIT)) {
        this.$emit(control, {
          id: control.id,
          summary: `Historical control added event: ${control.name}`,
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

    const response = await this.drata.listControls({
      paginate: true,
      params: {
        limit: constants.PAGINATION_LIMIT,
      },
    });

    for (const control of response.data) {
      if (!visitedIds.has(control.id)) {
        visitedIds.add(control.id);
        this.$emit(control, {
          id: control.id,
          summary: `New control added: ${control.name}`,
          ts: new Date(),
        });
      }
    }

    this._setVisitedIds(visitedIds);
  },
};
