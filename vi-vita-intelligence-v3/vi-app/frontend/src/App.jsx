import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'

import SplashScreen       from './screens/SplashScreen'
import SignupScreen       from './screens/SignupScreen'
import OTPScreen          from './screens/OTPScreen'
import RoutineScreen      from './screens/RoutineScreen'
import AgeGroupScreen     from './screens/AgeGroupScreen'
import Quiz1Screen        from './screens/Quiz1Screen'
import AnalyzingScreen    from './screens/AnalyzingScreen'
import Quiz2Screen        from './screens/Quiz2Screen'
import Quiz3Screen        from './screens/Quiz3Screen'
import FinalLoadingScreen from './screens/FinalLoadingScreen'
import ResultScreen       from './screens/ResultScreen'
import RootCauseScreen    from './screens/RootCauseScreen'
import PlanScreen         from './screens/PlanScreen'
import ProductScreen      from './screens/ProductScreen'
import SocialProofScreen  from './screens/SocialProofScreen'
import CheckoutScreen     from './screens/CheckoutScreen'
import { SuccessScreen, FailureScreen } from './screens/PaymentScreens'
import DashboardScreen    from './screens/DashboardScreen'
import ProfileScreen      from './screens/ProfileScreen'

function ProtectedRoute({ children }) {
  const { state } = useApp()
  if (!state.isLoggedIn) return <Navigate to="/" replace />
  return children
}

function QuizRoute({ children }) {
  const { state } = useApp()
  if (!state.isLoggedIn)      return <Navigate to="/"          replace />
  if (state.hasCompletedQuiz) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <div style={{
      width:  '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#D6CCB8', overflow: 'hidden',
    }}>
      <div style={{
        width: '100%', maxWidth: 430,
        height: '100%', maxHeight: 932,
        position: 'relative', overflow: 'hidden',
        background: '#F0EAE0',
        boxShadow: '0 0 60px rgba(0,0,0,0.25)',
      }}>
        <Routes>
          {/* Public */}
          <Route path="/"       element={<SplashScreen />} />
          <Route path="/signup" element={<SignupScreen  />} />
          <Route path="/otp"    element={<OTPScreen     />} />

          {/* Quiz flow */}
          <Route path="/routine"       element={<QuizRoute><RoutineScreen      /></QuizRoute>} />
          <Route path="/age-group"     element={<QuizRoute><AgeGroupScreen     /></QuizRoute>} />
          <Route path="/quiz-1"        element={<QuizRoute><Quiz1Screen        /></QuizRoute>} />
          <Route path="/analyzing"     element={<QuizRoute><AnalyzingScreen    /></QuizRoute>} />
          <Route path="/quiz-2"        element={<QuizRoute><Quiz2Screen        /></QuizRoute>} />
          <Route path="/quiz-3"        element={<QuizRoute><Quiz3Screen        /></QuizRoute>} />
          <Route path="/final-loading" element={<QuizRoute><FinalLoadingScreen /></QuizRoute>} />

          {/* Results + plan flow */}
          <Route path="/result"       element={<ProtectedRoute><ResultScreen      /></ProtectedRoute>} />
          <Route path="/root-cause"   element={<ProtectedRoute><RootCauseScreen   /></ProtectedRoute>} />
          <Route path="/plan"         element={<ProtectedRoute><PlanScreen        /></ProtectedRoute>} />
          <Route path="/product"      element={<ProtectedRoute><ProductScreen     /></ProtectedRoute>} />
          <Route path="/social-proof" element={<ProtectedRoute><SocialProofScreen /></ProtectedRoute>} />
          <Route path="/checkout"     element={<ProtectedRoute><CheckoutScreen    /></ProtectedRoute>} />
          <Route path="/success"      element={<ProtectedRoute><SuccessScreen     /></ProtectedRoute>} />
          <Route path="/failure"      element={<ProtectedRoute><FailureScreen     /></ProtectedRoute>} />

          {/* Dashboard + profile */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><ProfileScreen   /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
