import { parseObject } from "../../common/utils.mjs";
import klaviyo from "../../klaviyo.app.mjs";

export default {
  key: "klaviyo-add-member-to-list",
  name: "Add Member To List",
  description: "Add member to a specific list. [See the documentation](https://developers.klaviyo.com/en/reference/add_profiles_to_list)",
  version: "1.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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

    $.export("$summary", `Member(s) successfully added to "${this.list.label}"!`);
    return response.data;
  },
};
