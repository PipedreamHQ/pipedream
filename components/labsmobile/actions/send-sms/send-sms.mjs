import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import labsmobile from "../../labsmobile.app.mjs";

export default {
  key: "labsmobile-send-sms",
  name: "Send SMS",
  description: "Sends a new SMS message. [See the documentation](https://apidocs.labsmobile.com/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    labsmobile,
    msisdn: {
      type: "integer[]",
      label: "Msisdn",
      description: "Parameter that includes a mobile number recipient. The number must include the country code without '+' ó '00'. Each customer account has a maximum number of msisdn per sending. See the terms of your account to see this limit.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to be sent. The maximum message length is 160 characters. Only characters in the GSM 3.38 7bit alphabet, found at the end of this document, are valid. Otherwise you must send `ucs2` parameter.",
    },
    tpoa: {
      type: "string",
      label: "Tpoa",
      description: "Sender of the message. May have a numeric (maximum length, 14 digits) or an alphanumeric (maximum capacity, 11 characters) value. The messaging platform assigns a default sender if this parameter is not included. By including the sender's mobile number, the message recipient can easily respond from their mobile phone with the \"Reply\" button. The sender can only be defined in some countries due to the restrictions of the operators. Otherwise the sender is a random numeric value.",
      optional: true,
    },
    subid: {
      type: "string",
      label: "Subid",
      description: "Message ID included in the ACKs (delivery confirmations). It is a unique delivery ID issued by the API client. It has a maximum length of 20 characters.",
      optional: true,
    },
    label: {
      type: "string",
      label: "Label",
      description: "Identifies the message for statistical purposes. WebSMS and other applications use this field to organize and record the message. Maximum capacity of 255 characters. Typical information contained in this field: user that has sent the message, application or module, etc. ...",
      optional: true,
    },
    test: {
      type: "boolean",
      label: "Test",
      description: "If the value is `true`, the message will be considered a test. It will not be sent to the GSM network and, therefore, will not be received on any mobile devices. However, these messages are accessible using online search tools. This parameter is intended to enable performing integration tests without an associated cost. Operator and handset confirmations will not be received.",
      optional: true,
    },
    ackurl: {
      type: "string",
      label: "Ackurl",
      description: "URL to which the corresponding delivery confirmation notifications will be sent. In the preferences section of WebSMS application you can set the default value for ackurl for all cases without having to send this parameter in each sending.",
      optional: true,
    },
    shortlink: {
      type: "boolean",
      label: "Shortlink",
      description: "If this field is present in the message and has a value of `true` the first URL would be replace by a short link of LabsMobile (format: http://lm0.es/XXXXX). The statistics of visits can be seen in WebSMS application or can be received in an url with the parameter clickurl.",
      optional: true,
    },
    clickurl: {
      type: "string",
      label: "Click URL",
      description: "URL to which the corresponding click confirmation notifications will be sent if the parameter shortlink is enabled. In the preferences section of WebSMS application you can set the default value for clickurl for all cases without having to send this parameter in each sending.",
      optional: true,
    },
    scheduled: {
      type: "string",
      label: "Scheduled",
      description: "The message will be sent at the date and time indicated in this field. If this field has not been specified, the message will be sent immediately. Format: YYYY-MM-DD HH:MM:SS. **IMPORTANT: the value of this field must be expressed using GMT time.**",
      optional: true,
    },
    long: {
      type: "boolean",
      label: "Long",
      description: "If this field is present in the message and has a value of `true`, the message field may contain up to 459 characters. Each 153 characters will be considered a single message (in terms of charges) and the recipient will receive one, concatenated message. **IMPORTANT: This option is only available in some countries due to the restrictions of the operators.**",
      optional: true,
    },
    crt: {
      type: "string",
      label: "CRT",
      description: "If this field is present in the message, it will be considered a certified SMS message. An email with the delivery certificate in an attachment will be sent to the address contained in this parameter. **IMPORTANT: This option is only implemented in some countries.**",
      optional: true,
    },
    crtId: {
      type: "string",
      label: "CRT ID",
      description: "If the message is a certified SMS message this field will be set as the tax identification number of the sender company or organization. You would see this value in the certificate in PDF format.",
      optional: true,
    },
    crtName: {
      type: "string",
      label: "CRT Name",
      description: "If the message is a certified SMS message this field will be set as the name of the sender company or organization. You would see this value in the certificate in PDF format.",
      optional: true,
    },
    ucs2: {
      type: "boolean",
      label: "UCS 2",
      description: "If this field is present in the message the message can contain any character in the UCS-2 alphabet. In this case the capacity of the message is 70 characters and can be sent concatenated to a maximum of 500 characters.",
      optional: true,
    },
    nofilter: {
      type: "boolean",
      label: "No Filter",
      description: "If this field is present the platform won't apply the duplicate filter, so no message will be blocked by this filter.",
      optional: true,
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "This field contains values to replace parameters in the text of the message. The message can contain one or more parameters (with the following format: **%name%**, **%fieldn%**, etc.). It is necessary to specify the value of each parameter for each of the recipients or establish a default value. Example: **{\"parameters\": [{\"name\": {\"msisdn\":\"12015550123\", \"value\":\"John\"}}, {\"name\": {\"msisdn\":\"default\", \"value\":\"Client\"}}]}**",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      labsmobile,
      msisdn,
      parameters,
      crtId,
      crtName,
      ...data
    } = this;

    const response = await labsmobile.sendSMS({
      $,
      data: {
        recipient: parseObject(msisdn).map((item) => ({
          msisdn: item,
        })),
        parameters: parameters && parseObject(parameters),
        crt_id: crtId,
        crt_name: crtName,
        ...data,
      },
    });

    if (response.code != "0") {
      throw new ConfigurationError(response.message);
    }

    $.export("$summary", `Successfully sent SMS with Id: ${response.subid}`);
    return response;
  },
};
