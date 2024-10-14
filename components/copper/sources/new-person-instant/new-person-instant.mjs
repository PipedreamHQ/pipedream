import copper from "../../copper.app.mjs";

export default {
  key: "copper-new-person-instant",
  name: "New Person Instant",
  description: "Emits a new event when a person object is newly created in Copper",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    copper,
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
      const summary = `New Person: ${data.name}`;
      const ts = Date.parse(data.created_date);
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const lastRun = this.db.get("lastRun") || this.timer.intervalSeconds;
    const now = Math.floor(Date.now() / 1000);
    const newPersons = await this.copper.getNewPerson();

    for (const person of newPersons) {
      const createdDate = Math.floor(Date.parse(person.created_date) / 1000);

      if (createdDate > lastRun) {
        const meta = this.generateMeta(person);
        this.$emit(person, meta);
      }
    }

    this.db.set("lastRun", now);
  },
};
