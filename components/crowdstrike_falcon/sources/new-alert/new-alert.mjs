import common from "../common/common-poling.mjs";

const BATCH_LIMIT = 500;

export default {
  ...common,
  key: "crowdstrike_falcon-new-alert",
  name: "New Alert",
  description: "Emit new event for each CrowdStrike Falcon alert created since the last run. Polls GET /alerts/queries/alerts/v1 (GetQueriesAlertsV2) for alert IDs newer than the stored `created_timestamp` checkpoint, then hydrates them via POST /alerts/entities/alerts/v1 (PostEntitiesAlertsV2, body field `composite_ids`). Use the optional FQL filter to narrow to specific alert products (e.g. legacy endpoint detections, now surfaced through the Alerts API). [See the documentation](https://developer.crowdstrike.com/api-reference/collections/alerts/).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    fqlFilter: {
      propDefinition: [
        common.props.crowdstrikeFalcon,
        "fqlFilter",
      ],
      description: "Optional FQL filter appended to the created_timestamp checkpoint filter. Example: `product:'epp'` to emit only endpoint-detection alerts. Combine terms with `+`.",
    },
  },
  methods: {
    ...common.methods,
    generateMeta(alert) {
      return {
        id: alert.composite_id ?? alert.id,
        summary: `New alert: ${alert.display_name ?? alert.id} [${alert.severity ?? "unknown"} severity]`,
        ts: Date.parse(alert.created_timestamp),
      };
    },
    _buildFilter(checkpoint) {
      const parts = [];
      if (checkpoint) {
        parts.push(`created_timestamp:>'${checkpoint}'`);
      }
      if (this.fqlFilter) {
        parts.push(this.fqlFilter);
      }
      return parts.join("+") || undefined;
    },
    async processEvents(max) {
      const checkpoint = this._getLastTimestamp();

      let offset;
      let maxTs = checkpoint;
      const filter = this._buildFilter(checkpoint);
      const results = [];
      let done = false;

      do {
        const queryResponse = await this.crowdstrikeFalcon.searchAlerts({
          params: {
            filter,
            limit: BATCH_LIMIT,
            offset,
            sort: "created_timestamp|desc",
          },
        });

        const ids = queryResponse.resources ?? [];
        if (!ids.length) {
          break;
        }

        // Hydrate IDs into full alert records.
        const entityResponse = await this.crowdstrikeFalcon.getAlerts({
          data: {
            composite_ids: ids,
          },
        });

        const alerts = entityResponse.resources ?? [];
        for (const alert of alerts) {
          const ts = Date.parse(alert.created_timestamp);
          if (!checkpoint || ts > Date.parse(checkpoint)) {
            results.push(alert);
            if (!maxTs || ts > Date.parse(maxTs)) {
              maxTs = alert.created_timestamp;
            }
            if (max && results.length >= max) {
              done = true;
              break;
            }
          }
        }

        const total = queryResponse.meta?.pagination?.total;
        offset = offset
          ? offset + ids.length
          : ids.length;
        if (!total || offset >= total) {
          done = true;
          break;
        }
      } while (!done);

      results.reverse().forEach((alert) => this.$emit(alert, this.generateMeta(alert)));
      this._setLastTimestamp(maxTs);
    },
  },
};
