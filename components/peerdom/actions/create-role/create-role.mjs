import peerdom from "../../peerdom.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "peerdom-create-role",
  name: "Create Role",
  description: "Create a new role within a specified circle. [See the documentation](https://api.peerdom.org/v1/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    peerdom,
    circleId: {
      propDefinition: [
        peerdom,
        "circleId",
      ],
    },
    roleName: {
      propDefinition: [
        peerdom,
        "roleName",
      ],
    },
    description: {
      propDefinition: [
        peerdom,
        "description",
      ],
      optional: true,
    },
    linkedDomains: {
      propDefinition: [
        peerdom,
        "linkedDomains",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.peerdom.createRole({
      circleId: this.circleId,
      roleName: this.roleName,
      description: this.description,
      linkedDomains: this.linkedDomains,
    });

    $.export("$summary", `Successfully created role: ${response.name}`);
    return response;
  },
};
