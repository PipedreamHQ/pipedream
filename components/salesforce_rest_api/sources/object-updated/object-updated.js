const startCase = require("lodash/startCase");

const common = require("../../common");

module.exports = {
  ...common,
  type: "source",
  name: "Object Updated (of Selectable Type)",
  key: "salesforce_rest_api-object-updated",
  description: `
    Emit new event (at regular intervals) when an object of arbitrary type
    (selected as an input parameter by the user) is updated
  `,
  version: "0.0.3",
  methods: {
    ...common.methods,
    generateMeta(item) {
      const nameField = this.db.get("nameField");
      const {
        LastModifiedDate: lastModifiedDate,
        Id: id,
        [nameField]: name,
      } = item;
      const entityType = startCase(this.objectType);
      const summary = `${entityType} updated: ${name}`;
      const ts = Date.parse(lastModifiedDate);
      const compositeId = `${id}-${ts}`;
      return {
        id: compositeId,
        summary,
        ts,
      };
    },
    async processEvent(eventData) {
      const {
        startTimestamp,
        endTimestamp,
      } = eventData;
      const {
        ids,
        latestDateCovered,
      } = await this.salesforce.getUpdatedForObjectType(
        this.objectType,
        startTimestamp,
        endTimestamp,
      );

      // By the time we try to retrieve an item, it might've been deleted. This
      // will cause `getSObject` to throw a 404 exception, which will reject its
      // promise. Hence, we need to filter those items that we still in Salesforce
      // and exclude those that are not.
      const itemRetrievals = await Promise.allSettled(
        ids.map((id) => this.salesforce.getSObject(this.objectType, id)),
      );
      itemRetrievals
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value)
        .forEach((item) => {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
        });

      this.db.set("latestDateCovered", latestDateCovered);
    },
  },
};
