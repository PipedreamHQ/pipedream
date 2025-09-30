import { clearObj } from "../../common/utils.mjs";
import nifty from "../../nifty.app.mjs";

export default {
  key: "nifty-create-message",
  name: "Create Message",
  description: "Sends a new message in a team's discussion. [See the documentation](https://openapi.niftypm.com/api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nifty,
    projectId: {
      propDefinition: [
        nifty,
        "projectId",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The content of the message.",
    },
    messageLocation: {
      type: "string",
      label: "Message Location",
      description: "Where the message will be posted.",
      reloadProps: true,
      options: [
        "Chat",
        "Task",
        "File",
        "Doc",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    const propName = this.messageLocation;
    if (propName) {
      props[`${propName}Id`] = {
        type: "string",
        label: `${propName} Id`,
        description: `The Id of the ${propName} where the message will be posted.`,
        options: async ({ page }) => {
          const response = await this.nifty[`list${this.messageLocation}s`]({
            params: {
              page,
              project_id: this.projectId,
            },
          });

          const values = response[`${this.messageLocation.toLowerCase()}s`] || response.items || response;

          return values.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }));
        },
      };
    }
    return props;
  },
  async run({ $ }) {
    const propName = this.messageLocation;
    const data = {
      type: "text",
      text: this.text,
    };
    if (propName) {
      data[`${propName.toLowerCase()}_id`] = this[`${propName}Id`];
    }
    const response = await this.nifty.sendMessage({
      $,
      data: clearObj(data),
    });

    $.export("$summary", `Successfully sent message to project ID: ${this.projectId}`);
    return response;
  },
};
