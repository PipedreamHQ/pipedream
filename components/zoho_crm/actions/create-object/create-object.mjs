import common from "../common/common-objects.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "zoho_crm-create-object",
  name: "Create Object",
  description: "Create a new object/module entry. [See the documentation](https://www.zoho.com/crm/developer/docs/api/v2/insert-records.html)",
  version: "0.3.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async additionalProps() {
    const requiredProps = this.getRequiredProps(this.moduleType);
    const optionalProps = await this.getOptionalProps(this.moduleType);
    return {
      ...requiredProps,
      ...optionalProps,
      additionalData: {
        type: "object",
        label: "Additional Data",
        description: "Additional values for new object",
        optional: true,
      },
    };
  },
  async run({ $ }) {
    const {
      zohoCrm,
      moduleType,
      lastName,
      accountName,
      dealName,
      stage,
      subject,
      callType,
      callStartTime,
      callDuration,
      campaignName,
      additionalData,
      ...otherProps
    } = this;

    const object = zohoCrm.omitEmptyStringValues({
      Last_Name: lastName,
      Account_Name: accountName,
      Deal_Name: dealName,
      Stage: stage,
      Subject: subject,
      Call_Type: callType,
      Call_Start_Time: callStartTime,
      Call_Duration: callDuration,
      Campaign_Name: campaignName,
      ...otherProps,
      ...additionalData,
    });
    const objectData = {
      data: [
        this.parseFields(object),
      ],
    };
    const res = await zohoCrm.createObject(moduleType, objectData, $);

    if (res.data[0].code === "SUCCESS") {
      $.export("$summary", `Successfully created new object with ID ${res.data[0].details.id}.`);
    } else {
      if (res.data[0].code === "INVALID_DATA") {
        throw new ConfigurationError(`Error: Invalid data for field '${res.data[0].details.api_name}'. Expected data type: ${res.data[0].details.expected_data_type}`);
      }
      throw new ConfigurationError(res.data[0].message);
    }
    return res;
  },
};
