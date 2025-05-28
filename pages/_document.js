import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Main, Head, NextScript } from 'next/document';
import { Analytics } from "@vercel/analytics/next"
import Script from 'next/script';

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          {/* 基本 favicon 配置作为后备 */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="shortcut icon" href="/favicon.ico" />
          
          {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && [
            <Script key='google-analytics-script' strategy='beforeInteractive'
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            />,
            <Script key='google-analytics-initialize' id='google-analytics-initializer' strategy='beforeInteractive'>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          ]}
        </Head>
        <body>
          <ColorModeScript initialColorMode='light' />
          <Main />
          <NextScript />
          <Analytics />
        </body>
      </Html>
    );
  }
}
