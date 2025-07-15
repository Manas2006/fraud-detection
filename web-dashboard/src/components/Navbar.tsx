import React from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  HStack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Box bg="white" px={4} shadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
          <Text fontSize="xl" fontWeight="bold" color="brand.500">
            FraudShield
          </Text>
        </ChakraLink>

        {isAuthenticated ? (
          <HStack spacing={8}>
            <ChakraLink as={RouterLink} to="/dashboard" color="gray.600" _hover={{ color: 'brand.500' }}>
              Dashboard
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/messages" color="gray.600" _hover={{ color: 'brand.500' }}>
              Messages
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/analysis" color="gray.600" _hover={{ color: 'brand.500' }}>
              Analysis
            </ChakraLink>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </HStack>
        ) : (
          <Button as={RouterLink} to="/login" colorScheme="brand">
            Login
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar; 