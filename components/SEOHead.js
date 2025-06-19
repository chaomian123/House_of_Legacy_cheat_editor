import Head from 'next/head';
import { useRouter } from 'next/router';
import { useLocale } from '../lib/useLocale';
import Script from 'next/script';

export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  ogImage = '/og-image.jpg',
  canonical 
}) {
  const router = useRouter();
  const { locale, t } = useLocale();
  
  const siteTitle = title || t.siteTitle;
  const siteDescription = description || t.siteDescription;
  const siteKeywords = keywords || t.keywords;
  const siteUrl = `https://savefile.space${router.asPath}`;
  const canonicalUrl = canonical || siteUrl;

  return (
    <Head>
      {/* 基本 SEO */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="author" content="House of Legacy Editor Team" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* 语言和地区 */}
      <meta httpEquiv="content-language" content={locale} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} /> 
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={`https://savefile.space${ogImage}`} />
      <meta property="og:site_name" content={t.seo.siteName} />
      <meta property="og:locale" content={t.seo.locale} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={`https://savefile.space${ogImage}`} />
      
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": siteTitle,
            "description": siteDescription,
            "url": siteUrl,
            "applicationCategory": "GameApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Organization",
              "name": "House of Legacy Editor Team"
            },
            "inLanguage": t.seo.locale.replace('_', '-')
          })
        }}
      />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#ffffff" />
      
      {/* Google Ads */}
      <meta name="google-adsense-account" content="ca-pub-1056917899569324" />
      <script 
        async 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1056917899569324"
        crossOrigin="anonymous"
      />
    </Head>
  );
} 