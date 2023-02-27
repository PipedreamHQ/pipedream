import base from "../common/webhooks.mjs";

export default {
  ...base,
  key: "fibery-entity-updated",
  name: "Entity Updated",
  description: "Emit new event for every updated entity of a certain type",
  type: "source",
  version: "0.0.1",
  async run(event) {
    console.log(`Received new event with ${event.body.effects.length} sequence(s)`);
    event.body.effects
      .filter(({ effect }) => effect === "fibery.entity/update")
      .forEach((effect) => {
        this.$emit(effect, {
          summary: `Updated entity: ${effect.id}`,
          ts: effect["fibery/modification-date"],
        });
      });
  },
};
