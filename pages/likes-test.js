import { HStack, ChakraProvider, Container, VStack, Heading, Text, Box, Button, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import LikeStatsPanel from '../components/LikeStatsPanel'
import LikeButton from '../components/LikeButton'
import SEOHead from '../components/SEOHead'

export default function LikesTestPage() {
  const [testData, setTestData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // 测试 API 数据
  const testAPIData = async () => {
    setIsLoading(true)
    try {
      // 1. 测试基础 getLikes
      const basicResponse = await fetch('/api/supabase-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getLikes' }),
      })
      const basicData = await basicResponse.json()

      // 2. 测试详细统计
      const detailedResponse = await fetch('/api/supabase-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getLikesDetailed' }),
      })
      const detailedData = await detailedResponse.json()

      setTestData({
        basic: basicData,
        detailed: detailedData,
        testTime: new Date().toLocaleString('zh-CN')
      })
    } catch (error) {
      console.error('测试 API 失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testAPIData()
  }, [])

  return (
    <ChakraProvider>
      <SEOHead 
        title="点赞统计测试页面"
        description="测试点赞功能和详细统计数据"
      />
      
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="lg" mb={2}>点赞功能测试</Heading>
            <Text color="gray.600" fontSize="sm">
              验证显示的是历史总量而不是今日数量
            </Text>
          </Box>

          {/* API 数据验证 */}
          <Box bg="blue.50" p={4} borderRadius="md">
            <HStack justify="space-between" align="center" mb={3}>
              <Heading size="sm">API 数据验证</Heading>
              <Button size="sm" onClick={testAPIData} isLoading={isLoading}>
                刷新测试
              </Button>
            </HStack>
            
            {testData && (
              <SimpleGrid columns={2} spacing={4}>
                <Stat>
                  <StatLabel>基础 API (getLikes)</StatLabel>
                  <StatNumber color="blue.600">
                    {testData.basic.totalLikes || 0}
                  </StatNumber>
                  <Text fontSize="xs" color="gray.600">历史总量</Text>
                </Stat>

                <Stat>
                  <StatLabel>详细 API (today)</StatLabel>
                  <StatNumber color="green.600">
                    {testData.detailed.todayCount || 0}
                  </StatNumber>
                  <Text fontSize="xs" color="gray.600">今日数量</Text>
                </Stat>
              </SimpleGrid>
            )}

            {testData && (
              <Box mt={4} fontSize="sm">
                <Text fontWeight="medium" mb={2}>数据验证结果:</Text>
                <VStack align="start" spacing={1}>
                  <Text color={testData.basic.totalLikes >= testData.detailed.todayCount ? "green.600" : "red.600"}>
                    ✓ 历史总量 ({testData.basic.totalLikes}) {testData.basic.totalLikes >= testData.detailed.todayCount ? '≥' : '<'} 今日数量 ({testData.detailed.todayCount})
                  </Text>
                  <Text color="gray.600">
                    测试时间: {testData.testTime}
                  </Text>
                </VStack>
              </Box>
            )}
          </Box>

          {/* 基础点赞组件 */}
          <Box>
            <Heading size="md" mb={4}>基础点赞组件</Heading>
            <Box display="flex" justifyContent="center">
              <LikeButton />
            </Box>
            <Text fontSize="sm" color="gray.600" textAlign="center" mt={2}>
              ↑ 应该显示历史总量，不是今日数量
            </Text>
          </Box>

          {/* 详细统计面板 */}
          <Box>
            <Heading size="md" mb={4}>详细统计面板</Heading>
            <LikeStatsPanel showDetailedStats={true} />
            <Text fontSize="sm" color="gray.600" textAlign="center" mt={2}>
              ↑ 大数字是历史总量，详细统计中分别显示今日/昨日数量
            </Text>
          </Box>

          {/* 调试信息 */}
          <Box bg="gray.50" p={4} borderRadius="md">
            <Heading size="sm" mb={3}>调试信息</Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>
                <strong>当前时间：</strong>
                {new Date().toLocaleString('zh-CN')}
              </Text>
              <Text>
                <strong>今日日期：</strong>
                {new Date().toLocaleDateString('zh-CN')}
              </Text>
              <Text>
                <strong>ISO 今日：</strong>
                {new Date().toISOString().split('T')[0]}
              </Text>
              <Text>
                <strong>环境：</strong>
                {process.env.NODE_ENV}
              </Text>
              <Text color="blue.600" fontWeight="medium">
                <strong>重要：</strong>
                所有组件显示的主要数字都应该是历史总量，详细统计才分别显示今日/昨日数据
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </ChakraProvider>
  )
} 