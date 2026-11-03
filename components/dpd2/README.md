# Overview

DPD (getdpd.com) is a hosted cart, checkout and download delivery service for selling ebooks, music, software, subscriptions and other digital products from your own website. With the DPD API you can watch for new purchases, customers, products and subscribers, look each of them up, and email a buyer their purchase again. Connect it to Pipedream to send your sales and members to the other tools you use.

# Example Use Cases

- **Record sales in a spreadsheet or your books**: When a purchase is made, add it to Google Sheets, Airtable or your accounting app, with the buyer, the products and the total.
- **Add buyers and members to your email list**: When someone buys for the first time, or joins your subscription store, add them to Mailchimp, ConvertKit or your CRM.
- **Answer "I lost my download" emails**: When a buyer writes in asking for their download, find their latest purchase by their email address and resend their purchase email.

# Getting Started

Connect your DPD account with your DPD username and API key. You'll find both under **API credentials** on your profile page in the DPD admin.

The **New Purchase Created** trigger emits purchases once they're paid for. The API lists only active purchases, so pending and refunded ones don't show up. **New Subscriber Created** and **Find Subscriber** need a subscription (membership) store.

# Troubleshooting

If you see "DPD didn't accept that username and API key", check both on your DPD profile page and reconnect your account. The API key isn't your DPD password.

The triggers check every 15 minutes. When you first deploy one, it emits up to 25 recent records so you can see what they look like.
