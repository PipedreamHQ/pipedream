import bloomGrowth from "../../bloom_growth.app.mjs";

export default {
  key: "bloom_growth-create-issue",
  name: "Create Issue",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new meeting issue [See the documentation](https://app.bloomgrowth.com/swagger/index.html)",
  type: "action",
  props: {
    bloomGrowth,
    meetingId: {
      propDefinition: [
        bloomGrowth,
        "meetingId",
      ],
    },
    title: {
      propDefinition: [
        bloomGrowth,
        "title",
      ],
    },
    ownerId: {
      propDefinition: [
        bloomGrowth,
        "ownerId",
      ],
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "A detailed description about the issue.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      bloomGrowth,
      ...data
    } = this;

    const response = await bloomGrowth.createIssue({
      $,
      data,
    });

    $.export("$summary", `A new issue with Id: ${response.Id} was successfully created!`);
    return response;
  },
};
