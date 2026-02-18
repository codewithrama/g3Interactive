import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import UserList from './pages/UserList'
import UserForm from './pages/UserForm'
import UnderReview from './pages/UnderReview'
import { ToastContainer } from './utils/toast'
import { getAuth } from './utils/auth'
import './App.css'

function RequireAuth({ children }) {
  const location = useLocation()
  const auth = getAuth()
  if (!auth?.email) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/users"
          element={
            <RequireAuth>
              <Layout>
                <UserList />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/users/add"
          element={
            <RequireAuth>
              <Layout>
                <UserForm />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            <RequireAuth>
              <Layout>
                <UserForm />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/team"
          element={
            <RequireAuth>
              <Layout>
                <UnderReview />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Layout>
                <UnderReview />
              </Layout>
            </RequireAuth>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
