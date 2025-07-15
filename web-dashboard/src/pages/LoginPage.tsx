import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Heading,
  Icon,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaShieldAlt, FaLock, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const toast = useToast();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any valid email/password
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
      
      toast({
        title: 'Login successful!',
        description: 'Welcome to FraudShield Dashboard',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      bg={bgColor}
      align="center"
      justify="center"
      p={4}
      backgroundImage="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        w="full"
        maxW="400px"
      >
        <Box
          bg={cardBg}
          p={8}
          borderRadius="xl"
          boxShadow="2xl"
          border="1px solid"
          borderColor={borderColor}
        >
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <VStack spacing={3}>
              <Box
                p={4}
                borderRadius="full"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
              >
                <Icon as={FaShieldAlt} boxSize={8} />
              </Box>
              <Heading size="lg" textAlign="center" color="gray.700">
                Welcome to FraudShield
              </Heading>
              <Text textAlign="center" color="gray.500" fontSize="sm">
                Secure fraud detection and monitoring platform
              </Text>
            </VStack>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                    Email Address
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size="lg"
                      borderRadius="lg"
                      borderColor={borderColor}
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px #3182ce',
                      }}
                    />
                    <InputRightElement pointerEvents="none" top="50%" transform="translateY(-50%)">
                      <Icon as={FaUser} color="gray.400" />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                    Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      size="lg"
                      borderRadius="lg"
                      borderColor={borderColor}
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px #3182ce',
                      }}
                    />
                    <InputRightElement top="50%" transform="translateY(-50%)">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        _hover={{ bg: 'transparent' }}
                      >
                        <Icon as={showPassword ? FaEyeSlash : FaEye} color="gray.400" />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  borderRadius="lg"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            {/* Demo Credentials */}
            <Box
              p={4}
              bg="blue.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="blue.200"
            >
              <Text fontSize="sm" color="blue.700" fontWeight="medium" mb={2}>
                Demo Credentials:
              </Text>
              <Text fontSize="xs" color="blue.600">
                Email: demo@fraudshield.com
              </Text>
              <Text fontSize="xs" color="blue.600">
                Password: demo123
              </Text>
            </Box>
          </VStack>
        </Box>
      </MotionBox>
    </Flex>
  );
};

export default LoginPage; 