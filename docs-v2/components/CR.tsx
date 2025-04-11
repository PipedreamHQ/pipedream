import Script from "next/script";

export default function RB2B() {
  return (
    <Script strategy="lazyOnload">
      {
        `
        !function () {if (typeof window === "undefined") return;if (typeof window.signals !== "undefined") return;var script = document.createElement("script");script.src = "https://cdn.cr-relay.com/v1/site/80b683ec-139c-45c4-92e4-900b361a91a2/signals.js";script.async = true;window.signals = Object.assign([],["page", "identify", "form"].reduce(function (acc, method) {acc[method] = function () {signals.push([method, arguments]);return signals;};return acc;}, {}));document.head.appendChild(script);}();
        `
      }
    </Script>
  );
}
