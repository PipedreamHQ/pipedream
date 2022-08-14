/*
* EXAMPLE IMPLEMENTATION OF USING SHOWPAD CUSTOM CRM FUNCTIONALITY TO CONNECT HUBSPOT
* This is just an illustration / Proof-Of-Concept
* No guarantees offered of functionality of production-readiness.
* Author: wouter.smet@showpad.com - Summer 2022
*
* Steps to set up:
* - Add this as an action to a workflow with HTTP (API) trigger.
* - Create a 'custom CRM' connection in Showpad's CRM Setup area, API key for auth
* - For endpoints, copy-paste the trigger URL of this workflow with paths as follows:
* [pipedream_trigger_url]/recipientsearch
* [pipedream_trigger_url]/objectsearch
* [pipedream_trigger_url]/suggestions
* [pipedream_trigger_url]/logactivity
*/

import { axios } from "@pipedream/platform";

export default {
  key: "showpad-custom-crm-hubspot",
  name: "Showpad Custom CRM: Hubspot (Alpha)",
  version: "0.0.5",
  description: `Example implementation of the endpoints required to connect Hubspot as a Showpad 'Custom CRM'. 
  Use in workflow with HTTP API trigger.
  (see 'code' section for more detailed instructions)
  `,
  props: {
    HTTP_TRIGGER_EVENT: {
      type: "object",
      label: "HTTP Trigger Event",
      default: {},
      description: "Needed for action to capture the incoming request. Choose custom expression, then {{ steps.trigger.event}} ",
    },
    hubspot: {
      type: "app",
      app: "hubspot",
      label: "Hubspot",
      description: "Hubspot integration account",
    },
    SHOWPAD_CUSTOMCRM_API_KEY: {
      type: "string",
      secret: true,
      label: "Showpad Custom CRM API Key",
      default: "",
      description: "Created within Showpad setup > crm > Custom CRM. E.g. sh0wpadHubsp0tCust0mCrm!",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    // const req = steps.trigger.event;
    const req = this.HTTP_TRIGGER_EVENT; //no 'steps' object on published components
    const info = {
      showpadSubdomain: req.body.showpad_info.subdomain,
      showpadUsername: req.body.showpad_info.username,
    };

    // helper function
    const sendResponse = async (statusCode, responseObject, existMessage = null) => {
      console.log("Will send response:", responseObject);
      await $.respond({
        status: statusCode,
        headers: {},
        body: JSON.stringify(responseObject),
      });
      $.flow.exit(existMessage);
    };

    if (!signatureIsValid(req.headers, this.SHOWPAD_CUSTOMCRM_API_KEY)) {
      await sendResponse(401, {
        message: "Invalid or no auth header received",
      }, "`Invalid auth`");
    }

    // handle actions
    const token = this.hubspot.$auth.oauth_access_token;
    const orgId = this.hubspot.$auth.oauth_uid;
    const client = new HubspotClient($,
      sendResponse,
      orgId,
      token);

    if (req.path == "/recipientsearch") {
      await client.searchRecipients(req.body.query);
    }
    else if (req.path == "/objectsearch") {
      await client.searchObjects(req.body.query, req.body.objecttypes);
    }
    else if (req.path == "/suggestions") {
      await client.getSuggestions(req.body.recipients);
    }
    else if (req.path == "/logactivity") {
      await client.logactivity(req.body, info.showpadUsername);
    }
    else { // fallback
      await sendResponse(400, {
        message: `Don't know what to do with method ${req.method} and path ${req.path}`,
      });
    }
  },
};

// check auth @TODO: check SHA-256 / HMAC signature instead of bearer token
const signatureIsValid = (headers, apiKey) => {
  return headers && headers["authorization"] === `Bearer ${apiKey}`;
};

class HubspotClient {
  constructor($, sendPipedreamResponse, orgId, authToken) {
    console.log(`Init hubspot with org ${orgId} token ${authToken}`);
    // global constants
    this.METHOD_GET = "GET";
    this.METHOD_POST = "POST";
    this.METHOD_PUT = "PUT";

    // needed for 'pipedream-specific axios' which helps debugging with $ context
    this.$ = $;
    this.sendPipedreamResponse = sendPipedreamResponse;

    this.tenantUrl = "https://app.hubspot.com";
    this.orgId = orgId;
    this.authToken = authToken;
  }

  async callHubspotCrmV3Api(method, endpoint, bodyData = null) {
    return await axios(this.$, {
      url: `https://api.hubapi.com/crm/v3/${endpoint}`,
      headers: {
        "Authorization": `Bearer ${this.authToken}`,
        "Content-Type": "application/json",
      },
      method: method,
      data: bodyData,
    }).catch( (error) => {
      console.log(`Hubspot API error response (status ${error.response.status}) from endpoint ${endpoint}`, error.response);
      this.sendPipedreamResponse(502, {
        message: `Hubspot returned ${error.response.status} error from ${endpoint}: ${error.response.data.message}`,
      });
    });
  }

  buildHubspotSearchJson(query, fieldsToSearch, withEmailOnly = false) {
    const filtersFormatted = fieldsToSearch.map((field) => {
      const conditionList = [
        {
          operator: "CONTAINS_TOKEN",
          propertyName: field,
          value: `*${query}*`,
        },
      ];
      if (withEmailOnly) conditionList.push({
        operator: "HAS_PROPERTY",
        propertyName: "email",
      });

      return {
        filters: conditionList,
      };
    });

    return JSON.stringify({
      filterGroups: filtersFormatted,
    });
  }

  async searchRecipients(searchQuery) {
    if (!searchQuery) {
      await this.sendPipedreamResponse(400, {
        message: "No query param received",
      }, "No query param received");
    }
    else {
      console.log(`Will search hubspot contacts for query: ${searchQuery}`);

      const toShowpadRecipientResultItem = (result) => {
        return {
          "type": "contact",
          "id": result.id,
          "name": `${result.properties.firstname} ${result.properties.lastname}`,
          "firstName": result.properties.firstname,
          "lastName": result.properties.lastname,
          "emailAddress": result.properties.email,
          "url": `${this.tenantUrl}/contact/${result.id}`,
          "account": {},
        };
      };

      const fields = [
        "email",
        "firstname",
        "lastname",
      ];
      const hubspotResults = await this.callHubspotCrmV3Api(this.METHOD_POST, "objects/contacts/search", this.buildHubspotSearchJson(searchQuery, fields, true));

      const count = hubspotResults.total;
      const items = [];
      for (let i = 0; i < hubspotResults.results.length; i++) {
        const result = hubspotResults.results[i];
        items.push(toShowpadRecipientResultItem(result));
      }

      const responseData = {
        count,
        items,
      };
      await this.sendPipedreamResponse(200, responseData);
    }
  }

  async searchObjects(searchQuery, typesToQuery) {
    console.log(`Will search hubspot records for query: ${searchQuery}`, "types: ", typesToQuery);
    const toShowpadSearchResultItem = (hubspotBase, showpadType, hubspotType, result) => {
      return {
        "type": showpadType, // "account" etc
        "id": result.id,
        "name": result.properties.name,
        "url": `${hubspotBase}/${hubspotType}/${result.id}`,
      };
    };

    let count = 0, items = [];

    // todo: run in parallel? clean up with less ugly duplicate code?
    if (typesToQuery.includes("account")) {
      const hubspotResults = await this.callHubspotCrmV3Api(this.METHOD_POST, "objects/companies/search", this.buildHubspotSearchJson(searchQuery, [
        "name",
      ]));
      for (let i = 0; i < hubspotResults.results.length; i++) {
        items.push(toShowpadSearchResultItem(`${this.tenantUrl}/contacts/${this.orgId}`, "account", "company", hubspotResults.results[i]));
      }
      count += hubspotResults.total;
    }

    if (typesToQuery.includes("opportunity")) {
      const hubspotResults = await this.callHubspotCrmV3Api(this.METHOD_POST, "objects/deals/search", this.buildHubspotSearchJson(searchQuery, [
        "dealname",
      ]));
      for (let i = 0; i < hubspotResults.results.length; i++) {
        items.push(toShowpadSearchResultItem(`${this.tenantUrl}/deals/${this.orgId}`, "opportunity", "deal", hubspotResults.results[i]));
      }
      count += hubspotResults.total;
    }

    if (typesToQuery.includes("contact") || typesToQuery.includes("lead")) {
      const hubspotResults = await this.callHubspotCrmV3Api(this.METHOD_POST, "objects/contacts/search", this.buildHubspotSearchJson(searchQuery, [
        "firstname",
      ]));

      for (let i = 0; i < hubspotResults.results.length; i++) {
        items.push(toShowpadSearchResultItem(`${this.tenantUrl}/contacts/${this.orgId}`, "contact", "contact", hubspotResults.results[i]));
      }
      count += hubspotResults.total;
    }

    const responseData = {
      count,
      items,
    };
    await this.sendPipedreamResponse(200, responseData);
  }

  async getSuggestions(recipients) {
    const toShowpadSuggestionItem = (hubspotBase, showpadType, hubspotType, result) => {
      return {
        "type": showpadType, // "account" etc
        "id": result.id,
        "name": result.properties.name,
        "url": `${hubspotBase}/${hubspotType}/${result.id}`,
      };
    };

    let relatedObjects = [];
    let personObjects = [];

    const firstContactId = recipients[0].split(":")[1];

    // person objects (just first recipient)
    const hubspotContactDetails = await this.callHubspotCrmV3Api(this.METHOD_GET, `objects/contacts/${firstContactId}`);
    personObjects = [
      toShowpadSuggestionItem(`${this.tenantUrl}/companies/${this.orgId}`, "account", "company", hubspotContactDetails),
    ];

    // related objects (companies, deals...)
    console.log(`Will get associations for contact: ${firstContactId}`);
    const hubspotAssociationResults = await this.callHubspotCrmV3Api(this.METHOD_GET, `objects/contacts/${firstContactId}/associations/company`);
    console.log("Hubspot contact association results:", hubspotAssociationResults);
    if (hubspotAssociationResults.results.length > 0) {
      for (let i = 0; i < hubspotAssociationResults.results.length; i++) {
        const hubspotCompanyResults = await this.callHubspotCrmV3Api(this.METHOD_GET, `objects/companies/${hubspotAssociationResults.results[i]["id"]}`);
        console.log("Hubspot company results:", hubspotCompanyResults);
        relatedObjects.push(toShowpadSuggestionItem(`${this.tenantUrl}/companies/${this.orgId}`, "account", "company", hubspotCompanyResults));
      }
    }

    const responseData = {
      relatedObjects,
      personObjects,
    };
    await this.sendPipedreamResponse(200, responseData);
  }

  async logactivity(requestBody, showpadUsername) {
    if (!requestBody.crmActivityRelatedobjects) {
      await this.sendPipedreamResponse(400, "No related objects specified");
    }
    else {
      // get hubspot user (crm 'owner') with matching email
      let hubspotUserId = false;
      const hubspotOwners = await this.callHubspotCrmV3Api(this.METHOD_GET, "owners");
      for (let i = 0; i < hubspotOwners.results.length; i++) {
        if (hubspotOwners.results[i].email === showpadUsername) {
          hubspotUserId = hubspotOwners.results[i].id;
          break;
        }
      }

      if (!hubspotUserId) {
        await this.sendPipedreamResponse(400, `No Hubspot user found for ${showpadUsername}`);
      }
      else {
        const buildSubjectAndMessageFromPayload = (requestBody) => {
          const action = requestBody.showpadUserAction;
          if (action === "email_share") {
            return {
              subject: `Showpad share: ${requestBody.emailShareInfo.subject}`,
              message: `Share info: ${requestBody.emailShareInfo.body}`,
            };
          }
          else if (action === "link_share") {
            return {
              subject: `Showpad share: ${requestBody.linkShareInfo.title}`,
              message: `Share info: ${requestBody.linkShareInfo.body}`,
            };
          }
          else if (action === "meetingiq") {
            return {
              subject: `Showpad meeting: ${requestBody.meetingInfo.subject}`,
              message: `Meeting info: ${requestBody.meetingInfo.body} \n\n Visit: ${requestBody.meetingInfo.meetingIqUrl}`,
            };
          }
          else if (requestBody.showpadUserAction === "shared_space_create" || action === "shared_space_currentstate") {
            return {
              subject: `Showpad shared space: ${requestBody.sharedSpaceInfo.name}`,
              message: `Shared space description: ${requestBody.sharedSpaceInfo.description} \n\n Visit: ${requestBody.sharedSpaceInfo.url}`,
            };
          }
          else {
            return {
              subject: "Showpad Share",
              message: "Showpad share happened (but no further info on share type or assets known)",
            };
          }
        };

        const pad = (thing) => String(thing).padStart(2, "0");
        const getCurrentTime = () => {
          const d = new Date();
          return d.getFullYear() + "-" +
                  pad(d.getMonth() + 1) + "-" +
                  pad(d.getDate()) + "T" +
                  pad(d.getHours()) + ":" +
                  pad(d.getMinutes()) + ":" +
                  pad(d.getSeconds()) + "Z";
        };

        const buildHubspotTaskObjectJson = (ownerId, subject, message) => {
          return JSON.stringify({
            properties: {
              hs_timestamp: getCurrentTime(), // should be formatted like "2019-10-30T03:30:17.883Z",
              hubspot_owner_id: ownerId,
              hs_task_subject: subject,
              hs_task_body: message,
              hs_task_status: "COMPLETED",
              hs_task_priority: "MEDIUM",
            },
          });
        };

        const buildHubspotEmailObjectJson = (ownerId, subject, message) => {
          return JSON.stringify({
            properties: {
              hs_timestamp: getCurrentTime(), // should be formatted like "2019-10-30T03:30:17.883Z",
              hubspot_owner_id: ownerId,
              hs_email_subject: subject,
              hs_email_text: message,
              hs_email_direction: "EMAIL",
              hs_email_status: "SENT",
            },
          });
        };

        //build subject+message based on payload, share type etc
        const {
          subject, message,
        } = buildSubjectAndMessageFromPayload(requestBody);
        let bodyData, hubspotResults;
        const treatEmailSharesSeparately = false; // possible improvement
        if (treatEmailSharesSeparately && requestBody.showpadUserAction === "email_share") {
          bodyData = buildHubspotEmailObjectJson(hubspotUserId, subject, message);
          console.log("Will send this email info to hubspot: ", bodyData);
          hubspotResults = await this.callHubspotCrmV3Api(this.METHOD_POST, "objects/emails", bodyData);
        }
        else {
          bodyData = buildHubspotTaskObjectJson(hubspotUserId, subject, message);

          console.log("Will send this task info to hubspot: ", bodyData);
          hubspotResults = await this.callHubspotCrmV3Api(this.METHOD_POST, "objects/tasks", bodyData);
        }
        console.log("Hubspot results:", hubspotResults);

        if (!hubspotResults) {
          this.sendPipedreamResponse(400, "Error creating task in Hubspot");
        }
        else {
          // add associations with records to the task
          const relatedObjects = requestBody.crmActivityRelatedobjects;
          for (let i = 0;i < relatedObjects.length;i++) {
            let relatedObject = relatedObjects[i];
            if (relatedObject.type === "contact") {
              console.log(`Will link created task #${hubspotResults.id} to contact #${relatedObject.id} ...`);
              await this.callHubspotCrmV3Api(this.METHOD_PUT, `objects/tasks/${hubspotResults.id}/associations/contacts/${relatedObject.id}/task_to_contact`);

              // also got account here?
              if (relatedObject.account) {
                console.log(`Will link created task #${hubspotResults.id} to contact's account/company #${relatedObject.account.id} ...`);
                await this.callHubspotCrmV3Api(this.METHOD_PUT, `objects/tasks/${hubspotResults.id}/associations/companies/${relatedObject.account.id}/task_to_company`);
              }
            }
            else if (relatedObject.type === "account") {
              console.log(`Will link created task #${hubspotResults.id} to account/company #${relatedObject.id} ...`);
              await this.callHubspotCrmV3Api(this.METHOD_PUT, `objects/tasks/${hubspotResults.id}/associations/companies/${relatedObject.id}/task_to_company`);
            }
            else if (relatedObject.type === "opportunity") {
              console.log(`Will link created task #${hubspotResults.id} to opportunity/deal #${relatedObject.id} ...`);
              await this.callHubspotCrmV3Api(this.METHOD_PUT, `objects/tasks/${hubspotResults.id}/associations/deals/${relatedObject.id}/task_to_deal`);

              if (relatedObject.accountId) {
                console.log(`We also have accountId! Will link created task #${hubspotResults.id} to account/company #${relatedObject.accountId} ...`);
                await this.callHubspotCrmV3Api(this.METHOD_PUT, `objects/tasks/${hubspotResults.id}/associations/companies/${relatedObject.accountId}/task_to_company`);
              }
            }
          }
          // @TODO any more direct deep link url to task?
          const responseData = {
            id: hubspotResults.id,
            url: `${this.tenantUrl}/tasks/${this.orgId}`,
          };
          await this.sendPipedreamResponse(201, responseData);
        }
      }
    }
  }
}
