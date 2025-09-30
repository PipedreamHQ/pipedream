import app from "../../textline.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "textline-send-announcement",
  name: "Send Announcement",
  description: "Send an announcement to a group of contacts. [See the documentation](https://textline.docs.apiary.io/#reference/messaging-tools/announcements/send-an-announcement).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    massTextGroupUuid: {
      label: "Mass Text Group UUID",
      description: "The UUID of the mass text group.",
      propDefinition: [
        app,
        "groupUuid",
      ],
    },
    massTextCommentBody: {
      type: "string",
      label: "Mass Text Comment Body",
      description: "The content of the message to send.",
    },
    massTextTitle: {
      type: "string",
      label: "Mass Text Title",
      description: "The title of the message.",
    },
    selectionType: {
      type: "string",
      label: "Selection Type",
      description: "The type of the selection for the announcement.",
      reloadProps: true,
      options: Object.values(constants.SELECTION_TYPE),
    },
  },
  additionalProps() {
    const { selectionType } = this;

    if (selectionType === constants.SELECTION_TYPE.TAGS.value) {
      return {
        tag: {
          type: "string",
          label: "Tag",
          description: "Send to all contacts with this tag.",
        },
      };
    }

    if (selectionType === constants.SELECTION_TYPE.PHONE_NUMBERS.value) {
      return {
        phoneNumbers: {
          type: "string[]",
          label: "Phone Numbers",
          description: "The phone numbers to send the announcement to.",
          useQuery: true,
          options: async ({
            page, query,
          }) => {
            const { customers } = await this.app.listCustomers({
              params: {
                page,
                page_size: 30,
                query: query || "",
              },
            });
            return customers.map(({
              name: label, phone_number: value,
            }) => ({
              label,
              value,
            }));
          },
        },
      };
    }

    return {};
  },
  methods: {
    sendAnnouncement(args = {}) {
      return this.app.post({
        path: "/announcements",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendAnnouncement,
      selectionType,
      massTextGroupUuid,
      massTextCommentBody,
      massTextTitle,
      tag,
      phoneNumbers,
    } = this;

    const response = await sendAnnouncement({
      $,
      data: {
        selection_type: selectionType,
        recipients: {
          tag,
          phone_numbers: phoneNumbers,
        },
        mass_text: {
          group_uuid: massTextGroupUuid,
          comment_body: massTextCommentBody,
          title: massTextTitle,
        },
      },
    });

    $.export("$summary", "Successfully sent the announcement.");
    return response;
  },
};
