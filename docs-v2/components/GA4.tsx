import Script from "next/script";

export default function GA4() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-770996949"
        strategy="lazyOnload"
      />

      <Script id="gtag-init" strategy="lazyOnload">
        {
          `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-770996949');
          `
        }
      </Script>
    </>
  );
}
