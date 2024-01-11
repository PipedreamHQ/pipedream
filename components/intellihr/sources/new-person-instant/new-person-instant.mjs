import intellihr from "../../intellihr.app.mjs";

export default {
  key: "intellihr-new-person-instant",
  name: "New Person Instant",
  description: "Emits a new event when a new person is created in intellihr.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    intellihr,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const id = data.id;
      const summary = `New Person: ${data.first_name} ${data.last_name}`;
      const ts = Date.parse(data.created_at);
      return {
        id,
        summary,
        ts,
      };
    },
  },
  hooks: {
    async deploy() {
      // get the last 50 persons
      const persons = await this.intellihr.searchPerson({
        params: {
          limit: 50,
        },
      });
      if (persons.length > 0) {
        // sort by creation date
        persons.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        // store the most recent person's id
        this.db.set("since_id", persons[0].id);
      }
    },
  },
  async run() {
    // get the most recent person's id
    const sinceId = this.db.get("since_id");
    // get the new persons
    const persons = await this.intellihr.searchPerson({
      params: {
        since_id: sinceId,
      },
    });
    for (const person of persons) {
      // emit the new person
      const meta = this.generateMeta(person);
      this.$emit(person, meta);
      // update the most recent person's id
      this.db.set("since_id", person.id);
    }
  },
};
