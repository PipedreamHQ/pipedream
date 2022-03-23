// legacy_hash_id: a_njiaY8
import asana from "../../asana.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "Add Task To Section",
  description: "Add task to section",
  key: "asana-add-task-to-section",
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
      propDefinition: [
        asana,
        "projects",
      ],
      optional: true,
    },
    task: {
      label: "Task",
      type: "string",
      description: "The task to add to this section.",
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          projects: c.projects,
        }),
      ],
    },
    section_gid: {
      label: "Section GID",
      type: "string",
      description: "The globally unique identifier for the section.",
      propDefinition: [
        asana,
        "sections",
        (c) => ({
          projects: c.projects,
        }),
      ],
    },
    insert_before: {
      label: "Insert Before",
      type: "string",
      description: "An existing task within this section before which the added task should be inserted. Cannot be provided together with insert_after.",
      optional: true,
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          projects: c.projects,
        }),
      ],
    },
    insert_after: {
      label: "Insert After",
      type: "string",
      description: "An existing task within this section after which the added task should be inserted. Cannot be provided together with insert_before.",
      optional: true,
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          projects: c.projects,
        }),
      ],
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: `https://app.asana.com/api/1.0/sections/${this.section_gid}/addTask`,
      headers: {
        "Authorization": `Bearer ${this.asana._accessToken()}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      data: {
        data: {
          task: this.task,
          insert_before: this.insert_before,
          insert_after: this.insert_after,
        },
      },
    });
  },
};
