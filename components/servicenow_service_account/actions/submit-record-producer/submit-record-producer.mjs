import action from "@pipedream/servicenow/actions/submit-record-producer/submit-record-producer.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-submit-record-producer",
  note: "The producer runs as the integration user, so the created record's caller, `opened_by`, and requested-for fields default to the integration user unless **Variables** sets the person.",
  propDescriptions: {
    variables: "JSON object of variable name-value pairs for the record producer. Run **Get Catalog Item Variables** to discover valid names. Example: `{\"short_description\": \"laptop broken\"}`. The producer runs as the integration user, so the created record's caller, `opened_by`, and requested-for fields default to the integration user. To attribute the record to a person, pass their `sys_id` from **Find Users** in the producer's own person variable (for example a caller or requested-for variable listed by **Get Catalog Item Variables**). If the producer has no such variable, this API cannot set the person, and the producer's script can overwrite the value. After submitting, check the person fields on the created record with **Get Table Record by ID**, and correct them with **Update Table Record** if the integration user's ACLs allow it.",
  },
});
