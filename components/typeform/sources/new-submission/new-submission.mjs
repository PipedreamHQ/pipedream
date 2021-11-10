import typeform from "../../typeform.app.mjs";
import { uuid } from "uuidv4";
import { DateTime } from "luxon";

function parseIsoDate(isoDate) {
  const dt = DateTime.fromISO(isoDate);
  return {
    isoDate,
    date_time: dt.toFormat("yyyy-mm-dd hh:mm:ss a"),
    date: dt.toFormat("yyyy-mm-dd"),
    time: dt.toFormat("hh:mm:ss a"),
    timezone: dt.zoneName,
    epoch: dt.toMillis(),
  };
}

export default {
  key: "typeform-new-submission",
  name: "New Submission",
  version: "0.0.4",
  type: "source",
  description: "Emit new submission",
  props: {
    typeform,
    formId: {
      propDefinition: [
        typeform,
        "formId",
      ],
    },
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    generateSecret() {
      return "" + Math.random();
    },
  },
  hooks: {
    async activate() {
      const secret = this.generateSecret();
      this.db.set("secret", secret);
      let tag = this.db.get("tag");
      if (!tag) {
        tag = uuid();
        this.db.set("tag", tag);
      }
      try {
        return await this.typeform.createHook({
          endpoint: this.http.endpoint,
          formId: this.formId,
          tag,
          secret,
        });

      } catch (error) {
        throw new Error(error);
      }
    },
    async deactivate() {
      try {
        return await this.typeform.deleteHook({
          formId: this.formId,
          tag: this.db.get("tag"),
        });

      } catch (error) {
        throw new Error(error);
      }
    },
  },
  async run(event) {
    const {
      body,
      headers,
    } = event;

    if (headers["Typeform-Signature"]) {
      const crypto = require("crypto");
      const algo = "sha256";
      const hmac = crypto.createHmac(algo, this.db.get("secret"));
      hmac.update(body);
      if (
        headers["Typeform-Signature"] !== `${algo}=${hmac.digest("base64")}`
      ) {
        throw new Error("signature mismatch");
      }
    }

    let formResponseString = "";
    const data = Object.assign({}, body.form_response);
    data.form_response_parsed = {};
    for (let i = 0; i < body.form_response.answers.length; i++) {
      const field = body.form_response.definition.fields[i];
      const answer = body.form_response.answers[i];

      let parsedAnswer;
      let value = answer[answer.type];
      if (value.label) {
        parsedAnswer = value.label;
      } else if (value.labels) {
        parsedAnswer = value.labels.join();
      } else if (value.choice) {
        parsedAnswer = value.choice;
      } else if (value.choices) {
        parsedAnswer = value.choices.join();
      } else {
        parsedAnswer = value;
      }
      data.form_response_parsed[field.title] = parsedAnswer;
      formResponseString += `### ${field.title}\n${parsedAnswer}\n`;
    }
    data.form_response_string = formResponseString;
    data.raw_webhook_event = body;
    if (data.landed_at) data.landed_at = parseIsoDate(data.landed_at);
    if (data.submitted_at) data.submitted_at = parseIsoDate(data.submitted_at);
    data.form_title = body.form_response.definition.title;
    delete data.answers;
    delete data.definition;

    this.$emit(data, {
      summary: JSON.stringify(data),
      id: data.token,
    });
  },
};
