import { createHmac } from "crypto";
import { uuid } from "uuidv4";
import common from "../common/common.mjs";
import constants from "../../constants.mjs";
import utils from "../common/utils.mjs";

const { typeform } = common.props;
const { parseIsoDate } = utils;

export default {
  ...common,
  key: "typeform-new-submission",
  name: "New Submission",
  version: "0.0.6",
  type: "source",
  description: "Emit new submission",
  props: {
    ...common.props,
    http: "$.interface.http",
    db: "$.service.db",
    formId: {
      propDefinition: [
        typeform,
        "formId",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateSecret() {
      return "" + Math.random();
    },
  },
  hooks: {
    ...common.hooks,
    async activate() {
      const secret = this.generateSecret();
      this._setSecret(secret);

      let tag = this._getTag();
      if (!tag) {
        tag = uuid();
        this._setTag(tag);
      }

      return await this.typeform.createHook({
        endpoint: this.http.endpoint,
        formId: this.formId,
        tag,
        secret,
      });
    },
    async deactivate() {
      const tag = this._getTag();

      return await this.typeform.deleteHook({
        formId: this.formId,
        tag,
      });
    },
  },
  async run(event) {
    const {
      body,
      headers,
    } = event;

    const { [constants.TYPEFORM_SIGNATURE]: typeformSignature } = headers;

    if (typeformSignature) {
      const secret = this._getSecret();

      const hmac =
        createHmac(constants.ALGORITHM, secret)
          .update(body)
          .digest(constants.ENCODING);

      const signature = `${constants.ALGORITHM}=${hmac}`;

      if (typeformSignature !== signature) {
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

    if (data.landed_at) {
      data.landed_at = parseIsoDate(data.landed_at);
    }

    if (data.submitted_at) {
      data.submitted_at = parseIsoDate(data.submitted_at);
    }

    data.form_title = body.form_response.definition.title;
    delete data.answers;
    delete data.definition;

    this.$emit(data, {
      summary: JSON.stringify(data),
      id: data.token,
    });
  },
};
