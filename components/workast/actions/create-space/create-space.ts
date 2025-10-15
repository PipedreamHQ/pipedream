import { defineAction } from "@pipedream/types";
import workast from "../../app/workast.app";
import constants from "../common/constants";

export default defineAction({
  name: "Create Space",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "workast-create-space",
  description: "Creates a space. [See docs here](https://developers.workast.com/#/method/createSpace)",
  type: "action",
  props: {
    workast,
    name: {
      label: "Name",
      description: "The space name",
      type: "string",
    },
    description: {
      label: "Description",
      description: "The space description",
      type: "string",
      optional: true,
    },
    userIds: {
      label: "Participants Ids",
      description: "The user ID to assigne to the task",
      type: "string[]",
      propDefinition: [
        workast,
        "userId",
      ],
      optional: true,
    },
    type: {
      label: "Type",
      description: "The type of the space",
      type: "string",
      options: constants.SPACE_TYPES,
      optional: true,
    },
    privacy: {
      label: "Privacy",
      description: "The privacy of the space",
      type: "string",
      options: constants.SPACE_PRIVACIES,
      optional: true,
    },
  },
  async run({ $ }) {
    const participantsParsed = typeof this.userIds === "string"
      ? JSON.parse(this.userIds)
      : this.userIds;

    const response = await this.workast.createSpace({
      $,
      data: {
        name: this.name,
        description: this.description,
        participants: participantsParsed ?? [],
        type: this.type,
        privacy: this.privacy,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created space with id ${response.id}`);
    }

    return response;
  },
});
