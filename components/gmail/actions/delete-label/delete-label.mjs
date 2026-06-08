import gmail from "../../gmail.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-delete-label",
  name: "Delete Label",
  description: "Delete a user-created label from the connected account. [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/delete)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gmail,
    label: {
      propDefinition: [
        gmail,
        "label",
      ],
      async options() {
        const { labels } = await this.gmail.listLabels();
        return labels
          .filter(({ type }) => type === "user")
          .map((label) => ({
            label: label.name,
            value: label.id,
          }));
      },
    },
  },
  async run({ $ }) {
    const response = await this.gmail._client().users.labels.delete({
      userId: constants.USER_ID,
      id: this.label,
    });

    $.export("$summary", `Successfully deleted label: ${this.label}`);

    return response;
  },
};
