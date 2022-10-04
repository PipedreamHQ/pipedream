import app from "../../app/apitemplate_io.app";
import { ConfigurationError } from "@pipedream/platform";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Create Image",
  description: "Create a new image. [See the docs](https://apitemplate.io/apiv2/#tag/API-Integration/operation/create-image) for more information",
  key: "apitemplate_io-create-image",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
        () => ({
          format: "JPEG",
        }),
      ],
    },
    overrides: {
      propDefinition: [
        app,
        "overrides",
      ],
    },
    apiEndpoints: {
      propDefinition: [
        app,
        "apiEndpoints",
      ],
    },
    expiration: {
      propDefinition: [
        app,
        "expiration",
      ],
    },
    meta: {
      propDefinition: [
        app,
        "meta",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      template_id: this.templateId,
      expiration: this.expiration,
      meta: this.meta,
    };

    let overrides = this.overrides;
    if (overrides && typeof (this.overrides) === "string") {
      overrides = JSON.parse(this.overrides);
    }

    if (overrides && !Array.isArray(overrides)) {
      throw new ConfigurationError("Override must ba an array of objects with the property name and the replaced values on the template.");
    }

    const data = {
      overrides,
    };

    const response = await this.app.createImage($, this.apiEndpoints, params, data);
    $.export("$summary", `Successfully created a new image: ${response.transaction_ref}`);
    return response;
  },
});
