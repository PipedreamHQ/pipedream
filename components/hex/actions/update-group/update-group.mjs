import { parseObject } from "../../common/utils.mjs";
import hex from "../../hex.app.mjs";

export default {
  key: "hex-update-group",
  name: "Update Group",
  description: "Update a group to manage users. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/EditGroup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hex,
    groupId: {
      propDefinition: [
        hex,
        "groupId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the group.",
      optional: true,
    },
    users: {
      propDefinition: [
        hex,
        "userId",
      ],
      type: "string[]",
      label: "User IDs",
      description: "A list of user IDs to add to the group.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hex.updateGroup({
      $,
      groupId: this.groupId,
      data: {
        name: this.name,
        members: {
          users: this.users && parseObject(this.users)?.map((user) => ({
            id: user,
          })),
        },
      },
    });

    $.export("$summary", `Successfully updated group with ID: ${response.id}`);
    return response;
  },
};
