import { defineSource } from "@pipedream/types";
import { DOCS } from "../../common/constants";
import { Test } from "../../common/types";
import common from "../common";

export default defineSource({
  ...common,
  key: "practitest-test-created",
  name: "Test Created",
  description: `Emit new event for each new test [See docs here](${DOCS.testCreated})`,
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getData(): Promise<Test[]> {
      return this.practitest.getTests(this.projectId);
    },
    getSummaryName({ name }: Test["attributes"]) {
      return name;
    },
  },
});
