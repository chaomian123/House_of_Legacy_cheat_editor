import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Box
} from '@chakra-ui/react';

export default function FeedbackGroupModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>问题反馈群</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box textAlign="center">
            <Image
              src="/images/feedback_group.jpg"
              alt="问题反馈群二维码"
              maxW="100%"
              borderRadius="md"
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box w="100%" textAlign="center" fontSize="sm" color="gray.500">
            扫描上方二维码加入问题反馈群
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 