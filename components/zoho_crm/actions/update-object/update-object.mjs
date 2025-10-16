import zohoCrm from "../../zoho_crm.app.mjs";
import common from "../common/common-objects.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "zoho_crm-update-object",
  name: "Update Object",
  description: "Updates existing entities in the module. [See the documentation](https://www.zoho.com/crm/developer/docs/api/v2/update-records.html)",
  version: "0.3.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    recordId: {
      propDefinition: [
        zohoCrm,
        "recordId",
        (c) => ({
          module: c.moduleType,
        }),
      ],
    },
  },
  async additionalProps() {
    const requiredProps = this.getRequiredProps(this.moduleType, "update");
    const optionalProps = await this.getOptionalProps(this.moduleType, "update");
    return {
      ...requiredProps,
      ...optionalProps,
    };
  },
  async run({ $ }) {
    const {
      zohoCrm,
      moduleType,
      recordId,
      lastName,
      accountName,
      dealName,
      stage,
      subject,
      callType,
      callStartTime,
      callDuration,
      campaignName,
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
    });

    const res = await zohoCrm.updateObject(
      moduleType,
      recordId,
      this.parseFields(object),
      $,
    );

    if (res.data[0].code === "SUCCESS") {
      $.export("$summary", `Successfully updated object with ID ${recordId}.`);
    } else {
      if (res.data[0].code === "INVALID_DATA") {
        throw new ConfigurationError(`Error: Invalid data for field '${res.data[0].details.api_name}'. Expected data type: ${res.data[0].details.expected_data_type}`);
      }
      throw new ConfigurationError(res.data[0].message);
    }
    return res;
  },
};
