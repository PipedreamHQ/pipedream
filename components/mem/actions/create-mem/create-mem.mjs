import mem from "../../mem.app.mjs";

export default {
  key: "mem-create-mem",
  name: "Create Mem",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new mem. [See the documentation](https://docs.mem.ai/docs/api/mems/create)",
  type: "action",
  props: {
    mem,
    content: {
      propDefinition: [
        mem,
        "content",
      ],
    },
    isRead: {
      type: "boolean",
      label: "Is Read",
      description: "Indicates whether the mem should be automatically marked as \"read\" (unread mems are highlighted within the default views in the product UI). Defaults to `false`.",
      optional: true,
    },
    isAchived: {
      type: "boolean",
      label: "Is Archived",
      description: "Indicates whether the mem should be automatically marked as \"archived\" (archived mems are hidden from the default views in the product UI). Defaults to `false`.",
      optional: true,
    },
    scheduledFor: {
      type: "string",
      label: "Scheduled For",
      description: "Specify a time that this mem will resurface at (similar to the \"snooze\" button in the product UI). This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`",
      optional: true,
    },
    createdAt: {
      type: "string",
      label: "Created At",
      description: "Specify the time that the mem was created at. Defaults to the current time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`",
      optional: true,
    },
    memId: {
      type: "string",
      label: "Mem ID",
      description: "Specify the ID which should be assigned to the new mem. Defaults to a randomly-generated id. The IDs must be in the [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) format.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      mem,
      ...data
    } = this;

    const response = await mem.createMem({
      $,
      data,
    });

    $.export("$summary", `A new mem with Id: ${response.id} was successfully created!`);
    return response;
  },
};
