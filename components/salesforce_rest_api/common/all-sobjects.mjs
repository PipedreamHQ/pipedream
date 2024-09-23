// The execution context of additionalProps prevents usage of propDefinitions
// and of standard async options methods (an arrow function is required)
// And the execution context of async options prevents any variable "leaking"
// so the only way is to actually paste these out as plain individual functions,
// unfortunately, without any references to code outside the function

/*
getRecords: () => this.salesforce.listRecordOptions({ objType: "ObjType",
nameField: "NameField" })
*/

const sobjects = [
  {
    name: "AIInsightAction",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AIInsightAction",
        nameField: "Name",
      }),
  },
  {
    name: "AIInsightFeedback",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AIInsightFeedback",
        nameField: "Name",
      }),
  },
  {
    name: "AIInsightReason",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AIInsightReason",
        nameField: "Name",
      }),
  },
  {
    name: "AIInsightValue",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AIInsightValue",
        nameField: "Name",
      }),
  },
  {
    name: "AIRecordInsight",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AIRecordInsight",
        nameField: "Name",
      }),
  },
  {
    name: "Account",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Account",
        nameField: "Name",
      }),
  },
  {
    name: "AccountCleanInfo",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AccountCleanInfo",
        nameField: "Name",
      }),
  },
  {
    name: "AccountContactRole",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AccountContactRole",
        nameField: "Id",
      }),
  },
  {
    name: "AccountFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AccountFeed",
        nameField: "Id",
      }),
  },
  {
    name: "AccountHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AccountHistory",
        nameField: "Id",
      }),
  },
  {
    name: "AdditionalNumber",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AdditionalNumber",
        nameField: "Name",
      }),
  },
  {
    name: "Address",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Address",
        nameField: "Name",
      }),
  },
  {
    name: "Announcement",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Announcement",
        nameField: "Id",
      }),
  },
  {
    name: "ApexClass",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ApexClass",
        nameField: "Name",
      }),
  },
  {
    name: "ApexComponent",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ApexComponent",
        nameField: "Name",
      }),
  },
  {
    name: "ApexPage",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ApexPage",
        nameField: "Name",
      }),
  },
  {
    name: "ApexTrigger",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ApexTrigger",
        nameField: "Name",
      }),
  },
  {
    name: "ApiAnomalyEventStore",
    nameField: "ApiAnomalyEventNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ApiAnomalyEventStore",
        nameField: "ApiAnomalyEventNumber",
      }),
  },
  {
    name: "ApiAnomalyEventStoreFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ApiAnomalyEventStoreFeed",
        nameField: "Id",
      }),
  },
  {
    name: "AppAnalyticsQueryRequest",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AppAnalyticsQueryRequest",
        nameField: "Name",
      }),
  },
  {
    name: "AppUsageAssignment",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AppUsageAssignment",
        nameField: "Name",
      }),
  },
  {
    name: "Asset",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Asset",
        nameField: "Name",
      }),
  },
  {
    name: "AssetAction",
    nameField: "AssetActionNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AssetAction",
        nameField: "AssetActionNumber",
      }),
  },
  {
    name: "AssetActionSource",
    nameField: "AssetActionSourceNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AssetActionSource",
        nameField: "AssetActionSourceNumber",
      }),
  },
  {
    name: "AssetFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AssetFeed",
        nameField: "Id",
      }),
  },
  {
    name: "AssetHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AssetHistory",
        nameField: "Id",
      }),
  },
  {
    name: "AssetRelationship",
    nameField: "AssetRelationshipNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AssetRelationship",
        nameField: "AssetRelationshipNumber",
      }),
  },
  {
    name: "AssetRelationshipFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AssetRelationshipFeed",
        nameField: "Id",
      }),
  },
  {
    name: "AssetRelationshipHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AssetRelationshipHistory",
        nameField: "Id",
      }),
  },
  {
    name: "AssetStatePeriod",
    nameField: "AssetStatePeriodNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AssetStatePeriod",
        nameField: "AssetStatePeriodNumber",
      }),
  },
  {
    name: "AssignedResource",
    nameField: "AssignedResourceNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AssignedResource",
        nameField: "AssignedResourceNumber",
      }),
  },
  {
    name: "AssignedResourceFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AssignedResourceFeed",
        nameField: "Id",
      }),
  },
  {
    name: "AssociatedLocation",
    nameField: "AssociatedLocationNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AssociatedLocation",
        nameField: "AssociatedLocationNumber",
      }),
  },
  {
    name: "AssociatedLocationHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AssociatedLocationHistory",
        nameField: "Id",
      }),
  },
  {
    name: "Attachment",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Attachment",
        nameField: "Name",
      }),
  },
  {
    name: "AuthorizationForm",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AuthorizationForm",
        nameField: "Name",
      }),
  },
  {
    name: "AuthorizationFormConsent",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AuthorizationFormConsent",
        nameField: "Name",
      }),
  },
  {
    name: "AuthorizationFormConsentHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AuthorizationFormConsentHistory",
        nameField: "Id",
      }),
  },
  {
    name: "AuthorizationFormDataUse",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AuthorizationFormDataUse",
        nameField: "Name",
      }),
  },
  {
    name: "AuthorizationFormDataUseHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AuthorizationFormDataUseHistory",
        nameField: "Id",
      }),
  },
  {
    name: "AuthorizationFormHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AuthorizationFormHistory",
        nameField: "Id",
      }),
  },
  {
    name: "AuthorizationFormText",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AuthorizationFormText",
        nameField: "Name",
      }),
  },
  {
    name: "AuthorizationFormTextHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "AuthorizationFormTextHistory",
        nameField: "Id",
      }),
  },
  {
    name: "BackgroundOperation",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "BackgroundOperation",
        nameField: "Name",
      }),
  },
  {
    name: "BrandTemplate",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "BrandTemplate",
        nameField: "Name",
      }),
  },
  {
    name: "BriefcaseAssignment",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "BriefcaseAssignment",
        nameField: "Id",
      }),
  },
  {
    name: "BusinessHours",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "BusinessHours",
        nameField: "Name",
      }),
  },
  {
    name: "BusinessProcess",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "BusinessProcess",
        nameField: "Name",
      }),
  },
  {
    name: "BuyerGroup",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "BuyerGroup",
        nameField: "Name",
      }),
  },
  {
    name: "BuyerGroupFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "BuyerGroupFeed",
        nameField: "Id",
      }),
  },
  {
    name: "BuyerGroupHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "BuyerGroupHistory",
        nameField: "Id",
      }),
  },
  {
    name: "CalendarView",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CalendarView",
        nameField: "Name",
      }),
  },
  {
    name: "CallCenter",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CallCenter",
        nameField: "Name",
      }),
  },
  {
    name: "Campaign",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Campaign",
        nameField: "Name",
      }),
  },
  {
    name: "CampaignFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CampaignFeed",
        nameField: "Id",
      }),
  },
  {
    name: "CampaignHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CampaignHistory",
        nameField: "Id",
      }),
  },
  {
    name: "CampaignMember",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CampaignMember",
        nameField: "Id",
      }),
  },
  {
    name: "CampaignMemberStatus",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CampaignMemberStatus",
        nameField: "Id",
      }),
  },
  {
    name: "CardPaymentMethod",
    nameField: "CardPaymentMethodNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CardPaymentMethod",
        nameField: "CardPaymentMethodNumber",
      }),
  },
  {
    name: "CartCheckoutSession",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CartCheckoutSession",
        nameField: "Name",
      }),
  },
  {
    name: "CartDeliveryGroup",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CartDeliveryGroup",
        nameField: "Name",
      }),
  },
  {
    name: "CartDeliveryGroupMethod",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CartDeliveryGroupMethod",
        nameField: "Name",
      }),
  },
  {
    name: "CartItem",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CartItem",
        nameField: "Name",
      }),
  },
  {
    name: "CartRelatedItem",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CartRelatedItem",
        nameField: "Name",
      }),
  },
  {
    name: "CartTax",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CartTax",
        nameField: "Name",
      }),
  },
  {
    name: "CartValidationOutput",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CartValidationOutput",
        nameField: "Name",
      }),
  },
  {
    name: "Case",
    nameField: "CaseNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Case",
        nameField: "CaseNumber",
      }),
  },
  {
    name: "CaseComment",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CaseComment",
        nameField: "Id",
      }),
  },
  {
    name: "CaseContactRole",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CaseContactRole",
        nameField: "Id",
      }),
  },
  {
    name: "CaseFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CaseFeed",
        nameField: "Id",
      }),
  },
  {
    name: "CaseHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CaseHistory",
        nameField: "Id",
      }),
  },
  {
    name: "CaseSolution",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CaseSolution",
        nameField: "Id",
      }),
  },
  {
    name: "CaseTeamMember",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CaseTeamMember",
        nameField: "Id",
      }),
  },
  {
    name: "CaseTeamRole",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CaseTeamRole",
        nameField: "Name",
      }),
  },
  {
    name: "CaseTeamTemplate",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CaseTeamTemplate",
        nameField: "Name",
      }),
  },
  {
    name: "CaseTeamTemplateMember",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CaseTeamTemplateMember",
        nameField: "Id",
      }),
  },
  {
    name: "CaseTeamTemplateRecord",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CaseTeamTemplateRecord",
        nameField: "Id",
      }),
  },
  {
    name: "CategoryData",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CategoryData",
        nameField: "Id",
      }),
  },
  {
    name: "CategoryNode",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CategoryNode",
        nameField: "Id",
      }),
  },
  {
    name: "ChatterActivity",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ChatterActivity",
        nameField: "Id",
      }),
  },
  {
    name: "CollaborationGroupFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CollaborationGroupFeed",
        nameField: "Id",
      }),
  },
  {
    name: "CollaborationGroupMember",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CollaborationGroupMember",
        nameField: "Id",
      }),
  },
  {
    name: "CollaborationGroupRecord",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CollaborationGroupRecord",
        nameField: "Id",
      }),
  },
  {
    name: "CommSubscription",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CommSubscription",
        nameField: "Name",
      }),
  },
  {
    name: "CommSubscriptionChannelType",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CommSubscriptionChannelType",
        nameField: "Name",
      }),
  },
  {
    name: "CommSubscriptionChannelTypeFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CommSubscriptionChannelTypeFeed",
        nameField: "Id",
      }),
  },
  {
    name: "CommSubscriptionChannelTypeHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CommSubscriptionChannelTypeHistory",
        nameField: "Id",
      }),
  },
  {
    name: "CommSubscriptionConsent",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CommSubscriptionConsent",
        nameField: "Name",
      }),
  },
  {
    name: "CommSubscriptionConsentFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CommSubscriptionConsentFeed",
        nameField: "Id",
      }),
  },
  {
    name: "CommSubscriptionConsentHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CommSubscriptionConsentHistory",
        nameField: "Id",
      }),
  },
  {
    name: "CommSubscriptionFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CommSubscriptionFeed",
        nameField: "Id",
      }),
  },
  {
    name: "CommSubscriptionHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CommSubscriptionHistory",
        nameField: "Id",
      }),
  },
  {
    name: "CommSubscriptionTiming",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CommSubscriptionTiming",
        nameField: "Name",
      }),
  },
  {
    name: "CommSubscriptionTimingFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CommSubscriptionTimingFeed",
        nameField: "Id",
      }),
  },
  {
    name: "CommSubscriptionTimingHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CommSubscriptionTimingHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ConferenceNumber",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ConferenceNumber",
        nameField: "Name",
      }),
  },
  {
    name: "ConsumptionRate",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ConsumptionRate",
        nameField: "Name",
      }),
  },
  {
    name: "ConsumptionRateHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ConsumptionRateHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ConsumptionSchedule",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ConsumptionSchedule",
        nameField: "Name",
      }),
  },
  {
    name: "ConsumptionScheduleFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ConsumptionScheduleFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ConsumptionScheduleHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ConsumptionScheduleHistory",
        nameField: "Id",
      }),
  },
  {
    name: "Contact",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Contact",
        nameField: "Name",
      }),
  },
  {
    name: "ContactCleanInfo",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactCleanInfo",
        nameField: "Name",
      }),
  },
  {
    name: "ContactFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ContactHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ContactPointAddress",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactPointAddress",
        nameField: "Name",
      }),
  },
  {
    name: "ContactPointAddressHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactPointAddressHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ContactPointConsent",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactPointConsent",
        nameField: "Name",
      }),
  },
  {
    name: "ContactPointConsentHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactPointConsentHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ContactPointEmail",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactPointEmail",
        nameField: "Name",
      }),
  },
  {
    name: "ContactPointEmailHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactPointEmailHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ContactPointPhone",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactPointPhone",
        nameField: "Name",
      }),
  },
  {
    name: "ContactPointPhoneHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactPointPhoneHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ContactPointTypeConsent",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactPointTypeConsent",
        nameField: "Name",
      }),
  },
  {
    name: "ContactPointTypeConsentHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactPointTypeConsentHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ContactRequest",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContactRequest",
        nameField: "Name",
      }),
  },
  {
    name: "ContentDocumentFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContentDocumentFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ContentDocumentHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContentDocumentHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ContentFolder",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContentFolder",
        nameField: "Name",
      }),
  },
  {
    name: "ContentVersionHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContentVersionHistory",
        nameField: "Id",
      }),
  },
  {
    name: "Contract",
    nameField: "ContractNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Contract",
        nameField: "ContractNumber",
      }),
  },
  {
    name: "ContractContactRole",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContractContactRole",
        nameField: "Id",
      }),
  },
  {
    name: "ContractFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContractFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ContractHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContractHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ContractLineItem",
    nameField: "LineItemNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContractLineItem",
        nameField: "LineItemNumber",
      }),
  },
  {
    name: "ContractLineItemHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ContractLineItemHistory",
        nameField: "Id",
      }),
  },
  {
    name: "CredentialStuffingEventStore",
    nameField: "CredentialStuffingEventNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CredentialStuffingEventStore",
        nameField: "CredentialStuffingEventNumber",
      }),
  },
  {
    name: "CredentialStuffingEventStoreFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CredentialStuffingEventStoreFeed",
        nameField: "Id",
      }),
  },
  {
    name: "CreditMemo",
    nameField: "DocumentNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CreditMemo",
        nameField: "DocumentNumber",
      }),
  },
  {
    name: "CreditMemoFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CreditMemoFeed",
        nameField: "Id",
      }),
  },
  {
    name: "CreditMemoHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CreditMemoHistory",
        nameField: "Id",
      }),
  },
  {
    name: "CreditMemoInvApplication",
    nameField: "CreditMemoInvoiceNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CreditMemoInvApplication",
        nameField: "CreditMemoInvoiceNumber",
      }),
  },
  {
    name: "CreditMemoInvApplicationFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CreditMemoInvApplicationFeed",
        nameField: "Id",
      }),
  },
  {
    name: "CreditMemoInvApplicationHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CreditMemoInvApplicationHistory",
        nameField: "Id",
      }),
  },
  {
    name: "CreditMemoLine",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CreditMemoLine",
        nameField: "Name",
      }),
  },
  {
    name: "CreditMemoLineFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CreditMemoLineFeed",
        nameField: "Id",
      }),
  },
  {
    name: "CreditMemoLineHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "CreditMemoLineHistory",
        nameField: "Id",
      }),
  },
  {
    name: "DandBCompany",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DandBCompany",
        nameField: "Name",
      }),
  },
  {
    name: "DashboardComponentFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DashboardComponentFeed",
        nameField: "Id",
      }),
  },
  {
    name: "DashboardFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DashboardFeed",
        nameField: "Id",
      }),
  },
  {
    name: "DataAssessmentFieldMetric",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DataAssessmentFieldMetric",
        nameField: "Name",
      }),
  },
  {
    name: "DataAssessmentMetric",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DataAssessmentMetric",
        nameField: "Name",
      }),
  },
  {
    name: "DataAssessmentValueMetric",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DataAssessmentValueMetric",
        nameField: "Name",
      }),
  },
  {
    name: "DataKitDeploymentLog",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DataKitDeploymentLog",
        nameField: "Id",
      }),
  },
  {
    name: "DataUseLegalBasis",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DataUseLegalBasis",
        nameField: "Name",
      }),
  },
  {
    name: "DataUseLegalBasisHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DataUseLegalBasisHistory",
        nameField: "Id",
      }),
  },
  {
    name: "DataUsePurpose",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DataUsePurpose",
        nameField: "Name",
      }),
  },
  {
    name: "DataUsePurposeHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DataUsePurposeHistory",
        nameField: "Id",
      }),
  },
  {
    name: "DatacloudOwnedEntity",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DatacloudOwnedEntity",
        nameField: "Name",
      }),
  },
  {
    name: "DatacloudPurchaseUsage",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DatacloudPurchaseUsage",
        nameField: "Name",
      }),
  },
  {
    name: "DigitalWallet",
    nameField: "DigitalWalletNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DigitalWallet",
        nameField: "DigitalWalletNumber",
      }),
  },
  {
    name: "Document",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Document",
        nameField: "Name",
      }),
  },
  {
    name: "DuplicateRecordItem",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DuplicateRecordItem",
        nameField: "Name",
      }),
  },
  {
    name: "DuplicateRecordSet",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "DuplicateRecordSet",
        nameField: "Name",
      }),
  },
  {
    name: "EmailMessage",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EmailMessage",
        nameField: "Id",
      }),
  },
  {
    name: "EmailMessageRelation",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EmailMessageRelation",
        nameField: "Id",
      }),
  },
  {
    name: "EmailServicesAddress",
    nameField: "LocalPart",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EmailServicesAddress",
        nameField: "LocalPart",
      }),
  },
  {
    name: "EmailServicesFunction",
    nameField: "FunctionName",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EmailServicesFunction",
        nameField: "FunctionName",
      }),
  },
  {
    name: "EmailTemplate",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EmailTemplate",
        nameField: "Name",
      }),
  },
  {
    name: "EngagementChannelType",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EngagementChannelType",
        nameField: "Name",
      }),
  },
  {
    name: "EngagementChannelTypeFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EngagementChannelTypeFeed",
        nameField: "Id",
      }),
  },
  {
    name: "EngagementChannelTypeHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EngagementChannelTypeHistory",
        nameField: "Id",
      }),
  },
  {
    name: "EnhancedLetterhead",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EnhancedLetterhead",
        nameField: "Name",
      }),
  },
  {
    name: "EnhancedLetterheadFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EnhancedLetterheadFeed",
        nameField: "Id",
      }),
  },
  {
    name: "Entitlement",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Entitlement",
        nameField: "Name",
      }),
  },
  {
    name: "EntitlementContact",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EntitlementContact",
        nameField: "Name",
      }),
  },
  {
    name: "EntitlementFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EntitlementFeed",
        nameField: "Id",
      }),
  },
  {
    name: "EntitlementHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EntitlementHistory",
        nameField: "Id",
      }),
  },
  {
    name: "EntityMilestone",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EntityMilestone",
        nameField: "Name",
      }),
  },
  {
    name: "EntityMilestoneFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EntityMilestoneFeed",
        nameField: "Id",
      }),
  },
  {
    name: "EntityMilestoneHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EntityMilestoneHistory",
        nameField: "Id",
      }),
  },
  {
    name: "EntitySubscription",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EntitySubscription",
        nameField: "Id",
      }),
  },
  {
    name: "Event",
    nameField: "Subject",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Event",
        nameField: "Subject",
      }),
  },
  {
    name: "EventFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EventFeed",
        nameField: "Id",
      }),
  },
  {
    name: "EventRelation",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "EventRelation",
        nameField: "Id",
      }),
  },
  {
    name: "ExpressionFilter",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ExpressionFilter",
        nameField: "Name",
      }),
  },
  {
    name: "ExpressionFilterCriteria",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ExpressionFilterCriteria",
        nameField: "Name",
      }),
  },
  {
    name: "ExternalEvent",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ExternalEvent",
        nameField: "Name",
      }),
  },
  {
    name: "ExternalEventMapping",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ExternalEventMapping",
        nameField: "Name",
      }),
  },
  {
    name: "FeedComment",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FeedComment",
        nameField: "Id",
      }),
  },
  {
    name: "FeedItem",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FeedItem",
        nameField: "Id",
      }),
  },
  {
    name: "FeedRevision",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FeedRevision",
        nameField: "Id",
      }),
  },
  {
    name: "FileSearchActivity",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FileSearchActivity",
        nameField: "Name",
      }),
  },
  {
    name: "FinanceBalanceSnapshot",
    nameField: "FinanceBalanceSnapshotNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FinanceBalanceSnapshot",
        nameField: "FinanceBalanceSnapshotNumber",
      }),
  },
  {
    name: "FinanceTransaction",
    nameField: "FinanceTransactionNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FinanceTransaction",
        nameField: "FinanceTransactionNumber",
      }),
  },
  {
    name: "FiscalYearSettings",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FiscalYearSettings",
        nameField: "Name",
      }),
  },
  {
    name: "FlowInterview",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FlowInterview",
        nameField: "Name",
      }),
  },
  {
    name: "FlowInterviewLog",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FlowInterviewLog",
        nameField: "Name",
      }),
  },
  {
    name: "FlowInterviewLogEntry",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FlowInterviewLogEntry",
        nameField: "Name",
      }),
  },
  {
    name: "FlowRecordRelation",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FlowRecordRelation",
        nameField: "Name",
      }),
  },
  {
    name: "FlowStageRelation",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FlowStageRelation",
        nameField: "Name",
      }),
  },
  {
    name: "Folder",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Folder",
        nameField: "Name",
      }),
  },
  {
    name: "FulfillmentOrder",
    nameField: "FulfillmentOrderNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FulfillmentOrder",
        nameField: "FulfillmentOrderNumber",
      }),
  },
  {
    name: "FulfillmentOrderFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FulfillmentOrderFeed",
        nameField: "Id",
      }),
  },
  {
    name: "FulfillmentOrderItemAdjustment",
    nameField: "FulfillmentOrderItemAdjustmentNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FulfillmentOrderItemAdjustment",
        nameField: "FulfillmentOrderItemAdjustmentNumber",
      }),
  },
  {
    name: "FulfillmentOrderItemAdjustmentFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FulfillmentOrderItemAdjustmentFeed",
        nameField: "Id",
      }),
  },
  {
    name: "FulfillmentOrderItemTax",
    nameField: "FulfillmentOrderItemTaxNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FulfillmentOrderItemTax",
        nameField: "FulfillmentOrderItemTaxNumber",
      }),
  },
  {
    name: "FulfillmentOrderItemTaxFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FulfillmentOrderItemTaxFeed",
        nameField: "Id",
      }),
  },
  {
    name: "FulfillmentOrderLineItem",
    nameField: "FulfillmentOrderLineItemNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FulfillmentOrderLineItem",
        nameField: "FulfillmentOrderLineItemNumber",
      }),
  },
  {
    name: "FulfillmentOrderLineItemFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "FulfillmentOrderLineItemFeed",
        nameField: "Id",
      }),
  },
  {
    name: "Group",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Group",
        nameField: "Name",
      }),
  },
  {
    name: "GroupMember",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "GroupMember",
        nameField: "Id",
      }),
  },
  {
    name: "Holiday",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Holiday",
        nameField: "Name",
      }),
  },
  {
    name: "Idea",
    nameField: "Title",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Idea",
        nameField: "Title",
      }),
  },
  {
    name: "IdeaComment",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "IdeaComment",
        nameField: "Id",
      }),
  },
  {
    name: "Image",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Image",
        nameField: "Name",
      }),
  },
  {
    name: "Individual",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Individual",
        nameField: "Name",
      }),
  },
  {
    name: "IndividualHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "IndividualHistory",
        nameField: "Id",
      }),
  },
  {
    name: "InstalledMobileApp",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "InstalledMobileApp",
        nameField: "Name",
      }),
  },
  {
    name: "Invoice",
    nameField: "DocumentNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Invoice",
        nameField: "DocumentNumber",
      }),
  },
  {
    name: "InvoiceFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "InvoiceFeed",
        nameField: "Id",
      }),
  },
  {
    name: "InvoiceHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "InvoiceHistory",
        nameField: "Id",
      }),
  },
  {
    name: "InvoiceLine",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "InvoiceLine",
        nameField: "Name",
      }),
  },
  {
    name: "InvoiceLineFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "InvoiceLineFeed",
        nameField: "Id",
      }),
  },
  {
    name: "InvoiceLineHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "InvoiceLineHistory",
        nameField: "Id",
      }),
  },
  {
    name: "Lead",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Lead",
        nameField: "Name",
      }),
  },
  {
    name: "LeadCleanInfo",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "LeadCleanInfo",
        nameField: "Name",
      }),
  },
  {
    name: "LeadFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "LeadFeed",
        nameField: "Id",
      }),
  },
  {
    name: "LeadHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "LeadHistory",
        nameField: "Id",
      }),
  },
  {
    name: "LegalEntity",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "LegalEntity",
        nameField: "Name",
      }),
  },
  {
    name: "LegalEntityFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "LegalEntityFeed",
        nameField: "Id",
      }),
  },
  {
    name: "LegalEntityHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "LegalEntityHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ListEmail",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ListEmail",
        nameField: "Name",
      }),
  },
  {
    name: "ListEmailIndividualRecipient",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ListEmailIndividualRecipient",
        nameField: "Name",
      }),
  },
  {
    name: "ListEmailRecipientSource",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ListEmailRecipientSource",
        nameField: "Name",
      }),
  },
  {
    name: "Location",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Location",
        nameField: "Name",
      }),
  },
  {
    name: "LocationFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "LocationFeed",
        nameField: "Id",
      }),
  },
  {
    name: "LocationHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "LocationHistory",
        nameField: "Id",
      }),
  },
  {
    name: "Macro",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Macro",
        nameField: "Name",
      }),
  },
  {
    name: "MacroHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "MacroHistory",
        nameField: "Id",
      }),
  },
  {
    name: "MacroInstruction",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "MacroInstruction",
        nameField: "Name",
      }),
  },
  {
    name: "MacroUsage",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "MacroUsage",
        nameField: "Name",
      }),
  },
  {
    name: "MailmergeTemplate",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "MailmergeTemplate",
        nameField: "Name",
      }),
  },
  {
    name: "MatchingInformation",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "MatchingInformation",
        nameField: "Name",
      }),
  },
  {
    name: "MessagingDeliveryError",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "MessagingDeliveryError",
        nameField: "Name",
      }),
  },
  {
    name: "MessagingEndUser",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "MessagingEndUser",
        nameField: "Name",
      }),
  },
  {
    name: "MessagingEndUserHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "MessagingEndUserHistory",
        nameField: "Id",
      }),
  },
  {
    name: "MessagingSession",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "MessagingSession",
        nameField: "Name",
      }),
  },
  {
    name: "MessagingSessionFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "MessagingSessionFeed",
        nameField: "Id",
      }),
  },
  {
    name: "MessagingSessionHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "MessagingSessionHistory",
        nameField: "Id",
      }),
  },
  {
    name: "MlFeatureValueMetric",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "MlFeatureValueMetric",
        nameField: "Name",
      }),
  },
  {
    name: "Note",
    nameField: "Title",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Note",
        nameField: "Title",
      }),
  },
  {
    name: "OperatingHours",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OperatingHours",
        nameField: "Name",
      }),
  },
  {
    name: "OperatingHoursFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OperatingHoursFeed",
        nameField: "Id",
      }),
  },
  {
    name: "OperatingHoursHoliday",
    nameField: "OperatingHoursHolidayNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OperatingHoursHoliday",
        nameField: "OperatingHoursHolidayNumber",
      }),
  },
  {
    name: "OperatingHoursHolidayFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OperatingHoursHolidayFeed",
        nameField: "Id",
      }),
  },
  {
    name: "Opportunity",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Opportunity",
        nameField: "Name",
      }),
  },
  {
    name: "OpportunityCompetitor",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OpportunityCompetitor",
        nameField: "Id",
      }),
  },
  {
    name: "OpportunityContactRole",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OpportunityContactRole",
        nameField: "Id",
      }),
  },
  {
    name: "OpportunityFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OpportunityFeed",
        nameField: "Id",
      }),
  },
  {
    name: "OpportunityFieldHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OpportunityFieldHistory",
        nameField: "Id",
      }),
  },
  {
    name: "OpportunityHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OpportunityHistory",
        nameField: "Id",
      }),
  },
  {
    name: "OpportunityLineItem",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OpportunityLineItem",
        nameField: "Name",
      }),
  },
  {
    name: "Order",
    nameField: "OrderNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Order",
        nameField: "OrderNumber",
      }),
  },
  {
    name: "OrderFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OrderFeed",
        nameField: "Id",
      }),
  },
  {
    name: "OrderHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OrderHistory",
        nameField: "Id",
      }),
  },
  {
    name: "OrderItem",
    nameField: "OrderItemNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OrderItem",
        nameField: "OrderItemNumber",
      }),
  },
  {
    name: "OrderItemFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OrderItemFeed",
        nameField: "Id",
      }),
  },
  {
    name: "OrderItemHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OrderItemHistory",
        nameField: "Id",
      }),
  },
  {
    name: "OrgDeleteRequest",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OrgDeleteRequest",
        nameField: "Name",
      }),
  },
  {
    name: "OrgWideEmailAddress",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "OrgWideEmailAddress",
        nameField: "Id",
      }),
  },
  {
    name: "Organization",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Organization",
        nameField: "Name",
      }),
  },
  {
    name: "Partner",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Partner",
        nameField: "Id",
      }),
  },
  {
    name: "PartyConsent",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PartyConsent",
        nameField: "Name",
      }),
  },
  {
    name: "PartyConsentFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PartyConsentFeed",
        nameField: "Id",
      }),
  },
  {
    name: "PartyConsentHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PartyConsentHistory",
        nameField: "Id",
      }),
  },
  {
    name: "Payment",
    nameField: "PaymentNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Payment",
        nameField: "PaymentNumber",
      }),
  },
  {
    name: "PaymentAuthorization",
    nameField: "PaymentAuthorizationNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PaymentAuthorization",
        nameField: "PaymentAuthorizationNumber",
      }),
  },
  {
    name: "PaymentGateway",
    nameField: "PaymentGatewayName",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PaymentGateway",
        nameField: "PaymentGatewayName",
      }),
  },
  {
    name: "PaymentGatewayLog",
    nameField: "PaymentGatewayLogNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PaymentGatewayLog",
        nameField: "PaymentGatewayLogNumber",
      }),
  },
  {
    name: "PaymentGroup",
    nameField: "PaymentGroupNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PaymentGroup",
        nameField: "PaymentGroupNumber",
      }),
  },
  {
    name: "PaymentLineInvoice",
    nameField: "PaymentLineInvoiceNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PaymentLineInvoice",
        nameField: "PaymentLineInvoiceNumber",
      }),
  },
  {
    name: "Period",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Period",
        nameField: "Id",
      }),
  },
  {
    name: "Pricebook2",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Pricebook2",
        nameField: "Name",
      }),
  },
  {
    name: "Pricebook2History",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Pricebook2History",
        nameField: "Id",
      }),
  },
  {
    name: "PricebookEntry",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PricebookEntry",
        nameField: "Name",
      }),
  },
  {
    name: "PricebookEntryHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PricebookEntryHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ProcessException",
    nameField: "ProcessExceptionNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProcessException",
        nameField: "ProcessExceptionNumber",
      }),
  },
  {
    name: "ProcessInstanceNode",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProcessInstanceNode",
        nameField: "Id",
      }),
  },
  {
    name: "Product2",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Product2",
        nameField: "Name",
      }),
  },
  {
    name: "Product2Feed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Product2Feed",
        nameField: "Id",
      }),
  },
  {
    name: "Product2History",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Product2History",
        nameField: "Id",
      }),
  },
  {
    name: "ProductAttribute",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProductAttribute",
        nameField: "Name",
      }),
  },
  {
    name: "ProductAttributeSetProduct",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProductAttributeSetProduct",
        nameField: "Name",
      }),
  },
  {
    name: "ProductCatalog",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProductCatalog",
        nameField: "Name",
      }),
  },
  {
    name: "ProductCatalogFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProductCatalogFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ProductCatalogHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProductCatalogHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ProductCategory",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProductCategory",
        nameField: "Name",
      }),
  },
  {
    name: "ProductCategoryFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProductCategoryFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ProductCategoryHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProductCategoryHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ProductCategoryProduct",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProductCategoryProduct",
        nameField: "Name",
      }),
  },
  {
    name: "ProductCategoryProductHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProductCategoryProductHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ProductConsumptionSchedule",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ProductConsumptionSchedule",
        nameField: "Id",
      }),
  },
  {
    name: "Profile",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Profile",
        nameField: "Name",
      }),
  },
  {
    name: "Promotion",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Promotion",
        nameField: "Name",
      }),
  },
  {
    name: "PromotionFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PromotionFeed",
        nameField: "Id",
      }),
  },
  {
    name: "PromotionHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PromotionHistory",
        nameField: "Id",
      }),
  },
  {
    name: "PromptAction",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "PromptAction",
        nameField: "Name",
      }),
  },
  {
    name: "QueueSobject",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "QueueSobject",
        nameField: "Id",
      }),
  },
  {
    name: "QuickText",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "QuickText",
        nameField: "Name",
      }),
  },
  {
    name: "QuickTextHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "QuickTextHistory",
        nameField: "Id",
      }),
  },
  {
    name: "QuickTextUsage",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "QuickTextUsage",
        nameField: "Name",
      }),
  },
  {
    name: "QuoteTemplateRichTextData",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "QuoteTemplateRichTextData",
        nameField: "Name",
      }),
  },
  {
    name: "Recommendation",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Recommendation",
        nameField: "Name",
      }),
  },
  {
    name: "RecordAction",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "RecordAction",
        nameField: "Id",
      }),
  },
  {
    name: "RecordType",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "RecordType",
        nameField: "Name",
      }),
  },
  {
    name: "Refund",
    nameField: "RefundNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Refund",
        nameField: "RefundNumber",
      }),
  },
  {
    name: "RefundLinePayment",
    nameField: "RefundLinePaymentNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "RefundLinePayment",
        nameField: "RefundLinePaymentNumber",
      }),
  },
  {
    name: "ReportAnomalyEventStore",
    nameField: "ReportAnomalyEventNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ReportAnomalyEventStore",
        nameField: "ReportAnomalyEventNumber",
      }),
  },
  {
    name: "ReportAnomalyEventStoreFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ReportAnomalyEventStoreFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ReportFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ReportFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ResourceAbsence",
    nameField: "AbsenceNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ResourceAbsence",
        nameField: "AbsenceNumber",
      }),
  },
  {
    name: "ResourceAbsenceFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ResourceAbsenceFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ResourceAbsenceHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ResourceAbsenceHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ResourcePreference",
    nameField: "ResourcePreferenceNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ResourcePreference",
        nameField: "ResourcePreferenceNumber",
      }),
  },
  {
    name: "ResourcePreferenceFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ResourcePreferenceFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ResourcePreferenceHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ResourcePreferenceHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ReturnOrder",
    nameField: "ReturnOrderNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ReturnOrder",
        nameField: "ReturnOrderNumber",
      }),
  },
  {
    name: "ReturnOrderFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ReturnOrderFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ReturnOrderHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ReturnOrderHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ReturnOrderItemAdjustment",
    nameField: "ReturnOrderItemAdjustmentNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ReturnOrderItemAdjustment",
        nameField: "ReturnOrderItemAdjustmentNumber",
      }),
  },
  {
    name: "ReturnOrderItemTax",
    nameField: "ReturnOrderItemTaxNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ReturnOrderItemTax",
        nameField: "ReturnOrderItemTaxNumber",
      }),
  },
  {
    name: "ReturnOrderLineItem",
    nameField: "ReturnOrderLineItemNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ReturnOrderLineItem",
        nameField: "ReturnOrderLineItemNumber",
      }),
  },
  {
    name: "ReturnOrderLineItemFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ReturnOrderLineItemFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ReturnOrderLineItemHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ReturnOrderLineItemHistory",
        nameField: "Id",
      }),
  },
  {
    name: "Scontrol",
    nameField: "DeveloperName",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Scontrol",
        nameField: "DeveloperName",
      }),
  },
  {
    name: "SearchPromotionRule",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "SearchPromotionRule",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceAppointment",
    nameField: "AppointmentNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceAppointment",
        nameField: "AppointmentNumber",
      }),
  },
  {
    name: "ServiceAppointmentFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceAppointmentFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceAppointmentHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceAppointmentHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceContract",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceContract",
        nameField: "Name",
      }),
  },
  {
    name: "ServiceContractFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceContractFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceContractHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceContractHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceResource",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceResource",
        nameField: "Name",
      }),
  },
  {
    name: "ServiceResourceFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceResourceFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceResourceHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceResourceHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceResourceSkill",
    nameField: "SkillNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceResourceSkill",
        nameField: "SkillNumber",
      }),
  },
  {
    name: "ServiceResourceSkillFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceResourceSkillFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceResourceSkillHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceResourceSkillHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceTerritory",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceTerritory",
        nameField: "Name",
      }),
  },
  {
    name: "ServiceTerritoryFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceTerritoryFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceTerritoryHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceTerritoryHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceTerritoryMember",
    nameField: "MemberNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceTerritoryMember",
        nameField: "MemberNumber",
      }),
  },
  {
    name: "ServiceTerritoryMemberFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceTerritoryMemberFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceTerritoryMemberHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceTerritoryMemberHistory",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceTerritoryWorkType",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceTerritoryWorkType",
        nameField: "Name",
      }),
  },
  {
    name: "ServiceTerritoryWorkTypeFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceTerritoryWorkTypeFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ServiceTerritoryWorkTypeHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ServiceTerritoryWorkTypeHistory",
        nameField: "Id",
      }),
  },
  {
    name: "SessionHijackingEventStore",
    nameField: "SessionHijackingEventNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "SessionHijackingEventStore",
        nameField: "SessionHijackingEventNumber",
      }),
  },
  {
    name: "SessionHijackingEventStoreFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "SessionHijackingEventStoreFeed",
        nameField: "Id",
      }),
  },
  {
    name: "SetupAssistantStep",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "SetupAssistantStep",
        nameField: "Name",
      }),
  },
  {
    name: "Shift",
    nameField: "ShiftNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Shift",
        nameField: "ShiftNumber",
      }),
  },
  {
    name: "ShiftFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ShiftFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ShiftHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ShiftHistory",
        nameField: "Id",
      }),
  },
  {
    name: "Shipment",
    nameField: "ShipmentNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Shipment",
        nameField: "ShipmentNumber",
      }),
  },
  {
    name: "ShipmentFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ShipmentFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ShipmentHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ShipmentHistory",
        nameField: "Id",
      }),
  },
  {
    name: "SiteFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "SiteFeed",
        nameField: "Id",
      }),
  },
  {
    name: "SiteHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "SiteHistory",
        nameField: "Id",
      }),
  },
  {
    name: "SkillRequirement",
    nameField: "SkillNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "SkillRequirement",
        nameField: "SkillNumber",
      }),
  },
  {
    name: "SkillRequirementFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "SkillRequirementFeed",
        nameField: "Id",
      }),
  },
  {
    name: "SkillRequirementHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "SkillRequirementHistory",
        nameField: "Id",
      }),
  },
  {
    name: "Solution",
    nameField: "SolutionName",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Solution",
        nameField: "SolutionName",
      }),
  },
  {
    name: "SolutionFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "SolutionFeed",
        nameField: "Id",
      }),
  },
  {
    name: "SolutionHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "SolutionHistory",
        nameField: "Id",
      }),
  },
  {
    name: "StaticResource",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "StaticResource",
        nameField: "Name",
      }),
  },
  {
    name: "StreamingChannel",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "StreamingChannel",
        nameField: "Name",
      }),
  },
  {
    name: "Task",
    nameField: "Subject",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Task",
        nameField: "Subject",
      }),
  },
  {
    name: "TaskFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "TaskFeed",
        nameField: "Id",
      }),
  },
  {
    name: "ThreatDetectionFeedback",
    nameField: "ThreatDetectionFeedbackNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ThreatDetectionFeedback",
        nameField: "ThreatDetectionFeedbackNumber",
      }),
  },
  {
    name: "ThreatDetectionFeedbackFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "ThreatDetectionFeedbackFeed",
        nameField: "Id",
      }),
  },
  {
    name: "TimeSlot",
    nameField: "TimeSlotNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "TimeSlot",
        nameField: "TimeSlotNumber",
      }),
  },
  {
    name: "TodayGoal",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "TodayGoal",
        nameField: "Name",
      }),
  },
  {
    name: "Topic",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Topic",
        nameField: "Name",
      }),
  },
  {
    name: "TopicAssignment",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "TopicAssignment",
        nameField: "Id",
      }),
  },
  {
    name: "TopicFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "TopicFeed",
        nameField: "Id",
      }),
  },
  {
    name: "User",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "User",
        nameField: "Name",
      }),
  },
  {
    name: "UserAppInfo",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "UserAppInfo",
        nameField: "Id",
      }),
  },
  {
    name: "UserAppMenuCustomization",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "UserAppMenuCustomization",
        nameField: "Id",
      }),
  },
  {
    name: "UserEmailPreferredPerson",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "UserEmailPreferredPerson",
        nameField: "Name",
      }),
  },
  {
    name: "UserFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "UserFeed",
        nameField: "Id",
      }),
  },
  {
    name: "UserProvAccount",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "UserProvAccount",
        nameField: "Name",
      }),
  },
  {
    name: "UserProvAccountStaging",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "UserProvAccountStaging",
        nameField: "Name",
      }),
  },
  {
    name: "UserProvMockTarget",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "UserProvMockTarget",
        nameField: "Name",
      }),
  },
  {
    name: "UserProvisioningLog",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "UserProvisioningLog",
        nameField: "Name",
      }),
  },
  {
    name: "UserProvisioningRequest",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "UserProvisioningRequest",
        nameField: "Name",
      }),
  },
  {
    name: "UserRole",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "UserRole",
        nameField: "Name",
      }),
  },
  {
    name: "VoiceCall",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "VoiceCall",
        nameField: "Id",
      }),
  },
  {
    name: "VoiceCallFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "VoiceCallFeed",
        nameField: "Id",
      }),
  },
  {
    name: "VoiceCallRecording",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "VoiceCallRecording",
        nameField: "Name",
      }),
  },
  {
    name: "Vote",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "Vote",
        nameField: "Id",
      }),
  },
  {
    name: "WaveAutoInstallRequest",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WaveAutoInstallRequest",
        nameField: "Name",
      }),
  },
  {
    name: "WaveCompatibilityCheckItem",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WaveCompatibilityCheckItem",
        nameField: "Name",
      }),
  },
  {
    name: "WebCart",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WebCart",
        nameField: "Name",
      }),
  },
  {
    name: "WebCartHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WebCartHistory",
        nameField: "Id",
      }),
  },
  {
    name: "WebLink",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WebLink",
        nameField: "Name",
      }),
  },
  {
    name: "WebStore",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WebStore",
        nameField: "Name",
      }),
  },
  {
    name: "WebStoreBuyerGroup",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WebStoreBuyerGroup",
        nameField: "Name",
      }),
  },
  {
    name: "WebStoreCatalog",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WebStoreCatalog",
        nameField: "Name",
      }),
  },
  {
    name: "WebStoreCatalogHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WebStoreCatalogHistory",
        nameField: "Id",
      }),
  },
  {
    name: "WorkOrder",
    nameField: "WorkOrderNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkOrder",
        nameField: "WorkOrderNumber",
      }),
  },
  {
    name: "WorkOrderFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkOrderFeed",
        nameField: "Id",
      }),
  },
  {
    name: "WorkOrderHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkOrderHistory",
        nameField: "Id",
      }),
  },
  {
    name: "WorkOrderLineItem",
    nameField: "LineItemNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkOrderLineItem",
        nameField: "LineItemNumber",
      }),
  },
  {
    name: "WorkOrderLineItemFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkOrderLineItemFeed",
        nameField: "Id",
      }),
  },
  {
    name: "WorkOrderLineItemHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkOrderLineItemHistory",
        nameField: "Id",
      }),
  },
  {
    name: "WorkPlan",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkPlan",
        nameField: "Name",
      }),
  },
  {
    name: "WorkPlanFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkPlanFeed",
        nameField: "Id",
      }),
  },
  {
    name: "WorkPlanHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkPlanHistory",
        nameField: "Id",
      }),
  },
  {
    name: "WorkPlanTemplate",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkPlanTemplate",
        nameField: "Name",
      }),
  },
  {
    name: "WorkPlanTemplateEntry",
    nameField: "WorkPlanTemplateEntryNumber",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkPlanTemplateEntry",
        nameField: "WorkPlanTemplateEntryNumber",
      }),
  },
  {
    name: "WorkStep",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkStep",
        nameField: "Name",
      }),
  },
  {
    name: "WorkStepTemplate",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkStepTemplate",
        nameField: "Name",
      }),
  },
  {
    name: "WorkType",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkType",
        nameField: "Name",
      }),
  },
  {
    name: "WorkTypeFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkTypeFeed",
        nameField: "Id",
      }),
  },
  {
    name: "WorkTypeGroup",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkTypeGroup",
        nameField: "Name",
      }),
  },
  {
    name: "WorkTypeGroupFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkTypeGroupFeed",
        nameField: "Id",
      }),
  },
  {
    name: "WorkTypeGroupHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkTypeGroupHistory",
        nameField: "Id",
      }),
  },
  {
    name: "WorkTypeGroupMember",
    nameField: "Name",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkTypeGroupMember",
        nameField: "Name",
      }),
  },
  {
    name: "WorkTypeGroupMemberFeed",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkTypeGroupMemberFeed",
        nameField: "Id",
      }),
  },
  {
    name: "WorkTypeGroupMemberHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkTypeGroupMemberHistory",
        nameField: "Id",
      }),
  },
  {
    name: "WorkTypeHistory",
    nameField: "Id",
    getRecords: () =>
      this.salesforce.listRecordOptions({
        objType: "WorkTypeHistory",
        nameField: "Id",
      }),
  },
];
export default sobjects;
