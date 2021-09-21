const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-send-chat-message",
    name: "Send Chat Message",
    description: "Send a chat message to a channel or contact",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        userId: {
            label: "UserId",
            type: "string",
            optional: false,
            default: "me"
        },
        message: {
            label: "Message",
            type: "string",
            description: "The message to be sent.",
            optional: false,
            default: ""
        },
        toContact: {
            label: "To contact",
            type: "string",
            description: "The email address of the contact to whom you would like to send the message.",
            optional: true,
            default: ""
        },
        toChannel: {
            label: "To channel",
            type: "string",
            description: "The Channel Id of the channel where you would like to send a message.",
            optional: true,
            default: ""
        },
        replyMainMessageId: {
            label: "Reply main message id",
            type: "string",
            description: "The reply message's ID. This field only returns if the message is a reply message.",
            optional: true,
            default: ""
        },
        atItems: {
            label: "At items",
            type: "any",
            description: `[Chat mentions](https://support.zoom.us/hc/en-us/articles/360037567431-Using-chat-mentions-and-slash-commands). Use this object to include mentions in the message that will be sent to  a channel. JSON example:
            '[{
                "start_position": "Start position of the mention('@') in the message string. For example if you want to include the mention at the beginning of the message, the value for this field will be 0.",
                "end_position":"End position of the mention.",
                "at_type": "Type of mention. 1-Mention a contact./ 2-Mention 'all' to notify everyone in the channel",
                "at_contact":"This field is required if the value of 'at_type' field is set to 1. Email address of the contact"
            }]'
            `,
            optional: true,
            default: ""
        }
        // @todo: add props
    },
    async run() {
        // @todo: add action logic
    }
}