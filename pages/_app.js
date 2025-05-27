import { ChakraProvider, Alert, AlertIcon, AlertTitle, AlertDescription, Link, Box } from '@chakra-ui/react';
import Head from 'next/head';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Navigation from '../components/Navigation';
import './editor.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>

      <ChakraProvider>
       
        <LanguageSwitcher />
        <Component {...pageProps} />
        <Navigation />
      </ChakraProvider>
    </>
  );
}
