// legacy_hash_id: a_l0iLdL
import asana from "../../asana.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "asana-create-task-comment",
  name: "Create Task Comment",
  description: "Create a comment on a task",
  version: "0.2.1",
  type: "action",
  props: {
    asana,
    workspace: {
      label: "Workspace",
      description: "Gid of a workspace.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
      optional: true,
    },
    projects: {
      label: "Project",
      type: "string",
      propDefinition: [
        asana,
        "projects",
      ],
      optional: true,
    },
    task_gid: {
      label: "Task GID",
      description: "The task GID to operate on.",
      type: "string",
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          projects: c.project,
        }),
      ],
    },
    text: {
      label: "Text",
      description: "The plain text of the comment to add. Cannot be used with html_text.",
      type: "string",
      optional: true,
    },
    html_text: {
      label: "HTML Text",
      description: "HTML formatted text for a comment. This will not include the name of the creator.",
      type: "string",
      optional: true,
    },
    is_pinned: {
      label: "Is Pinned",
      description: "Conditional. Whether the story should be pinned on the resource.",
      type: "boolean",
      optional: true,
    },
    sticker_name: {
      label: "Sticker Name",
      description: "The name of the sticker in this story. null if there is no sticker.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: `${this.asana._apiUrl()}/tasks/${this.task_gid}/stories`,
      headers: this.asana._headers(),
      data: {
        data: {
          text: this.text,
          html_text: this.html_text,
          is_pinned: this.is_pinned,
          sticker_name: this.sticker_name,
        },
      },
    });
  },
};
