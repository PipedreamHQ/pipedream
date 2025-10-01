import adhook from "../../adhook.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "adhook-create-calendar-event",
  name: "Create Calendar Event",
  description: "Generates a personalized calendar event in AdHook. [See the documentation](https://app.adhook.io/api-doc/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    adhook,
    title: {
      type: "string",
      label: "Event Title",
      description: "The title of the calendar event",
      optional: true,
    },
    description: {
      type: "string",
      label: "Event Description",
      description: "The description of the calendar event",
      optional: true,
    },
    externalId: {
      propDefinition: [
        adhook,
        "externalId",
      ],
      optional: true,
    },
    start: {
      type: "string",
      label: "Start Date",
      description: "Start date of the event. **Format: YYYY-MM-DDTHH:MM:SSZ**",
      optional: true,
    },
    end: {
      type: "string",
      label: "End Date",
      description: "End date of the event. **Format: YYYY-MM-DDTHH:MM:SSZ**",
      optional: true,
    },
    allDay: {
      type: "boolean",
      label: "All Day",
      description: "Whether the event lasts all day or not",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "The color of the event",
      optional: true,
    },
    subtenantId: {
      propDefinition: [
        adhook,
        "subtenantId",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        adhook,
        "tags",
      ],
      optional: true,
    },
    topics: {
      propDefinition: [
        adhook,
        "topics",
      ],
      optional: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "A list of objects of attachments for the event. **Format: {\"name\": \"Attachment name\", \"url\":\"https://attachment.com/file.pdf\", \"fileExtension\":\"pdf\"}**",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      adhook,
      tags,
      topics,
      attachments,
      ...data
    } = this;

    const response = await adhook.createCalendarEvent({
      $,
      data: {
        type: "EVENT",
        ...data,
        tags: parseObject(tags),
        topics: parseObject(topics)?.map((topic) => ({
          name: topic,
        })),
        attachments: parseObject(attachments),
      },
    });

    $.export("$summary", `Successfully created calendar event: ${response.id}`);
    return response;
  },
};
