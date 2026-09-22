import aws from "../../aws.app.mjs";

export default {
  key: "aws-list-region-options",
  name: "List AWS Region Options",
  description: "Retrieves available options for the AWS Region field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aws,
  },
  async run({ $ }) {
    const options = await aws.propDefinitions.region.options.call(this.aws);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
