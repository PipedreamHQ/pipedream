# Overview

The twocaptcha API provides an automated way to solve captchas, which can be useful in a variety of automation and data scraping workflows. By integrating twocaptcha with Pipedream, you can create serverless workflows that leverage twocaptcha's captcha solving service. This is particularly handy for automating tasks that encounter captchas, like form submissions or web scraping. When a captcha is encountered, Pipedream can send the captcha to twocaptcha, receive the solved captcha, and continue the automated task without manual intervention.

## Example twocaptcha Workflows on Pipedream

1. **Web Scraping Automation**: Create a Pipedream workflow that triggers on a schedule to scrape a website. When a captcha is encountered, use twocaptcha to solve it and continue scraping data, which can then be stored in a Pipedream Data Store or sent to a Google Sheet for analysis.

2. **Automated Form Submission**: Set up a workflow that fills out web forms automatically. When a captcha appears during form submission, the twocaptcha API is called to solve the captcha, allowing the workflow to submit the form successfully. The confirmation or result of the submission can be logged or sent to an email using the built-in SMTP service in Pipedream.

3. **Account Creation Bot**: Develop a workflow to automate the creation of accounts on a platform. When the signup page includes a captcha, the workflow sends it to twocaptcha for resolution. Once the captcha is solved, the workflow completes the signup process. This workflow could be linked to a Slack app to notify a channel each time a new account is created successfully.
