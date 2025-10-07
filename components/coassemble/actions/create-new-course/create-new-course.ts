import coassemble from "../../app/coassemble.app";

export default {
  key: "coassemble-create-new-course",
  name: "Create New Course",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Use this endpoint to create new courses in your workspace. [See the docs here](https://developers.coassemble.com/api/courses#create-a-new-course)",
  type: "action",
  props: {
    coassemble,
    title: {
      type: "string",
      label: "Title",
      description: "Title for the newly-created course.",
    },
    category: {
      propDefinition: [
        coassemble,
        "category",
      ],
    },
    code: {
      type: "string",
      label: "Code",
      description: "Course code (optional, will be displayed prior to course title).",
      optional: true,
    },
    overview: {
      type: "string",
      label: "Overview",
      description: "Short description of the course's content. May contain HTML formatting.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      coassemble,
      ...data
    } = this;
    const response = await coassemble.createCourse({
      $,
      data,
    });

    $.export("$summary", `A new Course with id: ${response.id} was successfully created!`);
    return response;
  },
};
