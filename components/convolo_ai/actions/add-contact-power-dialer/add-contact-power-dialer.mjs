import { axios } from "@pipedream/platform";
import convolo_ai from "../../convolo_ai.app.mjs";

export default {
  key: "convolo_ai-add-contact-power-dialer",
  name: "Add Contact to Power Dialer",
  description: "Adds a new contact to a power dialer project in Convolo. [See the documentation](https://help.convolo.ai/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    convolo_ai,
    contactDetails: {
      propDefinition: [
        convolo_ai,
        "contactDetails",
      ],
    },
    powerDialerProjectIdentifier: {
      propDefinition: [
        convolo_ai,
        "powerDialerProjectIdentifier",
      ],
    },
  },
  async run({ $ }) {
    const parsedContactDetails = this.contactDetails.map(JSON.parse);
    const response = await this.convolo_ai.addContactToPowerDialer({
      contactDetails: parsedContactDetails,
      powerDialerProjectIdentifier: this.powerDialerProjectIdentifier,
    });

    $.export("$summary", `Successfully added contact to the power dialer project with identifier: ${this.powerDialerProjectIdentifier}`);
    return response;
  },
};
