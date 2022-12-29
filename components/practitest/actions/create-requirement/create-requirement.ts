import practitest from "../../app/practitest.app";
import { defineAction } from "@pipedream/types";
import { DOCS } from "../../common/constants";
import {
  CreateRequirementParams, CreateRequirementResponse,
} from "../../common/types";

export default defineAction({
  name: "Create Requirement",
  description: `Create a requirement [See docs here](${DOCS.createRequirement})`,
  key: "practitest-create-requirement",
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
      propDefinition: [
        practitest,
        "version",
      ],
    },
    priority: {
      type: "string",
      label: "Priority",
      optional: true,
    },
    customFields: {
      propDefinition: [
        practitest,
        "customFields",
      ],
    },
    parentId: {
      type: "string",
      label: "Parent ID",
      description: "A parent's requirement ID",
      optional: true,
    },
    testIds: {
      type: "integer[]",
      label: "Test IDs",
      description:
        "An array of test-ids to add to the traceability of the new requirement",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      optional: true,
    },
  },
  async run({ $ }): Promise<CreateRequirementResponse> {
    const {
      projectId,
      name,
      authorId,
      description,
      assignedToId,
      version,
      priority,
      customFields,
      parentId,
      testIds,
      tags,
    } = this;

    const params: CreateRequirementParams = {
      $,
      projectId,
      attributes: {
        name,
        "author-id": authorId,
        description,
        "assigned-to-id": assignedToId,
        version,
        priority,
        "custom-fields": customFields,
        "parent-id": parentId,
        tags,
      },
    };
    if (testIds) {
      params.traceability = {
        "test-ids": testIds,
      };
    }

    const response: CreateRequirementResponse = await this.practitest.createRequirement(params);

    $.export("$summary", `Successfully created requirement (id ${response.data.id})`);

    return response;
  },
});
