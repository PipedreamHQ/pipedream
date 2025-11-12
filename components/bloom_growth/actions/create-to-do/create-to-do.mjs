import bloomGrowth from "../../bloom_growth.app.mjs";

export default {
  key: "bloom_growth-create-to-do",
  name: "Create To-Do",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new meeting to-do [See the documentation](https://app.bloomgrowth.com/swagger/index.html)",
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
      description: "The title of the to-do.",
    },
    accountableUserId: {
      propDefinition: [
        bloomGrowth,
        "ownerId",
      ],
      label: "Accountable User Id",
      description: "The user Id for which this to-do will be created.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The date by which the to-do has to be done. E.g. **2010-01-10T11:36:20.136Z**.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      bloomGrowth,
      meetingId,
      ...data
    } = this;

    const response = await bloomGrowth.createTodo({
      $,
      meetingId,
      data,
    });

    $.export("$summary", `A new to-do with Id: ${response.Id} was successfully created!`);
    return response;
  },
};
