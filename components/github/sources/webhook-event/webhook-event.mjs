import common from "../common/common-webhook.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "github-weebhook-vents",
  name: "New Webhook Event (Instant)",
  description: "Emit new event for each selected event types",
  type: "source",
  version: "0.0.1",
  props: {
    ...common.props,
    events: {
      label: "Webhook Events",
      description: "The event will be emited",
      type: "string[]",
      options: constants.REPOSITORY_WEBHOOK_EVENTS.map(({
        value, label,
      }) => ({
        value,
        label,
      })),
    },
  },
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return this.events;
    },
    async loadHistoricalData() {
      const func = constants
        .REPOSITORY_WEBHOOK_EVENTS
        .find((item) => this.events[0] === item.value);
      if (func?.fnName) {
        const data = await this["github"][func.fnName]({
          repoFullname: this.repoFullname,
          data: {
            per_page: 25,
            page: 1,
          },
        });
        console.log("data", data);
        const ts = new Date().getTime();
        if (data) {
          return data.map((event) => ({
            main: event,
            sub: {
              id: event?.id || event?.name || ts,
              summary: `New event of type ${constants.REPOSITORY_WEBHOOK_EVENTS.find((item) => this.events[0] === item.value).label}`,
              ts,
            },
          }));
        }
      }

    },
  },
  async run(event) {
    const {
      headers,
      body,
    } = event;

    this.$emit(body, {
      id: headers["x-github-delivery"],
      summary: `New event ${headers["x-github-hook-installation-target-id"]} of type ${headers["x-github-hook-installation-target-type"]}}`,
      ts: new Date(),
    });
  },
};
