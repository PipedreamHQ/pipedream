import { defineAction, JSONValue } from "@pipedream/types";
import dayjs from "dayjs";
import namely from "../../app/namely.app";

export default defineAction({
  key: "namely-create-user",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create User",
  description: "Creates a new user. [See docs here](https://developers.namely.com/docs/namely-api/28db3994d16fe-create-a-user)",
  type: "action",
  props: {
    namely,
    firstName: {
      propDefinition: [
        namely,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        namely,
        "lastName",
      ],
    },
    personalEmail: {
      propDefinition: [
        namely,
        "personalEmail",
      ],
    },
    workEmail: {
      propDefinition: [
        namely,
        "workEmail",
      ],
    },
    userStatus: {
      propDefinition: [
        namely,
        "userStatus",
      ],
    },
    salaryAmount: {
      propDefinition: [
        namely,
        "salaryAmount",
      ],
      optional: true,
    },
    salaryCurrency: {
      propDefinition: [
        namely,
        "salaryCurrency",
      ],
      optional: true,
    },

  },
  async run({ $ }) {
    const body: Record<string, JSONValue> = {
      first_name: this.firstName,
      last_name: this.lastName,
      user_status: this.userStatus,
      personal_email: this.personalEmail,
      email: this.workEmail,
      start_date: dayjs().format("YYYY-MM-DD"),
    };

    if (this.salaryAmount) {
      body.salary = {
        yearly_amount: +this.salaryAmount,
        currency_type: this.salaryCurrency,
        date: dayjs().format("YYYY-MM-DD"),
      };
    }

    const response = await this.namely.createUser({
      $,
      data: body,
    });

    $.export("$summary", `Successfully created user with id ${response.profiles[0].id}`);

    return response;
  },
});
