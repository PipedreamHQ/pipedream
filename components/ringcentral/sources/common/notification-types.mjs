// These notifications and filters list is documented in the official
// RingCentral API docs:
// https://developers.ringcentral.com/api-reference/events-notifications

export default [
  {
    key: "ringcentral-account-presence-event",
    label: "Account Presence Event",
    filter: "/restapi/v1.0/account/~/presence",
  },
  {
    key: "ringcentral-account-telephony-sessions-event",
    label: "Account Telephony Sessions Event",
    filter: "/restapi/v1.0/account/~/telephony/sessions",
  },
  {
    key: "ringcentral-account-telephony-sessions-event-missed-inbound-call",
    label: "Extension Telephony Sessions Event (Missed Inbound Call)",
    filter: "/restapi/v1.0/account/~/telephony/sessions?direction=Inbound&missedCall=true",
  },
  {
    key: "ringcentral-account-telephony-sessions-event-inbound-call",
    label: "Extension Telephony Sessions Event (Inbound Call)",
    filter: "/restapi/v1.0/account/~/telephony/sessions?direction=Inbound&missedCall=false",
  },
  {
    key: "ringcentral-account-telephony-sessions-event-outbound-call",
    label: "Extension Telephony Sessions Event (Outbound Call)",
    filter: "/restapi/v1.0/account/~/telephony/sessions?direction=Outbound&missedCall=false",
  },
  {
    key: "ringcentral-company-directory-event",
    label: "Company Directory Event",
    filter: "/restapi/v1.0/account/~/directory/entries",
  },
  {
    key: "ringcentral-detailed-extension-presence-event-any",
    label: "Detailed Extension Presence Event (Any Change)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/presence?detailedTelephonyState=true",
  },
  {
    key: "ringcentral-detailed-extension-presence-event-ext-mon",
    label: "Detailed Extension Presence Event (Monitored by the Current Extension)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/presence/line/presence?detailedTelephonyState=true",
  },
  {
    key: "ringcentral-detailed-extension-presence-event-ext-fav",
    label: "Detailed Extension Presence Event (Current Extension Favorites List)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/favorite/presence?detailedTelephonyState=true",
  },
  {
    key: "ringcentral-detailed-extension-presence-with-sip-event-any",
    label: "Detailed Extension Presence with SIP Event (Any Change)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/presence?detailedTelephonyState=true&sipData=true",
  },
  {
    key: "ringcentral-detailed-extension-presence-with-sip-event-ext-mon",
    label: "Detailed Extension Presence with SIP Event (Monitored by the Current Extension)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/presence/line/presence?detailedTelephonyState=true&sipData=true",
  },
  {
    key: "ringcentral-detailed-extension-presence-with-sip-event-ext-fav",
    label: "Detailed Extension Presence with SIP Event (Current Extension Favorites List)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/favorite/presence?detailedTelephonyState=true&sipData=true",
  },
  {
    key: "ringcentral-extension-favorites-event",
    label: "Extension Favorites Event",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/favorite",
  },
  {
    key: "ringcentral-extension-grant-list-event",
    label: "Extension Grant List Event",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/grant",
  },
  {
    key: "ringcentral-extension-info-event",
    label: "Extension Info Event",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}",
  },
  {
    key: "ringcentral-extension-list-event",
    label: "Extension List Event",
    filter: "/restapi/v1.0/account/~/extension",
  },
  {
    key: "ringcentral-extension-presence-event",
    label: "Extension Presence Event",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/presence",
  },
  {
    key: "ringcentral-extension-presence-event-ext-mon",
    label: "Extension Presence Event (Monitored by the Current Extension)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/presence/line/presence",
  },
  {
    key: "ringcentral-extension-presence-event-ext-fav",
    label: "Extension Presence Event (Current Extension Favorites List)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/favorite/presence",
  },
  {
    key: "ringcentral-extension-presence-line-event",
    label: "Extension Presence Line Event",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/presence/line",
  },
  {
    key: "ringcentral-extension-telephony-sessions-event",
    label: "Extension Telephony Sessions Event",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/telephony/sessions",
  },
  {
    key: "ringcentral-extension-telephony-sessions-event-missed-inbound-call",
    label: "Extension Telephony Sessions Event (Missed Inbound Call)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/telephony/sessions?direction=Inbound&missedCall=true",
  },
  {
    key: "ringcentral-extension-telephony-sessions-event-inbound-call",
    label: "Extension Telephony Sessions Event (Inbound Call)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/telephony/sessions?direction=Inbound&missedCall=false",
  },
  {
    key: "ringcentral-extension-telephony-sessions-event-outbound-call",
    label: "Extension Telephony Sessions Event (Outbound Call)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/telephony/sessions?direction=Outbound&missedCall=false",
  },
  {
    key: "ringcentral-inbound-fax-event",
    label: "Inbound Fax Event",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/fax?direction=Inbound",
  },
  {
    key: "ringcentral-instant-message-event",
    label: "Instant Message Event",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/message-store/instant?type=SMS",
  },
  {
    key: "ringcentral-message-event",
    label: "Message Event",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/message-store",
  },
  {
    key: "ringcentral-message-event-inbound",
    label: "Message Event (Inbound)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/message-store?direction=Inbound&type=${messageType}",
  },
  {
    key: "ringcentral-message-event-outbound",
    label: "Message Event (Outbound)",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/message-store?direction=Outbound&type=${messageType}",
  },
  {
    key: "ringcentral-voicemail-message-event",
    label: "Voicemail Message Event",
    filter: "/restapi/v1.0/account/~/extension/${extensionId}/voicemail",
  },
  {
    key: "ringcentral-emergency-address-event",
    label: "Emergency Address Event",
    filter: "/restapi/v1.0/account/~/device/${deviceId}/emergency-address",
  },
  {
    key: "ringcentral-contact-center-phone-number-event",
    label: "Contact Center Phone Number Event",
    filter: "/restapi/v1.0/account/~/phone-number?usageType=ContactCenterNumber",
  },
];
