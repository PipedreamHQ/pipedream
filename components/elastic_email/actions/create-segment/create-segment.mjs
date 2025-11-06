import app from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-create-segment",
  name: "Create Segment",
  description: "Create a segment in an Elastic Email account. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#tag/Segments)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Segment Name",
      description: "The name of the segment",
    },
    rule: {
      type: "string",
      label: "Rule",
      description: "SQL-like rule to determine which Contacts belong to this Segment. Help for building a segment rule can be found [here](https://help.elasticemail.com/en/articles/5162182-segment-rules)",
    },
  },
  async run({ $ }) {
    const response = await this.app.createSegment({
      $,
      data: {
        Name: this.name,
        Rule: this.rule,
      },
    });
    $.export("$summary", "Segment created successfully");
    return response;
  },
};
