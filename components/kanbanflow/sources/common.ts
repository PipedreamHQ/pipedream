import kanbanflow from "../app/kanbanflow.app";
import { SourceHttpRunOptions } from "@pipedream/types";
import { CreateHookParams, Webhook, WebhookData } from "../common/types";

export default {
  props: {
    kanbanflow,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    getHookFilter() {
      // filter is optional - if not implemented, returns undefined
    },
    getHookName() {
      throw new Error("Hook name not defined for this source");
    },
    getHookType() {
      throw new Error("Hook type not defined for this source");
    },
    getSummary() {
      throw new Error("Summary not defined for this source");
    },
  },
  hooks: {
    async activate() {
      const data: CreateHookParams = {
        name: `Pipedream: ${this.getHookName()}`,
        callbackUrl: this.http.endpoint,
        events: [{ name: this.getHookType() }],
        ...this.getHookFilter()
      };

      const { webhookId }: Webhook = await this.kanbanflow.createHook(data);
      this.db.set("hookId", webhookId);
    },
    async deactivate() {
      const id: string = this.db.get("hookId");
      await this.kanbanflow.deleteHook(id);
    },
  },
  async run(data: SourceHttpRunOptions) {
    this.http.respond({
      status: 200,
    });

    const body = data.body as WebhookData;
    
    const id = body.task._id;
    const summary = this.getSummary(body);
    const ts = new Date(body.timestamp).valueOf();

    if (data.method !== "HEAD") {
      this.$emit(body, {
        id,
        summary,
        ts,
    });
    }
  },
};
