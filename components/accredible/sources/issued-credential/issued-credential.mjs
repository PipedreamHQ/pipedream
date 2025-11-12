import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "accredible-issued-credential",
  name: "Issued Credential",
  description: "This source triggers when a new credential is issued to a recipient. [See the documentation](https://accrediblecredentialapi.docs.apiary.io/#reference/credentials/search-credentials-v2/search-for-credentials).",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    setLastDate(resource) {
      this.db.set(constants.LAST_ISSUED_ON, resource?.issued_on);
    },
    getLastDate() {
      return this.db.get(constants.LAST_ISSUED_ON);
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

      const lastIssuedOn = lastDate
        ? this.getDateFormatted(lastDate)
        : this.getDateFormatted(undefined, 1);

      return {
        data: {
          query: {
            "issued_on[gte]": lastIssuedOn,
          },
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Credential Issued: ${resource.recipient_name}`,
        ts: Date.parse(resource.issued_on),
      };
    },
  },
};
