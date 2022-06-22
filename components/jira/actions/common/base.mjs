import jira from "../../jira.app.mjs";

export default {
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
  },
};
