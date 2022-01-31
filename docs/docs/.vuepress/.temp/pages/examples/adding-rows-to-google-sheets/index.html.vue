<template><h1 id="example-add-rows-to-google-sheets" tabindex="-1"><a class="header-anchor" href="#example-add-rows-to-google-sheets" aria-hidden="true">#</a> Example: Add Rows to Google Sheets</h1>
<p>Here, you'll find examples of how to add your data to Google Sheets. Each example has a workflow you can copy, with sample Node.js code.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#end-to-end-example-with-sample-data">End-to-end example with sample data</RouterLink></li><li><RouterLink to="#add-data-from-the-http-payload-to-your-sheet">Add data from the HTTP payload to your sheet</RouterLink></li><li><RouterLink to="#add-multiple-rows-to-a-sheet">Add multiple rows to a sheet</RouterLink></li><li><RouterLink to="#changing-complex-data-to-the-row-format-expected-by-google-sheets">Changing complex data to the row format expected by Google Sheets</RouterLink></li></ul></nav>
<h2 id="end-to-end-example-with-sample-data" tabindex="-1"><a class="header-anchor" href="#end-to-end-example-with-sample-data" aria-hidden="true">#</a> End-to-end example with sample data</h2>
<p>The examples below use <a href="https://docs.google.com/spreadsheets/d/1lDCfU081VCB5Wi7eDYmV31o0Y0ZcmBpOu-JU0u7zync/edit#gid=0" target="_blank" rel="noopener noreferrer">this spreadsheet<ExternalLinkIcon/></a>.</p>
<div>
<img alt="Star Wars spreadsheet" width="300px" src="@source/examples/adding-rows-to-google-sheets/images/example-header.png">
</div>
<p>Each row added to the sheet has two columns - the <code>Name</code> and the <code>Title</code> of a Star Wars character. To add a row with the name &quot;Luke&quot; and the title &quot;Jedi&quot;, add the <strong>Add Single Row to Sheet</strong> step to your <a href="/workflows" target="_blank" rel="noopener noreferrer">workflow<ExternalLinkIcon/></a>:</p>
<ol>
<li>Click on the <strong>+</strong> button below any step</li>
<li>Select the <strong>Google Sheets</strong> app</li>
<li>Choose the <strong>Add Single Row to Sheet</strong> step</li>
</ol>
<div>
<img alt="Find the add row to sheet action" src="@source/examples/adding-rows-to-google-sheets/images/add-row-to-sheet-action.gif">
</div>
<p><a href="https://pipedream.com/@dylburger/google-sheets-example-add-row-to-google-sheets-with-hardcoded-data-p_G6C6ZBR/edit" target="_blank" rel="noopener noreferrer">See this workflow<ExternalLinkIcon/></a> for a finished example.</p>
<p><strong>To add your own data, you'll need to do four things</strong>:</p>
<ol>
<li>Click the <strong>Connect Google Sheets</strong> button and connect your Google Sheets account.</li>
<li>The <strong>Columns</strong> section is where you add your data. Each cell of data is placed in its own field in this section. In the <a href="https://pipedream.com/@dylburger/google-sheets-example-add-row-to-google-sheets-with-hardcoded-data-p_G6C6ZBR/edit" target="_blank" rel="noopener noreferrer">example workflow<ExternalLinkIcon/></a>, we added &quot;Luke&quot; in the first column. You can click the <strong>+</strong> button on the right to add another column:</li>
</ol>
<div>
<img alt="Add row data" src="@source/examples/adding-rows-to-google-sheets/images/add-row-data.gif">
</div>
<ol start="3">
<li>In the <strong>Spreadsheet ID</strong> field, enter the ID of your spreadsheet. You can find this in the URL. In the <a href="https://docs.google.com/spreadsheets/d/1lDCfU081VCB5Wi7eDYmV31o0Y0ZcmBpOu-JU0u7zync/edit#gid=0" target="_blank" rel="noopener noreferrer">example spreadsheet<ExternalLinkIcon/></a>, it's <code>1lDCfU081VCB5Wi7eDYmV31o0Y0ZcmBpOu-JU0u7zync</code>:</li>
</ol>
<div>
<img alt="Spreadsheet ID" src="@source/examples/adding-rows-to-google-sheets/images/star-wars-spreadsheet-id.png">
</div>
<ol start="4">
<li>In the <strong>Sheet Name</strong> field, enter the name of the specific sheet <em>within</em> your spreadsheet that you'd like to add data to. Sheet names are found at the bottom of your spreadsheet. By default, new spreadsheets have a single sheet named &quot;Sheet 1&quot;:</li>
</ol>
<div>
<img alt="Sheet Name" width="200px" src="@source/examples/adding-rows-to-google-sheets/images/sheet-name.png">
</div>
<p>The action should look like this when finished:</p>
<div>
<img alt="Finished action" src="@source/examples/adding-rows-to-google-sheets/images/finished-action.png">
</div>
<p>and you'll see this data in the spreadsheet:</p>
<div>
<img alt="Luke data" width="300px" src="@source/examples/adding-rows-to-google-sheets/images/luke-data.png">
</div>
<h2 id="add-data-from-the-http-payload-to-your-sheet" tabindex="-1"><a class="header-anchor" href="#add-data-from-the-http-payload-to-your-sheet" aria-hidden="true">#</a> Add data from the HTTP payload to your sheet</h2>
<p><em><a href="#end-to-end-example-with-sample-data">Read this section</a> for a general overview of how to add a row to a Google sheet</em>.</p>
<p>If you're using the HTTP trigger, you'll find your HTTP payload in the variable <code>event.body</code>. If you send this HTTP POST request:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> -d <span class="token string">'{ "name": "Luke", "title": "Jedi" }'</span> https://endpoint.m.pipedream.net
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>you'll see this data when <a href="/workflows/events/#examining-incoming-event-data" target="_blank" rel="noopener noreferrer">inspecting your event<ExternalLinkIcon/></a>:</p>
<div>
<img alt="Star Wars event data" width="300px" src="@source/examples/adding-rows-to-google-sheets/images/star-wars-event-data.png">
</div>
<p>You can access this data in your workflow at the variables <code>event.body.name</code> and <code>event.body.title</code>.</p>
<p><a href="#end-to-end-example-with-sample-data">Add the Add Single Row to Sheet action</a> to your workflow. In the <strong>Columns</strong> section, add <a href="/workflows/steps/params/#entering-expressions" target="_blank" rel="noopener noreferrer">references to those variables<ExternalLinkIcon/></a>, along with the Spreadsheet ID and Sheet Name of your spreadsheet:</p>
<div>
<img alt="Star Wars event data" width="300px" src="@source/examples/adding-rows-to-google-sheets/images/star-wars-name-title-column.png">
</div>
<p>Send the same HTTP request to your workflow, and you should see that data in your Google sheet:</p>
<div>
<img alt="Finished data" width="300px" src="@source/examples/adding-rows-to-google-sheets/images/luke-data.png">
</div>
<p>See <a href="https://pipedream.com/@dylburger/add-a-row-to-a-google-sheet-p_NMC9PbG/edit" target="_blank" rel="noopener noreferrer">this workflow<ExternalLinkIcon/></a> for a finished example.</p>
<h2 id="add-multiple-rows-to-a-sheet" tabindex="-1"><a class="header-anchor" href="#add-multiple-rows-to-a-sheet" aria-hidden="true">#</a> Add multiple rows to a sheet</h2>
<p><em><a href="#end-to-end-example-with-sample-data">Read this section</a> for an overview of the data used in this example</em>.</p>
<p>You can add multiple rows of data to a Google sheet at one time using the <strong>Add Multiple Rows to Sheet</strong> action:</p>
<ol>
<li>Click on the <strong>+</strong> button below any step</li>
<li>Select the <strong>Google Sheets</strong> app</li>
<li>Choose the <strong>Add Multiple Rows to Sheet</strong> step</li>
</ol>
<div>
<img alt="Find the add multiple rows to sheet action" src="@source/examples/adding-rows-to-google-sheets/images/add-multiple-rows-to-sheet.gif">
</div>
<p>Google Sheets <a href="https://developers.google.com/sheets/api/guides/values#writing_to_a_single_range" target="_blank" rel="noopener noreferrer">expects these rows to be arrays of data<ExternalLinkIcon/></a>. To add two rows of Star Wars characters to your sheet, the row data must look like this:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>[
  ["Luke", "Jedi"],
  ["Leia", "General"]
]
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p><a href="https://pipedream.com/@dylburger/google-sheets-add-multiple-rows-to-sheet-p_NMCr7R/edit" target="_blank" rel="noopener noreferrer">See this workflow<ExternalLinkIcon/></a> for an example of how to add this data to a Google sheet. The final data will look like this:</p>
<div>
<img alt="Luke Leia data" width="300px" src="@source/examples/adding-rows-to-google-sheets/images/luke-leia-data.png">
</div>
<h2 id="changing-complex-data-to-the-row-format-expected-by-google-sheets" tabindex="-1"><a class="header-anchor" href="#changing-complex-data-to-the-row-format-expected-by-google-sheets" aria-hidden="true">#</a> Changing complex data to the row format expected by Google Sheets</h2>
<p><em><a href="#end-to-end-example-with-sample-data">Read this section</a> for a general overview of how to add a row to a Google sheet</em>.</p>
<p>Often, you can add data to a new row just by referencing the correct variable in your workflow. For example, to <a href="#add-data-from-the-http-payload-to-your-sheet">store data from the HTTP payload</a> to Google Sheets, you can reference the variables directly <a href="/workflows/steps/params/" target="_blank" rel="noopener noreferrer">as params<ExternalLinkIcon/></a>:</p>
<div>
<img alt="Star Wars event data" width="300px" src="@source/examples/adding-rows-to-google-sheets/images/star-wars-name-title-column.png">
</div>
<p>However, your event data might contain a more complex structure that you can't directly reference in params. For example, if your data looks like this:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span> <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"Luke"</span><span class="token punctuation">,</span> <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"Jedi"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span> <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"Leia"</span><span class="token punctuation">,</span> <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"General"</span> <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>and you want to write the <code>name</code> and <code>title</code> within each object to Google Sheets:</p>
<div>
<img alt="Luke Leia data" width="300px" src="@source/examples/adding-rows-to-google-sheets/images/luke-leia-data.png">
</div>
<p>You'll have to write <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer">Node.js code<ExternalLinkIcon/></a> to change that data into the <a href="https://developers.google.com/sheets/api/guides/values#writing_to_a_single_range" target="_blank" rel="noopener noreferrer">format that Google expects<ExternalLinkIcon/></a>:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>[
  ["Luke", "Jedi"],
  ["Leia", "General"]
]
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p><a href="https://pipedream.com/@dylburger/google-sheets-format-array-of-objects-into-array-of-arrays-p_brCL7BK/edit" target="_blank" rel="noopener noreferrer">This workflow shows you how to do that<ExternalLinkIcon/></a>:</p>
<ol>
<li><code>steps.sample_data</code> returns sample data.</li>
<li><code>steps.format_data</code> modifies that data into the format that Google expects:</li>
</ol>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">return</span> steps<span class="token punctuation">.</span>sample_data<span class="token punctuation">.</span>$return_value<span class="token punctuation">.</span>data<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">character</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">[</span>
  character<span class="token punctuation">.</span>name<span class="token punctuation">,</span>
  character<span class="token punctuation">.</span>title<span class="token punctuation">,</span>
<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><ol start="3">
<li>In the <strong>Add Multiple Rows to Sheet</strong> step, you can reference the data from the <code>steps.format_data</code> step by turning structured mode <code>off</code> and selecting the data in the object explorer:</li>
</ol>
<div>
<img alt="Reference array from previous step" src="@source/examples/adding-rows-to-google-sheets/images/reference-array-from-previous-step.gif">
</div>
<Footer />
</template>
