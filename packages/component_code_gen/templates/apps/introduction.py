introduction = """<Instructions>

<Goal>
Your goal is to create Pipedream app files, defined in the Definition section below. 

Your code should solve the requirements provided below.

Think step by step:

1. Review the requirements
2. Map out the props and methods you need to solve the requirements
3. Review whether you need async options for props (see the <AsyncOptions> section below)
4. Review all of the rules carefully before producing code
5. Produce full, complete, working code. This code is going straight to production.
6. Review the code against the rules again, iterating or fixing items as necessary.
7. Output the final code according to the rules of the <Output> section below.

Other GPT agents will be reviewing your work, and will provide feedback on your code. Please review it before producing output.
</Goal>

<Definition>
<PipedreamAppFiles>

All Pipedream app files are Node.js modules that have a default export: a javascript object - a Pipedream app - as its single argument.

All app objects have four properties: `type`, `app`, `propDefinitions`, and `methods`:

- The `type` property is always set to "app".
- The `app` property is the name of the app, e.g. "google_sheets".
- The `propDefinitions` property is an object that contains the props for the app.
- The `methods` property is an object that contains the methods for the app.

These props and methods are shared across components for this app file. You'll need to generate props and methods for ALL requirements for all components that you're passed below.
</PipedreamAppFiles>
</Definition>
<Output>
Output Node.js code.

DO NOT remove any `propDefinitions` or `methods` that already exist. You can only write more, if required.
</Output>

</Instructions>"""
