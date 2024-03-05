import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "satuit-new-contact",
  name: "New Contact Created",
  description: "Emit new event each time a new contact is created in Satuit. [See the documentation](https://satuittechnologies.zendesk.com/hc/en-us/articles/360055725213-Satuit-REST-API-Postman-Documentation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "pcontact.iconkey";
    },
    getResourceName() {
      return "Result";
    },
    getResourcesFn() {
      return this.app.getContact;
    },
    getResourcesFnArgs() {
      return {
        params: {
          pagesize: constants.DEFAULT_LIMIT,
          orderby: encodeURIComponent(
            JSON.stringify({
              [this.getFieldId()]: "desc",
            }),
          ),
        },
      };
    },
    generateMeta(resource) {
      const {
        [this.getFieldId()]: id,
        ["pcontact.dcreated"]: createdAt,
      } = resource;
      return {
        id,
        summary: `New Contact: ${id}`,
        ts: Date.parse(createdAt),
      };
    },
  },
};
