# Overview

The End API on Pipedream allows you to terminate workflows conditionally or unconditionally based on specific logic or triggers. This capability is vital for managing the flow of operations, especially in complex processes where certain conditions need to be met before proceeding or when unnecessary execution needs to be prevented to save resources.

# Example Use Cases

- **Conditional Cleanup Operations**: Set up a workflow where data processing is followed by cleanup tasks like deleting temporary files or logging activity. Use the End API to stop the workflow prematurely if the initial data check fails, ensuring that cleanup only occurs after successful processing.

- **User Verification Process**: In a user signup scenario, integrate the End API to stop the workflow if the user fails an initial verification check (e.g., email or phone number validation). This prevents the subsequent steps, such as welcome emails or database entries, from executing until the user meets all preliminary criteria.

- **Content Moderation Pipeline**: For a content uploading platform, employ the End API to halt a workflow if uploaded content is flagged by preliminary AI-based moderation tools. This prevents the distribution of inappropriate content and ensures only compliant materials proceed to human review or publication.
