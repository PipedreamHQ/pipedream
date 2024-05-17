# Overview

The Nyckel API offers machine learning capabilities, enabling you to add custom image and text classification to your applications without needing a data science background. With Nyckel, you can train models, make predictions, and refine your model iteratively as new data comes in. On Pipedream, you can integrate Nyckel to automate various tasks such as processing images uploaded to cloud storage, categorizing customer support tickets, or augmenting content moderation workflows. By harnessing the power of serverless on Pipedream, you can create efficient pipelines that respond in real-time to events, without managing infrastructure.

# Example Use Cases

- **Automated Image Sorting**: Trigger a Pipedream workflow whenever new images are uploaded to an S3 bucket. Use the Nyckel API to classify the images and then route them to different folders based on the prediction results. This can streamline the organization of visual content and support automated image-based processes.

- **Content Moderation Automation**: Integrate Nyckel with social media platforms like Twitter. Whenever a new post is detected, evaluate the content using Nyckel’s text classification to detect potentially harmful or inappropriate content. Use this output to automatically flag or remove posts, ensuring a safer online environment.

- **Customer Inquiry Categorization**: Connect your email platform to Pipedream and use Nyckel API to analyze and categorize incoming customer support emails. Based on the classification, you can automatically route messages to the appropriate department or flag high-priority issues, enhancing customer service efficiency.
