import app from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-create-segment",
  name: "Create Segment",
  description: "Create a segment in an Elastic Email account. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#tag/Segments)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
  },
  async run() {
  },
};
