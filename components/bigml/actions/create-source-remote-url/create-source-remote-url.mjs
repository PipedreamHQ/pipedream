import bigml from "../../bigml.app.mjs";

export default {
  key: "bigml-create-source-remote-url",
  name: "Create Source (Remote URL)",
  description: "Create a source with a provided remote URL that points to the data file that you want BigML to download for you. [See the docs.](https://bigml.com/api/sources?id=creating-a-source-using-a-url)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bigml,
    remote: {
      type: "string",
      label: "Remote URL",
      description: "The remote URL of the source file",
    },
  },
  async run({ $ }) {
    const response = await this.bigml.createSource({
      $,
      data: {
        remote: this.remote,
      },
    });
    $.export("$summary", "Succesfully created source");
    return response;
  },
};
