import { ConfigurationError } from "@pipedream/platform";
import { clearObj } from "../../common/util.mjs";
import motive from "../../motive.app.mjs";

export default {
  key: "motive-find-user-details",
  name: "Find User Details",
  description: "Retrieve user details based on specific criteria. [See the documentation](https://developer.gomotive.com/reference/users-lookup)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    motive,
    alert: {
      type: "alert",
      alertType: "info",
      content: "If you provide more than one prop, only one will be considered, the others will be ignored.",
    },
    username: {
      type: "string",
      label: "Username",
      description: "Username to retrieve user details",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email to retrieve user details",
      optional: true,
    },
    driverCompanyId: {
      propDefinition: [
        motive,
        "driverCompanyId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    let response;
    const criteria = [];

    const {
      username, email, driverCompanyId,
    } = this;
    if (!username && !email && !driverCompanyId) {
      throw new Error("At least one of 'Username', 'Email', 'Driver Company Id' must be provided.");
    }

    if (username) criteria.push(`username: ${username}`);
    if (email) criteria.push(`email: ${email}`);
    if (driverCompanyId) criteria.push(`driverCompanyId: ${driverCompanyId}`);

    try {
      response = await this.motive.retrieveUserDetails({
        $,
        params: clearObj({
          username,
          email,
          driver_company_id: driverCompanyId,
        }),
      });

    } catch ({ response: { data } }) {
      if (data.error_message === "user not found") {
        response =  {
          user: null,
        };
      } else {
        throw new ConfigurationError(data.error_message);
      }
    }
    $.export("$summary", `Successfully retrieved user details for ${criteria.join(", ")}`);
    return response;
  },
};
