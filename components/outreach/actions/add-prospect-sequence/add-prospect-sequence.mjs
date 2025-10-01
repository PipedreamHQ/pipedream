import { ConfigurationError } from "@pipedream/platform";
import outreach from "../../outreach.app.mjs";

export default {
  key: "outreach-add-prospect-sequence",
  name: "Add Prospect to Sequence",
  description: "Adds an existing prospect to a specific sequence in Outreach. [See the documentation](https://developers.outreach.io/api/reference/tag/prospect/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    outreach,
    prospectId: {
      propDefinition: [
        outreach,
        "prospectId",
      ],
    },
    sequenceId: {
      propDefinition: [
        outreach,
        "sequenceId",
      ],
    },
    mailboxId: {
      propDefinition: [
        outreach,
        "mailboxId",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.outreach.addProspectToSequence({
        $,
        data: {
          data: {
            type: "sequenceState",
            relationships: {
              prospect: {
                data: {
                  type: "prospect",
                  id: this.prospectId,
                },
              },
              sequence: {
                data: {
                  type: "sequence",
                  id: this.sequenceId,
                },
              },
              mailbox: {
                data: {
                  type: "mailbox",
                  id: this.mailboxId,
                },
              },
            },
          },
        },
      });

      $.export("$summary", `Successfully added prospect ${this.prospectId} to sequence ${this.sequenceId}`);
      return response;
    } catch ({ message }) {
      throw new ConfigurationError(JSON.parse(message).errors[0].detail);
    }
  },
};
