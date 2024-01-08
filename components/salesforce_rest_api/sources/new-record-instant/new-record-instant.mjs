import startCase from "lodash/startCase.js";
import common from "../common-instant.mjs";

export default {
  ...common,
  type: "source",
  name: "New Record (Instant, of Selectable Type)",
  key: "salesforce_rest_api-new-record-instant",
  description: "Emit new event immediately after a record of arbitrary object type (selected as an input parameter by the user) is created",
  version: "0.0.3",
  hooks: {
    ...common.hooks,
    async deploy() {
      const objectType = this.objectType;
      const nameField = await this.salesforce.getNameFieldForObjectType(objectType);
      this.setNameField(nameField);

      // emit hisorical events
      const { recentItems } = await this.salesforce.listSObjectTypeIds(objectType);
      const ids = recentItems.map((item) => item.Id);
      for (const id of ids.slice(-25)) {
        const object = await this.salesforce.getSObject(objectType, id);
        const event = {
          body: {
            "New": object,
            "UserId": id,
          },
        };
        this.processEvent(event);
      }
    },
  },
  methods: {
    ...common.methods,
    generateMeta(data) {
      const nameField = this.getNameField();
      const { New: newObject } = data.body;
      const {
        CreatedDate: createdDate,
        Id: id,
        [nameField]: name,
      } = newObject;
      const entityType = startCase(this.objectType).toLowerCase();
      const summary = `New ${entityType} created: ${name}`;
      const ts = Date.parse(createdDate);
      return {
        id,
        summary,
        ts,
      };
    },
    getEventType() {
      return "new";
    },
  },
};
