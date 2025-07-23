import common from "../../common/base.mjs";

export default {
    ...common,
    key: "highlevel_oauth-get-free-slots",
    name: "Get Free Slots",
    description: "Retrieves available time slots from a calendar. [See the documentation](https://highlevel.stoplight.io/docs/integrations/7f694ee8bd969-get-free-slots)",
    version: "0.0.38",
    type: "action",
    props: {
        ...common.props,
        calendarId: {
            type: "string",
            label: "Calendar ID",
            description: "The ID of the calendar to retrieve free slots from",
            async options() {
                const {calendars} = await this.app._makeRequest({
                    url: "/calendars/",
                    params: {
                        locationId: this.app.getLocationId(),
                    },
                });
                return calendars?.calendars?.map(({
                    id: value, name: label,
                }) => ({
                    label,
                    value,
                })) || [];
            },
        },
        startDate: {
            type: "string",
            label: "Start Date",
            description: "The start date for slot lookup in YYYY-MM-DD format (e.g., 2024-01-15)",
        },
        endDate: {
            type: "string",
            label: "End Date",
            description: "The end date for slot lookup in YYYY-MM-DD format (e.g., 2024-01-16)",
        },
        timezone: {
            type: "string",
            label: "Timezone",
            description: "Timezone for the slots",
            optional: true,
            default: "America/New_York",
            options: [
                "America/New_York",
                "America/Chicago",
                "America/Denver",
                "America/Los_Angeles",
                "America/Phoenix",
                "America/Anchorage",
                "Pacific/Honolulu",
                "Europe/London",
                "Europe/Paris",
                "Europe/Berlin",
                "Europe/Rome",
                "Europe/Madrid",
                "Asia/Tokyo",
                "Asia/Shanghai",
                "Asia/Kolkata",
                "Asia/Dubai",
                "Australia/Sydney",
                "Australia/Melbourne",
                "UTC",
            ],
        },
        userId: {
            type: "string",
            label: "User ID",
            description: "The ID of the user whose calendar to check",
            optional: true,
            async options() {
                const users = await this.app._makeRequest({
                    url: "/users/",
                    params: {
                        locationId: this.app.getLocationId(),
                    },
                });
                return users?.users?.map(({
                    id: value, name: label,
                }) => ({
                    label,
                    value,
                })) || [];
            }
        },
    },
    async run({ $ }) {
        const {
            app,
            calendarId,
            startDate,
            endDate,
            timezone,
            userId,
        } = this;

        console.log("startDate", startDate, new Date(startDate).getTime());
        console.log("endDate", endDate, new Date(endDate).getTime());
        const args = {
            startDate: startDate ? new Date(startDate).getTime() : undefined,
            endDate: endDate ? new Date(endDate).getTime() : undefined,
            ...(timezone && { timezone }),
            ...(userId && { userId }),
        };

        const response = await app.getFreeSlots({
            $,
            calendarId,
            params: args,
        });

        const slotsCount = response.slots?.length || 0;
        $.export("$summary", `Successfully retrieved ${slotsCount} free slots from calendar ${calendarId}`);

        return response;
    },
};
