import { ChakraProvider, Alert, AlertIcon, AlertTitle, AlertDescription, Link, Box } from '@chakra-ui/react';
import Head from 'next/head';
import './editor.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>house of legency cheat editor</title>
        <meta property='og:site_name' content='吾今有世家修改器' />
        <meta name='keywords'
          content='house of legency, house of legency cheat, house of legency cheat save file, 吾 今 有 世 家 修改器, 吾今有世家 修改器, 吾今有世家'
        />
        <meta name="google-adsense-account" content="ca-pub-1056917899569324"></meta>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1056917899569324"
     crossorigin="anonymous"></script>
     <script src="https://analytics.ahrefs.com/analytics.js" data-key="KIhjCyEc3LpDR/QIvFuOKQ" async></script>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>

      <ChakraProvider>
       
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
