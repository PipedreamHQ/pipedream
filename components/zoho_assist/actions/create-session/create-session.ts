import { defineAction } from "@pipedream/types";
import app from "../../app/zoho_assist.app";
import { CreateSessionParams } from "../../common/types";
import { CREATE_SESSION_TYPE_OPTIONS } from "../../common/constants";

export default defineAction({
  name: "Create Session",
  description: "Create a remote support or screen sharing session. [See the documentation](https://www.zoho.com/assist/api/createasession.html)",
  key: "zoho_assist-create-session",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description:
        "Customer Email to whom the join invitation is to be sent.",
      optional: true,
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
      description:
        "Session type, defaulting to Remote Support.",
      optional: true,
      options: CREATE_SESSION_TYPE_OPTIONS,
      default: "rs",
    },
    computerId: {
      type: "string",
      label: "Computer ID",
      description:
        "URS (unattended remote support) key to initiate an unattended access session.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      customerEmail,
      type,
      computerId,
    } = this;

    const params: CreateSessionParams = {
      $,
      params: {
        customer_email: customerEmail,
        type,
        computer_id: computerId,
      },
    };

    const { representation } = await this.app.createSession(params);

    $.export("$summary", `Successfully created session (ID: ${representation.session_id})`);

    return representation;
  },
});
