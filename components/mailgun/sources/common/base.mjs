import mailgun from "../../mailgun.app.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  props: {
    mailgun,
    domain: {
      propDefinition: [
        mailgun,
        "domain",
      ],
    },
  },
  methods: {
    generateMeta() {
      return {
        id: uuidv4(),
        summary: "New event",
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const meta = this.generateMeta(event);
    this.$emit(event, meta);
  },
};
