<template><h1 id="insert-data-into-google-sheets" tabindex="-1"><a class="header-anchor" href="#insert-data-into-google-sheets" aria-hidden="true">#</a> Insert data into Google Sheets</h1>
<p>Next, let's transform data returned by the ISS API and save it to Google Sheets. This example builds on the workflow created in <a href="/quickstart/" target="_blank" rel="noopener noreferrer">previous sections<ExternalLinkIcon/></a> and will cover how to:</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#set-up-a-google-sheet-for-this-example">Set up a Google Sheet for this example</RouterLink></li><li><RouterLink to="#transform-a-timestamp-using-the-luxon-npm-package">Transform a timestamp using the luxon npm package</RouterLink></li><li><RouterLink to="#connect-an-account-to-use-an-action">Connect an account to use an action</RouterLink></li><li><RouterLink to="#pass-exports-from-a-previous-step-to-an-action">Pass exports from a previous step to an action</RouterLink></li></ul></nav>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>If you didn't complete the previous examples, we recommend you start from the <a href="/quickstart/" target="_blank" rel="noopener noreferrer">beginning of this guide<ExternalLinkIcon/></a>. If you still want to start here, <a href="https://pipedream.com/@gettingstarted/quickstart-use-any-npm-package-p_pWCg5BP" target="_blank" rel="noopener noreferrer">copy this workflow<ExternalLinkIcon/></a> and then follow the instructions below. If you have any issues completing this example, you can <a href="https://pipedream.com/@gettingstarted/quickstart-insert-data-into-google-sheets-p_KwCAR9z" target="_blank" rel="noopener noreferrer">view, copy and run a completed version<ExternalLinkIcon/></a>.</p>
</div>
<h3 id="set-up-a-google-sheet-for-this-example" tabindex="-1"><a class="header-anchor" href="#set-up-a-google-sheet-for-this-example" aria-hidden="true">#</a> Set up a Google Sheet for this example</h3>
<p>First, create a Google Sheet with the columns <code>Latitude</code>, <code>Longitude</code>, <code>Timestamp</code>, and <code>Date/Time</code> in the first row (or make a copy of <a href="https://docs.google.com/spreadsheets/d/1ArKQhQ6EO1uaDZ2WyIU-aMBMQnsJXU9TbKIvFM_q1dY/edit" target="_blank" rel="noopener noreferrer">our sample Google Sheet<ExternalLinkIcon/></a>):</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210517195215566.png" alt="image-20210517195215566"></p>
<h3 id="transform-a-timestamp-using-the-luxon-npm-package" tabindex="-1"><a class="header-anchor" href="#transform-a-timestamp-using-the-luxon-npm-package" aria-hidden="true">#</a> Transform a timestamp using the <code>luxon</code> npm package</h3>
<p>Next, select a recent event and inspect the exports for <code>steps.get_iss_position</code>. We can see that the <code>timestamp</code> field returned by the API is not a friendly, human-readable date/time:</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525181359535.png" alt="image-20210525181359535"></p>
<p>Let's fix that by using the <code>luxon</code> npm package to transform the timestamp into a value that is human-readable — and one that Google Sheets will interpret as a date/time. Based on a quick Google Search, the date/time format expected by Google Sheets is <code>yyyy-MM-dd HH:mm:ss</code>.</p>
<p>Click the <strong>+</strong> button to add a new step after <code>steps.get_iss_position</code> and select <strong>Run Node.js code</strong>.</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525181449209.png" alt="image-20210525181449209"></p>
<p>Then add the following code to convert the timestamp to a Google Sheets compatible date/time and export it from the code step:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> DateTime <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'luxon'</span><span class="token punctuation">;</span>

