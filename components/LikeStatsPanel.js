import { 
  Box, 
  Button, 
  Text, 
  HStack, 
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Divider
} from '@chakra-ui/react'
import { FaHandPointUp, FaRegHandPointUp, FaChartLine, FaCalendarDay, FaClock } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function LikeStatsPanel({ showDetailedStats = false }) {
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [detailedStats, setDetailedStats] = useState(null)
  const toast = useToast()

  // 开发环境标识
  const isDev = process.env.NODE_ENV === 'development'

  // 加载点赞数
  useEffect(() => {
    fetchLikes()
    if (showDetailedStats) {
      fetchDetailedStats()
    }
  }, [showDetailedStats])

  const fetchLikes = async () => {
    try {
      // 调用 getLikes API - 获取所有历史总点赞数
      const response = await fetch('/api/supabase-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'getLikes' }),
      })

      if (response.ok) {
        const data = await response.json()
        // 设置历史总量，不是今日数量
        setLikes(data.totalLikes || 0)
        
        // 开发环境下打印调试信息
        if (isDev) {
          console.log('LikeStatsPanel - 获取到历史总点赞数:', data.totalLikes)
        }
      } else {
        console.error('获取点赞数失败:', response.status)
      }
    } catch (error) {
      console.error('获取点赞数失败:', error)
    }
  }

  const fetchDetailedStats = async () => {
    setIsLoadingStats(true)
    try {
      // 调用 getLikesDetailed API - 获取详细统计（包含历史总量和今日统计）
      const response = await fetch('/api/supabase-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'getLikesDetailed' }),
      })

      if (response.ok) {
        const data = await response.json()
        setDetailedStats(data)
        
        // 开发环境下打印详细统计
        if (isDev) {
          console.log('详细统计数据:', {
            历史总量: data.totalCount,
            今日数量: data.todayCount,
            昨日数量: data.yesterdayCount
          })
        }
      }
    } catch (error) {
      console.error('获取详细统计失败:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleLike = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/supabase-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'like' }),
      })

      const data = await response.json()

      if (response.ok) {
        setLikes(data.totalLikes)
        setHasLiked(true)
        
        // 刷新详细统计
        if (showDetailedStats) {
          setTimeout(fetchDetailedStats, 1000)
        }
        
        toast({
          title: "感谢点赞！",
          description: "您的支持是我们前进的动力",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } else {
        if (data.error === 'Already liked today') {
          setHasLiked(true)
          toast({
            title: "今日已点赞",
            description: "每天只能点赞一次哦",
            status: "info",
            duration: 3000,
            isClosable: true,
          })
        } else {
          throw new Error(data.error || '点赞失败')
        }
      }
    } catch (error) {
      console.error('点赞失败:', error)
      toast({
        title: "点赞失败",
        description: error.message || "网络错误，请稍后重试",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '无数据'
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="white" shadow="sm">
      <VStack spacing={4} align="stretch">
        {/* 基础点赞功能 */}
        <HStack spacing={3} justify="center" align="center">
          <Button
            leftIcon={hasLiked ? <FaHandPointUp /> : <FaRegHandPointUp />}
            colorScheme="blue"
            variant={hasLiked ? "solid" : "outline"}
            size="md"
            onClick={handleLike}
            isLoading={isLoading}
            isDisabled={hasLiked}
            _hover={!hasLiked ? { bg: 'blue.50' } : {}}
          >
            {hasLiked ? '已点赞' : '点赞支持'}
          </Button>
          
          <VStack spacing={0} align="center">
            <Text fontSize="lg" fontWeight="bold" color="blue.600">
              {likes}
            </Text>
            <Text fontSize="xs" color="gray.500">
              历史总点赞
              {isDev && <Text as="span" color="orange.500" ml={1}>[Dev]</Text>}
            </Text>
          </VStack>
        </HStack>

        {/* 详细统计（可选） */}
        {showDetailedStats && (
          <>
            <Divider />
            
            {isLoadingStats ? (
              <HStack justify="center" py={4}>
                <Spinner size="sm" />
                <Text fontSize="sm" color="gray.500">加载统计数据...</Text>
              </HStack>
            ) : detailedStats ? (
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between" align="center">
                  <Text fontSize="md" fontWeight="semibold" color="gray.700">
                    <FaChartLine style={{ display: 'inline', marginRight: '8px' }} />
                    详细统计
                  </Text>
                  <Button 
                    size="xs" 
                    variant="ghost" 
                    onClick={fetchDetailedStats}
                    leftIcon={<FaClock />}
                  >
                    刷新
                  </Button>
                </HStack>

                <SimpleGrid columns={2} spacing={3}>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">今日点赞</StatLabel>
                    <StatNumber fontSize="lg" color="green.500">
                      {detailedStats.todayCount || 0}
                    </StatNumber>
                    <StatHelpText fontSize="xs" mb={0}>
                      <FaCalendarDay style={{ display: 'inline', marginRight: '4px' }} />
                      {new Date().toLocaleDateString('zh-CN')}
                    </StatHelpText>
                  </Stat>

                  <Stat size="sm">
                    <StatLabel fontSize="xs">昨日点赞</StatLabel>
                    <StatNumber fontSize="lg" color="blue.500">
                      {detailedStats.yesterdayCount || 0}
                    </StatNumber>
                    <StatHelpText fontSize="xs" mb={0}>
                      对比前一天
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>

                {detailedStats.recentDays && detailedStats.recentDays.length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
                      最近7天趋势
                    </Text>
                    <VStack spacing={1} align="stretch">
                      {detailedStats.recentDays.slice(0, 7).map((day, index) => (
                        <HStack key={index} justify="space-between" fontSize="xs">
                          <Text color="gray.600">{day.date}</Text>
                          <HStack>
                            <Text color="blue.500" fontWeight="medium">{day.count}</Text>
                            <Text color="gray.400">次</Text>
                          </HStack>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                )}

                {detailedStats.lastLikeTime && (
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    最近点赞: {formatDate(detailedStats.lastLikeTime)}
                  </Text>
                )}
              </VStack>
            ) : (
              <Alert status="info" size="sm">
                <AlertIcon />
                <Text fontSize="sm">暂无详细统计数据</Text>
              </Alert>
            )}
          </>
        )}
      </VStack>
    </Box>
  )
} 