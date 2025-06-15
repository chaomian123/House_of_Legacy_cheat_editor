import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  useToast
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useLocale } from '../../lib/useLocale';

export default function SurveyVote({ 
  surveyId,
  question,
  yesText,
  noText,
  onVoteComplete
}) {
  const [surveyStats, setSurveyStats] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { locale, t } = useLocale();
  const toast = useToast();

  // 获取调查统计
  const fetchSurveyStats = async () => {
    try {
      const response = await fetch(`/api/survey?surveyId=${surveyId}`);
      const data = await response.json();
      setSurveyStats(data.stats);
    } catch (error) {
      console.error('Error fetching survey stats:', error);
    }
  };

  // 处理投票
  const handleVote = async (vote) => {
    if (hasVoted) {
      toast({
        title: locale === 'zh' ? "已经投过票了" : "Already voted",
        description: locale === 'zh' ? "您已经参与过这个调查了" : "You have already participated in this survey.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsVoting(true);
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'vote',
          surveyId,
          vote: vote
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setHasVoted(true);
        setSurveyStats(data.stats);
        setShowStats(true);
        if (onVoteComplete) {
          onVoteComplete(vote, data.stats);
        }
        toast({
          title: locale === 'zh' ? "投票成功！" : "Vote recorded!",
          description: locale === 'zh' ? "感谢您的反馈！" : "Thank you for your feedback!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        if (data.error === 'You have already voted') {
          setHasVoted(true);
          setShowStats(true);
          await fetchSurveyStats();
        }
        toast({
          title: locale === 'zh' ? "错误" : "Error",
          description: data.error || (locale === 'zh' ? "投票失败" : "Failed to record vote"),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: locale === 'zh' ? "错误" : "Error",
        description: locale === 'zh' ? "网络错误，请稍后重试" : "Network error. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsVoting(false);
    }
  };

  // 组件加载时获取统计数据
  useEffect(() => {
    fetchSurveyStats();
  }, [surveyId]);

  return (
    <Box textAlign='center' mb='4'>
      <Text fontSize="sm" color="gray.600" mb='2'>
        {question}
      </Text>
      
      {!hasVoted && !showStats ? (
        <HStack spacing={2} justifyContent='center'>
          <Button 
            size="sm" 
            colorScheme="green" 
            variant="outline"
            onClick={() => handleVote('yes')}
            isLoading={isVoting}
            disabled={isVoting}
          >
            {yesText}
          </Button>
          <Button 
            size="sm" 
            colorScheme="gray" 
            variant="outline"
            onClick={() => handleVote('no')}
            isLoading={isVoting}
            disabled={isVoting}
          >
            {noText}
          </Button>
        </HStack>
      ) : (
        <VStack spacing={2}>
          {hasVoted && (
            <Text fontSize="xs" color="green.600" fontWeight="medium">
              {locale === 'zh' ? "✓ 感谢您的投票！" : "✓ Thank you for voting!"}
            </Text>
          )}
          
          {surveyStats && (
            <HStack spacing={4} fontSize="sm">
              <HStack>
                <Badge colorScheme="green" variant="outline">
                  {locale === 'zh' ? "是" : "Yes"}: {surveyStats.yes} ({surveyStats.yesPercentage}%)
                </Badge>
              </HStack>
              <HStack>
                <Badge colorScheme="gray" variant="outline">
                  {locale === 'zh' ? "否" : "No"}: {surveyStats.no} ({surveyStats.noPercentage}%)
                </Badge>
              </HStack>
              <Text color="gray.500" fontSize="xs">
                {locale === 'zh' ? "总计" : "Total"}: {surveyStats.total} {locale === 'zh' ? "票" : "votes"}
              </Text>
            </HStack>
          )}
          
          {!hasVoted && (
            <Button 
              size="xs" 
              variant="ghost" 
              onClick={() => setShowStats(false)}
            >
              {locale === 'zh' ? "现在投票" : "Vote now"}
            </Button>
          )}
        </VStack>
      )}
    </Box>
  );
} 