import { ConfigurationError } from "@pipedream/platform";
import app from "../../karbon.app.mjs";

export default {
  key: "karbon-create-note",
  name: "Create Note",
  description: "Create a note in Karbon and optionally link it to the timeline of a work item, contact, organization or client group."
    + " Use **List Users** to find valid email addresses for the author and assignee."
    + " [See the documentation](https://karbonhq.github.io/karbon-api-reference/#post-/v3/Notes)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    authorEmailAddress: {
      type: "string",
      label: "Author Email Address",
      description: "The email address of the note's author, e.g. `jane@example.com`. Use **List Users** to find it (the `EmailAddress` field).",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject line of the note, e.g. `Note from client`.",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the note. HTML is supported, e.g. `<strong>To do:</strong> return the client's call`.",
    },
    assigneeEmailAddress: {
      type: "string",
      label: "Assignee Email Address",
      description: "The email address of the Karbon user to assign the note to, e.g. `joe@example.com`. Use **List Users** to find it (the `EmailAddress` field).",
      optional: true,
    },
    todoDate: {
      type: "string",
      label: "To-Do Date",
      description: "The date for the actions on the note as an ISO 8601 date-time, e.g. `2026-11-10T00:00:00Z`.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The date by which the actions must be complete as an ISO 8601 date-time, e.g. `2026-11-11T00:00:00Z`.",
      optional: true,
    },
    entityType: {
      type: "string",
      label: "Entity Type",
      description: "The type of record to link the note to, e.g. `WorkItem`. Set it together with **Entity Key**.",
      options: [
        "WorkItem",
        "Contact",
        "Organization",
        "ClientGroup",
      ],
      optional: true,
    },
    entityKey: {
      type: "string",
      label: "Entity Key",
      description: "The Karbon key of the record to link the note to, e.g. `2y7H6dhQL7mD`. Use **List Work Items** (the `WorkItemKey` field), **List Contacts** (the `ContactKey` field) or **List Organizations** (the `OrganizationKey` field) to find it. Set it together with **Entity Type**.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (Boolean(this.entityType) !== Boolean(this.entityKey)) {
      throw new ConfigurationError("Set both **Entity Type** and **Entity Key**, or neither.");
    }
    const note = await this.app.createNote({
      $,
      data: {
        AuthorEmailAddress: this.authorEmailAddress,
        Subject: this.subject,
        Body: this.body,
        AssigneeEmailAddress: this.assigneeEmailAddress,
        TodoDate: this.todoDate,
        DueDate: this.dueDate,
        Timelines: this.entityKey
          ? [
            {
              EntityType: this.entityType,
              EntityKey: this.entityKey,
            },
          ]
          : undefined,
      },
    });
    $.export("$summary", `Created note ${note.Id}: ${note.Subject}`);
    return note;
  },
};
