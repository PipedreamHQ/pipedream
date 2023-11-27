import zohoCrm from "../../zoho_crm.app.mjs";
import common from "../common/common-objects.mjs";

export default {
  ...common,
  key: "zoho_crm-update-object",
  name: "Update Object",
  description: "Updates existing entities in the module. [See the documentation](https://www.zoho.com/crm/developer/docs/api/v2/update-records.html)",
  version: "0.3.2",
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

    const response = await zohoCrm.updateObject(
      moduleType,
      recordId,
      object,
      $,
    );
    $.export("$summary", `Successfully updated object with ID ${recordId}.`);
    return response;
  },
};
