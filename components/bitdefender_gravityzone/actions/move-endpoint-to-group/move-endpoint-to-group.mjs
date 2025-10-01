import bitdefender from "../../bitdefender_gravityzone.app.mjs";

export default {
  key: "bitdefender_gravityzone-move-endpoint-to-group",
  name: "Move Endpoint to Group",
  description: "Move an endpoint to a different group. [See the documentation](https://www.bitdefender.com/business/support/en/77209-128489-moveendpoints.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bitdefender,
    endpointId: {
      propDefinition: [
        bitdefender,
        "endpointId",
      ],
    },
    groupId: {
      propDefinition: [
        bitdefender,
        "groupId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bitdefender.moveEndpointToGroup({
      $,
      data: {
        params: {
          endpointIds: [
            this.endpointId,
          ],
          groupId: this.groupId,
        },
      },
    });

    $.export("$summary", `Successfully moved endpoint ${this.endpointId} to group ${this.groupId}`);
    return response;
  },
};
