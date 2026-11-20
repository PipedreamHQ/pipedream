import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-get-request-type-form",
  name: "Get Request Type Form",
  description:
    "Gets the form attached to a request type, so you can ask the user each question and pass their answers in the `form` argument of **Create Request**."
    + " Forms are separate from the fields that **List Request Type Fields** returns: a request type can have both, and a request created without its form's answers is created with no form at all."
    + " Returns `hasForm` (`false` when the request type has no form), the form's `name`, and its `questions` in the order the form shows them."
    + " Each question gives the `questionId` to key its answer by, its `label`, `typeName`, whether it is `required`, the `answerFormat` its answer must follow, and for choice questions the `choices` whose `id`s go in the answer."
    + " A question with `conditions` is shown or hidden depending on another question's answer, e.g. `{ \"effect\": \"show\", \"whenAnyChoiceSelected\": { \"12\": [\"2\"] } }` means it only appears, and is only required, when question `12` has choice `2` selected; answers to hidden questions are dropped."
    + " Example: a question `{ \"questionId\": \"2\", \"label\": \"Licence type\", \"typeName\": \"Radio buttons\", \"choices\": [{ \"id\": \"1\", \"label\": \"Free\" }, { \"id\": \"2\", \"label\": \"Paid\" }] }` is answered as `{ \"2\": { \"choices\": [\"2\"] } }`."
    + " Use **List Sites** for `cloudId`, **List Service Desks** for `serviceDeskId`, and **List Request Types** for `requestTypeId`."
    + " [See the documentation](https://developer.atlassian.com/cloud/forms/rest/api-group-forms-on-portal/#api-servicedesk-servicedeskid-requesttype-requesttypeid-form-get)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    cloudId: {
      propDefinition: [
        app,
        "cloudId",
      ],
    },
    serviceDeskId: {
      propDefinition: [
        app,
        "serviceDeskId",
      ],
      description: "The service desk the request type belongs to. Use **List Service Desks** to find valid IDs (e.g. `1`).",
    },
    requestTypeId: {
      propDefinition: [
        app,
        "requestTypeId",
      ],
      description: "The request type whose form to get. Use **List Request Types** to find valid IDs (e.g. `5`).",
    },
    requestLanguage: {
      type: "string",
      label: "Request Language",
      description: "Locale to translate the form's labels into, e.g. `de-DE`. Defaults to the form's own language.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, cloudId, serviceDeskId, requestTypeId, requestLanguage,
    } = this;

    const result = await app.getRequestTypeFormQuestions({
      $,
      cloudId,
      serviceDeskId,
      requestTypeId,
      params: {
        requestLanguage,
      },
    });

    if (!result) {
      $.export("$summary", `Request type ${requestTypeId} has no form`);
      return {
        hasForm: false,
        questions: [],
      };
    }

    const {
      form, questions,
    } = result;
    $.export("$summary", `Found form "${form.design.settings?.name}" with ${questions.length} question${questions.length === 1
      ? ""
      : "s"}`);
    return {
      hasForm: true,
      formId: form.id,
      name: form.design.settings?.name,
      submitOnCreate: form.publish?.submitOnCreate,
      validateOnCreate: form.publish?.validateOnCreate,
      questions,
    };
  },
};
