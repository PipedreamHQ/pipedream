import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-update-custom-object-by-id",
  name: "Update Custom Object by ID",
  description: "Updates a custom object identified by ID in Kustomer. [See the documentation](https://developer.kustomer.com/kustomer-api-docs/reference/updatekobject)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kustomer,
    klassName: {
      propDefinition: [
        kustomer,
        "klassName",
      ],
    },
    customObjectId: {
      propDefinition: [
        kustomer,
        "customObjectId",
        ({ klassName }) => ({
          klassName,
        }),
      ],
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "The external ID of the custom object to update",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the custom object to update",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the custom object to update",
      optional: true,
    },
    data: {
      type: "object",
      label: "Data",
      description: "The data to update the custom object with",
      optional: true,
    },
    custom: {
      type: "object",
      label: "Custom",
      description: "The custom data of the custom object to update",
      optional: true,
    },
    tags: {
      propDefinition: [
        kustomer,
        "tags",
      ],
      label: "Tags",
      description: "Tags associated with the custom object",
      optional: true,
    },
    rev: {
      type: "integer",
      label: "Rev",
      description: "The rev of the custom object to update",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.kustomer.updateCustomObjectById({
        $,
        klassName: this.klassName,
        customObjectId: this.customObjectId,
        data: {
          externalId: this.externalId,
          title: this.title,
          description: this.description,
          data: parseObject(this.data),
          custom: parseObject(this.custom),
          tags: parseObject(this.tags),
          rev: this.rev,
        },
      });

      $.export("$summary", `Successfully updated custom object with ID ${this.customObjectId}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.errors[0].title);
    }
  },
};
