import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import peerdom from "../../peerdom.app.mjs";

export default {
  key: "peerdom-update-role",
  name: "Update Role",
  description: "Update an existing role's attributes such as name, description, or linked domains. [See the documentation](https://api.peerdom.org/v1/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    peerdom,
    roleId: {
      propDefinition: [
        peerdom,
        "roleId",
      ],
    },
    name: {
      propDefinition: [
        peerdom,
        "name",
      ],
      optional: true,
    },
    parentId: {
      propDefinition: [
        peerdom,
        "groupId",
      ],
    },
    electable: {
      propDefinition: [
        peerdom,
        "electable",
      ],
      optional: true,
    },
    external: {
      propDefinition: [
        peerdom,
        "external",
      ],
      optional: true,
    },
    color: {
      propDefinition: [
        peerdom,
        "color",
      ],
      optional: true,
    },
    shape: {
      propDefinition: [
        peerdom,
        "shape",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        peerdom,
        "customFields",
      ],
      optional: true,
    },
    groupEmail: {
      propDefinition: [
        peerdom,
        "groupEmail",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const {
        peerdom,
        roleId,
        customFields,
        ...data
      } = this;

      const response = await peerdom.updateRole({
        $,
        roleId,
        data: {
          ...data,
          customFields: parseObject(customFields),
        },
      });

      $.export("$summary", `Successfully updated role with ID ${this.roleId}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.message);
    }
  },
};
