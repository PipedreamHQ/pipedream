import base from "../common/webhooks.mjs";

export default {
  ...base,
  key: "fibery-entity-created",
  name: "New Entity Created",
  description: "Emit new event for every created entity of a certain type. [See the docs here](https://api.fibery.io/#webhooks)",
  type: "source",
  dedupe: "unique",
  version: "0.0.1",
  async run(event) {
    console.log(`Received new event with ${event.body.effects.length} sequence(s)`);
    event.body.effects
      .filter(({ effect }) => effect === "fibery.entity/create")
      .forEach((entity) => {
        this.$emit(entity, {
          id: entity.id,
          summary: `New created entity: ${this.getEntityId(entity)}`,
          ts: entity.values["fibery/creation-date"],
        });
      });
  },
};
