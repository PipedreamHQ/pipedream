import bubble from "../../bubble.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bubble-create-thing",
  name: "Create Thing",
  description: "Creates a new thing in the Bubble database. [See the documentation](https://manual.bubble.io/core-resources/api/the-bubble-api/the-data-api/data-api-requests#create-a-thing)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bubble,
    thingAttributes: {
      propDefinition: [
        bubble,
        "thingAttributes",
      ],
      type: "object",
      label: "Thing Attributes",
      description: "The attributes for the new thing to create in the Bubble database",
    },
  },
  async run({ $ }) {
    const response = await this.bubble.createNewThing({
      thingAttributes: this.thingAttributes,
    });

    $.export("$summary", `Successfully created thing with ID: ${response.id}`);
    return response;
  },
};
