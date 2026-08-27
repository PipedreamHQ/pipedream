import { ConfigurationError } from "@pipedream/platform";
import surveyMonkey from "../../survey_monkey.app.mjs";
import base from "../common/base-survey.mjs";
import { parseObjectArray } from "../../common/utils.mjs";

export default {
  ...base,
  key: "survey_monkey-add-message-recipients",
  name: "Add Message Recipients",
  description: "Add recipients to an invite message, from new contacts, existing contact IDs, contact lists, or any combination. Uses the bulk endpoint, so nothing is re-added: a recipient already on the message or collector comes back under `existing`, while `duplicate` reports addresses repeated within this one request. [See the documentation](https://api.surveymonkey.com/v3/docs?javascript#api-endpoints-post-collectors-collector_id-messages-message_id-recipients-bulk)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...base.props,
    collectorId: {
      propDefinition: [
        surveyMonkey,
        "collectorId",
        (c) => ({
          surveyId: c.survey,
        }),
      ],
    },
    messageId: {
      propDefinition: [
        surveyMonkey,
        "messageId",
      ],
      description: "The ID of the invite message to add recipients to. Run **List Invite Messages** to find valid message IDs, or use the `id` returned by **Create Invite Message**.",
    },
    contacts: {
      type: "string[]",
      label: "Contacts",
      description: "New contacts to add, each a JSON object. Email is required for email collectors and phone number for SMS collectors. **Example:** `{\"email\": \"jane@example.com\", \"first_name\": \"Jane\", \"last_name\": \"Doe\"}` or `{\"phone_number\": \"+1 202 555 0156\"}`. Careful with `custom_fields`: if any one contact supplies them, SurveyMonkey clears the existing custom fields of every other contact in the same call that does not.",
      optional: true,
    },
    contactIds: {
      type: "string[]",
      label: "Contact IDs",
      description: "IDs of existing SurveyMonkey contacts to add as recipients, e.g. `[\"123456\"]`. Contacts live in your SurveyMonkey address book rather than in this action — find their IDs at `GET /v3/contacts`, which returns an `id` per contact, or in the `succeeded[].id` values a previous run of this action returned.",
      optional: true,
    },
    contactListIds: {
      type: "string[]",
      label: "Contact List IDs",
      description: "IDs of existing contact lists whose contacts should be added as recipients, e.g. `[\"123456\"]`. Contact lists are managed in SurveyMonkey rather than here — find their IDs at `GET /v3/contact_lists`, or in the list's URL in the SurveyMonkey UI.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      contactIds, contactListIds,
    } = this;
    const contacts = parseObjectArray(this.contacts, "Contacts");

    if (!contacts?.length && !contactIds?.length && !contactListIds?.length) {
      throw new ConfigurationError("Set at least one of **Contacts**, **Contact IDs**, or **Contact List IDs**.");
    }

    const response = await this.surveyMonkey.addMessageRecipients({
      $,
      collectorId: this.collectorId,
      messageId: this.messageId,
      data: {
        contacts,
        contact_ids: contactIds,
        contact_list_ids: contactListIds,
      },
    });

    // The endpoint answers 200 even when every recipient was rejected, sorting
    // them into per-reason buckets, so the counts are the only signal that a
    // send will actually reach anyone.
    const skipped = [
      "invalids",
      "existing",
      "bounced",
      "opted_out",
      "duplicate",
    ]
      .map((bucket) => response?.[bucket]?.length
        ? `${response[bucket].length} ${bucket.replace("_", " ")}`
        : null)
      .filter(Boolean)
      .join(", ");

    $.export("$summary", `Successfully added ${response?.succeeded?.length ?? 0} recipient(s)${skipped
      ? `; skipped ${skipped}`
      : ""}`);

    return response;
  },
};
