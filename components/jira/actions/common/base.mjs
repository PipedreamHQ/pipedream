import { axios } from "@pipedream/platform";
import jira from "../../jira.app.mjs";

export default {
  props: {
    jira,
    projectId: {
      propDefinition: [
        jira,
        "projectId",
      ],
    },
  },
};
