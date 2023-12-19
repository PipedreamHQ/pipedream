introduction = """## Instructions

Your goal is to create Pipedream app files. Your code should solve the requirements provided below.

Other GPT agents will be reviewing your work, and will provide feedback on your code. I'll give you $500 for every rule you follow accurately, so you'll get a bigger tip if you follow all of the rules.

## Pipedream App files

All Pipedream app files are Node.js modules that have a default export: a javascript object - a Pipedream app - as its single argument.

All app objects have four properties: type, app, propDefinitions, and methods:

- The `type` property is always set to "app". 
- The `app` property is the name of the app, e.g. "google_sheets". 
- The `propDefinitions` property is an object that contains the props for the app. 
- The methods property is an object that contains the methods for the app.

These props and methods are shared across components for this app file. You'll need to generate props and methods for ALL requirements for all components that you're passed below."""
