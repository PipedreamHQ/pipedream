<template><h1 id="bash" tabindex="-1"><a class="header-anchor" href="#bash" aria-hidden="true">#</a> Bash</h1>
<p>Prefer to write quick scripts in Bash? We've got you covered.</p>
<p>You can run any Bash in a Pipedream step within your workflows.</p>
<div class="custom-container warning"><p class="custom-container-title">WARNING</p>
<p>Bash steps are available in a limited alpha release.</p>
<p>You can still run arbitrary Bash scripts, including <a href="/code/bash/#sharing-data-between-steps" target="_blank" rel="noopener noreferrer">sharing data between steps<ExternalLinkIcon/></a> as well as <a href="/code/bash/#using-environment-variables" target="_blank" rel="noopener noreferrer">accessing environment variables<ExternalLinkIcon/></a>.</p>
<p>However, you can't connect accounts, return HTTP responses, or take advantage of other features available in the <a href="/code/nodejs" target="_blank" rel="noopener noreferrer">Node.js<ExternalLinkIcon/></a> environment at this time. If you have any questions, find bugs or have feedback please <a href="https://pipedream.com/support" target="_blank" rel="noopener noreferrer">contact support<ExternalLinkIcon/></a>.</p>
</div>
<h2 id="adding-a-bash-code-step" tabindex="-1"><a class="header-anchor" href="#adding-a-bash-code-step" aria-hidden="true">#</a> Adding a Bash code step</h2>
<ol>
<li>Click the + icon to add a new step</li>
<li>Click <strong>Custom Code</strong></li>
<li>In the new step, select the <code>bash</code> runtime in language dropdown</li>
</ol>
<h2 id="logging-and-debugging" tabindex="-1"><a class="header-anchor" href="#logging-and-debugging" aria-hidden="true">#</a> Logging and debugging</h2>
<p>When it comes to debugging Bash scripts, <code>echo</code> is your friend.</p>
<p>Your <code>echo</code> statements will print their output in the workflow step results:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token assign-left variable">MESSAGE</span><span class="token operator">=</span><span class="token string">'Hello world'</span>

<span class="token comment"># The message will now be available in the "Result > Logs" area in the workflow step</span>
<span class="token builtin class-name">echo</span> <span class="token variable">$MESSAGE</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="available-binaries" tabindex="-1"><a class="header-anchor" href="#available-binaries" aria-hidden="true">#</a> Available binaries</h2>
<p>Bash steps come with many common and useful binaries preinstalled and available in <code>$PATH</code> for you to use out of the box. These binaries include but aren't limited to:</p>
<ul>
<li><code>curl</code> for making HTTP requests</li>
<li><code>jq</code> for manipulating and viewing JSON data</li>
<li><code>git</code> for interacting with remote repositories</li>
</ul>
<p>Unfortunately it is not possible to install packages from a package manager like <code>apt</code> or <code>yum</code>.</p>
<p>If you need a package pre-installed in your Bash steps, <a href="https://pipedream.com/support" target="_blank" rel="noopener noreferrer">just ask us<ExternalLinkIcon/></a>.</p>
<p>Otherwise, you can use the <code>/tmp</code> directory to download and install software from source.</p>
<h2 id="making-an-http-request" tabindex="-1"><a class="header-anchor" href="#making-an-http-request" aria-hidden="true">#</a> Making an HTTP request</h2>
<p><code>curl</code> is already preinstalled in Bash steps, we recommend using it for making HTTP requests in your code for sending or requesting data from APIs or webpages.</p>
<h3 id="making-a-get-request" tabindex="-1"><a class="header-anchor" href="#making-a-get-request" aria-hidden="true">#</a> Making a <code>GET</code> request</h3>
<p>You can use <code>curl</code> to perform <code>GET</code> requests from websites or APIs directly.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># Get the current weather in San Francisco</span>
<span class="token assign-left variable">WEATHER</span><span class="token operator">=</span><span class="token variable"><span class="token variable">`</span><span class="token function">curl</span> --silent https://wttr.in/San<span class="token punctuation">\</span> Francisco<span class="token punctuation">\</span>?format<span class="token operator">=</span><span class="token number">3</span><span class="token variable">`</span></span>

