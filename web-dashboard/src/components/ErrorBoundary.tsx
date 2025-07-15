import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  useToast,
  Card,
  CardBody,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Card
            maxW="600px"
            w="full"
            bg="white"
            borderRadius="xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor="gray.200"
          >
            <CardBody p={8}>
              <VStack spacing={6} align="center">
                {/* Error Icon */}
                <Box
                  p={4}
                  borderRadius="full"
                  bg="red.100"
                  color="red.600"
                >
                  <Icon as={FaExclamationTriangle} boxSize={8} />
                </Box>

                {/* Error Title */}
                <VStack spacing={2}>
                  <Heading size="lg" color="gray.800" textAlign="center">
                    Oops! Something went wrong
                  </Heading>
                  <Text color="gray.600" textAlign="center" fontSize="lg">
                    We encountered an unexpected error. Don't worry, our team has been notified.
                  </Text>
                </VStack>

                {/* Error Details */}
                <Alert status="error" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Error Details</AlertTitle>
                    <AlertDescription fontSize="sm">
                      {this.state.error?.message || 'An unknown error occurred'}
                    </AlertDescription>
                  </Box>
                </Alert>

                {/* Action Buttons */}
                <HStack spacing={4} w="full" justify="center">
                  <Button
                    leftIcon={<FaRedo />}
                    colorScheme="blue"
                    onClick={this.handleReload}
                    borderRadius="lg"
                    size="lg"
                  >
                    Reload Page
                  </Button>
                  <Button
                    leftIcon={<FaHome />}
                    variant="outline"
                    onClick={this.handleGoHome}
                    borderRadius="lg"
                    size="lg"
                  >
                    Go Home
                  </Button>
                </HStack>

                {/* Technical Details (Collapsible) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <Box w="full">
                    <details>
                      <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>
                        Technical Details (Development)
                      </summary>
                      <Box
                        p={4}
                        bg="gray.50"
                        borderRadius="md"
                        fontSize="sm"
                        fontFamily="mono"
                        overflowX="auto"
                      >
                        <Text fontWeight="bold" mb={2}>Error:</Text>
                        <Text color="red.600" mb={4}>
                          {this.state.error.toString()}
                        </Text>
                        
                        {this.state.errorInfo && (
                          <>
                            <Text fontWeight="bold" mb={2}>Stack Trace:</Text>
                            <Text color="gray.700" whiteSpace="pre-wrap">
                              {this.state.errorInfo.componentStack}
                            </Text>
                          </>
                        )}
                      </Box>
                    </details>
                  </Box>
                )}

                {/* Support Information */}
                <Box
                  p={4}
                  bg="blue.50"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="blue.200"
                  w="full"
                >
                  <Text fontSize="sm" color="blue.700" textAlign="center">
                    If this problem persists, please contact our support team at{' '}
                    <Text as="span" fontWeight="bold">support@fraudshield.com</Text>
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 