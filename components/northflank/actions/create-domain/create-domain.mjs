import app from "../../northflank.app.mjs";

export default {
  key: "northflank-create-domain",
  name: "Create Domain",
  description: "Creates a new domain on Northflank. [See the documentation](https://northflank.com/docs/v1/api/domains/create-new-domain)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createDomain({
      $,
      data: {
        domain: this.domain,
      },
    });
    $.export("$summary", `Successfully created domain: ${this.domain}`);
    return response;
  },
};
