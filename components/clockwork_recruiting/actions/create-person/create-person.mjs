import app from "../../clockwork_recruiting.app.mjs";
import { parseArray } from "../../common/utils.mjs";

export default {
  key: "clockwork_recruiting-create-person",
  name: "Create A Person",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new person with provided data. [See the documentation](https://app.swaggerhub.com/apis-docs/clockwork-recruiting/cw-public-api/3.0.0#/People/post_people)",
  type: "action",
  props: {
    app,
    assistantName: {
      type: "string",
      label: "Assistant Name",
      description: "The person's assistant name.",
      optional: true,
    },
    biography: {
      type: "string",
      label: "Biography",
      description: "The Biography that is pulled over by a Third Party or entered by a User.",
      optional: true,
    },
    doNotContact: {
      type: "boolean",
      label: "Do Not Contact",
      description: "If the candidate is in the middle of a process then you can toggle Do Not Contact.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The person's name.",
      optional: true,
    },
    nickName: {
      type: "string",
      label: "Nickname",
      description: "The person's nickname.",
      optional: true,
    },
    noRelocation: {
      type: "boolean",
      label: "No Relocation",
      description: "If the candidate is willing to Relocate.",
      optional: true,
    },
    skypeName: {
      type: "string",
      label: "Skype Name",
      description: "The name of the skype account.",
      optional: true,
    },
    tagNames: {
      propDefinition: [
        app,
        "tagNames",
      ],
      optional: true,
    },
    tagIds: {
      propDefinition: [
        app,
        "tagIds",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      tagNames,
      tagIds,
      ...data
    } = this;

    const response = await app.createPerson({
      $,
      data: {
        person: {
          ...data,
          tag_names: tagNames && parseArray(tagNames),
          tag_ids: tagIds && parseArray(tagIds),
        },
      },
    });

    $.export("$summary", `Successfully created new person with ID ${response.id}`);
    return response;
  },
};
