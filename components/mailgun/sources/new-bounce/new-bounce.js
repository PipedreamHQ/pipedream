const common = require("../common-webhook");
const { mailgun } = common.props;

module.exports = {
  ...common,
  key: "new-bounce",
  name: "New bounce",
  description:
    "Emit an event when the email recipient who could not be reached.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    domain: { propDefinition: [mailgun, "domain"] },
  },
  methods: {
    ...common.methods,
    getEventName() {
      return ["bounce"];
    },
    getEventType() {
      return "bounced";
    },            
    generateMeta(eventPayload) {
      const ts = eventPayload.timestamp;
      return {
        id: `${eventPayload["X-Mailgun-Sid"]}${ts}`,
        summary: `New Bounce on message id: ${eventPayload["Message-Id"]} by ${eventPayload.recipient}`,
        ts,
      };
    },
    emitEvent(eventPayload) {      
      const eventTypes = this.getEventType();
      console.log(eventPayload.event);
      if (eventTypes.includes(eventPayload.event)) {
        const meta = this.generateMeta(eventPayload);
        this.$emit(eventPayload, meta);
      }
    },        
  },
  async run(eventRawData) {
    const eventWorkload = eventRawData.body;
    const { timestamp, token, signature } = eventWorkload;
    console.log(timestamp);
    console.log(token);
    console.log(signature);
    if (!this.verify(this.webhookSigningKey, timestamp, token, signature)) {
      throw new Error("signature mismatch");
    }
    this.emitEvent(eventWorkload);
  },  
};