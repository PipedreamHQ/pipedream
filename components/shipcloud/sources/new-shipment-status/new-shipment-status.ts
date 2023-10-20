import shipcloud from "../../app/shipcloud.app";
import {
  defineSource, SourceHttpRunOptions,
} from "@pipedream/types";
import { CreateHookParams } from "../../common/requestParams";
import { Webhook } from "../../common/responseSchemas";
import { WEBHOOK_EVENT_TYPES } from "../../common/constants";

export default defineSource({
  name: "New Shipment Status",
  description:
    "Emit new event for shipment status changes [See docs here](https://developers.shipcloud.io/reference/#webhooks)",
  key: "shipcloud-new-shipment-status",
  version: "0.0.1",
  type: "source",
  props: {
    shipcloud,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    eventTypes: {
      label: "Event types",
      description: "The shipment update(s) that should trigger an event",
      type: "string[]",
      options: WEBHOOK_EVENT_TYPES,
    },
  },
  hooks: {
    async activate() {
      const data: CreateHookParams = {
        event_types: this.eventTypes,
        url: this.http.endpoint,
      };

      const { id }: Webhook = await this.shipcloud.createHook(data);

      this.db.set("hookId", id);
    },
    async deactivate() {
      const id: string = this.db.get("hookId");

      await this.shipcloud.deleteHook({
        id,
      });
    },
  },
  async run(data: SourceHttpRunOptions) {
    this.http.respond({
      status: 200,
    });

    const { body } = data;

    let { id } = body;
    if (typeof id !== "string") {
      id = Date.now();
    }

    let summary = body.type;
    if (typeof summary !== "string") {
      summary = "Unknown event type";
    }

    const date = body.occured_at;
    const ts = typeof date === "string"
      ? new Date(date).valueOf()
      : Date.now();

    this.$emit(body, {
      id,
      summary,
      ts,
    });
  },
});
