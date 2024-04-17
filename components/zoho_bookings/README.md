# Overview

The Zoho Bookings API lets you integrate your booking system with other apps and services, automating tasks like scheduling, rescheduling, and cancelling appointments. On Pipedream, you can use this API to trigger workflows, process booking data, synchronize schedules across platforms, and create custom notifications. It's a powerful tool for service-based businesses looking to streamline their operations and enhance customer interaction.

# Example Use Cases

- **Sync Bookings with Google Calendar**: Automatically add new bookings from Zoho Bookings to a Google Calendar, allowing for seamless calendar management. Any changes or cancellations in Zoho Bookings can also update Google Calendar in real time, ensuring all schedules are in sync.

- **Send Personalized Notifications**: Craft and send personalized email or SMS notifications through Twilio or SendGrid when a new booking is made, or a booking is rescheduled. Include details like the time, service, and any special instructions, creating a tailored experience for each customer.

- **Manage Customer Follow-ups**: Connect Zoho Bookings with a CRM platform like Salesforce or HubSpot. When an appointment concludes, trigger a workflow that creates a follow-up task in the CRM, ensuring no customer is overlooked and opportunities for additional services or feedback are captured.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).