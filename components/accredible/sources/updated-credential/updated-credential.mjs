import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "accredible-updated-credential",
  name: "Updated Credential",
  description: "Emit new event when an existing credential's details are updated or modified. [See the documentation](https://accrediblecredentialapi.docs.apiary.io/#reference/credentials/search-credentials-v2/search-for-credentials).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    setLastDate(resource) {
      this.db.set(constants.LAST_UPDATED_AT, resource?.issued_on);
    },
    getLastDate() {
      return this.db.get(constants.LAST_UPDATED_AT);
    },
    sortFn(a, b) {
      // Sort by updated_at in ascending order
      return new Date(a.updated_at) - new Date(b.updated_at);
    },
    getResourceName() {
      return "credentials";
    },
    getResourceFn() {
      return this.app.searchCredentials;
    },
    getResourceFnArgs() {
      const lastDate = this.getLastDate();

      const lastUpdatedAt = lastDate
        ? this.getDateFormatted(lastDate)
        : this.getDateFormatted(undefined, 1);

      return {
        data: {
          query: {
            "updated_at[gte]": lastUpdatedAt,
          },
        },
      };
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Credential Updated: ${resource.recipient_name}`,
        ts,
      };
    },
  },
};
