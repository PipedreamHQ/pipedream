# Overview

Zoho Inventory API on Pipedream opens the door to smart inventory management by allowing you to integrate with a plethora of apps, automate inventory tracking, and streamline order processing. You can sync your inventory levels across multiple sales channels, automatically update stock quantities, process sales orders, manage returns, and generate detailed reports, all in real-time. With Pipedream's serverless platform, crafting workflows becomes a breeze, letting you focus on scaling your business while reducing manual overhead.

# Example Use Cases

- **Automated Order Fulfillment**: When a new order is placed on your e-commerce platform, Pipedream triggers a workflow that creates a sales order in Zoho Inventory, allocates stock, and updates inventory levels. The process can be extended to send a notification to your logistics team or directly to a shipping service like ShipStation to initiate the delivery process.

- **Real-time Stock Sync Across Channels**: Keep your inventory levels in sync across all sales channels, such as Shopify, Amazon, or eBay. Set up a Pipedream workflow that listens for stock level changes in Zoho Inventory and automatically updates the respective channel's inventory, ensuring you never oversell and always display the correct stock information to your customers.

- **Automated Reordering Alerts**: Configure a workflow to monitor stock thresholds and automatically send purchase orders to suppliers when inventory runs low. This could be coupled with Slack or email notifications to keep the purchasing team informed, ensuring your best-selling items are always in stock.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).