import {
  COMPANY_SIZE_OPTIONS,
  GEOGRAPHY_OPTIONS,
  INDUSTRY_OPTIONS,
  JOB_FUNCTION_OPTIONS,
  SENIORITY_OPTIONS,
  STAFF_COUNT_RANGE_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import hootsuite from "../../hootsuite.app.mjs";

export default {
  key: "hootsuite-schedule-message",
  name: "Schedule Message",
  description: "Schedules a message on your Hootsuite account. [See the documentation](https://apidocs.hootsuite.com/docs/api/index.html#operation/scheduleMessage)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hootsuite,
    text: {
      type: "string",
      label: "Text",
      description: "The message text to publish.",
    },
    socialProfileIds: {
      propDefinition: [
        hootsuite,
        "socialProfileIds",
      ],
    },
    scheduledSendTime: {
      type: "string",
      label: "Scheduled Send Time",
      description: "The time the message is scheduled to be sent in UTC time, [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) format. Missing or different timezones will not be accepted, to ensure there is no ambiguity about scheduled time. Dates must end with 'Z' to be accepted.",
      optional: true,
    },
    webhookUrls: {
      type: "string[]",
      label: "Webhook URLs",
      description: "The webhook URL(s) to call to when the message's state changes.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The Hootsuite message tags to apply to the message. To set tags the social profile must belong to an organization. Tags are case sensitive. Limited permission members can only use the existing tags for organization and cannot create new ones. See more about message tags at the Hootsuite Help Center. Not supported by Pinterest.",
      optional: true,
    },
    targetingFacebookPageAgeMin: {
      type: "string",
      label: "Targeting Facebook Page - Age Min",
      description: "Minimum age to target the message at.",
      options: [
        "13",
        "17",
        "18",
        "19",
        "21",
      ],
      optional: true,
    },
    targetingFacebookPageEducation: {
      type: "string[]",
      label: "Targeting Facebook Page - Education",
      description: "The education level of the Facebook page to target.",
      options: [
        "highSchool",
        "college",
        "collegeGrad",
      ],
      optional: true,
    },
    targetingFacebookPageInterestIn: {
      type: "string[]",
      label: "Targeting Facebook Page - Interests",
      description: "Interested in preferences to target the message at.",
      options: [
        "male",
        "female",
      ],
      optional: true,
    },
    targetingFacebookPageRelationshipStatus: {
      type: "string[]",
      label: "Targeting Facebook Page - Relationship Status",
      description: "Relationship status to target the message at.",
      options: [
        "single",
        "relationship",
        "married",
        "engaged",
      ],
      optional: true,
    },
    targetingFacebookPageCountry: {
      type: "string[]",
      label: "Targeting Facebook Page - Country",
      description: "Country to target the message at. 2-digit ISO 3166 format code as provided by Facebook. **Format: [{\"k\": \"Canada\", \"v\": \"CA\"}]** [See the documentation](https://apidocs.hootsuite.com/docs/api/index.html#operation/scheduleMessage) for more information.",
      optional: true,
    },
    targetingFacebookPageRegions: {
      type: "string[]",
      label: "Targeting Facebook Page - Regions",
      description: "Region to target the message at. Note that regions can only be specified when there is exactly one country targeted. Limit 200. **Format: [{\"k\": \"British Columbia\", \"v\": \"2\"}]** [See the documentation](https://apidocs.hootsuite.com/docs/api/index.html#operation/scheduleMessage) for more information.",
      optional: true,
    },
    targetingFacebookPageCities: {
      type: "string[]",
      label: "Targeting Facebook Page - Cities",
      description: "City to target the message at. Note that cities can only be specified when there is exactly one country targeted. Limit 250. **Format: [{\"k\": \"Burnaby, BC\", \"v\": \"292466\"}]** [See the documentation](https://apidocs.hootsuite.com/docs/api/index.html#operation/scheduleMessage) for more information.",
      optional: true,
    },
    targetingFacebookPageZips: {
      type: "string[]",
      label: "Targeting Facebook Page - Zip",
      description: "Zip/Postal Code to target the message at. Limit 50,000. **Format: [{\"k\": \"K1S\", \"v\": \"CA:K1S\"}]** [See the documentation](https://apidocs.hootsuite.com/docs/api/index.html#operation/scheduleMessage) for more information.",
      optional: true,
    },
    targetingLinkedInCompanySize: {
      type: "string[]",
      label: "Targeting LinkedIn Company - Size",
      description: "Company size to target the message at.",
      options: COMPANY_SIZE_OPTIONS,
      optional: true,
    },
    targetingLinkedInCompanyGeography: {
      type: "string[]",
      label: "Targeting LinkedIn Company - Geography",
      description: "Geography to target the message at.",
      options: GEOGRAPHY_OPTIONS,
      optional: true,
    },
    targetingLinkedInCompanyIndustry: {
      type: "string[]",
      label: "Targeting LinkedIn Company - Industry",
      description: "Industry to target the message at.",
      options: INDUSTRY_OPTIONS,
      optional: true,
    },
    targetingLinkedInCompanyJobFunction: {
      type: "string[]",
      label: "Targeting LinkedIn Company - Job Function",
      description: "Job function to target the message at.",
      options: JOB_FUNCTION_OPTIONS,
      optional: true,
    },
    targetingLinkedInCompanySeniority: {
      type: "string[]",
      label: "Targeting LinkedIn Company - Seniority",
      description: "Seniority to target the message at.",
      options: SENIORITY_OPTIONS,
      optional: true,
    },
    targetingLinkedInV2CompanyLocations: {
      type: "string[]",
      label: "Targeting LinkedIn V2 Company - Locations",
      description: "Locations to target the message at, expected format of `urn:li:geo:{CODE}`. [Geo Locations reference](https://learn.microsoft.com/en-us/linkedin/shared/references/v2/standardized-data/locations/geo), [Geo Typeahead Locations reference](https://learn.microsoft.com/en-us/linkedin/shared/references/v2/standardized-data/locations/geo-typeahead?tabs=http)",
      optional: true,
    },
    targetingLinkedInV2CompanyStaffCountRange: {
      type: "string[]",
      label: "Targeting LinkedIn V2 Company - Staff Count Range",
      description: "Staff count to target the message at, expected format of `SIZE_{VALUES}`. [Staff count codes reference](https://learn.microsoft.com/en-us/linkedin/shared/references/reference-tables/company-size-codes)",
      options: STAFF_COUNT_RANGE_OPTIONS,
      optional: true,
    },
    targetingLinkedInV2CompanySeniorities: {
      type: "string[]",
      label: "Targeting LinkedIn V2 Company - Seniorities",
      description: "Seniorities to target the message at, expected format of `urn:li:seniority:{CODE}`. [Seniorities codes reference](https://learn.microsoft.com/en-us/linkedin/shared/references/reference-tables/seniority-codes)",
      optional: true,
    },
    targetingLinkedInV2CompanyIndustries: {
      type: "string[]",
      label: "Targeting LinkedIn V2 Company - Industries",
      description: "Industries to target the message at, expected format of `urn:li:industry:{CODE}`. [Industries codes reference](https://learn.microsoft.com/en-us/linkedin/shared/references/reference-tables/industry-codes-v2)",
      optional: true,
    },
    targetingLinkedInV2CompanyInterfaceLocations: {
      type: "string[]",
      label: "Targeting LinkedIn V2 Company - Interface Locations",
      description: "Languages to target the message at, expected format of `{\"country\":\"COUNTRY\",\"language\":\"language\"}`. [Language codes reference](https://learn.microsoft.com/en-us/linkedin/shared/references/reference-tables/language-codes) Languages can be interpreted as this format: language_COUNTRY, replace in request as necessary.",
      optional: true,
    },
    privacyFacebookVisibility: {
      type: "string",
      label: "Privacy Facebook Visibility",
      description: "Facebook visibility rule.",
      options: [
        "everyone",
        "friends",
        "friendsOfFriends",
      ],
      optional: true,
    },
    privacyLinkedInVisibility: {
      type: "string",
      label: "Privacy LinkedIn Visibility",
      description: "LinkedIn visibility rule.",
      options: [
        "anyone",
        "connectionsOnly",
      ],
      optional: true,
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The latitude in decimal degrees. Must be between -90 to 90.",
      optional: true,
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The longitude in decimal degrees. Must be between -180 to 180.",
      optional: true,
    },
    emailNotification: {
      type: "boolean",
      label: "Email Notification",
      description: "A flag to determine whether email notifications are sent when the message is published.",
      optional: true,
    },
    mediaUrls: {
      type: "string[]",
      label: "Media URLs",
      description: "The ow.ly media to attach to the message",
      optional: true,
    },
    media: {
      type: "string[]",
      label: "Media",
      description: "The media id(s) returned at `Create Media Upload Job` action to attach to the message",
      optional: true,
    },
  },
  async run({ $ }) {
    const facebookPage = {};

    if (this.targetingFacebookPageAgeMin) {
      facebookPage.ageMin = parseInt(this.targetingFacebookPageAgeMin);
    }
    if (this.targetingFacebookPageEducation) {
      facebookPage.education = parseObject(this.targetingFacebookPageEducation);
    }
    if (this.targetingFacebookPageInterestIn) {
      facebookPage.interestIn = parseObject(this.targetingFacebookPageInterestIn);
    }
    if (this.targetingFacebookPageRelationshipStatus) {
      facebookPage.relationshipStatus = parseObject(this.targetingFacebookPageRelationshipStatus);
    }
    if (this.targetingFacebookPageCountry) {
      facebookPage.countries = parseObject(this.targetingFacebookPageCountry);
    }
    if (this.targetingFacebookPageRegions) {
      facebookPage.regions = parseObject(this.targetingFacebookPageRegions);
    }
    if (this.targetingFacebookPageCities) {
      facebookPage.cities = parseObject(this.targetingFacebookPageCities);
    }
    if (this.targetingFacebookPageZips) {
      facebookPage.zips = parseObject(this.targetingFacebookPageZips);
    }
    const linkedInCompany = {};
    if (this.targetingLinkedInCompanySize) {
      linkedInCompany.companySize = parseObject(this.targetingLinkedInCompanySize);
    }
    if (this.targetingLinkedInCompanyGeography) {
      linkedInCompany.geography = parseObject(this.targetingLinkedInCompanyGeography);
    }
    if (this.targetingLinkedInCompanyIndustry) {
      linkedInCompany.industry =
        parseObject(this.targetingLinkedInCompanyIndustry)?.map((item) => String(item));
    }
    if (this.targetingLinkedInCompanyJobFunction) {
      linkedInCompany.jobFunction = parseObject(this.targetingLinkedInCompanyJobFunction);
    }
    if (this.targetingLinkedInCompanySeniority) {
      linkedInCompany.seniority = parseObject(this.targetingLinkedInCompanySeniority);
    }

    const linkedInV2Company = {};
    if (this.targetingLinkedInV2CompanyLocations) {
      linkedInV2Company.locations = parseObject(this.targetingLinkedInV2CompanyLocations);
    }
    if (this.targetingLinkedInV2CompanyStaffCountRange) {
      linkedInV2Company.staffCountRange =
        parseObject(this.targetingLinkedInV2CompanyStaffCountRange);
    }
    if (this.targetingLinkedInV2CompanySeniorities) {
      linkedInV2Company.seniorities = parseObject(this.targetingLinkedInV2CompanySeniorities);
    }
    if (this.targetingLinkedInV2CompanyIndustries) {
      linkedInV2Company.industries = parseObject(this.targetingLinkedInV2CompanyIndustries);
    }
    if (this.targetingLinkedInV2CompanyInterfaceLocations) {
      linkedInV2Company.interfaceLocations =
        parseObject(this.targetingLinkedInV2CompanyInterfaceLocations);
    }

    const response = await this.hootsuite.scheduleMessage({
      $,
      data: {
        text: this.text,
        socialProfileIds: parseObject(this.socialProfileIds),
        scheduledSendTime: this.scheduledSendTime,
        webhookUrls: parseObject(this.webhookUrls),
        tags: parseObject(this.tags),
        targeting: {
          ...(Object.keys(facebookPage).length > 0
            ? {
              facebookPage,
            }
            : {}),
          ...(Object.keys(linkedInCompany).length > 0
            ? {
              linkedInCompany,
            }
            : {}),
          ...(Object.keys(linkedInV2Company).length > 0
            ? {
              linkedInV2Company,
            }
            : {}),
        },
        privacy: (this.privacyFacebookVisibility || this.privacyLinkedInVisibility) && {
          ...(this.privacyFacebookVisibility
            ? {
              facebook: {
                visibility: [
                  this.privacyFacebookVisibility,
                ],
              },
            }
            : {}),
          ...(this.privacyLinkedInVisibility
            ? {
              linkedIn: {
                visibility: [
                  this.privacyLinkedInVisibility,
                ],
              },
            }
            : {}),
        },
        location: {
          latitude: parseFloat(this.latitude),
          longitude: parseFloat(this.longitude),
        },
        emailNotification: this.emailNotification,
        mediaUrls: parseObject(this.mediaUrls)?.map((mediaUrl) => ({
          url: mediaUrl,
        })),
        media: parseObject(this.media)?.map((media) => ({
          id: media,
        })),
      },
    });

    $.export("$summary", `Successfully scheduled message with ID: ${response.data[0].id}`);
    return response;
  },
};
