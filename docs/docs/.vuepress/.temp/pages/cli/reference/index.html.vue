<template><h1 id="cli-reference" tabindex="-1"><a class="header-anchor" href="#cli-reference" aria-hidden="true">#</a> CLI Reference</h1>
<p>The Pipedream CLI currently allows you to manage <a href="/components/" target="_blank" rel="noopener noreferrer">components<ExternalLinkIcon/></a>. If you'd like to see support for managing <a href="/workflows/" target="_blank" rel="noopener noreferrer">workflows<ExternalLinkIcon/></a>, please +1 <a href="https://github.com/PipedreamHQ/pipedream/issues/220" target="_blank" rel="noopener noreferrer">this issue on Github<ExternalLinkIcon/></a>.</p>
<p>When this document uses the term &quot;component&quot;, the corresponding feature applies to both sources and actions. If a specific feature applies to only sources <em>or</em> actions, the correct term will be used.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#installing-the-cli">Installing the CLI</RouterLink></li><li><RouterLink to="#command-reference">Command Reference</RouterLink><ul><li><RouterLink to="#general-notes">General Notes</RouterLink></li><li><RouterLink to="#pd-delete">pd delete</RouterLink></li><li><RouterLink to="#pd-deploy">pd deploy</RouterLink></li><li><RouterLink to="#pd-describe">pd describe</RouterLink></li><li><RouterLink to="#pd-dev">pd dev</RouterLink></li><li><RouterLink to="#pd-events">pd events</RouterLink></li><li><RouterLink to="#pd-help">pd help</RouterLink></li><li><RouterLink to="#pd-init">pd init</RouterLink></li><li><RouterLink to="#pd-list">pd list</RouterLink></li><li><RouterLink to="#pd-login">pd login</RouterLink></li><li><RouterLink to="#pd-logout">pd logout</RouterLink></li><li><RouterLink to="#pd-logs">pd logs</RouterLink></li><li><RouterLink to="#pd-publish">pd publish</RouterLink></li><li><RouterLink to="#pd-signup">pd signup</RouterLink></li><li><RouterLink to="#pd-update">pd update</RouterLink></li></ul></li><li><RouterLink to="#profiles">Profiles</RouterLink><ul><li><RouterLink to="#creating-a-new-profile">Creating a new profile</RouterLink></li><li><RouterLink to="#creating-a-profile-for-an-organization">Creating a profile for an organization</RouterLink></li><li><RouterLink to="#using-profiles">Using profiles</RouterLink></li></ul></li><li><RouterLink to="#version">Version</RouterLink></li><li><RouterLink to="#auto-upgrade">Auto-upgrade</RouterLink></li><li><RouterLink to="#cli-config-file">CLI config file</RouterLink></li><li><RouterLink to="#analytics">Analytics</RouterLink></li></ul></nav>
<h2 id="installing-the-cli" tabindex="-1"><a class="header-anchor" href="#installing-the-cli" aria-hidden="true">#</a> Installing the CLI</h2>
<p><a href="/cli/install/" target="_blank" rel="noopener noreferrer">See the CLI installation docs<ExternalLinkIcon/></a> to learn how to install the CLI for your OS / architecture.</p>
<h2 id="command-reference" tabindex="-1"><a class="header-anchor" href="#command-reference" aria-hidden="true">#</a> Command Reference</h2>
<p>Run <code>pd</code> to see a list of all commands with basic usage info, or run <code>pd help &lt;command&gt;</code> to display help docs for a specific command.</p>
<p>We've also documented each command below, with usage examples for each.</p>
<h3 id="general-notes" tabindex="-1"><a class="header-anchor" href="#general-notes" aria-hidden="true">#</a> General Notes</h3>
<p>Everywhere you can refer to a specific component as an argument, you can use the component's ID <em>or</em> its name slug. For example, to retrieve details about a specific source using <code>pd describe</code>, you can use either of the following commands:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>λ ~/ pd describe dc_abc123

  id: dc_abc123
  name: http
  endpoint: https://myendpoint.m.pipedream.net

