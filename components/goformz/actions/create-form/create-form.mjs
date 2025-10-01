import goformz from "../../goformz.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "goformz-create-form",
  name: "Create Form",
  description: "Create a new form in GoFormz. [See the documentation](https://developers.goformz.com/reference/create-a-form)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    goformz,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the form",
    },
    templateId: {
      propDefinition: [
        goformz,
        "templateId",
      ],
      reloadProps: true,
    },
    userId: {
      propDefinition: [
        goformz,
        "userId",
      ],
      optional: true,
    },
    groupId: {
      propDefinition: [
        goformz,
        "groupId",
      ],
      optional: true,
    },
    overrideDefaultFormName: {
      type: "boolean",
      label: "Override Default Form Name",
      description: "Set to `true` to override the automatic form name rules",
      optional: true,
      default: false,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.templateId) {
      return props;
    }
    props["alert"] = {
      type: "alert",
      alertType: "info",
      content: "See the [Form Field Reference](https://developers.goformz.com/reference/form-field-reference) for more information about form field types",
    };
    const { fields } = await this.goformz.getTemplate({
      templateId: this.templateId,
    });
    for (const field of Object.values(fields)) {
      props[field.id] = {
        type: "object",
        label: field.name,
        description: `Value for ${field.name}. Type: ${field.type}`,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    if (!this.userId && !this.groupId) {
      throw new ConfigurationError("Form must be assigned to a User or Group");
    }
    if (this.userId && this.groupId) {
      throw new ConfigurationError("Form can only be assigned to one of User or Group");
    }

    const assignment = this.userId
      ? {
        id: this.userId,
        type: "User",
      }
      : {
        id: this.groupId,
        type: "Group",
      };

    const { fields } = await this.goformz.getTemplate({
      templateId: this.templateId,
    });

    const fieldProps = {};
    for (const field of Object.values(fields)) {
      fieldProps[field.name] = parseObject(this[field.id]);
    }

    const response = await this.goformz.createForm({
      $,
      data: {
        name: this.name,
        overrideDefaultFormName: this.overrideDefaultFormName,
        templateId: this.templateId,
        assignment,
        fields: fieldProps,
      },
    });
    $.export("$summary", `Successfully created form with ID: ${response.id}`);
    return response;
  },
};
