<template><h1 id="amazon-s3" tabindex="-1"><a class="header-anchor" href="#amazon-s3" aria-hidden="true">#</a> Amazon S3</h1>
<p><a href="https://aws.amazon.com/s3/" target="_blank" rel="noopener noreferrer">Amazon S3<ExternalLinkIcon/></a> — the Simple Storage Service — is a common place to dump data for long-term storage on AWS. Pipedream supports delivery to S3 as a first-class Destination.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#using-send-s3-in-workflows">Using $.send.s3 in workflows</RouterLink></li><li><RouterLink to="#using-send-s3-in-component-actions">Using $.send.s3 in component actions</RouterLink></li><li><RouterLink to="#s3-bucket-policy">S3 Bucket Policy</RouterLink></li><li><RouterLink to="#s3-destination-delivery">S3 Destination delivery</RouterLink></li><li><RouterLink to="#s3-object-format">S3 object format</RouterLink></li><li><RouterLink to="#limiting-s3-uploads-by-ip">Limiting S3 Uploads by IP</RouterLink></li></ul></nav>
<h2 id="using-send-s3-in-workflows" tabindex="-1"><a class="header-anchor" href="#using-send-s3-in-workflows" aria-hidden="true">#</a> Using <code>$.send.s3</code> in workflows</h2>
<p>You can send data to an S3 Destination in <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer">Node.js code steps<ExternalLinkIcon/></a> using <code>$.send.s3()</code>.</p>
<p><code>$.send.s3()</code> takes the following parameters:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code>$<span class="token punctuation">.</span>send<span class="token punctuation">.</span><span class="token function">s3</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">bucket</span><span class="token operator">:</span> <span class="token string">"your-bucket-here"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">prefix</span><span class="token operator">:</span> <span class="token string">"your-prefix/"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">payload</span><span class="token operator">:</span> event<span class="token punctuation">.</span>body<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>Like with any <code>$.send</code> function, you can use <code>$.send.s3()</code> conditionally, within a loop, or anywhere you'd use a function normally.</p>
<h2 id="using-send-s3-in-component-actions" tabindex="-1"><a class="header-anchor" href="#using-send-s3-in-component-actions" aria-hidden="true">#</a> Using <code>$.send.s3</code> in component actions</h2>
<p>If you're authoring a <a href="/components/actions/" target="_blank" rel="noopener noreferrer">component action<ExternalLinkIcon/></a>, you can deliver data to an S3 destination using <code>$.send.s3</code>.</p>
<p><code>$.send.s3</code> functions the same as <a href="#using-send-s3-in-workflows"><code>$.send.s3</code> in workflow code steps</a>:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  $<span class="token punctuation">.</span>send<span class="token punctuation">.</span><span class="token function">s3</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">bucket</span><span class="token operator">:</span> <span class="token string">"your-bucket-here"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">prefix</span><span class="token operator">:</span> <span class="token string">"your-prefix/"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">payload</span><span class="token operator">:</span> event<span class="token punctuation">.</span>body<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="s3-bucket-policy" tabindex="-1"><a class="header-anchor" href="#s3-bucket-policy" aria-hidden="true">#</a> S3 Bucket Policy</h2>
<p>In order for us to deliver objects to your S3 bucket, you need to modify its <a href="https://docs.aws.amazon.com/AmazonS3/latest/user-guide/add-bucket-policy.html" target="_blank" rel="noopener noreferrer">bucket policy<ExternalLinkIcon/></a> to allow Pipedream to upload objects.</p>
<p><strong>Replace <code>[your bucket name]</code> with the name of your bucket</strong> near the bottom of the policy.</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"Version"</span><span class="token operator">:</span> <span class="token string">"2012-10-17"</span><span class="token punctuation">,</span>
  <span class="token property">"Id"</span><span class="token operator">:</span> <span class="token string">"allow-pipedream-limited-access"</span><span class="token punctuation">,</span>
  <span class="token property">"Statement"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">"Effect"</span><span class="token operator">:</span> <span class="token string">"Allow"</span><span class="token punctuation">,</span>
      <span class="token property">"Principal"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"AWS"</span><span class="token operator">:</span> <span class="token string">"arn:aws:iam::203863770927:role/Pipedream"</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">"Action"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token string">"s3:AbortMultipartUpload"</span><span class="token punctuation">,</span>
        <span class="token string">"s3:GetBucketLocation"</span><span class="token punctuation">,</span>
        <span class="token string">"s3:PutObject"</span><span class="token punctuation">,</span>
        <span class="token string">"s3:PutObjectAcl"</span><span class="token punctuation">,</span>
        <span class="token string">"s3:ListBucketMultipartUploads"</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token property">"Resource"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token string">"arn:aws:s3:::[your bucket name]"</span><span class="token punctuation">,</span>
        <span class="token string">"arn:aws:s3:::[your bucket name]/*"</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><p>This bucket policy provides the minimum set of permissions necessary for Pipedream to deliver objects to your bucket. We use the <a href="https://docs.aws.amazon.com/AmazonS3/latest/dev/uploadobjusingmpu.html" target="_blank" rel="noopener noreferrer">Multipart Upload API<ExternalLinkIcon/></a> to upload objects, and require the <a href="https://docs.aws.amazon.com/AmazonS3/latest/dev/mpuAndPermissions.html" target="_blank" rel="noopener noreferrer">relevant permissions<ExternalLinkIcon/></a>.</p>
