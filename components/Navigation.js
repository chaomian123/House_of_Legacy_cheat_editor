import { HStack, Text, Link, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useLocale } from '../lib/useLocale';

export default function Navigation() {
  const router = useRouter();
  const { locale, t } = useLocale();

  const isActive = (path) => router.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? 'gray.700' : 'gray.500',
    fontWeight: isActive(path) ? 'medium' : 'normal',
    textDecoration: 'none',
    _hover: { color: 'gray.700', textDecoration: 'underline' }
  });

  return (
    <HStack 
      spacing={3} 
      justify="center"
      py={4}
      px={4}
      bg="gray.50"
      borderTop="1px"
      borderColor="gray.200"
      fontSize="sm"
      color="gray.500"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="999"
      width="100%"
    >
      <Link as={NextLink} href="/" {...linkStyle('/')}>
        {t.navigation.home}
      </Link>
      
      <Text color="gray.300">|</Text>
      
      <Link as={NextLink} href="/privacy" {...linkStyle('/privacy')}>
        {t.privacyPolicy}
      </Link>

      <Text color="gray.300">|</Text>
      
      <Link as={NextLink} href="/terms" {...linkStyle('/terms')}>
        {t.termsOfService}
      </Link>

      <Text color="gray.300">|</Text>

      <Link as={NextLink} href="/suggestions" {...linkStyle('/suggestions')}>
        {t.navigation.suggestions}
      </Link>

      <Text color="gray.300">|</Text>

      <Text color="gray.400" fontSize="xs">
        © 2025 House of Legacy Save Editor
      </Text>
    </HStack>
  );
} 