# Overview

The Metatext.AI Pre-built AI Models API offers various artificial intelligence capabilities such as natural language processing, image recognition, and sentiment analysis. This API enables users to add AI features to their applications without the need for extensive machine learning expertise. Utilizing this API in Pipedream workflows allows for automation and integration with other services, making it possible to process and analyze text and images within a serverless environment efficiently.

# Example Use Cases

- **Content Moderation Workflow**: Use Metatext.AI's sentiment analysis to filter and moderate user-generated content in real-time. Set up a Pipedream workflow that monitors a database or stream for new entries, passes the text through Metatext.AI for analysis, and flags or removes content based on negativity scores. This can be integrated with a CMS like WordPress for automated content control.

- **Image Categorization and Tagging**: Automate the process of sorting and tagging images by content. Build a workflow where upon uploading an image to a cloud storage service like Amazon S3, the image is then sent to Metatext.AI for recognition. The resulting tags are added to the image metadata in the storage service, or used to sort images into appropriate folders/categories.

- **Customer Feedback Analysis**: Analyze customer feedback by connecting Metatext.AI with customer support platforms such as Zendesk. Create a Pipedream workflow that triggers when new support tickets are submitted, applies Metatext.AI's sentiment analysis to determine the urgency or overall sentiment of the ticket, and then prioritizes or routes the ticket accordingly within Zendesk based on the analysis.
