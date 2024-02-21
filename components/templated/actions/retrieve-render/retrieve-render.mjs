import templated from "../../templated.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "templated-retrieve-render",
  name: "Retrieve Render",
  description: "Retrieves a single render object referenced by its unique ID. [See the documentation](https://app.templated.io/docs#retrieve-render)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    templated,
    renderId: {
      propDefinition: [
        templated,
        "renderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.templated.retrieveRender({
      renderId: this.renderId,
    });
    $.export("$summary", `Successfully retrieved render with ID: ${this.renderId}`);
    return response;
  },
};
