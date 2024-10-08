import bubble from "../../bubble.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bubble-modify-thing",
  name: "Modify Thing",
  description: "Modifies an existing thing in the Bubble database by providing the thing's ID. [See the documentation](https://manual.bubble.io/core-resources/api/the-bubble-api/the-data-api/data-api-requests)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bubble,
    thingId: {
      propDefinition: [
        bubble,
        "thingId",
      ],
    },
    attributeToModify: {
      propDefinition: [
        bubble,
        "attributeToModify",
      ],
      optional: true,
    },
    newValue: {
      propDefinition: [
        bubble,
        "newValue",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bubble.modifyThingById({
      thingId: this.thingId,
      attributeToModify: this.attributeToModify,
      newValue: this.newValue,
    });

    $.export("$summary", `Successfully modified the thing with ID ${this.thingId}`);
    return response;
  },
};
