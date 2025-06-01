import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Main, Head, NextScript } from 'next/document';
import { Analytics } from "@vercel/analytics/next"

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          {/* 基本 favicon 配置作为后备 */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="shortcut icon" href="/favicon.ico" />
          
          {/* DNS 预解析优化 */}
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          
          {/* 关键资源预加载 */}
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>
        <body>
          <ColorModeScript initialColorMode='light' />
          <Main />
          <NextScript />
          {/* Vercel Analytics - 保持轻量且自动优化 */}
          <Analytics />
        </body>
      </Html>
    );
  }
}
