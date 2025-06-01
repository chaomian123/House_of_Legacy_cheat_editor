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

  // 加载点赞数
  useEffect(() => {
    fetchLikes()
  }, [])

  const fetchLikes = async () => {
    try {
      const response = await fetch('/api/supabase-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'getLikes' }),
      })

      if (response.ok) {
        const data = await response.json()
        setLikes(data.totalLikes || 0)
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
        setLikes(data.totalLikes)
        setHasLiked(true)
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
          {likes} 人点赞 {isDev && <Text as="span" color="orange.500">[Dev]</Text>}
        </Text>
      </HStack>
    </Box>
  )
} 