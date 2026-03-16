import common from "../common/event.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  ...common,
  key: "eventbrite-new-event-ended",
  name: "New Event Ended",
  description: "Emit new event when an event has ended",
  version: "0.0.7",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      const params = {
        orgId: this.organization,
        params: {
          status: "ended,completed",
        },
      };
      const eventStream = await this.resourceStream(
        this.eventbrite.listEvents.bind(this),
        "events",
        params,
      );
      for await (const event of eventStream) {
        this.emitEvent(event);
      }
    },
    activate() { },
    deactivate() { },
  },
  async run() {
    const params = {
      orgId: this.organization,
      params: {
        status: "ended,completed",
      },
    };
    const eventStream = await this.resourceStream(
      this.eventbrite.listEvents.bind(this),
      "events",
      params,
    );
    for await (const newEvent of eventStream) {
      this.emitEvent(newEvent);
    }
  },
};
