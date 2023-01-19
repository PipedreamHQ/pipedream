import app from "../../ortto.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "ortto-create-activity",
  name: "Create an Activity",
  description: "Creates one custom activity definitions in Ortto’s customer data platform (CDP). [See the docs](https://help.ortto.com/developer/latest/developer-guide/custom-activities-guide.html#create-an-activity-in-ortto-via-api).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    activity: {
      type: "string",
      label: "Activity Name",
      description: "This should be a verb such as `Purchased`, `Visited`, `Downloaded` or `Logged in`.",
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "A string whose value is this person’s first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "A string whose value is this person’s last name.",
      optional: true,
    },
  },
  async run({ $: step }) {
    const {
      activity,
      email,
      firstName,
      lastName,
    } = this;

    const response = await this.app.createActivity({
      step,
      data: {
        activities: [
          {
            activity_id: `act:cm:${activity}`,
            fields: {
              [constants.FIELD.FIRST_NAME]: firstName,
              [constants.FIELD.LAST_NAME]: lastName,
              [constants.FIELD.EMAIL]: email,
            },
          },
        ],
      },
    });

    const [
      act,
    ] = response.activities || [];

    step.export("$summary", `Successfully created activity with Person ID ${act?.person_id}`);

    return act;
  },
};
