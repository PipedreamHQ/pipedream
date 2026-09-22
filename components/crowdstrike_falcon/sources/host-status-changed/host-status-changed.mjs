import common from "../common/common-poling.mjs";

const BATCH_LIMIT = 500;

export default {
  ...common,
  key: "crowdstrike_falcon-host-status-changed",
  name: "Host Status Changed",
  description: "Emit new event for each host matching a user-supplied FQL filter that has not been emitted in a prior run. Polls GET /devices/combined/devices/v1 (returns full device records including `status`/containment status and sensor-health fields) and deduplicates on a `deviceId-modified_timestamp` composite so only genuinely changed hosts emit. Covers both sensor-health and containment-status scenarios via the filter prop. [See the documentation](https://developer.crowdstrike.com/api-reference/collections/hosts/#combineddevicesbyfilter).",
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
      description: "FQL filter selecting the hosts to watch. Examples: `status:'containment_pending'` (containment change), `reduced_functionality_mode:'yes'` (degraded sensor health). Combine terms with `+`.",
    },
  },
  methods: {
    ...common.methods,
    generateMeta(device) {
      return {
        id: `${device.device_id}-${device.modified_timestamp}`,
        summary: `Host status changed: ${device.hostname ?? device.device_id} [${device.status ?? "unknown"}]`,
        ts: Date.parse(device.modified_timestamp),
      };
    },
    _buildFilter(checkpoint) {
      const parts = [];
      if (checkpoint) {
        parts.push(`modified_timestamp:>'${checkpoint}'`);
      }
      if (this.fqlFilter) {
        parts.push(this.fqlFilter);
      }
      return parts.join("+") || undefined;
    },
    async processEvents(max) {
      const deviceLastModified = this._getLastTimestamp();
      let maxTs = deviceLastModified;
      const filter = this._buildFilter(deviceLastModified);

      let offset;
      let done = false;
      const results = [];

      do {
        const response = await this.crowdstrikeFalcon.searchHosts({
          params: {
            filter,
            limit: BATCH_LIMIT,
            offset,
          },
        });

        const devices = response.resources ?? [];
        if (!devices.length) {
          break;
        }

        for (const device of devices) {
          const ts = Date.parse(device.modified_timestamp);
          if (!deviceLastModified || ts > Date.parse(deviceLastModified)) {
            results.push(device);
            if (!maxTs || ts > Date.parse(maxTs)) {
              maxTs = device.modified_timestamp;
            }
            if (max && results.length >= max) {
              done = true;
              break;
            }
          }
        }

        const total = response.meta?.pagination?.total;
        offset = offset
          ? offset + devices.length
          : devices.length;
        if (!total || offset >= total) {
          done = true;
          break;
        }
      } while (!done);

      results.forEach((device) => this.$emit(device, this.generateMeta(device)));
      this._setLastTimestamp(maxTs);
    },
  },
};
