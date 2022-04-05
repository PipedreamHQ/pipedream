import salesforce from "../../salesforce_rest_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-create-case",
  name: "Create Case",
  description: "Creates a Salesforce case, which represents a customer issue or problem.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce,
    SuppliedEmail: {
      type: "string",
      label: "SuppliedEmail",
      description: "The email address that was entered when the case was created. Label is Email.If your organization has an active auto-response rule, SuppliedEmail is required when creating a case via the API. Auto-response rules use the email in the contact specified by ContactId. If no email address is in the contact record, the email specified here is used.",
      optional: true,
    },
    AccountId: {
      type: "string",
      label: "AccountId",
      description: "ID of the account associated with this case.",
      optional: true,
    },
    BusinessHoursId: {
      type: "string",
      label: "BusinessHoursId",
      description: "ID of the business hours associated with this case.",
      optional: true,
    },
    ContactId: {
      type: "string",
      label: "ContactId",
      description: "ID of the associated Contact.",
      optional: true,
    },
    CommunityId: {
      type: "string",
      label: "CommunityId",
      description: "ID of the Community (Zone) associated with this case.",
      optional: true,
    },
    Description: {
      type: "string",
      label: "Description",
      description: "A text description of the case. Limit: 32 KB.",
      optional: true,
    },
    FeedItemId: {
      type: "string",
      label: "FeedItemId",
      description: "ID of the question in Chatter associated with the case. This field is available in API version 33.0 and later, and is only accessible in organizations where Question-to-Case is enabled.",
      optional: true,
    },
    IsEscalated: {
      type: "boolean",
      label: "IsEscalated",
      description: "Indicates whether the case has been escalated (true) or not. A case's escalated state does not affect how you can use a case, or whether you can query, delete, or update it. You can set this flag via the API. Label is Escalated.",
      optional: true,
    },
    Language: {
      type: "string",
      label: "Language",
      description: "The language of the case. This field is available in all Enterprise, Performance, and Unlimited orgs with the Service Cloud. Out of the box, it's used only by Einstein Case Classification.",
      optional: true,
    },
    Origin: {
      type: "string",
      label: "Origin",
      description: "The source of the case, such as Email, Phone, or Web. Label is Case Origin.",
      optional: true,
    },
    OwnerId: {
      type: "string",
      label: "OwnerId",
      description: "ID of the contact who owns the case.",
      optional: true,
    },
    ParentId: {
      type: "string",
      label: "ParentId",
      description: "The ID of the parent case in the hierarchy. The label is Parent Case.",
      optional: true,
    },
    Priority: {
      type: "string",
      label: "Priority",
      description: "The importance or urgency of the case, such as High, Medium, or Low.",
      optional: true,
    },
    QuestionId: {
      type: "string",
      label: "QuestionId",
      description: "The question in the answers community that is associated with the case. This field does not appear if you don't have an answers community enabled.",
      optional: true,
    },
    Reason: {
      type: "string",
      label: "Reason",
      description: "The reason why the case was created, such as Instructions not clear, or User didn't attend training.",
      optional: true,
    },
    RecordTypeId: {
      type: "string",
      label: "RecordTypeId",
      description: "ID of the record type assigned to this object.",
      optional: true,
    },
    SlaStartDate: {
      type: "string",
      label: "SlaStartDate",
      description: "Shows the time that the case entered an entitlement process. If you have the Edit permission on cases, you can update or reset the time if you have the Edit permission on cases.",
      optional: true,
    },
    SourceId: {
      type: "string",
      label: "SourceId",
      description: "The ID of the social post source.",
      optional: true,
    },
    Status: {
      type: "string",
      label: "Status",
      description: "The status of the case, such as New, Closed, or Escalated. This field directly controls the IsClosed flag. Each predefined Status value implies an IsClosed flag value. For more information, see CaseStatus.",
      optional: true,
    },
    Subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the case. Limit: 255 characters.",
      optional: true,
    },
    SuppliedCompany: {
      type: "string",
      label: "SuppliedCompany",
      description: "The company name that was entered when the case was created. Label is Company.",
      optional: true,
    },
    SuppliedName: {
      type: "string",
      label: "SuppliedName",
      description: "The name that was entered when the case was created. Label is Name.",
      optional: true,
    },
    SuppliedPhone: {
      type: "string",
      label: "SuppliedPhone",
      description: "The phone number that was entered when the case was created. Label is Phone.",
      optional: true,
    },
    Type: {
      type: "string",
      label: "Type",
      description: "The type of case, such as Feature Request or Question.",
      optional: true,
    },
  },
  async run({ $ }) {
    // See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm
    // Case object: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_case.htm

    if (!this.SuppliedEmail) {
      throw new Error("Must provide SuppliedEmail parameter.");
    }

    return await axios($, {
      "method": "post",
      "url": `${this.salesforce.$auth.instance_url}/services/data/v20.0/sobjects/Case/`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce.$auth.oauth_access_token}`,
      },
      "data": {
        AccountId: this.AccountId,
        BusinessHoursId: this.BusinessHoursId,
        ContactId: this.ContactId,
        CommunityId: this.CommunityId,
        Description: this.Description,
        FeedItemId: this.FeedItemId,
        IsEscalated: this.IsEscalated,
        Language: this.Language,
        Origin: this.Origin,
        OwnerId: this.OwnerId,
        ParentId: this.ParentId,
        Priority: this.Priority,
        QuestionId: this.QuestionId,
        Reason: this.Reason,
        RecordTypeId: this.RecordTypeId,
        SlaStartDate: this.SlaStartDate,
        SourceId: this.SourceId,
        Status: this.Status,
        Subject: this.Subject,
        SuppliedCompany: this.SuppliedCompany,
        SuppliedEmail: this.SuppliedEmail,
        SuppliedName: this.SuppliedName,
        SuppliedPhone: this.SuppliedPhone,
        Type: this.Type,
      },
    });
  },
};
