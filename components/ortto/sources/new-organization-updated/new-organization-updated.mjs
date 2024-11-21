import ortto from "../../ortto.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ortto-new-organization-updated",
  name: "New Organization Updated",
  description: "Emit new event when an organization is updated in your Ortto account. [See the documentation](https://help.ortto.com/a-250-api-reference)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ortto,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5, // 5 minutes
      },
    },
  },
  methods: {
    _getLastUpdatedTime() {
      return this.db.get("lastUpdatedTime") || 0;
    },
    _setLastUpdatedTime(lastUpdatedTime) {
      this.db.set("lastUpdatedTime", lastUpdatedTime);
    },
  },
  hooks: {
    async deploy() {
      const organizations = await this.ortto._makeRequest({
        method: "GET",
        path: "/v1/organizations/get",
        params: {
          sort_order: "desc",
          sort_by_field_id: "updated_at",
          limit: 50,
        },
      });

      const lastUpdatedTime = this._getLastUpdatedTime();
      const newOrgs = organizations.filter((o) => Date.parse(o.updated_at) > lastUpdatedTime);

      for (const org of newOrgs) {
        const {
          id, fields, updated_at,
        } = org;
        this.$emit({
          id,
          fields,
        }, {
          id,
          summary: `Organization Updated: ${fields["str:o:name"]}`,
          ts: Date.parse(updated_at),
        });
      }

      if (organizations.length) {
        this._setLastUpdatedTime(Date.parse(organizations[0].updated_at));
      }
    },
  },
  async run() {
    const organizations = await this.ortto._makeRequest({
      method: "GET",
      path: "/v1/organizations/get",
      params: {
        sort_order: "desc",
        sort_by_field_id: "updated_at",
        limit: 50,
      },
    });

    const lastUpdatedTime = this._getLastUpdatedTime();
    const newOrgs = organizations.filter((o) => Date.parse(o.updated_at) > lastUpdatedTime);

    for (const org of newOrgs) {
      const {
        id, fields, updated_at,
      } = org;
      this.$emit({
        id,
        fields,
      }, {
        id,
        summary: `Organization Updated: ${fields["str:o:name"]}`,
        ts: Date.parse(updated_at),
      });
    }

    if (organizations.length) {
      this._setLastUpdatedTime(Date.parse(organizations[0].updated_at));
    }
  },
};
