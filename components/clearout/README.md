# Overview

The Clearout API enables real-time email verification and cleaning to boost the deliverability of your emails. Integrated within Pipedream, it offers a serverless workflow for automating email list maintenance, validation processes, and enhances email marketing efficiency. With it, you can programmatically verify individual addresses or bulk lists, identify disposable emails, and detect invalid domains, creating a reliable foundation for your communication strategies.

# Example Use Cases

- **Validate Emails on User Sign-up**: Automate the verification of email addresses during user registration. When a new user signs up through your app's form, trigger a Pipedream workflow to use Clearout's API to verify the email address. If the email is valid, proceed with the registration; otherwise, prompt the user to provide a valid email.

- **Clean Email Lists Before Campaigns**: Use Pipedream's scheduled workflows to regularly clean your email lists with the Clearout API. Before sending out a marketing campaign, verify and clean your email list to minimize bounces and improve open rates. Once the list is verified, use a service like Mailchimp or SendGrid within Pipedream to send emails to the cleaned list.

- **Detect and Remove Disposable Emails**: Protect your database from being cluttered with temporary emails. Set up a Pipedream workflow that checks for disposable email addresses using the Clearout API each time a new email is added to your database. If a disposable email is detected, automatically remove it from your list or flag it for review.
