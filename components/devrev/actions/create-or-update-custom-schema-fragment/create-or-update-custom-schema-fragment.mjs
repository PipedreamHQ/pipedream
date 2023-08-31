import devrev from "../../devrev.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "devrev-create-or-update-custom-schema-fragment",
  name: "Create or Update Custom Schema Fragment",
  description: "Creates or updates a custom schema fragment in DevRev.",
  version: "0.0.1",
  type: "action",
  props: {
    devrev,
    type: {
      type: "string",
      label: "Type",
      description: "Type of schema fragment",
      options: [
        "app_fragment",
        "custom_type_fragment",
        "tenant_fragment",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the custom schema fragment",
    },
    leafType: {
      type: "string",
      label: "Leaf Type",
      description: "The leaf type this fragment applies to",
    },
    app: {
      type: "string",
      label: "App ",
      description: "The app this fragment applies to.",
      optional: true,
    },
    subtype: {
      type: "string",
      label: "Subtype",
      description: "The string used to populate the subtype in the leaf type",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.type === "app_fragment" && !this.app) {
      throw new ConfigurationError("App is required for type `app_fragment`.");
    }
    if (this.type === "custom_type_fragment" && !this.subtype) {
      throw new ConfigurationError("Subtype is required for type `custom_type_fragment`.");
    }
    if (this.app && this.type !== "app_fragment") {
      throw new ConfigurationError("App can only be specified for type `app_fragment.");
    }
    if (this.subtype && this.type !== "custom_type_fragment") {
      throw new ConfigurationError("Subtype can only be specified for type `custom_type_fragment`.");
    }

    const data = {
      type: this.type,
      description: this.description,
      leaf_type: this.leafType,
      app: this.app,
      subtype: this.subtype,
    };

    const response = await this.devrev.createOrUpdateCustomSchemaFragment({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created/updated custom schema fragment with ID ${response.id}.`);
    }

    return response;

  },
};
