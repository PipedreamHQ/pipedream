import akeneo from "../../akeneo.app.mjs";

export default {
  key: "akeneo-list-channel-code-options",
  name: "List Channel Code Options",
  description: "Retrieves available options for the Channel Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    akeneo,
    page: {
      propDefinition: [
        akeneo,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const options = await akeneo.propDefinitions.channelCode.options
      .call(this.akeneo, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
