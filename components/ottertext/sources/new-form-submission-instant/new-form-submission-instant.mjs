import ottertext from "../../ottertext.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ottertext-new-form-submission-instant",
  name: "New Form Submission Instant",
  description: "Emit new event when a customer submits a form on the website opt-in page or chat.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ottertext: {
      type: "app",
      app: "ottertext",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    formId: {
      propDefinition: [
        ottertext,
        "formId",
      ],
    },
    formType: {
      propDefinition: [
        ottertext,
        "formType",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Since this is an instant trigger, we don't fetch historical data here.
    },
    async activate() {
      // This source does not create a webhook on activate because it's designed to receive payloads directly
    },
    async deactivate() {
      // This source does not delete a webhook on deactivate because it doesn't create one
    },
  },
  async run(event) {
    const { body } = event;
    if (body.formId === this.formId && body.formType === this.formType) {
      this.$emit(body, {
        id: body.id || `${Date.now()}`,
        summary: `New submission for form ${body.formId}`,
        ts: body.ts
          ? Date.parse(body.ts)
          : Date.now(),
      });
    } else {
      this.http.respond({
        status: 404,
        body: "Form ID or Type does not match configured parameters.",
      });
    }
  },
};
