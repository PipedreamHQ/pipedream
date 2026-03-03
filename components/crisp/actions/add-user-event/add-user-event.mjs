import crisp from "../../crisp.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "crisp-add-user-event",
  name: "Add User Event",
  description: "Add a user event. [See the documentation](https://docs.crisp.chat/references/rest-api/v1/#add-a-people-event)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    crisp,
    personId: {
      propDefinition: [
        crisp,
        "personId",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the event. Example: `Added item to basket`",
      optional: true,
    },
    data: {
      type: "object",
      label: "Data",
      description: "The data of the event",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "The color of the event",
      options: constants.COLORS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.crisp.addPeopleEvent({
      $,
      personId: this.personId,
      data: {
        text: this.text,
        data: parseObject(this.data),
        color: this.color,
      },
    });
    $.export("$summary", `Successfully added user event for person with ID: ${this.personId}.`);
    return response;
  },
};
