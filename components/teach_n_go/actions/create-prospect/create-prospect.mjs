import teachNGo from "../../teach_n_go.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "teach_n_go-create-prospect",
  name: "Create Prospect",
  description: "Creates a new prospect inside Teach 'n Go. [See the documentation](https://intercom.help/teach-n-go/en/articles/5750592-prospect-registration-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    teachNGo,
    prospectDetails: {
      propDefinition: [
        teachNGo,
        "prospectDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.teachNGo.createProspect({
      prospectDetails: this.prospectDetails,
    });
    $.export("$summary", `Successfully created prospect with ID: ${response.id}`);
    return response;
  },
};
