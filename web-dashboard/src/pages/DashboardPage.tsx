import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  Heading,
  Icon,
  Progress,
  Badge,
  Flex,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
} from 'react-icons/fa';

const MotionBox = motion(Box);

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactElement;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => (
  <MotionBox
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card
      bg="white"
      borderRadius="xl"
      boxShadow="lg"
      border="1px solid"
      borderColor="gray.200"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
      transition="all 0.2s"
    >
      <CardBody>
        <HStack justify="space-between" align="flex-start">
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              {title}
            </Text>
            <Stat>
              <StatNumber fontSize="2xl" fontWeight="bold" color="gray.800">
                {value}
              </StatNumber>
              <StatHelpText>
                <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(change)}%
              </StatHelpText>
            </Stat>
          </VStack>
          <Box
            p={3}
            borderRadius="lg"
            bg={`${color}.100`}
            color={`${color}.600`}
          >
            {icon}
          </Box>
        </HStack>
      </CardBody>
    </Card>
  </MotionBox>
);

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Mock data for charts
  const fraudTrendData = [
    { name: 'Jan', fraud: 12, legitimate: 88 },
    { name: 'Feb', fraud: 15, legitimate: 85 },
    { name: 'Mar', fraud: 8, legitimate: 92 },
    { name: 'Apr', fraud: 20, legitimate: 80 },
    { name: 'May', fraud: 18, legitimate: 82 },
    { name: 'Jun', fraud: 14, legitimate: 86 },
  ];

  const riskDistributionData = [
    { name: 'Low Risk', value: 65, color: '#48BB78' },
    { name: 'Medium Risk', value: 25, color: '#ECC94B' },
    { name: 'High Risk', value: 10, color: '#F56565' },
  ];

  const recentActivityData = [
    { time: '2 min ago', message: 'Suspicious transaction detected', risk: 'High', status: 'Pending' },
    { time: '5 min ago', message: 'Payment verification completed', risk: 'Low', status: 'Approved' },
    { time: '12 min ago', message: 'New user registration', risk: 'Medium', status: 'Under Review' },
    { time: '18 min ago', message: 'Large transfer flagged', risk: 'High', status: 'Blocked' },
    { time: '25 min ago', message: 'Account verification passed', risk: 'Low', status: 'Approved' },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box p={8} textAlign="center">
        <Text>Loading dashboard...</Text>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="lg" color="gray.800" mb={2}>
            FraudShield Dashboard
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Real-time fraud detection and monitoring
          </Text>
        </MotionBox>

        {/* Statistics Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <StatCard
            title="Total Transactions"
            value="12,847"
            change={12.5}
            icon={<Icon as={FaMoneyBillWave} boxSize={6} />}
            color="blue"
          />
          <StatCard
            title="Fraud Detected"
            value="234"
            change={-8.2}
            icon={<Icon as={FaExclamationTriangle} boxSize={6} />}
            color="red"
          />
          <StatCard
            title="Success Rate"
            value="98.2%"
            change={2.1}
            icon={<Icon as={FaCheckCircle} boxSize={6} />}
            color="green"
          />
          <StatCard
            title="Active Users"
            value="1,234"
            change={15.3}
            icon={<Icon as={FaUsers} boxSize={6} />}
            color="purple"
          />
        </SimpleGrid>

        {/* Charts Section */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          {/* Fraud Trend Chart */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card bg="white" borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.200">
              <CardBody>
                <Heading size="md" mb={4} color="gray.800">
                  Fraud Detection Trend
                </Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={fraudTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="fraud"
                      stackId="1"
                      stroke="#F56565"
                      fill="#FED7D7"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="legitimate"
                      stackId="1"
                      stroke="#48BB78"
                      fill="#C6F6D5"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Risk Distribution */}
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card bg="white" borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.200">
              <CardBody>
                <Heading size="md" mb={4} color="gray.800">
                  Risk Distribution
                </Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <VStack spacing={2} mt={4}>
                  {riskDistributionData.map((item, index) => (
                    <HStack key={index} w="full" justify="space-between">
                      <HStack>
                        <Box w={3} h={3} borderRadius="full" bg={item.color} />
                        <Text fontSize="sm" color="gray.600">
                          {item.name}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="medium" color="gray.800">
                        {item.value}%
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        </Grid>

        {/* Recent Activity */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card bg="white" borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.200">
            <CardBody>
              <Heading size="md" mb={4} color="gray.800">
                Recent Activity
              </Heading>
              <VStack spacing={3} align="stretch">
                {recentActivityData.map((activity, index) => (
                  <HStack
                    key={index}
                    p={3}
                    borderRadius="lg"
                    bg="gray.50"
                    justify="space-between"
                    _hover={{ bg: 'gray.100' }}
                    transition="background 0.2s"
                  >
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.800">
                        {activity.message}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {activity.time}
                      </Text>
                    </VStack>
                    <HStack spacing={2}>
                      <Badge
                        colorScheme={
                          activity.risk === 'High' ? 'red' :
                          activity.risk === 'Medium' ? 'yellow' : 'green'
                        }
                        variant="subtle"
                      >
                        {activity.risk} Risk
                      </Badge>
                      <Badge
                        colorScheme={
                          activity.status === 'Approved' ? 'green' :
                          activity.status === 'Blocked' ? 'red' :
                          activity.status === 'Pending' ? 'yellow' : 'blue'
                        }
                        variant="subtle"
                      >
                        {activity.status}
                      </Badge>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* System Health */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card bg="white" borderRadius="xl" boxShadow="lg" border="1px solid" borderColor="gray.200">
            <CardBody>
              <Heading size="md" mb={4} color="gray.800">
                System Health
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">ML Model Accuracy</Text>
                  <Progress value={95} colorScheme="green" size="lg" borderRadius="full" w="full" />
                  <Text fontSize="sm" fontWeight="medium" color="gray.800">95%</Text>
                </VStack>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">API Response Time</Text>
                  <Progress value={88} colorScheme="blue" size="lg" borderRadius="full" w="full" />
                  <Text fontSize="sm" fontWeight="medium" color="gray.800">88%</Text>
                </VStack>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Database Performance</Text>
                  <Progress value={92} colorScheme="purple" size="lg" borderRadius="full" w="full" />
                  <Text fontSize="sm" fontWeight="medium" color="gray.800">92%</Text>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default DashboardPage; 