<span class="token builtin class-name">echo</span> <span class="token variable">$WEATHER</span>
<span class="token comment"># Produces:</span>
<span class="token comment"># San Francisco: 🌫  +48°F</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>Use the <code>--silent</code> flag with <code>curl</code> to suppress extra extra diagnostic information that <code>curl</code> produces when making requests.</p>
<p>This enables you to only worry about the body of the response so you can visualize it with tools like <code>echo</code> or <code>jq</code>.</p>
</div>
<h3 id="making-a-post-request" tabindex="-1"><a class="header-anchor" href="#making-a-post-request" aria-hidden="true">#</a> Making a <code>POST</code> request</h3>
<p><code>curl</code> can also make <code>POST</code>s requests as well. The <code>-X</code> flag allow you to specify the HTTP method you'd like to use for an HTTP request.</p>
<p>The <code>-d</code> flag is for passing data in the <code>POST</code> request.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> --silent -X POST https://postman-echo.com/post -d <span class="token string">'name=Bulbasaur&amp;id=1'</span>

<span class="token comment"># To store the API response in a variable, interpolate the response into a string and store it in variable</span>
<span class="token assign-left variable">RESPONSE</span><span class="token operator">=</span><span class="token variable"><span class="token variable">`</span><span class="token function">curl</span> --silent -X POST https://postman-echo.com/post -d <span class="token string">'name=Bulbasaur&amp;id=1'</span><span class="token variable">`</span></span>

<span class="token comment"># Now the response is stored as a variable</span>
<span class="token builtin class-name">echo</span> <span class="token variable">$RESPONSE</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h3 id="using-api-key-authentication" tabindex="-1"><a class="header-anchor" href="#using-api-key-authentication" aria-hidden="true">#</a> Using API key authentication</h3>
<p>Some APIs require you to authenticate with a secret API key.</p>
<p><code>curl</code> has an <code>-h</code> flag where you can pass your API key as a token.</p>
<p>For example, here's how to retrieve mentions from the Twitter API:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># Define the "Authorization" header to include your Twitter API key</span>
<span class="token function">curl</span> --silent -X POST -h <span class="token string">"Authorization: Bearer <span class="token variable"><span class="token variable">$(</span><span class="token operator">&lt;</span>your api key here<span class="token operator">></span><span class="token variable">)</span></span>"</span> https://api.twitter.com/2/users/@pipedream/mentions
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="sharing-data-between-steps" tabindex="-1"><a class="header-anchor" href="#sharing-data-between-steps" aria-hidden="true">#</a> Sharing data between steps</h2>
<p>A step can accept data from other steps in the same workflow, or pass data downstream to others.</p>
<h3 id="using-data-from-another-step" tabindex="-1"><a class="header-anchor" href="#using-data-from-another-step" aria-hidden="true">#</a> Using data from another step</h3>
<p>In Bash steps, data from the initial workflow trigger and other steps are available in the <code>$PIPEDREAM_STEPS</code> environment variable.</p>
<p>In this example, we'll pretend this data is coming into our HTTP trigger via a POST request.</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"id"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"Bulbasaur"</span><span class="token punctuation">,</span>
  <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"plant"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>In our Bash script, we can access this data via the <code>$PIPEDREAM_STEPS</code> file. Specifically, this data from the POST request into our workflow is available in the <code>trigger</code> object.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token builtin class-name">echo</span> <span class="token variable">$PIPEDREAM_STEPS</span> <span class="token operator">|</span> jq .trigger.event

<span class="token comment"># Results in { id: 1, name: "Bulbasaur", type: "plant" }</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>The period (<code>.</code>) in front the <code>trigger.event</code> in the example is not a typo. This is to define the starting point for <code>jq</code> to traverse down the JSON in the HTTP response.</p>
</div>
<h3 id="sending-data-downstream-to-other-steps" tabindex="-1"><a class="header-anchor" href="#sending-data-downstream-to-other-steps" aria-hidden="true">#</a> Sending data downstream to other steps</h3>
<p>To share data for future steps to use downstream, append it to the <code>$PIPEDREAM_EXPORTS</code> file.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># Retrieve the data from an API and store it in a variable</span>
<span class="token assign-left variable">DATA</span><span class="token operator">=</span><span class="token variable"><span class="token variable">`</span><span class="token function">curl</span> --silent https://pokeapi.co/api/v2/pokemon/charizard<span class="token variable">`</span></span>

