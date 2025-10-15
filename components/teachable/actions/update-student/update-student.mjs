import teachable from "../../teachable.app.mjs";

export default {
  key: "teachable-update-student",
  name: "Update Student",
  description: "Updates an existing student. [See the documentation](https://docs.teachable.com/reference/updateuser)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    teachable,
    studentId: {
      propDefinition: [
        teachable,
        "studentId",
      ],
    },
    name: {
      propDefinition: [
        teachable,
        "name",
      ],
    },
    src: {
      propDefinition: [
        teachable,
        "src",
      ],
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.name) {
      data.name = this.name;
    }
    if (this.src) {
      data.src = this.src;
    }

    const student = await this.teachable.updateStudent({
      studentId: this.studentId,
      data,
      $,
    });

    if (student.id) {
      $.export("$summary", `Successfully updated student with ID ${student.id}`);
    }

    return student;
  },
};
