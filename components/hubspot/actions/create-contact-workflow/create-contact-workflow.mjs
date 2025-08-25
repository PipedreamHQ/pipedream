import { parseObject } from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-create-contact-workflow",
  name: "Create Contact Workflow",
  description: "Create a contact workflow in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/automation/create-manage-workflows#post-%2Fautomation%2Fv4%2Fflows)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    canEnrollFromSalesforce: {
      type: "boolean",
      label: "Can Enroll From Salesforce",
      description: "Whether the contact workflow can enroll from Salesforce",
      optional: true,
    },
    isEnabled: {
      type: "boolean",
      label: "Is Enabled",
      description: "Whether the contact workflow is enabled",
      optional: true,
    },
    flowType: {
      type: "string",
      label: "Flow Type",
      description: "The type of flow",
      options: [
        "WORKFLOW",
        "ACTION_SET",
        "UNKNOWN",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact workflow",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the contact workflow",
      optional: true,
    },
    uuid: {
      type: "string",
      label: "UUID",
      description: "The UUID of the contact workflow",
      optional: true,
    },
    startAction: {
      type: "string",
      label: "Start Action",
      description: "The start action of the contact workflow",
      optional: true,
    },
    actions: {
      type: "string[]",
      label: "Actions",
      description: "The actions of the contact workflow",
      options: [
        "STATIC_BRANCH",
        "LIST_BRANCH",
        "AB_TEST_BRANCH",
        "CUSTOM_CODE",
        "WEBHOOK",
        "SINGLE_CONNECTION",
      ],
      optional: true,
    },
    enrollmentCriteria: {
      type: "object",
      label: "Enrollment Criteria",
      description: "An object with the enrollment criteria data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/enrollment-criteria-in-contact-workflows) for more information.",
      optional: true,
    },
    enrollmentSchedule: {
      type: "object",
      label: "Enrollment Schedule",
      description: "An object with the enrollment schedule data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/enrollment-schedule-in-contact-workflows) for more information.",
      optional: true,
    },
    timeWindows: {
      type: "string[]",
      label: "Time Windows",
      description: "A list of time windows for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/time-windows-in-contact-workflows) for more information.",
      optional: true,
    },
    blockedDates: {
      type: "string[]",
      label: "Blocked Dates",
      description: "A list of blocked dates for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/blocked-dates-in-contact-workflows) for more information.",
      optional: true,
    },
    customProperties: {
      type: "object",
      label: "Custom Properties",
      description: "An object with the custom properties data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/custom-properties-in-contact-workflows) for more information.",
      optional: true,
    },
    dataSources: {
      type: "string[]",
      label: "Data Sources",
      description: "A list of data sources for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/data-sources-in-contact-workflows) for more information.",
      optional: true,
    },
    suppressionListIds: {
      type: "string[]",
      label: "Suppression List IDs",
      description: "A list of suppression list IDs for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/suppression-list-ids-in-contact-workflows) for more information.",
      optional: true,
    },
    goalFilterBranch: {
      type: "object",
      label: "Goal Filter Branch",
      description: "An object with the goal filter branch data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/goal-filter-branch-in-contact-workflows) for more information.",
      optional: true,
    },
    eventAnchor: {
      type: "object",
      label: "Event Anchor",
      description: "An object with the event anchor data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/event-anchor-in-contact-workflows) for more information.",
      optional: true,
    },
    unEnrollmentSetting: {
      type: "object",
      label: "Un Enrollment Setting",
      description: "An object with the un enrollment setting data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/un-enrollment-setting-in-contact-workflows) for more information.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.createContactWorkflow({
      $,
      data: {
        type: "CONTACT_FLOW",
        canEnrollFromSalesforce: this.canEnrollFromSalesforce,
        isEnabled: this.isEnabled,
        flowType: this.flowType,
        name: this.name,
        description: this.description,
        uuid: this.uuid,
        startAction: this.startAction,
        actions: parseObject(this.actions),
        enrollmentCriteria: parseObject(this.enrollmentCriteria),
        enrollmentSchedule: parseObject(this.enrollmentSchedule),
        timeWindows: parseObject(this.timeWindows),
        blockedDates: parseObject(this.blockedDates),
        customProperties: parseObject(this.customProperties),
        dataSources: parseObject(this.dataSources),
        suppressionListIds: parseObject(this.suppressionListIds),
        goalFilterBranch: parseObject(this.goalFilterBranch),
        eventAnchor: parseObject(this.eventAnchor),
        unEnrollmentSetting: parseObject(this.unEnrollmentSetting),
      },
    });

    $.export("$summary", `Successfully created contact workflow with ID: ${response.id}`);

    return response;
  },
};
