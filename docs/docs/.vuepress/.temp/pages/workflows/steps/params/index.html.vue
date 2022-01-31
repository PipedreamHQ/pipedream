<template><h1 id="params" tabindex="-1"><a class="header-anchor" href="#params" aria-hidden="true">#</a> Params</h1>
<p>Params are form inputs that can be added to code steps in a workflow to abstract data from the code and improve reusability. Most actions use params to capture user input (e.g., to allow users to customize the URL, method and payload for the Send HTTP Request action). Params support the entry of simple values (e.g., <code>hello world</code> or <code>123</code>) or expressions in <code v-pre>{{...}}</code> that can reference objects in scope (e.g., <code v-pre>{{event.foo}}</code>) or run basic Node code (e.g., <code v-pre>{{JSON.stringify(event.foo)}}</code>).</p>
<iframe width="560" height="350" src="https://www.youtube.com/embed/6eq813uEExc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<ul>
<li><a href="#entering-expressions">Entering Expressions</a>
<ul>
<li><a href="#use-the-object-explorer">Use the object explorer</a></li>
<li><a href="#manually-enter-or-edit-an-expression">Manually enter or edit an expression</a></li>
<li><a href="#paste-a-reference-from-a-step-export">Paste a reference from a step export</a></li>
</ul>
</li>
<li><a href="#params-types">Params Types</a>
<ul>
<li><a href="#basic-params">Basic Params</a></li>
<li><a href="#structured-params">Structured Params</a></li>
</ul>
</li>
<li><a href="#sharing-params-values-in-workflow-templates">Sharing Params Values in Workflow Templates</a></li>
<li><a href="#configuring-custom-params">Configuring Custom Params</a>
<ul>
<li><a href="#adding-params-to-a-code-step">Adding params to a code step</a></li>
<li><a href="#configuring-the-params-form">Configuring the params form</a></li>
</ul>
</li>
</ul>
<h2 id="entering-expressions" tabindex="-1"><a class="header-anchor" href="#entering-expressions" aria-hidden="true">#</a> Entering Expressions</h2>
<p>Expressions make it easy to pass data exported from previous steps into a code step or action via params. For example, if your workflow is triggered on new Tweets and you want to send the Tweet content to an HTTP or webhook destination, you would reference <code v-pre>{{event.full_text}}</code> to do that.</p>
<p>While the data expected by each input depends on the data type (e.g., string, integer, array, etc) and the data entry mode (structured or non-structured — if applicable), the format for entering expressions is always the same; expressions are always enclosed in <code v-pre>{{...}}</code>.</p>
<p>There are three ways to enter expressions in a params form — you can use the object explorer, enter it manually, or paste a reference from a step export.</p>
<h3 id="use-the-object-explorer" tabindex="-1"><a class="header-anchor" href="#use-the-object-explorer" aria-hidden="true">#</a> Use the object explorer</h3>
<p>When you click into a params input, an object explorer expands below the input. You can explore all the objects in scope, filter for keywords (e.g., a key name), and then select the element to insert into the form as an expression.</p>
<p><img src="@source/workflows/steps/params/images/params-object-explorer.gif" alt="img"></p>
<h3 id="manually-enter-or-edit-an-expression" tabindex="-1"><a class="header-anchor" href="#manually-enter-or-edit-an-expression" aria-hidden="true">#</a> Manually enter or edit an expression</h3>
<p>To manually enter or edit an expression, just enter or edit a value between double curly braces <code v-pre>{{...}}</code>. Pipedream provides auto-complete support as soon as you type <code v-pre>{{</code>.</p>
<p><img src="@source/workflows/steps/params/images/params-autocomplete-7031289.gif" alt="img"></p>
<p>You can also run Node.js code in <code v-pre>{{...}}</code>. For example, if <code>event.foo</code> is a JSON object and you want to pass it to a param as a string, you can run <code v-pre>{{JSON.stringify(event.foo)}}</code>.</p>
<h3 id="paste-a-reference-from-a-step-export" tabindex="-1"><a class="header-anchor" href="#paste-a-reference-from-a-step-export" aria-hidden="true">#</a> Paste a reference from a step export</h3>
<p>To paste a reference from a step export, find the reference you want to use, click <strong>Copy Path</strong> and then paste it into the input.</p>
<p><img src="@source/workflows/steps/params/images/params-paste-7031315.gif" alt="img"></p>
<h2 id="params-types" tabindex="-1"><a class="header-anchor" href="#params-types" aria-hidden="true">#</a> Params Types</h2>
<h3 id="basic-params" tabindex="-1"><a class="header-anchor" href="#basic-params" aria-hidden="true">#</a> Basic Params</h3>
<p>Basic params support simple values or, expressions in <code v-pre>{{...}}</code>. You can enter expressions by copying the path from step observability, using the object explorer below the params input, or by manually entering a value within <code v-pre>{{...}}</code> (Pipedream provides auto-complete for the objects in scope, but you can also enter a value that is not supported by auto-complete).</p>
<table>
<thead>
<tr>
<th>Type</th>
<th>Structured</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>String</strong></td>
<td>This is the default type for newly added params. You can enter a simple value (e.g., <code>hello world</code>), an expression that evaluates to a string in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{JSON.stringify(event.object)}}</code>), or select a reference from the object explorer. You can also combine simple values and multiple expressions in the same input  (e.g., <code v-pre>hello world {{event.foo}}</code>).</td>
</tr>
<tr>
<td><strong>Number</strong></td>
<td>You can enter a simple value (e.g., <code>123</code>), an expression that evaluates to a number in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{1+1}}</code>), or select a reference from the object explorer.</td>
</tr>
<tr>
<td><strong>Integer</strong></td>
<td>You can enter a simple value (e.g., <code>123</code>), an expression that evaluates to an integer in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{1+1}}</code>), or select a reference from the object explorer.</td>
</tr>
</tbody>
</table>
<h3 id="structured-params" tabindex="-1"><a class="header-anchor" href="#structured-params" aria-hidden="true">#</a> Structured Params</h3>
<p>Structured params provide a guided approach to enter values expected for a specific input. You can turn off structured mode at any time to enter an expression for the the param.</p>
<p><img src="@source/workflows/steps/params/images/params-nonstructured-7033441.gif" alt="img"></p>
<table>
<thead>
<tr>
<th>Type</th>
<th>Structured</th>
<th>Non-Structured</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Enum</strong></td>
<td>Select a value from the drop down menu.</td>
<td>This is the default type for newly added params. You can enter a simple value (e.g., <code>hello world</code>), an expression that evaluates to a string in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{JSON.stringify(event.object)}}</code>), or select a reference from the object explorer. You can also combine simple values and multiple expressions in the same input  (e.g., <code v-pre>hello world {{event.foo}}</code>).</td>
</tr>
<tr>
<td><strong>Boolean</strong></td>
<td>Select a value from the drop down menu.</td>
<td>Enter an expression that evaluates to a boolean value in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{true}}</code>)</td>
</tr>
<tr>
<td><strong>Array</strong></td>
<td>Enter values for each array element. To add more array elements, click the <strong>+</strong> button at the right. Enter simple values (e.g., <code>hello world</code>), expressions <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code>), or select references from the object explorer.</td>
<td>Enter an expression that evaluates to an array in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{[1,2,3]}}</code>).</td>
</tr>
<tr>
<td><strong>Object</strong></td>
<td>Enter a key and corresponding value. To add more key-value pairs, click the <strong>+</strong> button at the right. Enter simple values (e.g., <code>hello world</code>), expressions <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code>), or select references from the object explorer.</td>
<td>Enter an expression that evaluates to an object in <code v-pre>{{...}}</code> (e.g., <code v-pre>{{event.foo}}</code> or <code v-pre>{{{&quot;foo&quot;:&quot;bar&quot;}}}</code>).</td>
</tr>
</tbody>
</table>
<h2 id="sharing-params-values-in-workflow-templates" tabindex="-1"><a class="header-anchor" href="#sharing-params-values-in-workflow-templates" aria-hidden="true">#</a> Sharing Params Values in Workflow Templates</h2>
<p>By default, any data you enter in a params form is private to workflow editors. If you are sharing a workflow and want specific values to be copied with the workflow then you should toggle the visibility for those params to <strong>public</strong> by clicking the &quot;eye&quot; icon at the far right. A common use case for this is to make params with expressions referencing earlier step exports public. Be sure not to make params public that contain sensitive data.</p>
<p><img src="@source/workflows/steps/params/images/params-visibility.gif" alt="img"></p>
<h2 id="configuring-custom-params" tabindex="-1"><a class="header-anchor" href="#configuring-custom-params" aria-hidden="true">#</a> Configuring Custom Params</h2>
<h3 id="adding-params-to-a-code-step" tabindex="-1"><a class="header-anchor" href="#adding-params-to-a-code-step" aria-hidden="true">#</a> Adding params to a code step</h3>
<p>To add a params input to a code step, just use <code>params.&lt;variable-name&gt;</code> in your code. A form element will automatically be generated. E.g., try adding the following line to a code step:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>params<span class="token punctuation">.</span>url<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Note: in some cases you may need to save your workflow for the form to generate.</p>
<p>You'll see this field appear no matter how the property is referenced in code. For example, you can <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring" target="_blank" rel="noopener noreferrer">destructure properties<ExternalLinkIcon/></a> of params and we'll correctly display the associated field. E.g., the following code will generate the same params form and behavior as the example above:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> url <span class="token punctuation">}</span> <span class="token operator">=</span> params
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><blockquote>
<p>Reminder: Workflow code is <a href="/public-workflows/" target="_blank" rel="noopener noreferrer">public<ExternalLinkIcon/></a> by default, so use params or environment variables for sensitive data. Alternatively, you can make your workflow code private.</p>
</blockquote>
<h3 id="configuring-the-params-form" tabindex="-1"><a class="header-anchor" href="#configuring-the-params-form" aria-hidden="true">#</a> Configuring the params form</h3>
<p>To configure the params form, click <strong>edit params schema</strong>.</p>
<p><img src="@source/workflows/steps/params/images/image-20200809172300069.png" alt="image-20200809172300069"></p>
<p>You will be presented with options to customize the label, data type, description, required vs optional setting, and more.</p>
<p><img src="@source/workflows/steps/params/images/image-20200809172609616.png" alt="image-20200809172609616"></p>
</template>
