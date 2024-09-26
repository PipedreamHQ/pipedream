import { defineSource } from "@pipedream/types";
import { DOCS } from "../../common/constants";
import { Issue } from "../../common/types";
import common from "../common";

export default defineSource({
  ...common,
  key: "practitest-issue-created",
  name: "Issue Created",
  description: `Emit new event for each new issue [See docs here](${DOCS.issueCreated})`,
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getData(): Promise<Issue[]> {
      return this.practitest.getIssues(this.projectId);
    },
    getSummaryName({ title }: Issue["attributes"]) {
      return title;
    },
  },
});
