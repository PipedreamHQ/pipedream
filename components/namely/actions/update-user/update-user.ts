import {
  defineAction, JSONValue,
} from "@pipedream/types";
import dayjs from "dayjs";
import namely from "../../app/namely.app";

export default defineAction({
  key: "namely-update-user",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Update User",
  description: "Updates a user. [See docs here](https://developers.namely.com/docs/namely-api/2bfe77e091d74-update-a-profile)",
  type: "action",
  props: {
    namely,
    userId: {
      propDefinition: [
        namely,
        "userId",
      ],
    },
    firstName: {
      propDefinition: [
        namely,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        namely,
        "lastName",
      ],
      optional: true,
    },
    personalEmail: {
      propDefinition: [
        namely,
        "personalEmail",
      ],
      optional: true,
    },
    workEmail: {
      propDefinition: [
        namely,
        "workEmail",
      ],
      optional: true,
    },
    userStatus: {
      propDefinition: [
        namely,
        "userStatus",
      ],
      optional: true,
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

    const response = await this.namely.updateUser({
      $,
      userId: this.userId,
      data: body,
    });

    $.export("$summary", `Successfully updated user with id ${response.profiles[0].id}`);

    return response;
  },
});
