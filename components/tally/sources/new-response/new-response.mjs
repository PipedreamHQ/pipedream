import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "New Response (Instant)",
  version: "0.0.4",
  key: "tally-new-response",
  description: "Emit new event on each form message. [See the documentation](https://tallyso.notion.site/Tally-OAuth-2-reference-d0442c679a464664823628f675f43454)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventTypes() {
      return [
        "FORM_RESPONSE",
      ];
    },
    emitEvent(response) {
      const data = response.raw_webhook_event.data;
      this.$emit(response, {
        id: data.responseId,
        summary: `New response for ${data.formName} form`,
        ts: Date.parse(data.createdAt),
      });
    },
    getSingleResponse(field) {
      const fieldValue = Array.isArray(field.value)
        ? field.value[0]
        : field.value;
      const { text } = field.options.find(({ id }) => id === fieldValue);
      return text;
    },
    getMultipeResponses(field) {
      return (field.options.filter(({ id }) => field.value.includes(id)).map(({ text }) => text))
        .join();
    },
    getUrlResponse(field) {
      return (field.value.map(({ url }) => url)).join();
    },
  },
  async run(event) {
    const fields = event?.body?.data?.fields;
    if (!fields.length) {
      return;
    }

    const data = {
      form_response_parsed: {},
    };
    let formResponseString = "";

    for (const field of fields) {
      if (!field.value) {
        continue;
      }
      let parsedAnswer = field.value;
      if (field.type === "MULTIPLE_CHOICE") {
        parsedAnswer = this.getSingleResponse(field);
      }
      if (field.type === "CHECKBOXES" || field.type === "DROPDOWN" || field.type === "MULTI_SELECT" || field.type === "RANKING") {
        if (!field.options) {
          continue;
        }
        parsedAnswer = this.getMultipeResponses(field);
      }
      if (field.type === "FILE_UPLOAD" || field.type === "SIGNATURE") {
        parsedAnswer = this.getUrlResponse(field);
      }
      if (field.type === "MATRIX") {
        const rows = Object.keys(field.value);
        let answers = [];
        for (const rowId of rows) {
          const row = (field.rows.find(({ id }) => id === rowId)).text;
          const columnId = field.value[rowId][0];
          const column = (field.columns.find(({ id }) => id === columnId)).text;
          answers.push(`${row} ${column}`);
        }
        parsedAnswer = answers.join();
      }

      const label = field.label || field.key;

      data.form_response_parsed[label] = parsedAnswer;
      formResponseString += `### ${label}\n${parsedAnswer}\n`;
    }

    data.form_response_string = formResponseString;
    data.raw_webhook_event = event.body;

    this.emitEvent(data);
  },
  sampleEmit,
};
