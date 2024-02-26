import { axios } from "@pipedream/platform";
import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-new-person-instant",
  name: "New Person Profile Created",
  description: "Emits an event when a new person profile is created. [See the documentation]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    nutshell,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900, // 15 minutes
      },
    },
  },
  methods: {
    ...nutshell.methods,
    generateMeta(data) {
      const {
        id, createdTime, firstName, lastName,
      } = data;
      const summary = `New Person: ${firstName} ${lastName}`;
      return {
        id,
        summary,
        ts: Date.parse(createdTime),
      };
    },
  },
  async run() {
    const lastTimestamp = this.db.get("lastTimestamp") || 0;
    let newLastTimestamp = lastTimestamp;

    // Assuming Nutshell API provides a method to fetch recent person profiles
    const response = await this.nutshell.findOrCreatePerson({
      email: this.email, // Dynamically fetch new persons
    });

    response.forEach((person) => {
      const createdTime = new Date(person.createdTime).getTime();
      if (createdTime > lastTimestamp) {
        this.$emit(person, this.generateMeta(person));

        if (createdTime > newLastTimestamp) {
          newLastTimestamp = createdTime;
        }
      }
    });

    if (newLastTimestamp !== lastTimestamp) {
      this.db.set("lastTimestamp", newLastTimestamp);
    }
  },
};
