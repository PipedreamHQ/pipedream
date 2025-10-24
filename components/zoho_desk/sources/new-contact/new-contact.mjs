import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "zoho_desk-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Contacts#Contacts_Listcontacts)",
  type: "source",
  version: "0.0.7",
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
      return this.zohoDesk.getContacts;
    },
    getResourceFnArgs() {
      return {
        headers: {
          orgId: this.orgId,
        },
        params: {
          sortBy: "createdTime", // firstName | lastName | createdTime
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
        summary: `Contact ID ${resource.id}`,
      };
    },
  },
};
