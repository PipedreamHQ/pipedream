import olostep from "../../olostep.app.mjs";

export default {
  key: "olostep-answer-question",
  name: "Answer Question",
  description: "Answer a question or complete a research task from the live web, with source URLs. [See the documentation](https://docs.olostep.com/api-reference/answers/create)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    olostep,
    task: {
      type: "string",
      label: "Task",
      description: "The question or task, e.g. `What is the latest stable version of Next.js?`",
    },
    jsonFormat: {
      type: "string",
      label: "JSON Format",
      description: "The shape of the answer you want: a JSON object with empty values, e.g. `{\"company\": \"\", \"founded_year\": \"\"}`, or a plain description of the data",
      optional: true,
    },
  },
  async run({ $ }) {
    let jsonFormat = this.jsonFormat;
    if (typeof jsonFormat === "string") {
      try {
        jsonFormat = JSON.parse(jsonFormat);
      } catch {
        // A plain-text description is also accepted.
      }
    }
    const response = await this.olostep.answer({
      $,
      data: {
        task: this.task,
        json_format: jsonFormat,
      },
    });
    $.export("$summary", "Successfully answered the task");
    return response;
  },
};
