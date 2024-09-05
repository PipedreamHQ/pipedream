import { parseObject } from "../../common/utils.mjs";
import ispringLearn from "../../ispring_learn.app.mjs";

export default {
  key: "ispring_learn-list-enrollments",
  name: "List Enrollments",
  description: "Fetches the list of user enrollments on iSpring Learn. [See the documentation](https://ispringhelpdocs.com/ispring-learn/getting-a-list-of-enrollments-17304245.html)",
  version: "0.0.1",
  type: "action",
  props: {
    ispringLearn,
    learnerIds: {
      propDefinition: [
        ispringLearn,
        "userId",
      ],
      type: "string[]",
      optional: true,
    },
    courseIds: {
      propDefinition: [
        ispringLearn,
        "courseIds",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ispringLearn.listUserEnrollments({
      $,
      params: {
        learnerIds: parseObject(this.learnerIds),
        courseIds: parseObject(this.courseIds),
      },
    });
    $.export("$summary", `Successfully fetched user ${response.length} enrollments!`);
    return response;
  },
};
