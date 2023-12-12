import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "missive-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is added. [See the Documentation](https://missiveapp.com/help/api-documentation/rest-endpoints#list-contacts)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    contactBookId: {
      propDefinition: [
        common.props.app,
        "contactBookId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceName() {
      return "contacts";
    },
    getResourceFn() {
      return this.app.listContacts;
    },
    getResourceFnArgs() {
      return {
        params: {
          contact_book: this.contactBookId,
          order: "last_modified",
          limit: constants.DEFAULT_LIMIT,
          modified_since: this.getLastModifiedAt(),
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Contact: ${resource.first_name}`,
        ts: resource.modified_at,
      };
    },
  },
};
