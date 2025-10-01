import devrev from "../../devrev.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  key: "devrev-create-or-update-custom-schema-fragment",
  name: "Create or Update Custom Schema Fragment",
  description: "Creates or updates a custom schema fragment in DevRev. [See the documentation](https://devrev.ai/docs/apis/beta-api-spec#/operations/custom-schema-fragments-set)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    devrev,
    type: {
      type: "string",
      label: "Type",
      description: "Type of schema fragment",
      options: Object.values(constants.SCHEMA_TYPE),
      reloadProps: true,
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
  },
  async additionalProps() {
    const props = {};
    if (this.type === constants.SCHEMA_TYPE.APP_FRAGMENT) {
      props.app = {
        type: "string",
        label: "App",
        description: "The app this fragment applies to.",
      };
    }
    if (this.type === constants.SCHEMA_TYPE.CUSTOM_TYPE_FRAGMENT) {
      props.subtype = {
        type: "string",
        label: "Subtype",
        description: "The string used to populate the subtype in the leaf type",
      };
    }
    return props;
  },
  async run({ $ }) {
    if (this.type === constants.SCHEMA_TYPE.APP_FRAGMENT && !this.app) {
      throw new ConfigurationError(`App is required for type \`${constants.SCHEMA_TYPE.APP_FRAGMENT}\`.`);
    }
    if (this.type === constants.SCHEMA_TYPE.CUSTOM_TYPE_FRAGMENT && !this.subtype) {
      throw new ConfigurationError(`Subtype is required for type \`${constants.SCHEMA_TYPE.CUSTOM_TYPE_FRAGMENT}\`.`);
    }
    if (this.app && this.type !== constants.SCHEMA_TYPE.APP_FRAGMENT) {
      throw new ConfigurationError(`App can only be specified for type \`${constants.SCHEMA_TYPE.APP_FRAGMENT}\`.`);
    }
    if (this.subtype && this.type !== constants.SCHEMA_TYPE.CUSTOM_TYPE_FRAGMENT) {
      throw new ConfigurationError(`Subtype can only be specified for type \`${constants.SCHEMA_TYPE.CUSTOM_TYPE_FRAGMENT}\`.`);
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
