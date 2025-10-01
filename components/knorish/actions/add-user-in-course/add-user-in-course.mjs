import knorish from "../../knorish.app.mjs";

export default {
  key: "knorish-add-user-in-course",
  name: "Add User In Course",
  description: "Add a specific user to a specific course on your Knorish site. [See the documentation](https://knowledge.knorish.com/api-endpoints-and-postman-dump-publisher-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    knorish,
    courseId: {
      propDefinition: [
        knorish,
        "courseId",
      ],
    },
    userId: {
      propDefinition: [
        knorish,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.knorish.addUserToCourse({
      data: {
        courseid: this.courseId,
        userid: this.userId,
      },
    });
    $.export("$summary", `Successfully added user with ID: ${this.userId} to course with ID: ${this.courseId}`);
    return response;
  },
};
