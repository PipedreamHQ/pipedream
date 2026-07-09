import odoo from "../../odoo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { normalizeDomain } from "../../common/utils.mjs";

export default {
  key: "odoo-new-record-created",
  name: "New Record Created",
  description: "Emit new event when a new record is created. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#list-records)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    odoo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    modelName: {
      propDefinition: [
        odoo,
        "modelName",
      ],
    },
    domain: {
      type: "string",
      label: "Search Domain",
      description: "Odoo search domain as JSON. Single-condition examples: phone contains `555` -> `[\"phone\", \"ilike\", \"555\"]`; email contains `acme.com` -> `[\"email\", \"ilike\", \"acme.com\"]`; companies only -> `[\"is_company\", \"=\", true]`. Use a full domain array for multiple conditions. Logical operators apply to the criteria that follow them, so use `[\"|\", [\"id\", \"=\", 7583], [\"id\", \"=\", 7584]]` for a two-condition OR. [See domain docs](https://www.odoo.com/documentation/18.0/developer/reference/backend/orm.html#search-domains).",
      optional: true,
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") ?? 0;
    },
    _setLastTs(ts) {
      return this.db.set("lastTs", ts);
    },
    _getNormalizedDomain() {
      return this.db.get("normalizedDomain");
    },
    _setNormalizedDomain(normalizedDomain) {
      return this.db.set("normalizedDomain", normalizedDomain);
    },
    _getFields() {
      return this.db.get("fields");
    },
    _setFields(fields) {
      return this.db.set("fields", fields);
    },
    generateMeta(record) {
      return {
        id: record.id,
        summary: `New Record Created: ${record.id}`,
        ts: Date.parse(record.create_date),
      };
    },
    async processEvents(max) {
      const normalizedDomain = this._getNormalizedDomain();
      const fields = this._getFields();

      const lastTs = this._getLastTs();
      const records = [];
      let done = false;
      let offset = 0;

      do {
        const response = await this.odoo.searchAndReadRecords(this.modelName, normalizedDomain, {
          fields,
          order: "create_date desc",
          limit: 100,
          offset,
        });
        for (const record of response) {
          const ts = Date.parse(record.create_date);
          if (ts > lastTs) {
            records.push(record);
            if (max && records.length >= max) {
              done = true;
              break;
            }
          } else {
            done = true;
            break;
          }
        }
        offset += 100;
        if (response.length < 100) {
          done = true;
        }
      } while (!done);

      if (!records.length) {
        return;
      }

      this._setLastTs(Date.parse(records[0].create_date));

      records.reverse().forEach((record) => {
        this.$emit(record, this.generateMeta(record));
      });
    },
  },
  hooks: {
    async deploy() {
      const normalizedDomain = normalizeDomain(this.domain);
      this._setNormalizedDomain(normalizedDomain);

      const fields = await this.odoo.getFields(this.modelName, [], {
        attributes: [
          "string",
        ],
      });
      this._setFields(Object.keys(fields));

      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
};
