import { Box, Button, Text, HStack, useToast } from '@chakra-ui/react'
import { FaHandPointUp, FaRegHandPointUp } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function LikeButton() {
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  // 开发环境标识
  const isDev = process.env.NODE_ENV === 'development'

  // 加载点赞数 - 获取历史总量，不是今日数量
  useEffect(() => {
    fetchLikes()
  }, [])

  const fetchLikes = async () => {
    try {
      // 调用 getLikes API - 返回所有历史点赞总数
      const response = await fetch('/api/supabase-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'getLikes' }),
      })

      if (response.ok) {
        const data = await response.json()
        // data.totalLikes 是历史总量，包含所有日期的点赞
        setLikes(data.totalLikes || 0)
        
        // 开发环境下打印调试信息
        if (isDev) {
          console.log('获取到历史总点赞数:', data.totalLikes)
        }
      }
    } catch (error) {
      console.error('获取点赞数失败:', error)
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
        // 更新为新的历史总量（包含刚刚的点赞）
        setLikes(data.totalLikes)
        setHasLiked(true)
        
        if (isDev) {
          console.log('点赞成功，新的历史总量:', data.totalLikes)
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

  return (
    <Box>
      <HStack spacing={2} justify="center" align="center">
        <Button
          leftIcon={hasLiked ? <FaHandPointUp /> : <FaRegHandPointUp />}
          colorScheme="blue"
          variant={hasLiked ? "solid" : "outline"}
          size="sm"
          onClick={handleLike}
          isLoading={isLoading}
          isDisabled={hasLiked}
          _hover={!hasLiked ? { bg: 'blue.50' } : {}}
        >
          {hasLiked ? '已点赞' : '点赞支持'}
        </Button>
        
        <Text fontSize="sm" color="gray.600">
          {/* 显示历史总点赞数，不是今日数量 */}
          {likes} 人点赞 {isDev && <Text as="span" color="orange.500">[Dev]</Text>}
        </Text>
      </HStack>
    </Box>
  )
} 