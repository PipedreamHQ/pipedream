import motive from "../../motive.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "motive-find-user-details",
  name: "Find User Details",
  description: "Retrieve user details based on specific criteria. [See the documentation](https://developer.gomotive.com/reference/users-lookup)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    motive,
    username: {
      propDefinition: [
        motive,
        "username",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        motive,
        "email",
      ],
      optional: true,
    },
    driverCompanyId: {
      propDefinition: [
        motive,
        "driverCompanyId",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        motive,
        "phone",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      username, email, driverCompanyId, phone,
    } = this;
    if (!username && !email && !driverCompanyId && !phone) {
      throw new Error("At least one of 'username', 'email', 'driverCompanyId', or 'phone' must be provided.");
    }

    const response = await this.motive.retrieveUserDetails({
      username,
      email,
      driverCompanyId,
      phone,
    });

    const criteria = [];
    if (username) criteria.push(`username: ${username}`);
    if (email) criteria.push(`email: ${email}`);
    if (driverCompanyId) criteria.push(`driverCompanyId: ${driverCompanyId}`);
    if (phone) criteria.push(`phone: ${phone}`);

    $.export("$summary", `Successfully retrieved user details for ${criteria.join(", ")}`);
    return response;
  },
};