λ ~/ pd describe http
Searching for sources matching http

  id: dc_abc123
  name: http
  endpoint: https://myendpoint.m.pipedream.net
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h3 id="pd-delete" tabindex="-1"><a class="header-anchor" href="#pd-delete" aria-hidden="true">#</a> <code>pd delete</code></h3>
<p>Deletes an event source. Run:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd describe &lt;source-id-or-name>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Run <code>pd list so</code> to display a list of your event sources.</p>
<h3 id="pd-deploy" tabindex="-1"><a class="header-anchor" href="#pd-deploy" aria-hidden="true">#</a> <code>pd deploy</code></h3>
<p>Deploy an event source from local or remote code.</p>
<p>Running <code>pd deploy</code>, without any arguments, brings up an interactive menu asking you select a source. This list of sources is retrieved from the registry of public sources <a href="https://github.com/PipedreamHQ/pipedream/tree/master/components" target="_blank" rel="noopener noreferrer">published to Github<ExternalLinkIcon/></a>.</p>
<p>When you select a source, we'll deploy it and start listening for new events.</p>
<p>You can also deploy a specific source via the source's <code>key</code> (defined in the component file for the source):</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd deploy http-new-requests
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>or author a component locally and deploy that local file:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd deploy http.js
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><a href="/components/quickstart/nodejs/sources/" target="_blank" rel="noopener noreferrer">Read more about authoring your own event sources<ExternalLinkIcon/></a>.</p>
<h3 id="pd-describe" tabindex="-1"><a class="header-anchor" href="#pd-describe" aria-hidden="true">#</a> <code>pd describe</code></h3>
<p>Display the details for a source: its id, name, and other configuration details:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd describe &lt;source-id-or-name>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="pd-dev" tabindex="-1"><a class="header-anchor" href="#pd-dev" aria-hidden="true">#</a> <code>pd dev</code></h3>
<p><code>pd dev</code> allows you to interactively develop a source from a local file.<code>pd dev</code> will link your local file with the deployed component and watch your local file for changes. When you save changes to your local file, your component will automatically be updated on Pipedream.</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd dev &lt;file-or-name>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>If you quit <code>pd dev</code> and want to link the same deployed source to your local file, you can pass the deployed component ID using the <code>--dc</code> flag:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd dev --dc &lt;existing-deployed-component-id> &lt;file-or-name>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="pd-events" tabindex="-1"><a class="header-anchor" href="#pd-events" aria-hidden="true">#</a> <code>pd events</code></h3>
<p>Returns historical events sent to a source, and streams emitted events directly to the CLI.</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd events &lt;source-id-or-name>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>By default, <code>pd events</code> prints (up to) the last 10 events sent to your source.</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd events -n 100 &lt;source-id-or-name>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><code>pd events -n N</code> retrieves the last <code>N</code> events sent to your source. We store the last 100 events sent to a source, so you can retrieve a max of 100 events using this command.</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd events -f &lt;source-id-or-name>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><code>pd events -f</code> connects to the <a href="/api/sse/" target="_blank" rel="noopener noreferrer">SSE stream tied to your source<ExternalLinkIcon/></a> and displays events as the source produces them.</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd events -n N -f &lt;source-id-or-name>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>You can combine the <code>-n</code> and <code>-f</code> options to list historical events <em>and</em> follow the source for new events.</p>
<h3 id="pd-help" tabindex="-1"><a class="header-anchor" href="#pd-help" aria-hidden="true">#</a> <code>pd help</code></h3>
<p>Displays help for any command. Run <code>pd help events</code>, <code>pd help describe</code>, etc.</p>
<h3 id="pd-init" tabindex="-1"><a class="header-anchor" href="#pd-init" aria-hidden="true">#</a> <code>pd init</code></h3>
<p>Generate new app and component files from templates.</p>
<h4 id="pd-init-app" tabindex="-1"><a class="header-anchor" href="#pd-init-app" aria-hidden="true">#</a> <code>pd init app</code></h4>
<p>Creates a directory and <a href="/components/guidelines/#app-files" target="_blank" rel="noopener noreferrer">an app file<ExternalLinkIcon/></a> from a template</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code># Creates google_calendar/ directory and google_calendar.mjs file
pd init app google_calendar
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="pd-init-action" tabindex="-1"><a class="header-anchor" href="#pd-init-action" aria-hidden="true">#</a> <code>pd init action</code></h4>
<p>Creates a new directory and <a href="/components/actions/" target="_blank" rel="noopener noreferrer">a component action<ExternalLinkIcon/></a> from a template.</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code># Creates add-new-event/ directory and add-new-event.mjs file
pd init action add-new-event
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="pd-init-source" tabindex="-1"><a class="header-anchor" href="#pd-init-source" aria-hidden="true">#</a> <code>pd init source</code></h4>
<p>Creates a new directory and <a href="/event-sources/" target="_blank" rel="noopener noreferrer">an event source<ExternalLinkIcon/></a> from a template.</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code># Creates cancelled-event/ directory and cancelled_event.mjs file
pd init source cancelled-event
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>You can attach <a href="/components/api/#db" target="_blank" rel="noopener noreferrer">database<ExternalLinkIcon/></a>, <a href="/components/api/#http" target="_blank" rel="noopener noreferrer">HTTP<ExternalLinkIcon/></a>, or <a href="/components/api/#timer" target="_blank" rel="noopener noreferrer">Timer<ExternalLinkIcon/></a> props to your template using the following flags:</p>
<table>
<thead>
<tr>
<th>Prop type</th>
<th>Flag</th>
</tr>
</thead>
<tbody>
<tr>
<td>Database</td>
<td><code>--db</code></td>
</tr>
<tr>
<td>HTTP</td>
<td><code>--http</code></td>
</tr>
<tr>
<td>Timer</td>
<td><code>--timer</code></td>
</tr>
</tbody>
</table>
<p>For example, running:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd init source cancelled-event --db --http --timer
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>will include the following props in your new event source:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">db</span><span class="token operator">:</span> <span class="token string">"$.service.db"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">http</span><span class="token operator">:</span> <span class="token string">"$.interface.http"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">timer</span><span class="token operator">:</span> <span class="token string">"$.interface.timer"</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="pd-list" tabindex="-1"><a class="header-anchor" href="#pd-list" aria-hidden="true">#</a> <code>pd list</code></h3>
<p>Lists Pipedream sources running in your account. Running <code>pd list</code> without any arguments prompts you to select the type of resource you'd like to list.</p>
<p>You can also list specific resource types directly:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd list components
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd list streams
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><code>sources</code> and <code>streams</code> have shorter aliases, too:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd list so
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd list st
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="pd-login" tabindex="-1"><a class="header-anchor" href="#pd-login" aria-hidden="true">#</a> <code>pd login</code></h3>
<p>Log in to Pipedream CLI and persist API key locally. See <a href="/cli/login/" target="_blank" rel="noopener noreferrer">Logging into the CLI<ExternalLinkIcon/></a> for more information.</p>
<h3 id="pd-logout" tabindex="-1"><a class="header-anchor" href="#pd-logout" aria-hidden="true">#</a> <code>pd logout</code></h3>
<p>Unsets the local API key tied to your account.</p>
<p>Running <code>pd logout</code> without any arguments removes the default API key from your <a href="/cli/reference/#cli-config-file" target="_blank" rel="noopener noreferrer">config file<ExternalLinkIcon/></a>.</p>
<p>You can remove the API key for a specific profile by running:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd logout -p &lt;profile>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="pd-logs" tabindex="-1"><a class="header-anchor" href="#pd-logs" aria-hidden="true">#</a> <code>pd logs</code></h3>
<p>Event sources produce logs that can be useful for troubleshooting issues with that source. <code>pd logs</code> displays logs for a source.</p>
<p>Running <code>pd logs &lt;source-id-or-name&gt;</code> connects to the <a href="/event-sources/logs/" target="_blank" rel="noopener noreferrer">SSE logs stream tied to your source<ExternalLinkIcon/></a>, displaying new logs as the source produces them.</p>
<p>Any errors thrown by the source will also appear here.</p>
<h3 id="pd-publish" tabindex="-1"><a class="header-anchor" href="#pd-publish" aria-hidden="true">#</a> <code>pd publish</code></h3>
<p>To publish an action, use the <code>pd publish</code> command.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd publish <span class="token operator">&lt;</span>filename<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>E.g.,</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd publish my-action.js
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="pd-signup" tabindex="-1"><a class="header-anchor" href="#pd-signup" aria-hidden="true">#</a> <code>pd signup</code></h3>
<p>Sign up for Pipedream via the CLI and persist your API key locally. See the docs on <a href="/cli/login/#signing-up-for-pipedream-via-the-cli" target="_blank" rel="noopener noreferrer">Signing up for Pipedream via the CLI<ExternalLinkIcon/></a> for more information.</p>
<h3 id="pd-update" tabindex="-1"><a class="header-anchor" href="#pd-update" aria-hidden="true">#</a> <code>pd update</code></h3>
<p>Updates the code, props, or metadata for an event source.</p>
<p>If you deployed a source from Github, for example, someone might publish an update to that source, and you may want to run the updated code.</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd update &lt;source-id-or-name> --code https://github.com/PipedreamHQ/pipedream/blob/master/components/http/sources/new-requests/new-requests.js
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>You can change the name of a source:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd update &lt;source-id-or-name> --name new-awesome-name
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>You can deactivate a source if you want to stop it from running:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd update &lt;source-id-or-name> --deactivate
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>or activate a source you previously deactivated:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd update &lt;source-id-or-name> --activate
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="profiles" tabindex="-1"><a class="header-anchor" href="#profiles" aria-hidden="true">#</a> Profiles</h2>
<p>Profiles allow you to work with multiple, named Pipedream accounts via the CLI.</p>
<h3 id="creating-a-new-profile" tabindex="-1"><a class="header-anchor" href="#creating-a-new-profile" aria-hidden="true">#</a> Creating a new profile</h3>
<p>When you <a href="/cli/login/" target="_blank" rel="noopener noreferrer">login to the CLI<ExternalLinkIcon/></a>, the CLI writes the API key for that account to your config file, in the <code>api_key</code> field:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>api_key = abc123
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>You can set API keys for other, named profiles, too. Run</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd login -p &lt;profile>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><code>&lt;profile&gt;</code> can be any string of shell-safe characters that you'd like to use to identify this new profile. The CLI opens up a browser asking you to login to your target Pipedream account, then writes the API key to a section of the config file under this profile:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>[your_profile]
api_key = def456
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>You can also run <code>pd signup -p &lt;profile&gt;</code> if you'd like to sign up for a new Pipedream account via the CLI and set a named profile for that account.</p>
<h3 id="creating-a-profile-for-an-organization" tabindex="-1"><a class="header-anchor" href="#creating-a-profile-for-an-organization" aria-hidden="true">#</a> Creating a profile for an organization</h3>
<p>If you're working with resources in an <a href="/orgs/" target="_blank" rel="noopener noreferrer">organization<ExternalLinkIcon/></a>, you'll need to add an <code>org_id</code> to your profile.</p>
<ol>
<li><a href="/orgs/#finding-your-organization-s-id" target="_blank" rel="noopener noreferrer">Retrieve your organization's ID<ExternalLinkIcon/></a></li>
<li>Open up your <a href="#cli-config-file">Pipedream config file</a> and create a new <a href="#profiles">profile</a> with the following information:</li>
</ol>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>[profile_name]
api_key = &lt;API Key from org settings>
org_id = &lt;Org ID from org settings>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>When using the CLI, pass <code>--profile &lt;profile_name&gt;</code> when running any command. For example, if you named your profile <code>my_org</code>, you'd run this command to publish a component:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd publish file.js --profile my_org
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="using-profiles" tabindex="-1"><a class="header-anchor" href="#using-profiles" aria-hidden="true">#</a> Using profiles</h3>
<p>You can set a profile on any <code>pd</code> command by setting the <code>-p</code> or <code>--profile</code> flag. For example, to list the sources in a specific account, run:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd list sources --profile &lt;profile>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="version" tabindex="-1"><a class="header-anchor" href="#version" aria-hidden="true">#</a> Version</h2>
<p>To get the current version of the <code>pd</code> CLI, run</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd --version
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="auto-upgrade" tabindex="-1"><a class="header-anchor" href="#auto-upgrade" aria-hidden="true">#</a> Auto-upgrade</h2>
<p>The CLI is configured to check for new versions automatically. This ensures you're always running the most up-to-date version.</p>
<h2 id="cli-config-file" tabindex="-1"><a class="header-anchor" href="#cli-config-file" aria-hidden="true">#</a> CLI config file</h2>
<p>The <code>pd</code> config file contains your Pipedream API keys (tied to your default account, or other <a href="#profiles">profiles</a>) and other configuration used by the CLI.</p>
<p>If the <code>XDG_CONFIG_HOME</code> env var is set, the config file will be found in <code>$XDG_CONFIG_HOME/pipedream</code>.</p>
<p>Otherwise, it will be found in <code>$HOME/.config/pipedream</code>.</p>
<h2 id="analytics" tabindex="-1"><a class="header-anchor" href="#analytics" aria-hidden="true">#</a> Analytics</h2>
<p>Pipedream tracks CLI usage data to report errors and usage stats. We use this data exclusively for the purpose of internal analytics (see <a href="https://pipedream.com/privacy" target="_blank" rel="noopener noreferrer">our privacy policy<ExternalLinkIcon/></a> for more information).</p>
<p>If you'd like to opt-out of CLI analytics, set the <code>PD_CLI_DO_NOT_TRACK</code> environment variable to <code>true</code> or <code>1</code>.</p>
<Footer />
</template>
