import { defineAction } from "@pipedream/types";
import salesmate from "../../app/salesmate.app";

export default defineAction({
  name: "Add Deal",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "salesmate-add-deal",
  description: "This API is used to add a deal. [See docs here](https://apidocs.salesmate.io/#fc738a12-8757-46aa-8625-3379fa205377)",
  type: "action",
  props: {
    salesmate,
    title: {
      label: "Title",
      description: "Title for the deal.",
      type: "string",
    },
    primaryContact: {
      propDefinition: [
        salesmate,
        "contactId",
      ],
      label: "Primary Contact",
      description: "Primary contact for the deal. User can select it from pre-defined contacts or add a quick contact.",
    },
    owner: {
      propDefinition: [
        salesmate,
        "owner",
      ],
      description: "Owner of the deal.",
    },
    pipeline: {
      propDefinition: [
        salesmate,
        "pipelineId",
      ],
    },
    status: {
      propDefinition: [
        salesmate,
        "status",
      ],
    },
    stage: {
      propDefinition: [
        salesmate,
        "stage",
        (c) => ({
          pipeline: c.pipeline,
        }),
      ],
    },
    primaryCompany: {
      propDefinition: [
        salesmate,
        "company",
      ],
      label: "Primary Company",
      description: "Primary Company for the deal. User can select it from pre-defined companies or add a quick company.",
      optional: true,
    },
    source: {
      propDefinition: [
        salesmate,
        "source",
      ],
      optional: true,
    },
    estimatedCloseDate: {
      label: "Estimated Close Date",
      description: "User can select estimated close date for the deal.",
      type: "string",
      optional: true,
    },
    dealValue: {
      label: "Deal Value",
      description: "This field contains value of the deal.",
      type: "string",
      optional: true,
    },
    currency: {
      propDefinition: [
        salesmate,
        "currency",
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        salesmate,
        "priority",
      ],
      optional: true,
    },
    dealDescription: {
      propDefinition: [
        salesmate,
        "contactDescription",
      ],
      description: "This field contains details related to the deal. It has an arbitrary string attached to the deal object.",
      optional: true,
    },
    tags: {
      propDefinition: [
        salesmate,
        "tags",
      ],
      description: "This field contains tags associated with a deal.",
      optional: true,
    },
    contactFollowers: {
      propDefinition: [
        salesmate,
        "contactId",
      ],
      label: "Followers (contacts)",
      description: "Array of the followers of particular deal. Every follower has some more attributes like isOwner if the follower is owner or not. follower's id, name, email address, type, photo, image path and can view the deal status.",
      type: "string[]",
      optional: true,
    },
    userFollowers: {
      propDefinition: [
        salesmate,
        "owner",
      ],
      label: "Followers (users)",
      description: "Array of the followers of particular deal. Every follower has some more attributes like isOwner if the follower is owner or not. follower's id, name, email address, type, photo, image path and can view the deal status.",
      type: "string[]",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      salesmate,
      tags,
      contactFollowers,
      userFollowers,
      dealDescription,
      ...data
    } = this;

    const followers = [];
    if (contactFollowers?.length) {
      followers.push(...contactFollowers.map((contact) => ({
        contactId: contact,
      })));
    }
    if (userFollowers?.length) {
      followers.push(...userFollowers.map((user) => ({
        userId: user,
      })));
    }

    const response = await salesmate.addDeal({
      $,
      data: {
        ...data,
        description: dealDescription,
        tags: tags?.toString(),
        followers,
      },
    });

    $.export("$summary", `Deal successfuly created with id: ${response.Data.id}!`);

    return response;
  },
});
