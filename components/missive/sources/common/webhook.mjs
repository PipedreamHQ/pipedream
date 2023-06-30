import { ConfigurationError } from "@pipedream/platform";
import common from "./base.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    ...common.methods,
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    isEventRelevant(event) {
      return event.rule?.type === this.getEventName();
    },
  },
  async run({ body }) {
    if (!this.isEventRelevant(body)) {
      console.log("Event is not relevant", JSON.stringify(body.rule, null, 2));
      return;
    }
    this.http.respond({
      status: 200,
    });
    this.$emit(body, this.generateMeta(body));
  },
};
