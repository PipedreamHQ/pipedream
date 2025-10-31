import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "zoho_desk-new-account",
  name: "New Account",
  description: "Emit new event when a new account is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Accounts#Accounts_Listaccounts)",
  type: "source",
  version: "0.0.8",
  dedupe: "unique",
  props: {
    ...common.props,
    orgId: {
      propDefinition: [
        common.props.zohoDesk,
        "orgId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zohoDesk.getAccounts;
    },
    getResourceFnArgs() {
      return {
        headers: {
          orgId: this.orgId,
        },
        params: {
          sortBy: "createdTime", // createdTime | accountName
        },
      };
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      return Date.parse(resource.createdTime) > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.createdTime),
        summary: `Account ID ${resource.id}`,
      };
    },
  },
};
