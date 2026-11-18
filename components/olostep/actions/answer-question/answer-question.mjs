import olostep from "../../olostep.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "olostep-answer-question",
  name: "Answer Question",
  description: "Answer a question or complete a research task from the live web, and return the answer with its source URLs. Use it when you need an answer rather than a list of pages; use **Search Web** to get the pages instead. [See the documentation](https://docs.olostep.com/api-reference/answers/create)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
      description: "The shape of the answer: a JSON object with empty values, e.g. `{\"company\": \"\", \"founded_year\": \"\"}`, or a plain description of the data, e.g. `the company's founding year`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.olostep.answerQuestion({
      $,
      data: {
        task: this.task,
        json_format: parseObject(this.jsonFormat),
      },
    });
    $.export("$summary", "Successfully answered the task");
    return response;
  },
};
