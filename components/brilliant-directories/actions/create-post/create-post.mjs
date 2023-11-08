import brilliantDirectories from "../../brilliant-directories.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "brilliant-directories-create-post",
  name: "Create Post",
  description: "Creates a single or group post in Brilliant Directories. [See the documentation](https://support.brilliantdirectories.com/support/solutions/articles/12000093239-member-posts-api-create-update-delete-and-get-member-posts)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    brilliantDirectories,
    postData: {
      propDefinition: [
        brilliantDirectories,
        "postData",
      ],
    },
    groupId: {
      propDefinition: [
        brilliantDirectories,
        "groupId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.brilliantDirectories.createPost({
      postData: this.postData,
      groupId: this.groupId,
    });

    $.export("$summary", `Successfully created ${this.groupId
      ? "group"
      : "single"} post`);
    return response;
  },
};
