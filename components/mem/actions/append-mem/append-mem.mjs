import mem from "../../mem.app.mjs";

export default {
  key: "mem-append-mem",
  name: "Append Mem",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new mem. [See the documentation](https://docs.mem.ai/docs/api/mems/create)",
  type: "action",
  props: {
    mem,
    memId: {
      type: "string",
      label: "Mem ID",
      description: "The Id of the mem you want to append.",
    },
    content: {
      propDefinition: [
        mem,
        "content",
      ],
      description: "The content which will be appended to the end of the existing mem. The string should be in a markdown-compatible format. For more details, see the [Mem Markdown Format](https://docs.mem.ai/docs/general/mem-markdown-format).",
    },
  },
  async run({ $ }) {
    const {
      mem,
      memId,
      ...data
    } = this;

    const response = await mem.appendMem({
      $,
      memId,
      data,
    });

    $.export("$summary", `The mem with Id: ${response.id} was successfully updated!`);
    return response;
  },
};
