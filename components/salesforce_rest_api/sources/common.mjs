import salesforce from "../salesforce_rest_api.app.mjs";

export default {
  dedupe: "unique",
  props: {
    salesforce,
    db: "$.service.db",
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    objectType: {
      label: "Object Type",
      description: "The type of object for which to monitor events",
      propDefinition: [
        salesforce,
        "objectType",
      ],
    },
  },
  hooks: {
    async activate() {
      const latestDateCovered = this.getLatestDateCovered();
      if (!latestDateCovered) {
        const now = new Date().toISOString();
        this.setLatestDateCovered(now);
      }

      const nameField = await this.salesforce.getNameFieldForObjectType(this.objectType);
      this.setNameField(nameField);
    },
  },
  methods: {
    getLatestDateCovered() {
      return this.db.get("latestDateCovered");
    },
    setLatestDateCovered(latestDateCovered) {
      this.db.set("latestDateCovered", latestDateCovered);
    },
    getNameField() {
      return this.db.get("nameField");
    },
    setNameField(nameField) {
      this.db.set("nameField", nameField);
    },
    isValidSObject(sobject) {
      // Only the activity of those SObject types that have the `replicateable`
      // flag set is published via the `getUpdated` API.
      //
      // See the API docs here: https://sforce.co/3gDy3uP
      return sobject.replicateable;
    },
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
  async run(event) {
    const startTimestamp = this.getLatestDateCovered();
    const endTimestamp = new Date(event.timestamp * 1000).toISOString();
    const timeDiffSec = Math.floor(
      (Date.parse(endTimestamp) - Date.parse(startTimestamp)) / 1000,
    );
    if (timeDiffSec < 60) {
      console.log(`
        Skipping execution since the last one happened approximately ${timeDiffSec} seconds ago
      `);
      return;
    }

    await this.processEvent({
      startTimestamp,
      endTimestamp,
    });
  },
};
