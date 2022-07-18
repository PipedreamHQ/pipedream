import { defineAction } from "@pipedream/types";
import dayjs from "dayjs";
import namely from "../../app/namely.app";
import constants from "../common/constants";

export default defineAction({
  key: "namely-create-user",
  version: "0.0.1",
  name: "Create User",
  description: "Creates a new user. [See docs here](https://developers.namely.com/docs/namely-api/28db3994d16fe-create-a-user)",
  type: "action",
  props: {
    namely,
    firstName: {
      label: "First Name",
      description: "The first name of the user",
      type: "string",
    },
    lastName: {
      label: "Last Name",
      description: "The last name of the user",
      type: "string",
    },
    personalEmail: {
      label: "Personal Email",
      description: "The personal email of the user",
      type: "string",
    },
    workEmail: {
      label: "Work Email",
      description: "The work email of the user",
      type: "string",
    },
    userStatus: {
      label: "user Status",
      description: "The status of the user",
      type: "string",
      options: constants.USER_STATUSES,
      default: "active",
    },
    salaryAmount: {
      label: "Yearly Salary Amount",
      description: "The yearly salary amount of the user. E.g. `100000`",
      type: "integer",
      optional: true,
    },
    salaryCurrency: {
      label: "Salary Currency",
      description: "The currency of the salary. E.g. `USD`",
      type: "string",
      default: "USD",
      optional: true,
    },

  },
  async run({ $ }) {
    const body: any = {
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

    const response = this.namely.createUser({
      $,
      data: body,
    });

    $.export("$summary", `Successfully created user with id ${response.id}`);

    return response;
  },
});
