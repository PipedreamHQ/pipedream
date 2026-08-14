import {
  buildBaseConversion, commonProps, DATE_TIME_HINT, DOC_LINK, uploadConversion,
} from "../common/conversion-upload.mjs";

const CALL_DOC_LINK = `${DOC_LINK}/UploadCallConversions?transport=rest`;

export default {
  key: "google_ads-upload-call-conversion",
  name: "Upload Call Conversion",
  description: `Uploads an offline conversion attributed to a phone call. [See the documentation](${CALL_DOC_LINK})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...commonProps,
    callerId: {
      type: "string",
      label: "Caller ID",
      description: "The phone number the call was placed from, in E.164 format with a leading `+` (e.g. `+16502531234`).",
    },
    callStartDateTime: {
      type: "string",
      label: "Call Start Date Time",
      description: `When the call occurred. Must be before the conversion. ${DATE_TIME_HINT}`,
    },
  },
  async run({ $ }) {
    const {
      googleAds,
      accountId,
      customerClientId,
      callerId,
      callStartDateTime,
      validateOnly,
    } = this;

    const conversion = {
      ...buildBaseConversion(this),
      callerId,
      callStartDateTime,
    };

    const response = await uploadConversion({
      $,
      googleAds,
      method: "uploadCallConversions",
      accountId,
      customerClientId,
      conversion,
      validateOnly,
    });

    $.export(
      "$summary",
      validateOnly
        ? "Call conversion payload validated successfully (not recorded)."
        : "Successfully uploaded call conversion.",
    );
    return response;
  },
};
