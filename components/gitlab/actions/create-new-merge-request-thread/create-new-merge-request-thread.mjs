import gitlab from "../../gitlab.app.mjs";

export default {
  name: "Create New Merge Request Thread",
  version: "0.0.1",
  key: "create-new-merge-request-thread",
  description: "Create a new thread on a Merge Request",
  props: {
    gitlab,
    projectId: {
      propDefinition: [
        gitlab,
        "projectId",
      ],
    },
    mergeRequestIid: {
      type: "integer",
      label: "Merge Request ID",
      description: "The ID of the Merge Request (integer)"
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the comment on the new thread. Markdown is supported."
    }
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const { data } = await this.gitlab.createNewMergeRequestThread(this.projectId, this.mergeRequestIid, { body: this.body });
    return data;
  },
};
