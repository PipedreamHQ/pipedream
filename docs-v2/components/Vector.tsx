import Script from "next/script";

export default function Vector() {
  return (
    <Script strategy="lazyOnload">
      {
        `
        if (typeof window !== "undefined" && window.vector) {
          // Vector already exists, just load our ID
          window.vector.load("1380baba-7f5a-41db-ad03-3cc628ffd499");
        } else {
          // Initialize Vector normally
          !function(e,r){try{if(e.vector)return;var t={};t.q=t.q||[];for(var o=["load","identify","on"],n=function(e){return function(){var r=Array.prototype.slice.call(arguments);t.q.push([e,r])}},c=0;c<o.length;c++){var a=o[c];t[a]=n(a)}if(e.vector=t,!t.loaded){var i=r.createElement("script");i.type="text/javascript",i.async=!0,i.src="https://cdn.vector.co/pixel.js";var l=r.getElementsByTagName("script")[0];l.parentNode.insertBefore(i,l),t.loaded=!0}}catch(e){}}(window,document);
          // Then load our ID
          typeof window !== "undefined" && window.vector && window.vector.load("1380baba-7f5a-41db-ad03-3cc628ffd499");
        }
        `
      }
    </Script>
  );
}
