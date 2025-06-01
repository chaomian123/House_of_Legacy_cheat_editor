import { ChakraProvider, Container, VStack, Heading, Text, Box, Button, SimpleGrid, Stat, StatLabel, StatNumber, Alert, AlertIcon, Code, HStack, Badge, Progress, Divider } from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react'
import { FaRocket, FaStopwatch, FaChartLine, FaEye, FaNetworkWired } from 'react-icons/fa'
import SEOHead from '../components/SEOHead'
import PerformanceMonitor from '../lib/performance'

export default function PerformanceTestPage() {
  const [performanceData, setPerformanceData] = useState(null)
  const [isRunningTest, setIsRunningTest] = useState(false)
  const [networkInfo, setNetworkInfo] = useState(null)
  const [loadStartTime, setLoadStartTime] = useState(null)
  const performanceMonitorRef = useRef(null)

  // 获取网络信息
  const getNetworkInfo = () => {
    if (typeof navigator !== 'undefined' && navigator.connection) {
      const connection = navigator.connection
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      }
    }
    return { effectiveType: 'unknown' }
  }

  // 性能测试函数
  const runPerformanceTest = () => {
    setIsRunningTest(true)
    setLoadStartTime(performance.now())
    
    // 启动性能监控
    if (!performanceMonitorRef.current) {
      performanceMonitorRef.current = new PerformanceMonitor()
      performanceMonitorRef.current.startMonitoring()
    }

    // 模拟页面重新加载完成
    setTimeout(() => {
      const endTime = performance.now()
      const loadTime = endTime - loadStartTime
      
      // 收集性能数据
      const perfData = {
        pageLoadTime: loadTime,
        timestamp: new Date().toISOString(),
        navigation: performance.getEntriesByType('navigation')[0],
        resources: performance.getEntriesByType('resource'),
        paint: performance.getEntriesByType('paint'),
        memory: performance.memory || null,
        networkInfo: getNetworkInfo()
      }

      setPerformanceData(perfData)
      setNetworkInfo(getNetworkInfo())
      setIsRunningTest(false)
    }, 2000)
  }

  // 页面加载时自动运行测试
  useEffect(() => {
    setNetworkInfo(getNetworkInfo())
    runPerformanceTest()
    
    return () => {
      if (performanceMonitorRef.current) {
        performanceMonitorRef.current.stopMonitoring()
      }
    }
  }, [])

  // 计算性能评分
  const calculatePerformanceScore = (data) => {
    if (!data) return 0
    
    const fcp = data.paint?.find(p => p.name === 'first-contentful-paint')?.startTime || 0
    const lcp = data.navigation?.loadEventEnd - data.navigation?.loadEventStart || 0
    
    let score = 100
    if (fcp > 2000) score -= 20
    if (lcp > 3000) score -= 30
    if (data.resources?.length > 50) score -= 20
    
    return Math.max(score, 0)
  }

  // 性能对比数据
  const performanceComparison = {
    production: {
      name: '线上环境 (savefile.space)',
      url: 'https://savefile.space',
      expectedMetrics: {
        fcp: '1.2s',
        lcp: '2.5s',
        cls: '0.1',
        fid: '100ms'
      }
    },
    optimized: {
      name: '本地优化版本',
      url: 'localhost:3000',
      features: [
        '延迟加载第三方脚本',
        'CSS 非阻塞加载',
        '网络条件自适应',
        '性能监控集成'
      ]
    }
  }

  return (
    <ChakraProvider>
      <SEOHead 
        title="性能测试对比"
        description="测试延迟加载优化后的页面性能表现"
      />
      
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          {/* 页面标题 */}
          <Box textAlign="center">
            <Heading size="lg" mb={2}>
              <FaRocket style={{ display: 'inline', marginRight: '8px' }} />
              性能测试对比
            </Heading>
            <Text color="gray.600" fontSize="sm">
              对比延迟加载优化前后的性能差异
            </Text>
          </Box>

          {/* 网络信息 */}
          <Box bg="blue.50" p={4} borderRadius="md">
            <HStack justify="space-between" align="center" mb={3}>
              <Text fontWeight="semibold">
                <FaNetworkWired style={{ display: 'inline', marginRight: '8px' }} />
                当前网络状况
              </Text>
              {networkInfo?.saveData && (
                <Badge colorScheme="orange">省流模式</Badge>
              )}
            </HStack>
            <SimpleGrid columns={4} spacing={4}>
              <Stat size="sm">
                <StatLabel>网络类型</StatLabel>
                <StatNumber fontSize="md">
                  {networkInfo?.effectiveType || 'Unknown'}
                </StatNumber>
              </Stat>
              <Stat size="sm">
                <StatLabel>下行速度</StatLabel>
                <StatNumber fontSize="md">
                  {networkInfo?.downlink ? `${networkInfo.downlink} Mbps` : 'N/A'}
                </StatNumber>
              </Stat>
              <Stat size="sm">
                <StatLabel>网络延迟</StatLabel>
                <StatNumber fontSize="md">
                  {networkInfo?.rtt ? `${networkInfo.rtt}ms` : 'N/A'}
                </StatNumber>
              </Stat>
              <Stat size="sm">
                <StatLabel>省流模式</StatLabel>
                <StatNumber fontSize="md">
                  {networkInfo?.saveData ? '开启' : '关闭'}
                </StatNumber>
              </Stat>
            </SimpleGrid>
          </Box>

          {/* 性能测试结果 */}
          <Box>
            <HStack justify="space-between" align="center" mb={4}>
              <Heading size="md">
                <FaStopwatch style={{ display: 'inline', marginRight: '8px' }} />
                性能测试结果
              </Heading>
              <Button 
                onClick={runPerformanceTest}
                isLoading={isRunningTest}
                leftIcon={<FaChartLine />}
                colorScheme="blue"
                size="sm"
              >
                重新测试
              </Button>
            </HStack>

            {isRunningTest && (
              <Box mb={4}>
                <Text fontSize="sm" color="gray.600" mb={2}>正在收集性能数据...</Text>
                <Progress isIndeterminate colorScheme="blue" size="sm" />
              </Box>
            )}

            {performanceData && (
              <SimpleGrid columns={2} spacing={6}>
                {/* 核心指标 */}
                <Box>
                  <Text fontWeight="semibold" mb={3}>Core Web Vitals</Text>
                  <VStack spacing={3}>
                    <Stat size="sm" bg="white" p={3} borderRadius="md" shadow="sm">
                      <StatLabel>First Contentful Paint (FCP)</StatLabel>
                      <StatNumber color="green.500">
                        {performanceData.paint?.find(p => p.name === 'first-contentful-paint')?.startTime 
                          ? `${(performanceData.paint.find(p => p.name === 'first-contentful-paint').startTime).toFixed(0)}ms`
                          : 'N/A'}
                      </StatNumber>
                    </Stat>

                    <Stat size="sm" bg="white" p={3} borderRadius="md" shadow="sm">
                      <StatLabel>Load Event End</StatLabel>
                      <StatNumber color="blue.500">
                        {performanceData.navigation?.loadEventEnd 
                          ? `${(performanceData.navigation.loadEventEnd).toFixed(0)}ms`
                          : 'N/A'}
                      </StatNumber>
                    </Stat>

                    <Stat size="sm" bg="white" p={3} borderRadius="md" shadow="sm">
                      <StatLabel>资源数量</StatLabel>
                      <StatNumber color="purple.500">
                        {performanceData.resources?.length || 0}
                      </StatNumber>
                    </Stat>
                  </VStack>
                </Box>

                {/* 详细数据 */}
                <Box>
                  <Text fontWeight="semibold" mb={3}>详细分析</Text>
                  <VStack spacing={3}>
                    <Box bg="white" p={3} borderRadius="md" shadow="sm" w="full">
                      <Text fontSize="sm" fontWeight="medium" mb={2}>性能评分</Text>
                      <Box>
                        <Progress 
                          value={calculatePerformanceScore(performanceData)} 
                          colorScheme={calculatePerformanceScore(performanceData) > 80 ? 'green' : 'orange'}
                          size="lg"
                        />
                        <Text fontSize="lg" fontWeight="bold" textAlign="center" mt={2}>
                          {calculatePerformanceScore(performanceData)}/100
                        </Text>
                      </Box>
                    </Box>

                    {performanceData.memory && (
                      <Stat size="sm" bg="white" p={3} borderRadius="md" shadow="sm">
                        <StatLabel>内存使用</StatLabel>
                        <StatNumber color="red.500">
                          {(performanceData.memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB
                        </StatNumber>
                      </Stat>
                    )}

                    <Box bg="white" p={3} borderRadius="md" shadow="sm" w="full">
                      <Text fontSize="sm" fontWeight="medium" mb={2}>测试时间</Text>
                      <Code fontSize="xs">
                        {new Date(performanceData.timestamp).toLocaleString('zh-CN')}
                      </Code>
                    </Box>
                  </VStack>
                </Box>
              </SimpleGrid>
            )}
          </Box>

          <Divider />

          {/* 性能对比指南 */}
          <Box>
            <Heading size="md" mb={4}>
              <FaEye style={{ display: 'inline', marginRight: '8px' }} />
              性能对比指南
            </Heading>

            <SimpleGrid columns={2} spacing={6}>
              {/* 线上环境 */}
              <Box bg="yellow.50" p={4} borderRadius="md">
                <Text fontWeight="semibold" mb={3} color="yellow.800">
                  {performanceComparison.production.name}
                </Text>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm">
                    <strong>URL:</strong> {performanceComparison.production.url}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">预期性能指标:</Text>
                  {Object.entries(performanceComparison.production.expectedMetrics).map(([key, value]) => (
                    <Text key={key} fontSize="sm">
                      <Code fontSize="xs">{key.toUpperCase()}</Code>: {value}
                    </Text>
                  ))}
                </VStack>
              </Box>

              {/* 本地优化版本 */}
              <Box bg="green.50" p={4} borderRadius="md">
                <Text fontWeight="semibold" mb={3} color="green.800">
                  {performanceComparison.optimized.name}
                </Text>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm">
                    <strong>URL:</strong> {performanceComparison.optimized.url}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">优化功能:</Text>
                  {performanceComparison.optimized.features.map((feature, index) => (
                    <Text key={index} fontSize="sm">
                      • {feature}
                    </Text>
                  ))}
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>

          {/* 测试建议 */}
          <Alert status="info">
            <AlertIcon />
            <Box>
              <Text fontWeight="semibold">测试建议</Text>
              <VStack align="start" spacing={1} mt={2} fontSize="sm">
                <Text>1. 使用 Chrome DevTools 的 Lighthouse 工具进行详细分析</Text>
                <Text>2. 在不同网络条件下测试（Fast 3G, Slow 3G, Offline）</Text>
                <Text>3. 对比相同页面在 savefile.space 和本地的加载时间</Text>
                <Text>4. 观察 Network 面板中第三方脚本的加载时机</Text>
                <Text>5. 检查 Performance 面板中的 FCP、LCP 等指标</Text>
              </VStack>
            </Box>
          </Alert>

          {/* 快速测试链接 */}
          <Box bg="gray.50" p={4} borderRadius="md">
            <Text fontWeight="semibold" mb={3}>快速对比测试</Text>
            <SimpleGrid columns={2} spacing={4}>
              <Button 
                as="a" 
                href="https://savefile.space" 
                target="_blank"
                colorScheme="blue" 
                variant="outline"
                size="sm"
              >
                打开线上版本
              </Button>
              <Button 
                as="a" 
                href="http://localhost:3000" 
                target="_blank"
                colorScheme="green" 
                variant="outline"
                size="sm"
              >
                打开本地版本
              </Button>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </ChakraProvider>
  )
} 