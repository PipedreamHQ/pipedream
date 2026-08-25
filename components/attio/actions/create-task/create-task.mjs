// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import attio from "../../attio.app.mjs";

export default {
  key: "attio-create-task",
  name: "Create Task",
  description: "Create a task in Attio with content, a deadline, completion state, optional assignees, and optional linked records. Use when you need a follow-up or to-do. Example: Content `Email the signed contract to Ada`, Deadline `2026-09-01T17:00:00Z`, Is Completed `false`. Returns the created task with its id. [See the documentation](https://docs.attio.com/rest-api/endpoint-reference/tasks/create-a-task)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    attio,
    content: {
      type: "string",
      label: "Content",
      description: "The text content of the task",
    },
    deadlineAt: {
      type: "string",
      label: "Deadline",
      description: "The deadline of the task in ISO 8601 format (e.g. `2025-04-22T10:00:00Z`)",
    },
    isCompleted: {
      type: "boolean",
      label: "Is Completed",
      description: "Whether the task has been completed",
    },
    assigneeIds: {
      type: "string[]",
      label: "Assignees",
      description: "The id of the members to assign the task to",
      propDefinition: [
        attio,
        "workspaceMemberId",
      ],
    },
    linkedRecords: {
      type: "string[]",
      label: "Linked Records",
      description: "Records to link to the task. Each entry is a JSON object naming the object type and the record, e.g. `{ \"target_object\": \"companies\", \"target_record_id\": \"891dcbfc-9141-415d-9b2a-2238a6cc012d\" }`. `target_object` accepts `companies`, `people`, `users`, `workspaces` or `deals`.",
      optional: true,
    },
  },
  methods: {
    createTask(args = {}) {
      return this.attio.post({
        path: "/tasks",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      content,
      deadlineAt,
      isCompleted,
      assigneeIds,
      linkedRecords,
    } = this;

    // Each entry arrives as JSON, so a malformed one should say so rather
    // than reach Attio as an incomplete link.
    const parsedLinkedRecords = (linkedRecords ?? []).map((record, index) => {
      let parsed;
      try {
        parsed = typeof record === "string"
          ? JSON.parse(record)
          : record;
      } catch (error) {
        throw new ConfigurationError(`Linked record ${index + 1} is not valid JSON: ${error.message}`);
      }
      if (!parsed?.target_object || !parsed?.target_record_id) {
        throw new ConfigurationError(`Linked record ${index + 1} needs both \`target_object\` and \`target_record_id\`.`);
      }
      return {
        target_object: parsed.target_object,
        target_record_id: parsed.target_record_id,
      };
    });

    const response = await this.createTask({
      $,
      data: {
        data: {
          format: "plaintext",
          content,
          deadline_at: deadlineAt,
          is_completed: isCompleted,
          assignees: assigneeIds?.map((id) => ({
            referenced_actor_type: "workspace-member",
            referenced_actor_id: id,
          })) || [],
          linked_records: parsedLinkedRecords,
        },
      },
    });

    $.export("$summary", `Successfully created task with ID \`${response.data.id.task_id}\`.`);
    return response;
  },
};
