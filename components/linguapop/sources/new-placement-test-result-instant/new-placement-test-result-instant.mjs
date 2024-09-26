import linguapop from "../../linguapop.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "linguapop-new-placement-test-result-instant",
  name: "New Placement Test Result (Instant)",
  description: "Emit new event when a placement test is completed. Must setup the source's URL as the `callbackUrl` when sending the test invitation. [See the documentation](https://docs.linguapop.eu/api/#sendcreate-an-invitation-to-a-placement-test)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    linguapop,
    http: "$.interface.http",
  },
  methods: {
    generateMeta(result) {
      return {
        id: result.invitationId,
        summary: `Test completed by ${result.email}`,
        ts: Date.parse(result.completedOn),
      };
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
  sampleEmit,
};
