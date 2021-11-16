const salesforce = require("./salesforce.app");

module.exports = {
  dedupe: "unique",
  props: {
    db: "$.service.db",
    salesforce,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The type of object for which to monitor events",
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return {
            options: [],
          };
        }

        const { sobjects } = await this.salesforce.listSObjectTypes();
        const options = sobjects
          .filter(this.isValidSObject)
          .map((sobject) => ({
            label: sobject.label,
            value: sobject.name,
          }));
        return {
          options,
        };
      },
    },
  },
  hooks: {
    async activate() {
      const latestDateCovered = this.db.get("latestDateCovered");
      if (!latestDateCovered) {
        const now = new Date().toISOString();
        this.db.set("latestDateCovered", now);
      }

      const nameField = await this.salesforce.getNameFieldForObjectType(this.objectType);
      this.db.set("nameField", nameField);
    },
  },
  methods: {
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
    const startTimestamp = this.db.get("latestDateCovered");
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
