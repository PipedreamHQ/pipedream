import { parseObject } from "../../common/utils.mjs";
import klaviyo from "../../klaviyo.app.mjs";

export default {
  key: "klaviyo-add-member-to-list",
  name: "Add Member To List",
  description: "Add member to a specific list. [See the docs here](https://developers.klaviyo.com/en/v1-2/reference/add-members)",
  version: "1.0.0",
  type: "action",
  props: {
    klaviyo,
    list: {
      propDefinition: [
        klaviyo,
        "list",
      ],
    },
    profileIds: {
      propDefinition: [
        klaviyo,
        "profileIds",
      ],
    },
  },
  async run({ $ }) {
    const { response } = await this.klaviyo.subscribeProfiles({
      listId: this.list.value,
      data: parseObject(this.profileIds)?.map(({ value: id }) => ({
        type: "profile",
        id,
      })),
    });

    $.export("$summary", `${this.profileId} successfully added to "${this.list.label}"!`);
    return response.data;
  },
};
