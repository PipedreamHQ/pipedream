import formstack from "../../formstack.app.mjs";

export default {
  key: "formstack-new-form",
  name: "New Form",
  description: "Emit new event for each new form added. [See docs here](https://formstack.readme.io/docs/form-id-webhook-post)",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  props: {
    formstack,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run({ $ }) {
    const forms = await this.formstack.getAllResources({
      getResourcesFn: this.formstack.getForms,
      $,
    });

    for (const form of forms) {
      this.$emit(form, {
        id: form.id,
        summary: `New form ${form.name} created`,
        ts: Date.now(),
      });
    }
  },
};
