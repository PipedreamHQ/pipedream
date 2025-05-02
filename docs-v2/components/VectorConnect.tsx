import Script from "next/script";

export default function VectorConnect() {
  return (
    <Script strategy="lazyOnload">
      {
        `
        // Script for loading Vector with ID d354cbca-d3d5-4395-9955-92b515283489
        // If Vector is already initialized, just call load with our ID
        if (typeof window !== "undefined" && window.vector) {
          window.vector.load("d354cbca-d3d5-4395-9955-92b515283489");
        } else {
          // Otherwise initialize Vector as normal
          !function(e,r){try{if(e.vector)return;var t={};t.q=t.q||[];for(var o=["load","identify","on"],n=function(e){return function(){var r=Array.prototype.slice.call(arguments);t.q.push([e,r])}},c=0;c<o.length;c++){var a=o[c];t[a]=n(a)}if(e.vector=t,!t.loaded){var i=r.createElement("script");i.type="text/javascript",i.async=!0,i.src="https://cdn.vector.co/pixel.js";var l=r.getElementsByTagName("script")[0];l.parentNode.insertBefore(i,l),t.loaded=!0}}catch(e){}}(window,document);
          // Then load our ID
          typeof window !== "undefined" && window.vector && window.vector.load("d354cbca-d3d5-4395-9955-92b515283489");
        }
        `
      }
    </Script>
  );
}
