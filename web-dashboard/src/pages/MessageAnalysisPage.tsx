import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Textarea,
  Button,
  Card,
  CardBody,
  Heading,
  Icon,
  useToast,
  useColorModeValue,
  Badge,
  Progress,
  Divider,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaCopy,
  FaDownload,
  FaInfoCircle,
  FaExclamation,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';

const MotionBox = motion(Box);

interface AnalysisResult {
  riskScore: number;
  isScam: boolean;
  confidence: number;
  analysis: {
    redFlags: string[];
    greenFlags: string[];
    neutralFlags: string[];
  };
  details: {
    urgency: boolean;
    financialPressure: boolean;
    suspiciousLinks: boolean;
    grammarIssues: boolean;
    impersonation: boolean;
    unusualRequests: boolean;
  };
  recommendations: string[];
  category: 'high_risk' | 'medium_risk' | 'low_risk';
}

const MessageAnalysisPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const analyzeMessage = async () => {
    if (!message.trim()) {
      toast({
        title: 'No message to analyze',
        description: 'Please enter a message to analyze',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Simulate API call to ML service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result based on message content
      const result = performMockAnalysis(message);
      setAnalysisResult(result);
      
      toast({
        title: 'Analysis complete!',
        description: `Risk score: ${result.riskScore}%`,
        status: result.isScam ? 'error' : 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performMockAnalysis = (text: string): AnalysisResult => {
    const lowerText = text.toLowerCase();
    let riskScore = 0;
    const redFlags: string[] = [];
    const greenFlags: string[] = [];
    const neutralFlags: string[] = [];
    
    // Check for common scam indicators
    if (lowerText.includes('urgent') || lowerText.includes('immediate')) {
      riskScore += 15;
      redFlags.push('Contains urgent language');
    }
    
    if (lowerText.includes('bank') || lowerText.includes('account') || lowerText.includes('credit card')) {
      riskScore += 10;
      redFlags.push('Mentions financial institutions');
    }
    
    if (lowerText.includes('click here') || lowerText.includes('http://') || lowerText.includes('www.')) {
      riskScore += 20;
      redFlags.push('Contains suspicious links');
    }
    
    if (lowerText.includes('verify') || lowerText.includes('confirm')) {
      riskScore += 10;
      redFlags.push('Requests verification');
    }
    
    if (lowerText.includes('limited time') || lowerText.includes('act now')) {
      riskScore += 15;
      redFlags.push('Creates time pressure');
    }
    
    if (lowerText.includes('free') && (lowerText.includes('money') || lowerText.includes('prize'))) {
      riskScore += 25;
      redFlags.push('Promises unrealistic rewards');
    }
    
    if (lowerText.includes('government') || lowerText.includes('irs') || lowerText.includes('tax')) {
      riskScore += 15;
      redFlags.push('Claims government authority');
    }
    
    // Check for legitimate indicators
    if (lowerText.includes('thank you') || lowerText.includes('appreciate')) {
      riskScore -= 5;
      greenFlags.push('Contains polite language');
    }
    
    if (lowerText.includes('customer service') || lowerText.includes('support')) {
      riskScore -= 5;
      greenFlags.push('Mentions customer service');
    }
    
    // Grammar and spelling checks
    const words = text.split(' ');
    const misspelledWords = words.filter(word => 
      word.length > 3 && !/^[a-zA-Z]+$/.test(word.replace(/[.,!?]/g, ''))
    );
    
    if (misspelledWords.length > words.length * 0.1) {
      riskScore += 10;
      redFlags.push('Contains spelling/grammar errors');
    }
    
    // Normalize risk score
    riskScore = Math.max(0, Math.min(100, riskScore));
    
    const isScam = riskScore > 50;
    const confidence = Math.min(95, 50 + Math.abs(riskScore - 50));
    
    let category: 'high_risk' | 'medium_risk' | 'low_risk';
    if (riskScore >= 70) category = 'high_risk';
    else if (riskScore >= 30) category = 'medium_risk';
    else category = 'low_risk';
    
    return {
      riskScore,
      isScam,
      confidence,
      analysis: { redFlags, greenFlags, neutralFlags },
      details: {
        urgency: lowerText.includes('urgent') || lowerText.includes('immediate'),
        financialPressure: lowerText.includes('bank') || lowerText.includes('account'),
        suspiciousLinks: lowerText.includes('http://') || lowerText.includes('www.'),
        grammarIssues: misspelledWords.length > words.length * 0.1,
        impersonation: lowerText.includes('government') || lowerText.includes('irs'),
        unusualRequests: lowerText.includes('verify') || lowerText.includes('confirm'),
      },
      recommendations: generateRecommendations(riskScore, redFlags),
      category,
    };
  };

  const generateRecommendations = (riskScore: number, redFlags: string[]): string[] => {
    const recommendations = [];
    
    if (riskScore > 70) {
      recommendations.push('Do not respond to this message');
      recommendations.push('Block the sender if possible');
      recommendations.push('Report to relevant authorities');
    } else if (riskScore > 40) {
      recommendations.push('Verify the sender through official channels');
      recommendations.push('Do not click any links');
      recommendations.push('Contact the organization directly');
    } else {
      recommendations.push('Message appears legitimate');
      recommendations.push('Exercise normal caution');
    }
    
    if (redFlags.some(flag => flag.includes('links'))) {
      recommendations.push('Avoid clicking any links in the message');
    }
    
    if (redFlags.some(flag => flag.includes('financial'))) {
      recommendations.push('Never share financial information via message');
    }
    
    return recommendations;
  };

  const copyToClipboard = async () => {
    if (analysisResult) {
      const report = `
FraudShield Analysis Report
==========================
Risk Score: ${analysisResult.riskScore}%
Category: ${analysisResult.category.replace('_', ' ').toUpperCase()}
Is Scam: ${analysisResult.isScam ? 'YES' : 'NO'}
Confidence: ${analysisResult.confidence}%

Red Flags:
${analysisResult.analysis.redFlags.map(flag => `- ${flag}`).join('\n')}

Recommendations:
${analysisResult.recommendations.map(rec => `- ${rec}`).join('\n')}
      `.trim();
      
      try {
        await navigator.clipboard.writeText(report);
        setCopied(true);
        toast({
          title: 'Report copied!',
          description: 'Analysis report copied to clipboard',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast({
          title: 'Copy failed',
          description: 'Please copy manually',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'red';
    if (score >= 30) return 'yellow';
    return 'green';
  };

  const getRiskIcon = (score: number) => {
    if (score >= 70) return FaExclamationTriangle;
    if (score >= 30) return FaExclamation;
    return FaCheckCircle;
  };

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.200">
            <CardBody>
              <VStack spacing={4} align="center">
                <Box
                  p={4}
                  borderRadius="full"
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                >
                  <Icon as={FaShieldAlt} boxSize={8} />
                </Box>
                <Heading size="lg" color="gray.800" textAlign="center">
                  Message Fraud Analysis
                </Heading>
                <Text color="gray.600" textAlign="center" fontSize="lg">
                  Paste any message to analyze it for potential fraud indicators
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Input Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.200">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="gray.800">
                  Enter Message to Analyze
                </Heading>
                <Textarea
                  placeholder="Paste the suspicious message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  size="lg"
                  minH="200px"
                  borderRadius="lg"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px #3182ce',
                  }}
                />
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.500">
                    {message.length} characters
                  </Text>
                  <Button
                    leftIcon={<FaSearch />}
                    colorScheme="blue"
                    onClick={analyzeMessage}
                    isLoading={isAnalyzing}
                    loadingText="Analyzing..."
                    borderRadius="lg"
                    size="lg"
                  >
                    Analyze Message
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Analysis Results */}
        {isAnalyzing && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.200">
              <CardBody>
                <VStack spacing={4} align="center" py={8}>
                  <Spinner size="xl" color="blue.500" />
                  <Text fontSize="lg" color="gray.600">
                    Analyzing message for fraud indicators...
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    This may take a few seconds
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        )}

        {analysisResult && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <VStack spacing={6} align="stretch">
              {/* Risk Summary */}
              <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.200">
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <HStack justify="space-between" align="center">
                      <Heading size="md" color="gray.800">
                        Analysis Results
                      </Heading>
                      <Button
                        leftIcon={<FaCopy />}
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        isDisabled={copied}
                      >
                        {copied ? 'Copied!' : 'Copy Report'}
                      </Button>
                    </HStack>

                    <HStack spacing={6} justify="center">
                      <Stat textAlign="center">
                        <StatLabel fontSize="sm" color="gray.600">Risk Score</StatLabel>
                        <StatNumber fontSize="3xl" color={`${getRiskColor(analysisResult.riskScore)}.500`}>
                          {analysisResult.riskScore}%
                        </StatNumber>
                        <StatHelpText>
                          <StatArrow type={analysisResult.riskScore > 50 ? 'increase' : 'decrease'} />
                          {analysisResult.riskScore > 50 ? 'High Risk' : 'Low Risk'}
                        </StatHelpText>
                      </Stat>

                      <Stat textAlign="center">
                        <StatLabel fontSize="sm" color="gray.600">Confidence</StatLabel>
                        <StatNumber fontSize="3xl" color="blue.500">
                          {analysisResult.confidence}%
                        </StatNumber>
                        <StatHelpText>Analysis Confidence</StatHelpText>
                      </Stat>
                    </HStack>

                    <Alert
                      status={analysisResult.isScam ? 'error' : 'success'}
                      borderRadius="lg"
                    >
                      <AlertIcon />
                      <Box>
                        <AlertTitle>
                          {analysisResult.isScam ? 'Potential Scam Detected' : 'Message Appears Legitimate'}
                        </AlertTitle>
                        <AlertDescription>
                          {analysisResult.isScam 
                            ? 'This message shows multiple signs of being a scam. Exercise extreme caution.'
                            : 'This message appears to be legitimate, but always verify through official channels.'
                          }
                        </AlertDescription>
                      </Box>
                    </Alert>
                  </VStack>
                </CardBody>
              </Card>

              {/* Detailed Analysis */}
              <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.200">
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" color="gray.800">
                      Detailed Analysis
                    </Heading>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      {/* Red Flags */}
                      {analysisResult.analysis.redFlags.length > 0 && (
                        <VStack align="start" spacing={3}>
                          <HStack>
                            <Icon as={FaTimesCircle} color="red.500" />
                            <Text fontWeight="bold" color="red.600">
                              Red Flags ({analysisResult.analysis.redFlags.length})
                            </Text>
                          </HStack>
                          <List spacing={2}>
                            {analysisResult.analysis.redFlags.map((flag, index) => (
                              <ListItem key={index} fontSize="sm" color="gray.700">
                                <ListIcon as={FaTimes} color="red.500" />
                                {flag}
                              </ListItem>
                            ))}
                          </List>
                        </VStack>
                      )}

                      {/* Green Flags */}
                      {analysisResult.analysis.greenFlags.length > 0 && (
                        <VStack align="start" spacing={3}>
                          <HStack>
                            <Icon as={FaCheckCircle} color="green.500" />
                            <Text fontWeight="bold" color="green.600">
                              Positive Indicators ({analysisResult.analysis.greenFlags.length})
                            </Text>
                          </HStack>
                          <List spacing={2}>
                            {analysisResult.analysis.greenFlags.map((flag, index) => (
                              <ListItem key={index} fontSize="sm" color="gray.700">
                                <ListIcon as={FaCheck} color="green.500" />
                                {flag}
                              </ListItem>
                            ))}
                          </List>
                        </VStack>
                      )}
                    </SimpleGrid>

                    {/* Recommendations */}
                    <VStack align="start" spacing={3}>
                      <HStack>
                        <Icon as={FaInfoCircle} color="blue.500" />
                        <Text fontWeight="bold" color="blue.600">
                          Recommendations
                        </Text>
                      </HStack>
                      <List spacing={2}>
                        {analysisResult.recommendations.map((rec, index) => (
                          <ListItem key={index} fontSize="sm" color="gray.700">
                            <ListIcon as={FaInfoCircle} color="blue.500" />
                            {rec}
                          </ListItem>
                        ))}
                      </List>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </MotionBox>
        )}
      </VStack>
    </Box>
  );
};

export default MessageAnalysisPage; 