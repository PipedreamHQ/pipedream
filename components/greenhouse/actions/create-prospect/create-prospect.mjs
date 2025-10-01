import { parseObject } from "../../common/utils.mjs";
import common from "../common/base-create.mjs";

export default {
  ...common,
  key: "greenhouse-create-prospect",
  name: "Create Prospect",
  description: "Creates a new prospect entry in Greenhouse. [See the documentation](https://developers.greenhouse.io/harvest.html#post-add-prospect)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    jobIds: {
      propDefinition: [
        common.props.greenhouse,
        "jobIds",
      ],
      optional: true,
    },
  },
  methods: {
    getData() {
      return {
        applications: parseObject(this.jobIds)?.map((item) => ({
          job_id: item,
        })),
      };
    },
    getFunc() {
      return this.greenhouse.createProspect;
    },
    getSummary(response) {
      return `Successfully created prospect with Id: ${response.id}!`;
    },
  },
};
