import React from 'react';
import {
  Box,
  VStack,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'xl' 
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    >
      <MotionBox
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6} align="center">
          <Box
            position="relative"
            animation={`${pulseAnimation} 2s ease-in-out infinite`}
          >
            <Spinner
              size={size}
              color="white"
              thickness="4px"
              speed="0.8s"
            />
          </Box>
          
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Text
              color="white"
              fontSize="lg"
              fontWeight="medium"
              textAlign="center"
              animation={`${fadeInUp} 0.6s ease-out`}
            >
              {message}
            </Text>
          </MotionBox>
          
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Text
              color="whiteAlpha.800"
              fontSize="sm"
              textAlign="center"
            >
              FraudShield Dashboard
            </Text>
          </MotionBox>
        </VStack>
      </MotionBox>
    </Box>
  );
};

export default LoadingSpinner; 