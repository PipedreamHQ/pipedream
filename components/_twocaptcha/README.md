# Overview

The 2Captcha API enables automated solving of captchas and reCaptcha. On Pipedream, you can integrate this API into workflows to handle captcha challenges when scraping websites, automating form submissions, or any process that encounters captchas. The API takes the captcha image or reCaptcha data as input and returns the text or token needed to bypass the captcha, effectively allowing your automations to mimic human interaction.

# Example Use Cases

- **Automated Account Creation**: Use 2Captcha in a workflow to solve captchas encountered during automated account sign-ups on various platforms. Combine it with HTTP requests or platform-specific APIs to complete the registration processes without manual intervention.

- **Data Scraping Automation**: Create a workflow that scrapes data from websites protected by captcha. When a captcha is encountered, the 2Captcha service can be called to solve it, allowing your scraping tool, like Puppeteer or Cheerio run on Pipedream, to continue gathering the required data.

- **Scheduled Form Submissions**: Implement a Pipedream workflow for submitting forms that include captcha validation on a schedule. Use 2Captcha to solve the captcha, and then submit the form with the correct data, automating repetitive submissions that would otherwise require human interaction.
