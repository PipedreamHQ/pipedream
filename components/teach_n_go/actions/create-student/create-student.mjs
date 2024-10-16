import teachNGo from "../../teach_n_go.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "teach_n_go-create-student",
  name: "Create Student",
  description: "Registers a new student in Teach 'n Go. [See the documentation](https://intercom.help/teach-n-go/en/articles/6807235-new-student-and-class-registration-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    teachNGo,
    personalDetails: {
      propDefinition: [
        teachNGo,
        "personalDetails",
      ],
    },
    academicDetails: {
      propDefinition: [
        teachNGo,
        "academicDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.teachNGo.registerStudent({
      personalDetails: this.personalDetails,
      academicDetails: this.academicDetails,
    });

    $.export("$summary", `Successfully registered student with ID: ${response.id}`);
    return response;
  },
};
