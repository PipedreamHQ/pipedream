# Overview

OpenAI provides a suite of powerful AI models through its API, enabling developers to integrate advanced natural language processing and generative capabilities into their applications. Here’s an overview of the services offered by OpenAI's API:

- [Text generation](https://platform.openai.com/docs/guides/text-generation)
- [Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
- [Image Generation](https://platform.openai.com/docs/guides/images?context=node)
- [Vision](https://platform.openai.com/docs/guides/vision)
- [Text-to-Speech](https://platform.openai.com/docs/guides/text-to-speech)
- [Speech-to-Text](https://platform.openai.com/docs/guides/speech-to-text)

Use Python or Node.js code to make fully authenticated API requests with your OpenAI account:

# Example Use Cases

The OpenAI API can be leveraged in a wide range of business contexts to drive efficiency, enhance customer experiences, and innovate product offerings. Here are some specific business use cases for utilizing the OpenAI API:

### **Customer Support Automation**

Significantly reduce response times and free up human agents to tackle more complex issues by automating customer support ticket responses.

### **Content Creation and Management**

Utilize AI to generate high-quality content for blogs, articles, product descriptions, and marketing material. 

### **Personalized Marketing and Advertising**

Optimize advertising copy and layouts based on user interaction data with a trained model via the Fine Tuning API.

### **Language Translation and Localization**

Use ChatGPT to translate and localize content across multiple languages, expanding your market reach without the need for extensive translation teams.

# Getting Started

First, sign up for an OpenAI account, then in a new workflow step open the OpenAI app:

![Screenshot highlighting the OpenAI (ChatGPT) app selected in the Pipedream workflow automation interface, with a red arrow pointing to the OpenAI option in the sidebar app list.](https://res.cloudinary.com/pipedreamin/image/upload/v1713464578/marketplace/apps/openai/CleanShot_2024-04-18_at_14.22.30_guc5ri.png)

Then select one of the Pre-built actions, or choose to use Node.js or Python:

![Interface showing a list of OpenAI (ChatGPT) actions available in Pipedream, including options for building API requests, using the API in Node.js and Python, and pre-built actions like Chat, Summarize Text, and Create Image (DALL-E).](https://res.cloudinary.com/pipedreamin/image/upload/v1713464768/marketplace/apps/openai/CleanShot_2024-04-18_at_14.25.46_akse9e.png)

Then connect your OpenAI account to Pipedream. Open the [API keys section](https://platform.openai.com/api-keys) in the OpenAI dashboard.

Then select **Create a new secret key:**

![Screenshot of the OpenAI API keys management page with a red arrow pointing to the 'Create new secret key' button for generating new API keys.](https://res.cloudinary.com/pipedreamin/image/upload/v1713464913/marketplace/apps/openai/CleanShot_2024-04-18_at_14.28.03_lw0pbw.png)

Name the key `Pipedream` and then save the API key within Pipedream. Now you’re all set to use pre-built actions like `Chat` or use your OpenAI API key directly in Node.js or Python code.

# Troubleshooting

## 401 - Invalid Authentication

---

Ensure the correct [API key](https://platform.openai.com/account/api-keys) and requesting organization are being used.

## 401 - Incorrect API key provided

---

Ensure the API key used is correct or [generate a new one](https://platform.openai.com/account/api-keys) and then reconnect it to Pipedream.

## 401 - You must be a member of an organization to use the API

Contact OpenAI to get added to a new organization or ask your organization manager to [invite you to an organization](https://platform.openai.com/account/team).

## 403 - Country, region, or territory not supported

You are accessing the API from an unsupported country, region, or territory.

## 429 - Rate limit reached for requests

---

You are sending requests too quickly. Pace your requests. Read the OpenAI [Rate limit guide](https://platform.openai.com/docs/guides/rate-limits). Use [Pipedream Concurrency and Throttling](https://pipedream.com/docs/workflows/concurrency-and-throttling) settings to control the frequency of API calls to OpenAI.

## 429 - You exceeded your current quota, please check your plan and billing details

You have run out of OpenAI credits or hit your maximum monthly spend. [Buy more OpenAI credits](https://platform.openai.com/account/billing) or learn how to [increase your OpenAI account limits](https://platform.openai.com/account/limits).

## 500 - The server had an error while processing your request

Retry your request after a brief wait and contact us if the issue persists. Check the [OpenAI status page](https://status.openai.com/).

## 503 - The engine is currently overloaded, please try again later

OpenAI’s servers are experiencing high amounts of traffic. Please retry your requests after a brief wait.