<span class="token comment"># Write data to $PIPEDREAM_EXPORTS to share with steps downstream</span>
<span class="token assign-left variable">EXPORT</span><span class="token operator">=</span><span class="token string">"key:json=<span class="token variable">${DATA}</span>"</span>
<span class="token builtin class-name">echo</span> <span class="token variable">$EXPORT</span> <span class="token operator">>></span> <span class="token variable">$PIPEDREAM_EXPORTS</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p>
<p>Not all data types can be stored in the <code>$PIPEDREAM_EXPORTS</code> data shared between workflow steps.</p>
<p>For the best experience, we recommend only exporting strings from Bash steps that can be serialized to JSON.</p>
<p><a href="/workflows/steps/#limitations-on-step-exports" target="_blank" rel="noopener noreferrer">Read more details on step limitations here.<ExternalLinkIcon/></a></p>
</div>
<h2 id="using-environment-variables" tabindex="-1"><a class="header-anchor" href="#using-environment-variables" aria-hidden="true">#</a> Using environment variables</h2>
<p>You can leverage any <a href="/environment-variables/#environment-variables" target="_blank" rel="noopener noreferrer">environment variables defined in your Pipedream account<ExternalLinkIcon/></a> in a bash step. This is useful for keeping your secrets out of code as well as keeping them flexible to swap API keys without having to update each step individually.</p>
<p>To access them, just append the <code>$</code> in front of the environment variable name.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token builtin class-name">echo</span> <span class="token variable">$POKEDEX_API_KEY</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Or an even more useful example, using the stored environment variable to make an authenticated API request.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> --silent -X POST -h <span class="token string">"Authorization: Bearer <span class="token variable">$TWITTER_API_KEY</span>"</span> https://api.twitter.com/2/users/@pipedream/mentions
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="raising-exceptions" tabindex="-1"><a class="header-anchor" href="#raising-exceptions" aria-hidden="true">#</a> Raising exceptions</h2>
<p>You may need to stop your step immediately. You can use the normal <code>exit</code> function available in Bash to quit the step prematurely.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token builtin class-name">echo</span> <span class="token string">"Exiting now!"</span> <span class="token operator"><span class="token file-descriptor important">1</span>></span><span class="token file-descriptor important">&amp;2</span>
<span class="token builtin class-name">exit</span> <span class="token number">1</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p>
<p>Using <code>exit</code> to quit a Bash step early <em>won't</em> stop the execution of the rest of the workflow.</p>
<p>Exiting a Bash step will only apply that particular step in the workflow.</p>
</div>
<p>This will exit the step and output the error message to <code>stderr</code> which will appear in the results of the step in the workflow.</p>
<h2 id="file-storage" tabindex="-1"><a class="header-anchor" href="#file-storage" aria-hidden="true">#</a> File storage</h2>
<p>If you need to download and store files, you can place them in the <code>/tmp</code> directory.</p>
<h3 id="writing-a-file-to-tmp" tabindex="-1"><a class="header-anchor" href="#writing-a-file-to-tmp" aria-hidden="true">#</a> Writing a file to /tmp</h3>
<p>For example, to download a file to <code>/tmp</code> using <code>curl</code></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># Download the current weather in Cleveland in PNG format</span>
<span class="token function">curl</span> --silent https://wttr.in/Cleveland.png --output /tmp/weather.png

<span class="token comment"># Output the contents of /tmp to confirm the file is there</span>
<span class="token function">ls</span> /tmp
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p>
<p>The <code>/tmp</code> directory does not have unlimited storage. Please refer to the <a href="/limits/#disk" target="_blank" rel="noopener noreferrer">disk limits<ExternalLinkIcon/></a> for details.</p>
</div>
</template>
