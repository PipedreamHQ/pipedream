import { VISIBILITY_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import pencilSpaces from "../../pencil_spaces.app.mjs";

export default {
  key: "pencil_spaces-create-space",
  name: "Create A Space",
  description: "Create a new space in Pencil Spaces. [See the documentation](https://api.pencilspaces.com/reference#tag/spaces/POST/spaces/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pencilSpaces,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the Space. If not provided and `Space To Clone Id` is set, the existing Space name will be used. If not, a random Space name will be generated.",
      optional: true,
    },
    spaceToCloneId: {
      propDefinition: [
        pencilSpaces,
        "spaceToCloneId",
      ],
      optional: true,
    },
    ownerId: {
      propDefinition: [
        pencilSpaces,
        "ownerId",
      ],
      optional: true,
    },
    hostIds: {
      propDefinition: [
        pencilSpaces,
        "ownerId",
      ],
      type: "string[]",
      label: "Host Ids",
      description: "The hosts you wish to invite to the Space. The user associated with your API key will always be added as a host.",
      optional: true,
    },
    participantIds: {
      propDefinition: [
        pencilSpaces,
        "ownerId",
      ],
      type: "string[]",
      label: "Participant Ids",
      description: "The participants you wish to invite to the Space.",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "The visibility of the Space.",
      options: VISIBILITY_OPTIONS,
      optional: true,
    },
    notifyInvitees: {
      type: "boolean",
      label: "Notify Invitees",
      description: "Whether you want to automatically notify invitees when you create your Space.",
    },
    siteId: {
      propDefinition: [
        pencilSpaces,
        "siteId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pencilSpaces.createSpace({
      $,
      data: {
        title: this.title,
        spaceToCloneId: this.spaceToCloneId,
        ownerId: {
          userId: this.ownerId,
        },
        hostIds: parseObject(this.hostIds)?.map((hostId) => ({
          userId: hostId,
        })),
        participantIds: parseObject(this.participantIds)?.map((participantId) => ({
          userId: participantId,
        })),
        visibility: this.visibility,
        notifyInvitees: this.notifyInvitees,
        siteId: this.siteId,
      },
    });

    $.export("$summary", `Successfully created space with ID: "${response.spaceId}"`);
    return response;
  },
};
