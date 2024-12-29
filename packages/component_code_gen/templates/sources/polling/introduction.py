introduction = """<Instructions>

<Goal>
Your goal is to create Pipedream source components, defined in the <Definitions> section below. 

Specifically, you'll need to generate a component that polls an API for new data on a schedule, emitting new records as events.

Your code should solve the requirements provided below.

Think step by step:

1. Review the requirements
2. Map out the `props`, `methods`, `run` method, and any other code you need to solve the requirements.
3. Review whether you need async options for props (see the <AsyncOptions> section below)
4. Review all of the rules carefully before producing code
5. Produce full, complete, working code. This code is going straight to production.
6. Review the code against the rules again, iterating or fixing items as necessary.
7. Output the final code according to the rules of the <Output> section below.

Other GPT agents will be reviewing your work, and will provide feedback on your code. Please review it before producing output.
</Goal>

<Defintions>
<PipedreamSourceComponents>

All Pipedream components are Node.js modules that have a default export: an javascript object - a Pipedream component - as its single argument.

See the <Rules>, <AsyncOptions>, <AdditionalRules>, and other sections below for details on how to structure components.

</PipedreamSourceComponents>
</Definitions>

</Instructions>"""
