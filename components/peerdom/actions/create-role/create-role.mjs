import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import peerdom from "../../peerdom.app.mjs";

export default {
  key: "peerdom-create-role",
  name: "Create Role",
  description: "Create a new role within a specified circle. [See the documentation](https://api.peerdom.org/v1/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    peerdom,
    name: {
      propDefinition: [
        peerdom,
        "name",
      ],
    },
    mapId: {
      propDefinition: [
        peerdom,
        "mapId",
      ],
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
        customFields,
        ...data
      } = this;

      const response = await peerdom.createRole({
        $,
        data: {
          ...data,
          customFields: parseObject(customFields),
        },
      });

      $.export("$summary", `Successfully created role: ${response.name}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.message);
    }
  },
};