<h2 id="s3-destination-delivery" tabindex="-1"><a class="header-anchor" href="#s3-destination-delivery" aria-hidden="true">#</a> S3 Destination delivery</h2>
<p>S3 Destination delivery is handled asynchronously, separate from the execution of a workflow. <strong>Moreover, events sent to an S3 bucket are batched and delivered once a minute</strong>. For example, if you sent 30 events to an S3 Destination within a particular minute, we would collect all 30 events, delimit them with newlines, and write them to a single S3 object.</p>
<p>In some cases, delivery will take longer than a minute. You can always review how many Destinations we've delivered a given event to by examining the <a href="/workflows/events/inspect/#dest-destinations" target="_blank" rel="noopener noreferrer"><strong>Dest</strong> column in the Inspector<ExternalLinkIcon/></a>.</p>
<h2 id="s3-object-format" tabindex="-1"><a class="header-anchor" href="#s3-object-format" aria-hidden="true">#</a> S3 object format</h2>
<p>We upload objects using the following format:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>[PREFIX]/YYYY/MM/DD/HH/YYYY-MM-DD-HH-MM-SS-IDENTIFIER.gz
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>That is — we write objects first to your prefix, then within folders specific to the current date and hour, then upload the object with the same date information in the object, so that it's easy to tell when it was uploaded by object name alone.</p>
<p>For example, if I were writing data to a prefix of <code>test/</code>, I might see an object in S3 at this path:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>test/2019/05/25/16/2019-05-25-16-14-58-8f25b54462bf6eeac3ee8bde512b6c59654c454356e808167a01c43ebe4ee919.gz
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>As noted above, a given object contains all payloads delivered to an S3 Destination within a specific minute. Multiple events within a given object are newline-delimited.</p>
<h2 id="limiting-s3-uploads-by-ip" tabindex="-1"><a class="header-anchor" href="#limiting-s3-uploads-by-ip" aria-hidden="true">#</a> Limiting S3 Uploads by IP</h2>
<p>S3 provides a mechanism to <a href="https://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html#example-bucket-policies-use-case-3" target="_blank" rel="noopener noreferrer">limit operations only from specific IP addresses<ExternalLinkIcon/></a>. If you'd like to apply that filter, uploads using <code>$.send.s3()</code> should come from one of the following IP addresses:</p>
<p>&lt;&lt;&lt; @/docs/snippets/public-node-ips.txt</p>
<p>This list may change over time. If you've previously whitelisted these IP addresses and are having trouble uploading S3 objects, please check to ensure this list matches your firewall rules.</p>
<Footer />
</template>
