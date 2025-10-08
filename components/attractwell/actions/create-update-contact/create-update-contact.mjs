import { ConfigurationError } from "@pipedream/platform";
import app from "../../attractwell.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "attractwell-create-update-contact",
  name: "Create or Update Contact",
  description: "Creates or updates a contact with the provided identification and contact details.",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact.",
      optional: true,
    },
    mobilePhone: {
      type: "string",
      label: "Mobile Phone",
      description: "The mobile phone number of the contact.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact.",
      optional: true,
    },
    contactType: {
      type: "string",
      label: "Contact Type",
      description: "The type of the contact.",
      optional: true,
    },
    rating: {
      type: "string",
      label: "Rating",
      description: "The rating of the contact. From `0` (coldest) to `5` (hottest). You'll get periodic reminders of which contacts to reach out to more often if you choose a higher rating, or not at all if you pick `0`.",
      default: "0",
      options: [
        {
          value: "0",
          label: "No reminders",
        },
        {
          value: "1",
          label: "Annual reminders",
        },
        {
          value: "2",
          label: "Quarterly reminders",
        },
        {
          value: "3",
          label: "Monthly reminders",
        },
        {
          value: "4",
          label: "Weekly reminders",
        },
        {
          value: "5",
          label: "Reminders every 3 days",
        },
      ],
    },
    workPhone: {
      type: "string",
      label: "Work Phone",
      description: "The work phone number of the contact.",
      optional: true,
    },
    homePhone: {
      type: "string",
      label: "Home Phone",
      description: "The home phone number of the contact.",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Street Address",
      description: "The street address of the contact.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the contact.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the contact.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the contact.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name of the contact.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the contact.",
      optional: true,
    },
    campaignContactEmail: {
      type: "boolean",
      label: "Send Campaigns By Email",
      description: "The campaign contact email setting.",
      default: true,
    },
    campaignContactText: {
      type: "boolean",
      label: "Send Campaigns By Text",
      description: "The campaign contact text setting.",
      default: false,
    },
    receiveMarketingEmail: {
      type: "boolean",
      label: "Opted Into Email",
      description: "The receive marketing email setting.",
      default: true,
    },
    receiveMarketingText: {
      type: "boolean",
      label: "Opted Into Text",
      description: "The receive marketing text setting.",
      default: true,
    },
    tagsToAdd: {
      type: "string[]",
      label: "Tags to Add",
      description: "Tags to add to the contact.",
      propDefinition: [
        app,
        "tag",
      ],
    },
    tagsToRemove: {
      type: "string[]",
      label: "Tags to Remove",
      description: "Tags to remove from the contact.",
      propDefinition: [
        app,
        "tag",
      ],
    },
    campaignsToAdd: {
      type: "string[]",
      label: "Campaigns to Add",
      description: "If a contact isn't already receiving a campaign, start sending these campaigns to them.",
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    campaignsToAddOrRestart: {
      type: "string[]",
      label: "Campaigns to Add or Restart",
      description: "If a contact is already receiving a campaign, restart these campaigns.  If a contact is not receiving a campaign, start sending these campaigns to them.",
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    campaignsToRemove: {
      type: "string[]",
      label: "Campaigns to Remove",
      description: "Campaigns to remove from the contact.",
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    offlineCampaignsToAdd: {
      type: "string[]",
      label: "Offline Campaigns To Add",
      description: "Offline campaigns to add to the contact.",
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    offlineCampaignsToRemove: {
      type: "string[]",
      label: "Offline Campaigns To Remove",
      description: "Offline campaigns to remove from the contact.",
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    addToVaults: {
      type: "string[]",
      label: "Add To Vaults",
      description: "Give Access To Vault (Contact Still Must Pay For Paid Vaults).",
      propDefinition: [
        app,
        "vaultId",
      ],
    },
    addToVaultsForFree: {
      type: "string[]",
      label: "Add To Vaults For Free",
      description: "Give Access To Vault For Free (Contact Gets Free Access To Paid Vaults).",
      propDefinition: [
        app,
        "vaultId",
      ],
    },
    removeFromVaults: {
      type: "string[]",
      label: "Remove from Vaults",
      description: "Vaults to remove the contact from.",
      propDefinition: [
        app,
        "vaultId",
      ],
    },
    automationsToRun: {
      type: "string[]",
      label: "Automations To Run",
      description: "Automations to run for the contact.",
      propDefinition: [
        app,
        "automationId",
      ],
    },
    mayAccessMemberArea: {
      type: "boolean",
      label: "May Access Member Area",
      description: "Whether the user may access or is banned from the member area. If this is set to `true`, they only are able to access the member area if they are also assigned to one or more vaults.",
      default: true,
    },
  },
  methods: {
    fromBooleanToInt(value) {
      return value === true
        ? 1
        : 0;
    },
    createOrUpdateContact(args = {}) {
      return this.app.post({
        path: "/contacts",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      fromBooleanToInt,
      createOrUpdateContact,
      email,
      mobilePhone,
      firstName,
      lastName,
      contactType,
      rating,
      workPhone,
      homePhone,
      address1,
      city,
      state,
      postalCode,
      country,
      companyName,
      title,
      campaignContactEmail,
      campaignContactText,
      receiveMarketingEmail,
      receiveMarketingText,
      tagsToAdd,
      tagsToRemove,
      campaignsToAdd,
      campaignsToRemove,
      offlineCampaignsToAdd,
      offlineCampaignsToRemove,
      addToVaults,
      addToVaultsForFree,
      removeFromVaults,
      automationsToRun,
      campaignsToAddOrRestart,
      mayAccessMemberArea,
    } = this;

    if (!email && !mobilePhone) {
      throw new ConfigurationError("Either **Email** or **Mobile Phone** is required.");
    }

    const response = await createOrUpdateContact({
      $,
      data: {
        contact_source: "API",
        email,
        mobile_phone: mobilePhone,
        first_name: firstName,
        last_name: lastName,
        contact_type: contactType,
        rating: parseInt(rating, 10),
        work_phone: workPhone,
        home_phone: homePhone,
        address1,
        city,
        state,
        postal_code: postalCode,
        country,
        company_name: companyName,
        title,
        campaign_contact_email: fromBooleanToInt(campaignContactEmail),
        campaign_contact_text: fromBooleanToInt(campaignContactText),
        receive_marketing_email: fromBooleanToInt(receiveMarketingEmail),
        receive_marketing_text: fromBooleanToInt(receiveMarketingText),
        tags_to_add: utils.parseArray(tagsToAdd),
        tags_to_remove: utils.parseArray(tagsToRemove),
        campaigns_to_add: campaignsToAdd,
        campaigns_to_remove: campaignsToRemove,
        offline_campaigns_to_add: offlineCampaignsToAdd,
        offline_campaigns_to_remove: offlineCampaignsToRemove,
        add_to_vaults: addToVaults,
        add_to_vaults_for_free: addToVaultsForFree,
        remove_from_vaults: removeFromVaults,
        automations_to_run: automationsToRun,
        campaigns_to_add_or_restart: campaignsToAddOrRestart,
        may_access_member_area: fromBooleanToInt(mayAccessMemberArea),
      },
    });
    $.export("$summary", `Successfully created or updated contact with ID \`${response.results.contact_id}\`.`);
    return response;
  },
};
