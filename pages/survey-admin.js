import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  useToast
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

export default function SurveyAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/survey');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch survey statistics",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <SEOHead 
        title="Thai Language Support Survey - Admin"
        description="Survey results for Thai language support"
      />
      
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="lg" mb={2}>
              Thai Language Support Survey
            </Heading>
            <Text color="gray.600">
              Survey Results Dashboard
            </Text>
          </Box>

          <Button 
            onClick={fetchStats} 
            isLoading={loading}
            size="sm"
            alignSelf="center"
          >
            Refresh Data
          </Button>

          {stats ? (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Total Votes</StatLabel>
                    <StatNumber>{stats.total}</StatNumber>
                    <StatHelpText>Unique IP addresses</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Yes Votes</StatLabel>
                    <StatNumber color="green.500">{stats.yes}</StatNumber>
                    <StatHelpText>{stats.yesPercentage}% of total</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>No Votes</StatLabel>
                    <StatNumber color="gray.500">{stats.no}</StatNumber>
                    <StatHelpText>{stats.noPercentage}% of total</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10}>
              <Text>Loading statistics...</Text>
            </Box>
          )}

          {stats && stats.total > 0 && (
            <Box>
              <Text mb={2} fontWeight="medium">Vote Distribution</Text>
              <VStack spacing={3}>
                <Box w="100%">
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="sm">Yes votes</Text>
                    <Badge colorScheme="green">{stats.yes} votes</Badge>
                  </HStack>
                  <Progress 
                    value={parseFloat(stats.yesPercentage)} 
                    colorScheme="green" 
                    size="lg"
                  />
                </Box>
                
                <Box w="100%">
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="sm">No votes</Text>
                    <Badge colorScheme="gray">{stats.no} votes</Badge>
                  </HStack>
                  <Progress 
                    value={parseFloat(stats.noPercentage)} 
                    colorScheme="gray" 
                    size="lg"
                  />
                </Box>
              </VStack>
            </Box>
          )}

          <Box textAlign="center" pt={6}>
            <Text fontSize="sm" color="gray.500">
              Survey: "Would you like us to add Thai language support?"
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 