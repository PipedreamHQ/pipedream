# Overview

The Enormail API brings email marketing campaigns to your fingertips, allowing you to automate subscriber management and email sending. You can craft workflows that respond to subscriber actions, update lists, and send targeted emails based on user behavior or predefined triggers. Pipedream's serverless platform magnifies Enormail's potential by enabling integrations with a multitude of apps to create custom automation chains, streamlining your marketing processes without having to write extensive code.

# Example Use Cases

- **Subscriber Segmentation Workflow**: When a new subscriber is added to Enormail, automatically trigger a Pipedream workflow that cross-references their email with a database on Google Sheets. If they're a returning customer, update their subscriber details in Enormail with a 'VIP' tag, and send a personalized welcome-back email.

- **Customer Feedback Loop**: After sending a campaign email through Enormail, use Pipedream to listen for opens and clicks. Trigger a follow-up email or SMS via Twilio to gather feedback if the subscriber interacts with the email. Store responses in a Google Sheets spreadsheet for analysis and subsequent action.

- **E-commerce Cart Abandonment**: Integrate Enormail with an e-commerce platform like Shopify. Monitor for cart abandonments and use Pipedream to trigger an Enormail workflow that sends a tailored email sequence to the potential buyer, encouraging them to complete their purchase with a special discount or a reminder.
