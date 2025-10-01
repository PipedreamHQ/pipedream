import delightedApp from "../../delighted.app.mjs";

export default {
  key: "delighted-sending-to-people",
  name: "Sending to People",
  description: "Create or update a person and send a survey email. [See the docs here](https://app.delighted.com/docs/api/sending-to-people)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    delightedApp,
    email: {
      type: "string",
      label: "Email",
      description: "Email of the person.",
    },
    name: {
      type: "string",
      optional: true,
      label: "Name",
      description: "Name of the person.",
    },
    properties: {
      type: "object",
      optional: true,
      label: "Properties",
      description: "Custom properties to associate with the survey. You can add as many properties as you need.",
    },
  },
  async run({ $ }) {
    const response =
      await this.delightedApp.sendingToPeople({
        email: this.email,
        name: this.name,
        properties: this.properties,
      });

    $.export("$summary", `Successfully sent survey to person with ID ${response.id}`);

    return response;
  },
};
