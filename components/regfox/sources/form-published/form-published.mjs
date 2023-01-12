import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "regfox-form-published",
  name: "New Form Published",
  description: "Emit new event when a form is succesfully published. [See docs here.](https://docs.webconnex.io/api/v2/#form-publish-event)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      let lastId;
      const allForms = [];

      while (true) {
        const response = await this.regfox.listForms({
          params: {
            startingAfter: lastId,
            limit: constants.MAX_LIMIT,
          },
        });

        allForms.push(...response.data);
        lastId = allForms[allForms.length - 1]?.id;

        if (!response.hasMore) {
          break;
        }
      }

      allForms
        .slice(constants.DEPLOY_LIMIT)
        .forEach((form) => this.emitEvent({
          event: form,
          id: form.id,
          name: form.name,
          ts: form.dateCreated,
        }));
    },
  },
  methods: {
    ...base.methods,
    eventTypes() {
      return [
        "publish",
      ];
    },
    emitEvent({
      event, id, name, ts,
    }) {
      console.log("Emitting form published event...");
      this.$emit(event, {
        id,
        summary: `New form published: ${name}`,
        ts: new Date(ts),
      });
    },
    processEvent(event) {
      this.emitEvent({
        event,
        id: event.formId,
        name: event.data.name,
        ts: event.datePublished,
      });
    },
  },
};
