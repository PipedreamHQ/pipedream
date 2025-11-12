import asknicely from "../../asknicely.app.mjs";
import { clearObj } from "../../common/utils.mjs";

export default {
  key: "asknicely-send-survey",
  name: "Send Survey",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Trigger a survey to a contact. [See the documentation](https://demo.asknice.ly/help/apidocs/survey)",
  type: "action",
  props: {
    asknicely,
    email: {
      propDefinition: [
        asknicely,
        "email",
      ],
    },
    name: {
      propDefinition: [
        asknicely,
        "name",
      ],
      optional: true,
    },
    triggeremail: {
      type: "boolean",
      label: "Trigger Email",
      description: "If set to true, the API will always send a survey, we recommend to only use this parameter for testing the API to see the survey emails being sent. Remove this entirely when in production, as including this parameter will override all contact rules and send a survey for each API call. Setting **false** won't stop it from sending surveys.",
      optional: true,
    },
    delayminutes: {
      type: "integer",
      label: "Delay Minutes",
      description: "If you want to trigger a survey to have a delay, use delayminutes. 10 = 10 minute delay. 7 day delay would be 60*24*7 = 10800, there is no limit to how minutes or days you can delay. This value ignored for sms, surveys are always sent immediately.",
      optional: true,
    },
    segment: {
      propDefinition: [
        asknicely,
        "segment",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        asknicely,
        "customFields",
      ],
      optional: true,
    },
    thendeactivate: {
      type: "boolean",
      label: "Then Deactivate",
      description: "After a survey has been sent, de-activate this customer so they are not eligible for NPS surveys sent via the Daily Scheduler on the Send page. If you wish to de-activate a customer regardless of if a survey is sent or not, please use the [remove contact](https://demo.asknice.ly/help/removecontact) API. `Very handy if you are using both the Daily Scheduler and API calls.`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      asknicely,
      segment,
      customFields,
      ...params
    } = this;

    const response = await asknicely.sendSurvey(clearObj({
      $,
      params: {
        ...customFields,
        segment,
        ...params,
      },
    }));

    $.export("$summary", "The survey was successfully sent!");
    return response;
  },
};
