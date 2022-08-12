import shipcloud from "../../app/shipcloud.app";
import { defineSource, SourceHttpRunOptions } from "@pipedream/types";
import { CreateHookParams } from "../../common/requestParams";
import { Webhook } from "../../common/responseSchemas";
import { WEBHOOK_EVENT_TYPES } from "../../common/constants";

export default defineSource({
  name: "New Shipment Status",
  description:
    "Emit new event for shipment status changes [See docs here](https://developers.shipcloud.io/reference/#webhooks)",
  key: "infusionsoft-new-appointment",
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
      options: WEBHOOK_EVENT_TYPES
    }
  },
  hooks: {
    async activate() {
      const data: CreateHookParams = {
        event_types: this.eventTypes,
        url: this.http.endpoint,
      };

      const { id }: Webhook = await this.infusionsoft.createHook(data);

      this.db.set("hookId", id);
    },
    async deactivate() {
      const id: string = this.db.get("hookId");

      await this.infusionsoft.deleteHook({
        id,
      });
    },
  },
  async run(data: SourceHttpRunOptions) {
    this.http.respond({
      status: 200,
    });

    this.$emit(data, {
      id: Date.now(),
      summary: "test summary",
      ts: Date.now(),
    });
  },
});
