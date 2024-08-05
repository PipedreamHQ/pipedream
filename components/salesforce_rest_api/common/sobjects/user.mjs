import salesforce from "../../salesforce_rest_api.app.mjs";
import {
  EMAIL_ENCODING_OPTIONS,
  GEOCODE_ACCURACY_OPTIONS,
  LANGUAGE_OPTIONS,
  LOCALE_OPTIONS,
  TIMEZONE_OPTIONS,
} from "../constants-props.mjs";
import commonProps from "../props-async-options.mjs";

export default {
  updateProps: {
    UserPreferencesEmailVerified: {
      type: "boolean",
      label: "Email Verified",
      description:
        "Indicates whether a user's email address is verified (true) or unverified (false).",
      optional: true,
    },
  },
  initialProps: {
    Alias: {
      type: "string",
      label: "Alias",
      description: "The user's alias (max 8 characters).",
    },
    CommunityNickname: {
      type: "string",
      label: "Nickname",
      description:
        "Name used to identify this user in the Experience Cloud site.",
    },
    DigestFrequency: {
      type: "string",
      label: "Chatter Email Highlights Frequency",
      description:
        "The send frequency of the user's Chatter personal email digest.",
      options: [
        {
          label: "Daily",
          value: "D",
        },
        {
          label: "Weekly",
          value: "W",
        },
        {
          label: "Never",
          value: "N",
        },
      ],
    },
    Email: {
      type: "string",
      label: "Email",
      description: "The user's email address.",
    },
    EmailEncodingKey: {
      type: "string",
      label: "Email Encoding",
      description: "The email encoding for the user.",
      options: EMAIL_ENCODING_OPTIONS,
    },
    LanguageLocaleKey: {
      type: "string",
      label: "Language",
      description: "The user's language.",
      options: LANGUAGE_OPTIONS,
    },
    LastName: {
      type: "string",
      label: "Last Name",
      description: "The user's last name.",
    },
    LocaleSidKey: {
      type: "string",
      label: "Locale",
      description:
        "The locale affects formatting and parsing of values, especially numeric values, in the user interface.",
      options: LOCALE_OPTIONS,
    },
    ProfileId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "Profile",
          nameField: "Name",
        }),
      ],
      label: "Profile ID",
      description:
        "ID of the user's Profile. Use this value to cache metadata based on profile.",
    },
    TimeZoneSidKey: {
      type: "string",
      label: "Time Zone",
      description:
        "A User time zone affects the offset used when displaying or entering times in the user interface.",
      options: TIMEZONE_OPTIONS,
    },
    Username: {
      type: "string",
      label: "Username",
      description:
        "Contains the name that a user enters to log in to the API or the user interface. The value for this field must be in the form of an email address, using all lowercase characters. It must also be unique across all organizations.",
    },
    UserPermissionsMarketingUser: {
      type: "boolean",
      label: "Marketing User",
      description:
        "Indicates whether the user is enabled to manage campaigns in the user interface (true) or not (false).",
    },
    UserPermissionsOfflineUser: {
      type: "boolean",
      label: "Offline User",
      description:
        "Indicates whether the user is enabled to use Offline Edition (true) or not (false).",
    },
  },
  extraProps: {
    AccountId: {
      ...commonProps.AccountId,
      description: "ID of the Account associated with a Customer Portal user.",
      optional: true,
    },
    CallCenterId: {
      ...commonProps.CallCenterId,
      description:
        "If Salesforce CRM Call Center is enabled, represents the call center that this user is assigned to.",
      optional: true,
    },
    ContactId: {
      ...commonProps.ContactId,
      description: "ID of the Contact associated with this account.",
      optional: true,
    },
    DelegatedApproverId: {
      ...commonProps.UserId,
      label: "Delegated Approver ID",
      description: "ID of the user who is a delegated approver for this user.",
      optional: true,
    },
    IndividualId: {
      ...commonProps.IndividualId,
      description: "ID of the data privacy record associated with this user.",
      optional: true,
    },
    ManagerId: {
      ...commonProps.UserId,
      label: "Manager ID",
      description: "The ID of the user who manages this user.",
      optional: true,
    },
    UserRoleId: {
      ...commonProps.UserRoleId,
      description: "ID of the user's UserRole.",
      optional: true,
    },
    AboutMe: {
      type: "string",
      label: "About Me",
      description:
        "Information about the user, such as areas of interest or skills.",
      optional: true,
    },
    City: {
      type: "string",
      label: "City",
      description:
        "The city associated with the user. Up to 40 characters allowed.",
      optional: true,
    },
    CompanyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the user's company.",
      optional: true,
    },
    Country: {
      type: "string",
      label: "Country",
      description:
        "The country associated with the user. Up to 80 characters allowed.",
      optional: true,
    },
    DefaultGroupNotificationFrequency: {
      type: "string",
      label: "Default Notification Frequency when Joining Groups",
      description:
        "The default frequency for sending the user's Chatter group email notifications when the user joins groups.",
      optional: true,
      options: [
        {
          label: "Email on Each Post",
          value: "P",
        },
        {
          label: "Daily Digests",
          value: "D",
        },
        {
          label: "Weekly Digests",
          value: "W",
        },
        {
          label: "Never",
          value: "N",
        },
      ],
    },
    Department: {
      type: "string",
      label: "Department",
      description: "The company department associated with the user.",
      optional: true,
    },
    Division: {
      type: "string",
      label: "Division",
      description: "The division associated with this user.",
      optional: true,
    },
    EmailPreferencesAutoBcc: {
      type: "boolean",
      label: "Auto Bcc",
      description:
        "Determines whether the user receives copies of sent emails.",
      optional: true,
    },
    EmployeeNumber: {
      type: "string",
      label: "Employee Number",
      description: "The user's employee number.",
      optional: true,
    },
    Extension: {
      type: "string",
      label: "Extension",
      description: "The user's phone extension number.",
      optional: true,
    },
    Fax: {
      type: "string",
      label: "Fax",
      description: "The user's fax number.",
      optional: true,
    },
    FederationIdentifier: {
      type: "string",
      label: "SAML Federation ID",
      description:
        "Indicates the value that must be listed in the Subject element of a Security Assertion Markup Language (SAML) IDP certificate to authenticate the user for a client application using single sign-on.",
      optional: true,
    },
    FirstName: {
      type: "string",
      label: "First Name",
      description: "The user's first name.",
      optional: true,
    },
    ForecastEnabled: {
      type: "boolean",
      label: "Allow Forecasting",
      description: "Indicates whether the user is enabled for forecasts.",
      optional: true,
    },
    GeocodeAccuracy: {
      type: "string",
      label: "Geocode Accuracy",
      description:
        "The level of accuracy of a location's geographical coordinates compared with its physical address.",
      optional: true,
      options: GEOCODE_ACCURACY_OPTIONS,
    },
    IsActive: {
      type: "boolean",
      label: "Active",
      description: "Indicates whether the user has access to log in.",
      optional: true,
    },
    JigsawImportLimitOverride: {
      type: "integer",
      label: "Data.com Monthly Addition Limit",
      description:
        "The Data.com user's monthly addition limit. The value must be between zero and the organization's monthly addition limit.",
      optional: true,
    },
    Latitude: {
      type: "string",
      label: "Latitude",
      description:
        "A number between -90 and 90 with up to 15 decimal places. Use with `Longitude` to specify the precise geolocation of an address.",
      optional: true,
    },
    Longitude: {
      type: "string",
      label: "Longitude",
      description:
        "A number between -180 and 180 with up to 15 decimal places. Use with `Latitude` to specify the precise geolocation of an address.",
      optional: true,
    },
    MiddleName: {
      type: "string",
      label: "Middle Name",
      description: "The user's middle name. Maximum size is 40 characters.",
      optional: true,
    },
    MobilePhone: {
      type: "string",
      label: "Mobile",
      description: "The user's mobile device number.",
      optional: true,
    },
    Phone: {
      type: "string",
      label: "Phone",
      description: "The user's phone number.",
      optional: true,
    },
    PostalCode: {
      type: "string",
      label: "Zip/Postal Code",
      description: "The user's postal or ZIP code.",
      optional: true,
    },
    ReceivesAdminInfoEmails: {
      type: "boolean",
      label: "Admin Info Emails",
      description:
        "Indicates whether the user receives email for administrators from Salesforce (true) or not (false).",
      optional: true,
    },
    ReceivesInfoEmails: {
      type: "boolean",
      label: "Info Emails",
      description:
        "Indicates whether the user receives informational email from Salesforce (true) or not (false).",
      optional: true,
    },
    SenderEmail: {
      type: "string",
      label: "Email Sender Address",
      description:
        "The email address used as the From address when the user sends emails.",
      optional: true,
    },
    SenderName: {
      type: "string",
      label: "Email Sender Name",
      description:
        "The name used as the email sender when the user sends emails.",
      optional: true,
    },
    Signature: {
      type: "string",
      label: "Email Signature",
      description: "The signature text added to emails.",
      optional: true,
    },
    State: {
      type: "string",
      label: "State",
      description:
        "The state associated with the User. Up to 80 characters allowed.",
      optional: true,
    },
    Street: {
      type: "string",
      label: "Street",
      description: "The street address associated with the User.",
      optional: true,
    },
    Suffix: {
      type: "string",
      label: "Suffix",
      description: "The user's name suffix. Maximum size is 40 characters.",
      optional: true,
    },
    Title: {
      type: "string",
      label: "Title",
      description: "The user's business title, such as Vice President.",
      optional: true,
    },
    UserPermissionsCallCenterAutoLogin: {
      type: "boolean",
      label: "Auto-login To Call Center",
      description:
        "Required if Salesforce CRM Call Center is enabled. Indicates whether the user is enabled to use the auto login feature of the call center (true) or not (false).",
      optional: true,
    },
    UserPermissionsChatterAnswersUser: {
      type: "boolean",
      label: "Chatter Answers User",
      description:
        "Indicates whether the portal user is enabled to use the Chatter Answers feature (true) or not (false).",
      optional: true,
    },
    UserPermissionsInteractionUser: {
      type: "boolean",
      label: "Flow User",
      description: "Indicates whether the user can run flows or not.",
      optional: true,
    },
    UserPermissionsJigsawProspectingUser: {
      type: "boolean",
      label: "Data.com User",
      description:
        "Indicates whether the user is allocated one Data.com user license (true) or not (false).",
      optional: true,
    },
    UserPermissionsKnowledgeUser: {
      type: "boolean",
      label: "Knowledge User",
      description:
        "Indicates whether the user is enabled to use Salesforce Knowledge (true) or not (false).",
      optional: true,
    },
    UserPermissionsLiveAgentUser: {
      type: "boolean",
      label: "Live Agent User",
      description:
        "Indicates whether the user is enabled to use Chat (true) or not (false).",
      optional: true,
    },
    UserPermissionsSFContentUser: {
      type: "boolean",
      label: "Salesforce CRM Content User",
      description:
        "Indicates whether the user is allocated one Salesforce CRM Content User License (true) or not (false).",
      optional: true,
    },
    UserPermissionsSiteforceContributorUser: {
      type: "boolean",
      label: "Site.com Contributor User",
      description:
        "Indicates whether the user is allocated one Site.com Contributor feature license (true) or not (false).",
      optional: true,
    },
    UserPermissionsSiteforcePublisherUser: {
      type: "boolean",
      label: "Site.com Publisher User",
      description:
        "Indicates whether the user is allocated one Site.com Publisher feature license (true) or not (false).",
      optional: true,
    },
    UserPermissionsSupportUser: {
      type: "boolean",
      label: "Service Cloud User",
      description: "When true, the user can use the Salesforce console.",
      optional: true,
    },
    UserPermissionsWorkDotComUserFeature: {
      type: "boolean",
      label: "WDC User",
      description:
        "Indicates whether the WDC feature is enabled for the user (true) or not (false).",
      optional: true,
    },
    UserPreferencesActivityRemindersPopup: {
      type: "boolean",
      label: "ActivityRemindersPopup",
      description:
        "When true, a reminder window automatically opens when an activity reminder is due. Corresponds to the Trigger alert when reminder comes due checkbox at the Reminders page in the personal settings in the user interface.",
      optional: true,
    },
    UserPreferencesAllowConversationReminders: {
      type: "boolean",
      label: "Allow Conversation Reminders",
      description:
        "When true, voice and call reminders are displayed as notification cards in Lightning Experience. Corresponds to the Show conversation reminders in Lightning Experience checkbox in the Activity Reminders page in the personal settings in the user interface.",
      optional: true,
    },
    UserPreferencesApexPagesDeveloperMode: {
      type: "boolean",
      label: "Apex Pages Developer Mode",
      description:
        "When true, indicates that the user has enabled developer mode for editing Visualforce pages and controllers.",
      optional: true,
    },
    UserPreferencesAutoForwardCall: {
      type: "boolean",
      label: "Auto Forward Call",
      description:
        "When true, the user receives Dialer calls simultaneously in their browser and on their forwarding number.",
      optional: true,
    },
    UserPreferencesContentEmailAsAndWhen: {
      type: "boolean",
      label: "Content Email As And When",
      description:
        "When false, a user with Salesforce CRM Content subscriptions receives a once-daily email summary if activity occurs on the subscribed content, libraries, tags, or authors.",
      optional: true,
    },
    UserPreferencesContentNoEmail: {
      type: "boolean",
      label: "Content No Email",
      description:
        "When false, a user with Salesforce CRM Content subscriptions receives email notifications if activity occurs on the subscribed content, libraries, tags, or authors.",
      optional: true,
    },
    UserPreferencesEnableAutoSubForFeeds: {
      type: "boolean",
      label: "Enable Auto Sub For Feeds",
      description:
        "When true, the user automatically subscribes to feeds for any objects that the user creates.",
      optional: true,
    },
    UserPreferencesDisableAllFeedsEmail: {
      type: "boolean",
      label: "Disable All Feeds Email",
      description:
        "When false, the user automatically receives email for all updates to Chatter feeds, based on the types of feed emails and digests the user has enabled.",
      optional: true,
    },
    UserPreferencesDisableBookmarkEmail: {
      type: "boolean",
      label: "Disable Bookmark Email",
      description:
        "When false, the user automatically receives email every time someone comments on a Chatter feed item after the user has bookmarked it.",
      optional: true,
    },
    UserPreferencesDisableChangeCommentEmail: {
      type: "boolean",
      label: "Disable Change Comment Email",
      description:
        "When false, the user automatically receives email every time someone comments on a change the user has made, such as an update to their profile.",
      optional: true,
    },
    UserPreferencesDisableEndorsementEmail: {
      type: "boolean",
      label: "Disable Endorsement Email",
      description:
        "When false, the member automatically receives email every time someone endorses them for a topic.",
      optional: true,
    },
    UserPreferencesDisableFileShareNotificationsForApi: {
      type: "boolean",
      label: "Disable File Share Notifications For Api",
      description:
        "When false, email notifications are sent from the person who shared the file to the users that the file is shared with.",
      optional: true,
    },
    UserPreferencesDisableFollowersEmail: {
      type: "boolean",
      label: "Disable Followers Email",
      description:
        "When false, the user automatically receives email every time someone starts following the user in Chatter.",
      optional: true,
    },
    UserPreferencesDisableLaterCommentEmail: {
      type: "boolean",
      label: "Disable Later Comment Email",
      description:
        "When false, the user automatically receives email every time someone comments on a feed item after the user has commented on the feed item.",
      optional: true,
    },
    UserPreferencesDisableLikeEmail: {
      type: "boolean",
      label: "Disable Like Email",
      description:
        "When false, the user automatically receives email every time someone likes their post or comment.",
      optional: true,
    },
    UserPreferencesDisableMentionsPostEmail: {
      type: "boolean",
      label: "Disable Mentions Post Email",
      description:
        "When false, the user automatically receives email every time they're mentioned in posts.",
      optional: true,
    },
    UserPreferencesDisableProfilePostEmail: {
      type: "boolean",
      label: "Disable Profile Post Email",
      description:
        "When false, the user automatically receives email every time someone posts to the user's profile.",
      optional: true,
    },
    UserPreferencesDisableSharePostEmail: {
      type: "boolean",
      label: "Disable Share Post Email",
      description:
        "When false, the user automatically receives email every time their post is shared.",
      optional: true,
    },
    UserPreferencesDisableFeedbackEmail: {
      type: "boolean",
      label: "Disable Feedback Email",
      description:
        "When false, the user automatically receives emails related to WDC feedback. The user receives these emails when someone requests or offers feedback, shares feedback with the user, or reminds the user to answer a feedback request.",
      optional: true,
    },
    UserPreferencesDisCommentAfterLikeEmail: {
      type: "boolean",
      label: "Dis Comment After Like Email",
      description:
        "When false, the user automatically receives email every time someone comments on a post that the user liked.",
      optional: true,
    },
    UserPreferencesDisMentionsCommentEmail: {
      type: "boolean",
      label: "Dis Mentions Comment Email",
      description:
        "When false, the user automatically receives email every time the user is mentioned in comments.",
      optional: true,
    },
    UserPreferencesDisableMessageEmail: {
      type: "boolean",
      label: "Disable Message Email",
      description:
        "When false, the user automatically receives email for Chatter messages sent to the user.",
      optional: true,
    },
    UserPreferencesDisableRewardEmail: {
      type: "boolean",
      label: "Disable Reward Email",
      description:
        "When false, the user automatically receives emails related to WDC rewards. The user receives these emails when someone gives a reward to the user.",
      optional: true,
    },
    UserPreferencesDisableWorkEmail: {
      type: "boolean",
      label: "Disable Work Email",
      description:
        "When false, the user receives emails related to WDC feedback, goals, and coaching. The user must also sign up for individual emails listed on the WDC email settings page. When true, the user doesn't receive any emails related to WDC feedback, goals, or coaching even if they're signed up for individual emails.",
      optional: true,
    },
    UserPreferencesDisProfPostCommentEmail: {
      type: "boolean",
      label: "Dis Prof Post Comment Email",
      description:
        "When false, the user automatically receives email every time someone comments on posts on the user's profile.",
      optional: true,
    },
    UserPreferencesEnableVoiceCallRecording: {
      type: "boolean",
      label: "EnableVoiceCallRecording",
      description: "When true, voice call recording is enabled for the user.",
      optional: true,
    },
    UserPreferencesEnableVoiceLocalPresence: {
      type: "boolean",
      label: "EnableVoiceLocalPresence",
      description:
        "When true, local numbers are shown when the user calls customers with Sales Dialer.",
      optional: true,
    },
    UserPreferencesEventRemindersCheckboxDefault: {
      type: "boolean",
      label: "Event Reminders Checkbox Default",
      description:
        "When true, a reminder popup is automatically set on the user's events. Corresponds to the `By default, set reminder on Events to...` checkbox on the Reminders page in the user interface. This field is related to UserPreference and customizing activity reminders.",
      optional: true,
    },
    UserPreferencesHideBiggerPhotoCallout: {
      type: "boolean",
      label: "Hide Bigger Photo Callout",
      description:
        "When true, users can choose to hide the callout text below the large profile photo.",
      optional: true,
    },
    UserPreferencesHideChatterOnboardingSplash: {
      type: "boolean",
      label: "Hide Chatter Onboarding Splash",
      description:
        "When true, the initial Chatter onboarding prompts don't appear.",
      optional: true,
    },
    UserPreferencesHideCSNDesktopTask: {
      type: "boolean",
      label: "Hide CSN Desktop Task",
      description:
        "When true, the Chatter recommendations panel never displays the recommendation to install Chatter Desktop.",
      optional: true,
    },
    UserPreferencesHideCSNGetChatterMobileTask: {
      type: "boolean",
      label: "Hide CSN Get Chatter Mobile Task",
      description:
        "When true, the Chatter recommendations panel never displays the recommendation to install Chatter Mobile.",
      optional: true,
    },
    UserPreferencesHideSecondChatterOnboardingSplash: {
      type: "boolean",
      label: "HideSecondChatterOnboardingSplash",
      description:
        "When true, the secondary Chatter onboarding prompts don't appear.",
      optional: true,
    },
    UserPreferencesHideS1BrowserUI: {
      type: "boolean",
      label: "Hide S1 Browser UI",
      description:
        "Controls the interface that the user sees when logging in to Salesforce from a supported mobile browser. If false, the user is automatically redirected to the Salesforce mobile web. If true, the user sees the full Salesforce site.",
      optional: true,
    },
    UserPreferencesHideSfxWelcomeMat: {
      type: "boolean",
      label: "Hide Sfx Welcome Mat",
      description:
        "Controls whether a user sees the Lightning Experience new user message. That message welcomes users to the new interface and provides step-by-step instructions that describe how to return to Salesforce Classic.",
      optional: true,
    },
    UserPreferencesJigsawListUser: {
      type: "boolean",
      label: "Data.com List User",
      description:
        "When true, the user is a Data.com List user so shares record additions from a pool.",
      optional: true,
    },
    UserPreferencesLightningExperiencePreferred: {
      type: "boolean",
      label: "Lightning Experience Preferred",
      description:
        "When true, redirects the user to the Lightning Experience interface. Label is Switch to Lightning Experience.",
      optional: true,
    },
    UserPreferencesLiveAgentMiawSetupDeflection: {
      type: "boolean",
      label: "Live Agent Miaw Setup Deflection",
      description:
        "When true, disables the pop-up to deflect users on Chat setup nodes to the Messaging setup. The default value is false.",
      optional: true,
    },
    UserPreferencesNativeEmailClient: {
      type: "boolean",
      label: "Native Email Client",
      description:
        "Use this field to set a default email preference for the user's native email client.",
      optional: true,
    },
    UserPreferencesOutboundBridge: {
      type: "boolean",
      label: "Outbound Bridge",
      description:
        "When true, outbound calls are made through the user's phone.",
      optional: true,
    },
    UserPreferencesPathAssistantCollapsed: {
      type: "boolean",
      label: "Path Assistant Collapsed",
      description:
        "When true, Sales Path appears collapsed or hidden to the user.",
      optional: true,
    },
    UserPreferencesReceiveNoNotificationsAsApprover: {
      type: "boolean",
      label: "Receive No Notifications As Approver",
      description:
        "Controls email notifications from the approval process for approvers. If true, emails are disabled. If false, emails are enabled. The default value is false.",
      optional: true,
    },
    UserPreferencesReceiveNotificationsAsDelegatedApprover: {
      type: "boolean",
      label: "Receive Notifications As Delegated Approver",
      description:
        "Controls email notifications from the approval process for delegated approvers. If true, emails are enabled. If false, emails are disabled. The default value is false.",
      optional: true,
    },
    UserPreferencesReminderSoundOff: {
      type: "boolean",
      label: "Reminde Sound Off",
      description:
        "When true, a sound automatically plays when an activity reminder is due. Corresponds to the `Play a reminder sound` checkbox on the Reminders page in the user interface.",
      optional: true,
    },
    UserPreferencesShowCityToExternalUsers: {
      type: "boolean",
      label: "Show City To External Users",
      description:
        "Indicates the visibility of the city field in the user's contact information. ",
      optional: true,
    },
    UserPreferencesShowCityToGuestUsers: {
      type: "boolean",
      label: "Show City To Guest Users",
      description:
        "Indicates the visibility of the city field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowCountryToExternalUsers: {
      type: "boolean",
      label: "Show Country To External Users",
      description:
        "Indicates the visibility of the country field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowCountryToGuestUsers: {
      type: "boolean",
      label: "Show Country To Guest Users",
      description:
        "Indicates the visibility of the country field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowEmailToExternalUsers: {
      type: "boolean",
      label: "Show Email To External Users",
      description:
        "Indicates the visibility of the email address field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowEmailToGuestUsers: {
      type: "boolean",
      label: "Show Email To Guest Users",
      description:
        "Indicates the visibility of the email address field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowFaxToExternalUsers: {
      type: "boolean",
      label: "Show Fax To External Users",
      description:
        "Indicates the visibility of the fax number field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowFaxToGuestUsers: {
      type: "boolean",
      label: "Show Fax To Guest Users",
      description:
        "Indicates the visibility of the fax number field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowManagerToExternalUsers: {
      type: "boolean",
      label: "Show Manager To External Users",
      description:
        "Indicates the visibility of the manager field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowManagerToGuestUsers: {
      type: "boolean",
      label: "Show Manager To Guest Users",
      description:
        "Indicates the visibility of the manager field in the user's contact information..",
      optional: true,
    },
    UserPreferencesShowMobilePhoneToExternalUsers: {
      type: "boolean",
      label: "Show Mobile Phone To External Users",
      description:
        "Indicates the visibility of the mobile device number field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowMobilePhoneToGuestUsers: {
      type: "boolean",
      label: "Show Mobile Phone To Guest Users",
      description:
        "Indicates the visibility of the mobile phone field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowPostalCodeToExternalUsers: {
      type: "boolean",
      label: "Show Postal Code To External Users",
      description:
        "Indicates the visibility of the postal or ZIP code field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowPostalCodeToGuestUsers: {
      type: "boolean",
      label: "Show Postal Code To Guest Users",
      description:
        "Indicates the visibility of the postal or ZIP code field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowProfilePicToGuestUsers: {
      type: "boolean",
      label: "Show Profile Pic To Guest Users",
      description:
        "Indicates the visibility of the user's profile photo.",
      optional: true,
    },
    UserPreferencesShowStateToExternalUsers: {
      type: "boolean",
      label: "Show State To External Users",
      description:
        "Indicates the visibility of the state field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowStateToGuestUsers: {
      type: "boolean",
      label: "Show State To Guest Users",
      description:
        "Indicates the visibility of the state field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowStreetAddressToExternalUsers: {
      type: "boolean",
      label: "Show Street Address To External Users",
      description:
        "Indicates the visibility of the street address field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowStreetAddressToGuestUsers: {
      type: "boolean",
      label: "Show Street Address To Guest Users",
      description:
        "Indicates the visibility of the street address field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowTitleToExternalUsers: {
      type: "boolean",
      label: "Show Title To External Users",
      description:
        "Indicates the visibility of the business title field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowTitleToGuestUsers: {
      type: "boolean",
      label: "Show Title To Guest Users",
      description:
        "Indicates the visibility of the business title field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowWorkPhoneToExternalUsers: {
      type: "boolean",
      label: "Show Work Phone To External Users",
      description:
        "Indicates the visibility of the work phone number field in the user's contact information.",
      optional: true,
    },
    UserPreferencesShowWorkPhoneToGuestUsers: {
      type: "boolean",
      label: "Show Work Phone To Guest Users",
      description:
        "Indicates the visibility of the work phone field in the user's contact information.",
      optional: true,
    },
    UserPreferencesSortFeedByComment: {
      type: "boolean",
      label: "Sort Feed By Comment",
      description:
        "Specifies the data value used in sorting a user's feed. When true, the feed is sorted by most recent comment activity. When false, the feed is sorted by post date.",
      optional: true,
    },
    UserPreferencesSuppressEventSFXReminders: {
      type: "boolean",
      label: "Suppress Event SFX Reminders",
      description:
        "When true, event reminders don't appear. Corresponds to the Show event reminders in Lightning Experience checkbox on the Activity Reminders page in the user interface.",
      optional: true,
    },
    UserPreferencesSuppressTaskSFXReminders: {
      type: "boolean",
      label: "Suppress Task SFX Reminders",
      description:
        "When true, task reminders don't appear. Corresponds to the `Show task reminders in Lightning Experience.` checkbox on the Activity Reminders page in the user interface.",
      optional: true,
    },
    UserPreferencesTaskRemindersCheckboxDefault: {
      type: "boolean",
      label: "Task Reminders Checkbox Default",
      description:
        "When true, a reminder popup is automatically set on the user's tasks. Corresponds to the `By default, set reminder on Tasks to...` checkbox on the Reminders page in the user interface.",
      optional: true,
    },
    UserPreferencesUserDebugModePref: {
      type: "boolean",
      label: "User Debug Mode Pref",
      description:
        "When true, the Lightning Component framework executes in debug mode for the user. Corresponds to the `Debug Mode` checkbox on the Advanced User Details page of personal settings in the user interface.",
      optional: true,
    },
  },
};
