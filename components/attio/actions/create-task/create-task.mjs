import attio from "../../attio.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "attio-create-task",
  name: "Create Task",
  description: "Creates a new task. [See the documentation](https://docs.attio.com/rest-api/endpoint-reference/tasks/create-a-task)",
  version: "0.0.4",
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
    numberOfLinkedRecords: {
      type: "integer",
      label: "Number Of Linked Records",
      description: "The number of linked records to generate. Defaults to 1.",
      default: 1,
      reloadProps: true,
    },
  },
  methods: {
    linkedRecordPropsMapper(prefix) {
      const {
        [`${prefix}targetObject`]: targetObject,
        [`${prefix}targetRecordId`]: targetRecordId,
      } = this;

      return {
        target_object: targetObject,
        target_record_id: targetRecordId,
      };
    },
    async getLinkedRecordsPropDefinitions({
      prefix, label,
    } = {}) {
      const targetObjectPropName = `${prefix}targetObject`;
      const targetObject = this[targetObjectPropName];
      let targetRecordOptions = [];

      if (targetObject) {
        const { data } = await this.attio.listRecords({
          targetObject,
          data: {
            limit: 100,
            sorts: [
              {
                direction: "desc",
                attribute: "created_at",
                field: "value",
              },
            ],
          },
        });

        targetRecordOptions = data.map(({
          id: { record_id: value },
          values: { name },
        }) => ({
          value,
          label: name[0]?.value || name[0]?.full_name || "unknown",
        }));
      }

      return {
        [targetObjectPropName]: {
          type: "string",
          label: `${label} - Target Object`,
          description: "The type of the record to link to. Eg. `companies`, `contacts`, `deals`",
          options: Object.values(constants.TARGET_OBJECT),
          reloadProps: true,
        },
        [`${prefix}targetRecordId`]: {
          type: "string",
          label: `${label} - Target Record ID`,
          description: "The ID of the record to link to",
          options: targetRecordOptions,
        },
      };
    },
    createTask(args = {}) {
      return this.attio.post({
        path: "/tasks",
        ...args,
      });
    },
  },
  async additionalProps() {
    const {
      numberOfLinkedRecords,
      getLinkedRecordsPropDefinitions,
    } = this;

    return utils.getAdditionalProps({
      numberOfFields: numberOfLinkedRecords,
      fieldName: "linked record",
      getPropDefinitions: getLinkedRecordsPropDefinitions,
    });
  },
  async run({ $ }) {
    const {
      content,
      deadlineAt,
      isCompleted,
      assigneeIds,
      numberOfLinkedRecords,
      linkedRecordPropsMapper,
    } = this;

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
          linked_records: utils.getFieldsProps({
            numberOfFields: numberOfLinkedRecords,
            fieldName: "linked record",
            propsMapper: linkedRecordPropsMapper,
          }),
        },
      },
    });

    $.export("$summary", `Successfully created task with ID \`${response.data.id.task_id}\`.`);
    return response;
  },
};