<span class="token keyword">return</span> DateTime<span class="token punctuation">.</span><span class="token function">fromSeconds</span><span class="token punctuation">(</span>steps<span class="token punctuation">.</span>get_iss_position<span class="token punctuation">.</span>$return_value<span class="token punctuation">.</span>timestamp<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toFormat</span><span class="token punctuation">(</span><span class="token string">'yyyy-MM-dd HH:mm:ss'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>Then update the name of the code step to <code>steps.format_datetime</code>:</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525181543435.png" alt="image-20210525181543435"></p>
<p><strong>Deploy</strong> and test your changes (load the endpoint URL or use the <strong>Send Test Event</strong> button).</p>
<p>Next, select the most recent event. You should see a human-readable date/time as the return value for <code>steps.format_datetime</code> (in GMT).</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525181704209.png" alt="image-20210525181704209"></p>
<h3 id="connect-an-account-to-use-an-action" tabindex="-1"><a class="header-anchor" href="#connect-an-account-to-use-an-action" aria-hidden="true">#</a> Connect an account to use an action</h3>
<p>Next, click the <strong>+</strong> button to add a new step after <code>steps.format_datetime</code> and select the <strong>Google Sheets</strong> app:</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525181736082.png" alt="image-20210525181736082"></p>
<p>Then select the <strong>Add Single Row</strong> action:</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525181801075.png" alt="image-20210525181801075"></p>
<p>To configure the step, first click on <strong>Connect Google Sheets</strong> (or select an account if you've previously connected one).</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525181917662.png" alt="image-20210525181917662"></p>
<p>When you click on <strong>Connect Google Sheets</strong> Pipedream will open a popup window where you can sign in to connect your account. When prompted by Google, click <strong>Allow</strong>:</p>
<img src="@source/quickstart/add-data-to-google-sheets/images/image-20210517181653424.png" alt="image-20210517181653424" style="zoom:25%;" />
<p>After you connect your account, Pipedream will securely store an authorization token that you can use in actions and code steps to authenticate API requests for Google Sheets (we'll cover how to use this token in code steps later in this guide).</p>
<p>Then select your <strong>Drive</strong>, <strong>Spreadsheet</strong> and <strong>Sheet Name</strong> from the drop down menus.</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525182234399.png" alt="image-20210525182234399"></p>
<h3 id="pass-exports-from-a-previous-step-to-an-action" tabindex="-1"><a class="header-anchor" href="#pass-exports-from-a-previous-step-to-an-action" aria-hidden="true">#</a> Pass exports from a previous step to an action</h3>
<p>Next, let's configure the cells / column values using exports from previous steps.</p>
<p>First, let's use the object explorer to select a value. The object explorer is automatically loaded whenever you focus in an action input. You can expand any item and then select the reference you want to insert.</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525182314235.png" alt="image-20210525182314235"></p>
<p>Another option is to explore the exports for a step and click on the <strong>Copy Path</strong> link. Then paste the reference into the action input.</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525182402438.png" alt="image-20210525182402438"></p>
<p>The final option is to use autocomplete — add double braces <code v-pre>{{ }}</code> and start typing between them to get autocomplete the same way you do in code steps.</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/autocomplete.gif" alt="autocomplete"></p>
<p>Since we want to add four columns of data with the latitude, longitude, timestamp and the formatted date time (in that order), add the following references to the <strong>Cells / Column Values</strong> inputs:</p>
<p><strong>[0]:</strong> <code v-pre>{{steps.get_iss_position.$return_value.iss_position.latitude}}</code></p>
<p><strong>[1]:</strong> <code v-pre>{{steps.get_iss_position.$return_value.iss_position.longitude}}</code></p>
<p><strong>[2]:</strong> <code v-pre>{{steps.get_iss_position.$return_value.timestamp}}</code></p>
<p><strong>[3]:</strong> <code v-pre>{{steps.format_datetime.$return_value}}</code></p>
<p>Your fully configured step should look similar to this:</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525183257888.png" alt="image-20210525183257888"></p>
<p>Next, <strong>Deploy</strong> your changes and reload the endpoint URL in your browser.</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/reload-iss-sheets.gif" alt="reload-iss-sheets"></p>
<p>When you check the workflow, you should see exports from the add row to sheets step:</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525183834078.png" alt="image-20210525183834078"></p>
<p>Finally, when you check Google Sheet you should see data about the ISS position.</p>
<p><img src="@source/quickstart/add-data-to-google-sheets/images/image-20210525184058476.png" alt="image-20210525184058476"></p>
<p><strong>If you loaded the URL in your web browser, you'll actually see two events. We'll fix that in the next example.</strong></p>
<p style="text-align:center;">
<a :href="$withBase('/quickstart/end-workflow-early/')"><img src="@source/quickstart/next.png"></a>
</p>
</template>
