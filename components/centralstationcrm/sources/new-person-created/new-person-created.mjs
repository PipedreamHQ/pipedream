import common from "../common/base.mjs";

export default {
  ...common,
  key: "centralstationcrm-new-person-created",
  name: "New Person Created",
  description: "Emit new event when a new person is created in CentralStationCRM.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.centralstationcrm.listPeople;
    },
    getResourceType() {
      return "person";
    },
    generateMeta(person) {
      return {
        id: person.id,
        summary: `${person.first_name} ${person.name}`,
        ts: Date.parse(person.created_at),
      };
    },
  },
};
