import { useState, useEffect } from 'react'
import { Button, Text, HStack, useToast, Spinner } from '@chakra-ui/react'
import { FaHandPointUp, FaRegHandPointUp } from 'react-icons/fa'
import { supabase, ENV_INFO } from '../lib/supabase'

export default function LikeButton() {
  const [likeCount, setLikeCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const toast = useToast()

  // 🎛️ 智能IP限制：开发环境禁用，生产环境启用
  const ENABLE_IP_LIMIT = process.env.NODE_ENV === 'production'

  // 获取客户端IP地址
  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error('Failed to get IP:', error)
      return 'unknown'
    }
  }

  // 获取点赞数
  const fetchLikeCount = async () => {
    try {
      setIsLoading(true)
      
      // 获取总点赞数
      const { data: countData, error: countError } = await supabase
        .from('like_count')
        .select('count')
        .eq('id', 1)
        .maybeSingle()

      if (countError) {
        console.error('Count error:', countError)
        throw countError
      }

      const count = countData?.count || 0
      setLikeCount(count)

      // 🎯 智能IP检查：只在生产环境启用
      if (ENABLE_IP_LIMIT) {
        const clientIP = await getClientIP()
        const today = new Date().toISOString().split('T')[0]
        
        const { data: likeData, error: likeError } = await supabase
          .from('likes')
          .select('id')
          .eq('ip', clientIP)
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lt('created_at', `${today}T23:59:59.999Z`)
          .maybeSingle()

        if (likeError && likeError.code !== 'PGRST116') {
          console.error('Like check error:', likeError)
        }

        if (likeData) {
          setHasLiked(true)
        }
      }

    } catch (error) {
      console.error('Error fetching like count:', error)
      toast({
        title: 'Error',
        description: 'Failed to load like count',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 点赞功能
  const handleLike = async () => {
    if (isLiking) return
    if (ENABLE_IP_LIMIT && hasLiked) return // 生产环境检查是否已点赞

    try {
      setIsLiking(true)
      const clientIP = await getClientIP()

      // 🎯 智能IP限制检查：只在生产环境启用
      if (ENABLE_IP_LIMIT) {
        const today = new Date().toISOString().split('T')[0]
        const { data: existingLike, error: checkError } = await supabase
          .from('likes')
          .select('id')
          .eq('ip', clientIP)
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lt('created_at', `${today}T23:59:59.999Z`)
          .maybeSingle()

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError
        }

        if (existingLike) {
          toast({
            title: 'Unable to like',
            description: 'You have already liked today. Please try again tomorrow.',
            status: 'warning',
            duration: 4000,
            isClosable: true,
          })
          return
        }
      }

      // 添加点赞记录
      const { error: insertError } = await supabase
        .from('likes')
        .insert([{ ip: clientIP }])

      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }

      // 获取当前计数
      const { data: currentCount, error: getCountError } = await supabase
        .from('like_count')
        .select('count')
        .eq('id', 1)
        .maybeSingle()

      if (getCountError) {
        console.error('Get count error:', getCountError)
        throw getCountError
      }

      const newCount = (currentCount?.count || 0) + 1

      // 更新计数
      const { error: updateError } = await supabase
        .from('like_count')
        .update({ count: newCount })
        .eq('id', 1)

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }

      setLikeCount(newCount)
      
      // 🎯 生产环境设置已点赞状态
      if (ENABLE_IP_LIMIT) {
        setHasLiked(true)
      }
      
      toast({
        title: 'Success!',
        description: `Thank you for your like! Total: ${newCount}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

    } catch (error) {
      console.error('Error liking:', error)
      toast({
        title: 'Error',
        description: 'Failed to process your like',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLiking(false)
    }
  }

  // 页面加载时获取点赞数
  useEffect(() => {
    fetchLikeCount()
  }, [])

  return (
    <HStack spacing={3} align="center" justify="center">
      {/* 小手点赞按钮 */}
      <Button
        leftIcon={hasLiked ? <FaHandPointUp /> : <FaRegHandPointUp />}
        colorScheme={hasLiked ? "blue" : "gray"}
        variant={hasLiked ? "solid" : "outline"}
        size="sm"
        onClick={handleLike}
        isLoading={isLiking}
        loadingText="..."
        isDisabled={ENABLE_IP_LIMIT && hasLiked}
        _hover={!(ENABLE_IP_LIMIT && hasLiked) ? { 
          colorScheme: "blue", 
          variant: "solid",
          transform: "scale(1.02)" 
        } : {}}
        transition="all 0.2s"
        fontSize="sm"
      >
        {hasLiked ? 'Liked' : 'Like'}
      </Button>
      
      {/* 点赞数显示 */}
      <HStack spacing={1} align="center">
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <>
            <FaHandPointUp color="#3182CE" size="14px" />
            <Text fontWeight="semibold" color="gray.600" fontSize="sm">
              {likeCount.toLocaleString()}
            </Text>
          </>
        )}
      </HStack>
      
      {/* 开发环境状态指示器 */}
      {ENV_INFO.isDevelopment && (
        <Text fontSize="xs" color="orange.400" fontStyle="italic">
          [Dev]
        </Text>
      )}
    </HStack>
  )
} 