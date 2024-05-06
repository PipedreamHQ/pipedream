# Overview

With the Google Vertex AI API, you can tap into a robust suite of AI tools offered by Google Cloud to build, deploy, and scale machine learning models. Whether you're processing data, training custom models, or using pre-trained ones, Vertex AI provides a unified platform for AI development. In Pipedream, you can create serverless workflows that interact with Vertex AI, allowing you to automate tasks like model training, prediction, and resource management without provisioning your own infrastructure.

# Example Use Cases

- **Automate Machine Learning Workflows**: Trigger a Pipedream workflow to automatically train a Vertex AI model with new data by connecting to a data source like Google Cloud Storage. Once training is complete, you can deploy the model to an endpoint and notify your team via Slack.

- **Process Data with Vertex AI Pipelines**: Integrate Vertex AI with Pipedream's cron scheduler to run preprocessing jobs on datasets at set intervals. Use the results to update models, perform feature engineering, or push insights to a Google Sheets spreadsheet for easy analysis and reporting.

- **Real-time Predictions with Event Triggers**: Set up a webhook in Pipedream to receive real-time data from a source app like Stripe for transaction fraud detection. Pass the data to Vertex AI for prediction and, based on the response, trigger an automated action, such as flagging the transaction, or emailing a summary report using SendGrid.
