import qs from "qs";
import formsite from "../../formsite.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "formsite-new-form-result-instant",
  name: "New Form Result (Instant)",
  description: "Emit new event when a form result is completed. [Formsite API](https://support.formsite.com/hc/en-us/articles/46181026038931-API)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    formsite,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    formDir: {
      propDefinition: [
        formsite,
        "formDir",
      ],
    },
  },
  hooks: {
    async activate() {
      await this.formsite.createWebhook({
        formDir: this.formDir,
        maxBodyLength: Infinity,
        data: qs.stringify({
          event: "result_completed",
          url: this.http.endpoint,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    async deactivate() {
      await this.formsite.deleteWebhook({
        formDir: this.formDir,
        params: {
          url: this.http.endpoint,
        },
      });
    },
  },
  async run({ body }) {

    this.http.respond({
      status: 200,
    });

    this.$emit(body, {
      id: `${body.id}`,
      summary: `New form result with ID: ${body.id}`,
      ts: body.date_finish
        ? Date.parse(body.date_finish)
        : Date.now(),
    });
  },
  sampleEmit,
};
