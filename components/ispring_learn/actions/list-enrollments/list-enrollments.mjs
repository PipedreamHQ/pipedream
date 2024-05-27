import ispringLearn from "../../ispring_learn.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ispring_learn-list-enrollments",
  name: "List Enrollments",
  description: "Fetches the list of user enrollments on iSpring Learn. [See the documentation](https://ispringhelpdocs.com/ispring-learn/getting-a-list-of-enrollments-17304245.html)",
  version: "0.0.1",
  type: "action",
  props: {
    ispringLearn,
    filters: {
      propDefinition: [
        ispringLearn,
        "filters",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ispringLearn.listUserEnrollments({
      filters: this.filters,
    });
    $.export("$summary", "Successfully fetched user enrollments");
    return response;
  },
};
