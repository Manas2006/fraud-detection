import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import MessagesPage from './pages/MessagesPage'
import DashboardPage from './pages/DashboardPage'
import MessageAnalysisPage from './pages/MessageAnalysisPage'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <Box minH="100vh" bg="gray.50">
        <Navbar />
        <Box as="main" p={4}>
                  <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/analysis" element={<MessageAnalysisPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<DashboardPage />} />
        </Routes>
        </Box>
      </Box>
    </ErrorBoundary>
  )
}

export default App 