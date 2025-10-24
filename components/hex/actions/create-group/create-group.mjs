import { parseObject } from "../../common/utils.mjs";
import hex from "../../hex.app.mjs";

export default {
  key: "hex-create-group",
  name: "Create Group",
  description: "Create a group to manage users. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/CreateGroup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hex,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the group.",
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
    const response = await this.hex.createGroup({
      $,
      data: {
        name: this.name,
        members: {
          users: this.users && parseObject(this.users)?.map((user) => ({
            id: user,
          })),
        },
      },
    });

    $.export("$summary", `Successfully created group with ID: ${response.id}`);
    return response;
  },
};
