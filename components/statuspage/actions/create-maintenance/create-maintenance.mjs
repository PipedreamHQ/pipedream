import statuspage from "../../statuspage.app.mjs";

export default {
  name: "Create Maintenance",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "statuspage-create-maintenance",
  description: "Creates a scheduled maintenance incident in Statuspage. [See the documentation](https://developer.statuspage.io/#operation/postPagesPageIdIncidents)",
  type: "action",
  props: {
    statuspage,
    pageId: {
      propDefinition: [
        statuspage,
        "pageId",
      ],
    },
    name: {
      label: "Name",
      description: "The name of the scheduled maintenance",
      type: "string",
    },
    body: {
      label: "Body",
      description: "The body of the scheduled maintenance",
      type: "string",
    },
    scheduledFor: {
      label: "Scheduled For",
      description: "The ISO 8601 datetime when the maintenance is scheduled to start (e.g. `2024-01-15T10:00:00.000Z`)",
      type: "string",
    },
    scheduledUntil: {
      label: "Scheduled Until",
      description: "The ISO 8601 datetime when the maintenance is scheduled to end (e.g. `2024-01-15T12:00:00.000Z`)",
      type: "string",
    },
    componentIds: {
      label: "Component IDs",
      description: "The IDs of the components affected by this maintenance",
      type: "string[]",
      propDefinition: [
        statuspage,
        "componentId",
        (c) => ({
          pageId: c.pageId,
        }),
      ],
      optional: true,
    },
    deliverNotifications: {
      label: "Deliver Notifications",
      description: "Whether to deliver notifications for this scheduled maintenance",
      type: "boolean",
      optional: true,
      default: true,
    },
    scheduledRemindPrior: {
      label: "Scheduled Remind Prior",
      description: "Whether to remind subscribers prior to the maintenance",
      type: "boolean",
      optional: true,
      default: true,
    },
    scheduledAutoInProgress: {
      label: "Scheduled Auto In Progress",
      description: "Whether to automatically transition to in progress at the scheduled start time",
      type: "boolean",
      optional: true,
      default: true,
    },
    autoTransitionDeliverNotificationsAtStart: {
      label: "Auto Transition Deliver Notifications At Start",
      description: "Whether to deliver notifications when transitioning to in progress",
      type: "boolean",
      optional: true,
      default: true,
    },
    autoTransitionToMaintenanceState: {
      label: "Auto Transition To Maintenance State",
      description: "Whether to automatically transition components to maintenance state at start",
      type: "boolean",
      optional: true,
      default: true,
    },
    scheduledAutoCompleted: {
      label: "Scheduled Auto Completed",
      description: "Whether to automatically complete the maintenance at the scheduled end time",
      type: "boolean",
      optional: true,
      default: true,
    },
    autoTransitionDeliverNotificationsAtEnd: {
      label: "Auto Transition Deliver Notifications At End",
      description: "Whether to deliver notifications when completing the maintenance",
      type: "boolean",
      optional: true,
      default: true,
    },
    autoTransitionToOperationalState: {
      label: "Auto Transition To Operational State",
      description: "Whether to automatically transition components back to operational state at end",
      type: "boolean",
      optional: true,
      default: true,
    },
    autoTweetOnCreation: {
      label: "Auto Tweet On Creation",
      description: "Whether to automatically tweet when the maintenance is created",
      type: "boolean",
      optional: true,
      default: false,
    },
    autoTweetOneHourBefore: {
      label: "Auto Tweet One Hour Before",
      description: "Whether to automatically tweet one hour before the maintenance starts",
      type: "boolean",
      optional: true,
      default: false,
    },
    autoTweetAtBeginning: {
      label: "Auto Tweet At Beginning",
      description: "Whether to automatically tweet when the maintenance begins",
      type: "boolean",
      optional: true,
      default: false,
    },
    autoTweetOnCompletion: {
      label: "Auto Tweet On Completion",
      description: "Whether to automatically tweet when the maintenance is completed",
      type: "boolean",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.statuspage.createIncident({
      $,
      pageId: this.pageId,
      data: {
        incident: {
          name: this.name,
          status: "scheduled",
          body: this.body,
          scheduled_for: this.scheduledFor,
          scheduled_until: this.scheduledUntil,
          deliver_notifications: this.deliverNotifications,
          scheduled_remind_prior: this.scheduledRemindPrior,
          scheduled_auto_in_progress: this.scheduledAutoInProgress,
          auto_transition_deliver_notifications_at_start: // changed — split for max-len
            this.autoTransitionDeliverNotificationsAtStart,
          auto_transition_to_maintenance_state: this.autoTransitionToMaintenanceState,
          scheduled_auto_completed: this.scheduledAutoCompleted,
          auto_transition_deliver_notifications_at_end: // changed — split for max-len
            this.autoTransitionDeliverNotificationsAtEnd,
          auto_transition_to_operational_state: this.autoTransitionToOperationalState,
          auto_tweet_on_creation: this.autoTweetOnCreation,
          auto_tweet_one_hour_before: this.autoTweetOneHourBefore,
          auto_tweet_at_beginning: this.autoTweetAtBeginning,
          auto_tweet_on_completion: this.autoTweetOnCompletion,
          ...(this.componentIds?.length && {
            component_ids: this.componentIds,
          }),
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created maintenance with id ${response.id}`);
    }

    return response;
  },
};
