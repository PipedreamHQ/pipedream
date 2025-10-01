import { parseObject } from "../../common/utils.mjs";
import common from "../common/base-create.mjs";

export default {
  ...common,
  key: "greenhouse-create-candidate",
  name: "Create Candidate",
  description: "Creates a new candidate entry in Greenhouse. [See the documentation](https://developers.greenhouse.io/harvest.html#post-add-candidate)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    educations: {
      propDefinition: [
        common.props.greenhouse,
        "educations",
      ],
      optional: true,
    },
    employments: {
      type: "string[]",
      label: "Employments",
      description: "A list of employment record objects. **Format: {\"company_name\": \"Greenhouse\",\"title\": \"Engineer\",\"start_date\": \"2001-09-15T00:00:00.000Z\",\"end_date\": \"2004-05-15T00:00:00.000Z\"}**",
      optional: true,
    },
    activityFeedNotes: {
      type: "string[]",
      label: "Activity Feed Notes",
      description: "A list of activity feed objects. **Format: {\"body\": \"John Locke was moved into Recruiter Phone Screen for Accounting Manager on 03/27/2014 by Boone Carlyle\",\"visibility\": \"admin_only\"}. Visibility can be one of: admin_only, private or public**",
      optional: true,
    },
    jobIds: {
      propDefinition: [
        common.props.greenhouse,
        "jobIds",
      ],
    },
  },
  methods: {
    getData() {
      return {
        educations: parseObject(this.educations)?.map((item) => ({
          degree_id: item,
        })),
        employments: parseObject(this.employments),
        activity_feed_notes: parseObject(this.activityFeedNotes)?.map((item) => ({
          ...item,
          user_id: this.userId,
        })),
        applications: parseObject(this.jobIds)?.map((item) => ({
          job_id: item,
        })),
      };
    },
    getFunc() {
      return this.greenhouse.createCandidate;
    },
    getSummary(response) {
      return `Successfully created candidate with Id: ${response.id}!`;
    },
  },
};
