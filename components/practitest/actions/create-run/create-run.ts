import practitest from "../../app/practitest.app";
import { defineAction } from "@pipedream/types";
import { DOCS } from "../../common/constants";
import {
  CreateRunParams, Run,
} from "../../common/types";

export default defineAction({
  name: "Create Run",
  description: `Create a run [See docs here](${DOCS.createRun})`,
  key: "practitest-create-run",
  version: "0.0.1",
  type: "action",
  props: {
    practitest,
    projectId: {
      propDefinition: [
        practitest,
        "project",
      ],
    },
    name: {
      type: "string",
      label: "Name",
    },
    authorId: {
      propDefinition: [
        practitest,
        "user",
      ],
      label: "Author",
    },
    description: {
      type: "string",
      label: "Description",
      optional: true,
    },
    assignedToId: {
      propDefinition: [
        practitest,
        "user",
      ],
      label: "Assigned To",
      optional: true,
    },
    version: {
      type: "string",
      label: "Version",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "A hash of custom-fields with their value",
      optional: true,
    },
    parentId: {
      type: "string",
      label: "Parent ID",
      description: "A parent's run ID",
      optional: true,
    },
    testIds: {
      type: "integer[]",
      label: "Test IDs",
      description:
        "An array of test-ids to add to the traceability of the new run",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      optional: true,
    },
  },
  async run({ $ }): Promise<Run> {
    const {
      projectId,
    } = this;

    const params: CreateRunParams = {
      $,
      projectId,
    };

    const data: Run = await this.practitest.createRun(params);

    $.export("$summary", `Successfully created run (id ${data.id})`);

    return data;
  },
});
