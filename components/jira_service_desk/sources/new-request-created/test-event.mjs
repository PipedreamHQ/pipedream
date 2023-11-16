export default {
  _expands: ["participant", "status", "sla", "requestType", "serviceDesk"],
  issueId: "107001",
  issueKey: "HELPDESK-1",
  requestTypeId: "25",
  serviceDeskId: "10",
  createdDate: {
    iso8601: "2015-10-08T14:42:00+0700",
    jira: "2015-10-08T14:42:00.000+0700",
    friendly: "Monday 14:42 PM",
    epochMillis: 1444290120000,
  },
  reporter: {
    name: "fred",
    key: "fred",
    emailAddress: "fred@example.com",
    displayName: "Fred F. User",
    active: true,
    timeZone: "Australia/Sydney",
    _links: {
      jiraRest: "http://www.example.com/jira/rest/api/2/user?username=fred",
      avatarUrls: {
        "48x48":
          "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred",
        "24x24":
          "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
        "16x16":
          "http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred",
        "32x32":
          "http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred",
      },
      self: "http://www.example.com/jira/rest/api/2/user?username=fred",
    },
  },
  requestFieldValues: [
    {
      fieldId: "summary",
      label: "What do you need?",
      value: "Request JSD help via REST",
    },
    {
      fieldId: "description",
      label: "Why do you need this?",
      value: "I need a new mouse for my Mac",
    },
  ],
  currentStatus: {
    status: "Waiting for Support",
    statusDate: {
      iso8601: "2015-10-08T14:01:00+0700",
      jira: "2015-10-08T14:01:00.000+0700",
      friendly: "Today 14:01 PM",
      epochMillis: 1444287660000,
    },
  },
  _links: {
    jiraRest: "http://host:port/context/rest/api/2/issue/107001",
    web: "http://host:port/context/servicedesk/customer/portal/10/HELPDESK-1",
    self: "http://host:port/context/rest/servicedeskapi/request/107001",
  },
};
