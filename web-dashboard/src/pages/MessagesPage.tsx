import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Card,
  CardBody,
  Heading,
  IconButton,
  useToast,
  useColorModeValue,
  Flex,
  Spinner,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';

const MotionBox = motion(Box);

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  riskScore: number;
  status: 'pending' | 'approved' | 'blocked' | 'under_review';
  type: 'sms' | 'email' | 'transaction';
  amount?: number;
  currency?: string;
}

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Mock data
  const mockMessages: Message[] = [
    {
      id: '1',
      sender: '+1-555-0123',
      recipient: '+1-555-0456',
      content: 'Your account has been compromised. Click here to verify: http://fake-link.com',
      timestamp: '2024-01-15T10:30:00Z',
      riskScore: 95,
      status: 'blocked',
      type: 'sms',
    },
    {
      id: '2',
      sender: 'john.doe@example.com',
      recipient: 'support@company.com',
      content: 'I need help with my account verification process',
      timestamp: '2024-01-15T09:15:00Z',
      riskScore: 15,
      status: 'approved',
      type: 'email',
    },
    {
      id: '3',
      sender: 'user123',
      recipient: 'bank',
      content: 'Transfer $10,000 to account 123456789',
      timestamp: '2024-01-15T08:45:00Z',
      riskScore: 78,
      status: 'under_review',
      type: 'transaction',
      amount: 10000,
      currency: 'USD',
    },
    {
      id: '4',
      sender: '+1-555-0789',
      recipient: '+1-555-0123',
      content: 'Your package has been delivered. Track at: https://legitimate-tracking.com',
      timestamp: '2024-01-15T07:20:00Z',
      riskScore: 8,
      status: 'approved',
      type: 'sms',
    },
    {
      id: '5',
      sender: 'suspicious@malware.com',
      recipient: 'admin@company.com',
      content: 'URGENT: Your system has been infected. Download antivirus now: http://malware-link.com',
      timestamp: '2024-01-15T06:10:00Z',
      riskScore: 98,
      status: 'blocked',
      type: 'email',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMessages(mockMessages);
      setFilteredMessages(mockMessages);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = messages;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        msg =>
          msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(msg => msg.status === statusFilter);
    }

    // Risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(msg => {
        if (riskFilter === 'high') return msg.riskScore >= 70;
        if (riskFilter === 'medium') return msg.riskScore >= 30 && msg.riskScore < 70;
        if (riskFilter === 'low') return msg.riskScore < 30;
        return true;
      });
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, statusFilter, riskFilter]);

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'red';
    if (score >= 30) return 'yellow';
    return 'green';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'green';
      case 'blocked': return 'red';
      case 'under_review': return 'yellow';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sms': return FaPhone;
      case 'email': return FaEnvelope;
      case 'transaction': return FaUser;
      default: return FaUser;
    }
  };

  const handleExport = () => {
    const csvContent = [
      'ID,Sender,Recipient,Content,Timestamp,Risk Score,Status,Type',
      ...filteredMessages.map(msg =>
        `"${msg.id}","${msg.sender}","${msg.recipient}","${msg.content}","${msg.timestamp}",${msg.riskScore},${msg.status},${msg.type}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fraudshield-messages.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: 'Messages exported to CSV file',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    onOpen();
  };

  const handleStatusUpdate = (messageId: string, newStatus: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, status: newStatus as any } : msg
      )
    );

    toast({
      title: 'Status updated',
      description: `Message status changed to ${newStatus}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (isLoading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" color="blue.500" />
        <Text mt={4} color="gray.600">Loading messages...</Text>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.200">
            <CardBody>
              <Flex justify="space-between" align="center" mb={6}>
                <VStack align="start" spacing={1}>
                  <Heading size="lg" color="gray.800">
                    Message Monitoring
                  </Heading>
                  <Text color="gray.600">
                    {filteredMessages.length} of {messages.length} messages
                  </Text>
                </VStack>
                <Button
                  leftIcon={<FaDownload />}
                  colorScheme="blue"
                  onClick={handleExport}
                  borderRadius="lg"
                >
                  Export CSV
                </Button>
              </Flex>

              {/* Filters */}
              <HStack spacing={4} wrap="wrap">
                <InputGroup maxW="300px">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    borderRadius="lg"
                  />
                </InputGroup>

                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  maxW="200px"
                  borderRadius="lg"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="blocked">Blocked</option>
                  <option value="under_review">Under Review</option>
                </Select>

                <Select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  maxW="200px"
                  borderRadius="lg"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </Select>
              </HStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Messages Table */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.200">
            <CardBody>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Type</Th>
                      <Th>Sender</Th>
                      <Th>Recipient</Th>
                      <Th>Content</Th>
                      <Th>Risk Score</Th>
                      <Th>Status</Th>
                      <Th>Timestamp</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredMessages.map((message, index) => (
                      <motion.tr
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Td>
                          <HStack>
                            <Icon as={getTypeIcon(message.type)} color="blue.500" />
                            <Text fontSize="sm" textTransform="capitalize">
                              {message.type}
                            </Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontSize="sm" fontWeight="medium" color="gray.800">
                            {message.sender}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" color="gray.600">
                            {message.recipient}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" color="gray.700" noOfLines={2}>
                            {message.content}
                          </Text>
                          {message.amount && (
                            <Text fontSize="xs" color="gray.500" mt={1}>
                              Amount: {message.currency} {message.amount.toLocaleString()}
                            </Text>
                          )}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={getRiskColor(message.riskScore)}
                            variant="subtle"
                            borderRadius="full"
                            px={3}
                            py={1}
                          >
                            {message.riskScore}%
                          </Badge>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={getStatusColor(message.status)}
                            variant="subtle"
                            textTransform="capitalize"
                          >
                            {message.status.replace('_', ' ')}
                          </Badge>
                        </Td>
                        <Td>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(message.timestamp).toLocaleString()}
                          </Text>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Tooltip label="View Details">
                              <IconButton
                                aria-label="View message"
                                icon={<FaEye />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => handleViewMessage(message)}
                              />
                            </Tooltip>
                            <Tooltip label="Update Status">
                              <Select
                                size="sm"
                                value={message.status}
                                onChange={(e) => handleStatusUpdate(message.id, e.target.value)}
                                maxW="120px"
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="blocked">Blocked</option>
                                <option value="under_review">Review</option>
                              </Select>
                            </Tooltip>
                          </HStack>
                        </Td>
                      </motion.tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              {filteredMessages.length === 0 && (
                <Box textAlign="center" py={8}>
                  <Icon as={FaSearch} boxSize={8} color="gray.400" mb={4} />
                  <Text color="gray.500">No messages found matching your criteria</Text>
                </Box>
              )}
            </CardBody>
          </Card>
        </MotionBox>
      </VStack>

      {/* Message Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader>Message Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedMessage && (
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Badge colorScheme={getRiskColor(selectedMessage.riskScore)} variant="subtle">
                    Risk Score: {selectedMessage.riskScore}%
                  </Badge>
                  <Badge colorScheme={getStatusColor(selectedMessage.status)} variant="subtle">
                    {selectedMessage.status.replace('_', ' ')}
                  </Badge>
                </HStack>

                <FormControl>
                  <FormLabel fontWeight="medium">Sender</FormLabel>
                  <Text p={3} bg="gray.50" borderRadius="md">
                    {selectedMessage.sender}
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="medium">Recipient</FormLabel>
                  <Text p={3} bg="gray.50" borderRadius="md">
                    {selectedMessage.recipient}
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="medium">Content</FormLabel>
                  <Textarea
                    value={selectedMessage.content}
                    isReadOnly
                    rows={4}
                    bg="gray.50"
                    borderRadius="md"
                  />
                </FormControl>

                {selectedMessage.amount && (
                  <FormControl>
                    <FormLabel fontWeight="medium">Transaction Amount</FormLabel>
                    <Text p={3} bg="gray.50" borderRadius="md" fontWeight="bold">
                      {selectedMessage.currency} {selectedMessage.amount.toLocaleString()}
                    </Text>
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel fontWeight="medium">Timestamp</FormLabel>
                  <Text p={3} bg="gray.50" borderRadius="md">
                    {new Date(selectedMessage.timestamp).toLocaleString()}
                  </Text>
                </FormControl>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MessagesPage; 