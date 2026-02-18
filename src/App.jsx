import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import UserList from './pages/UserList'
import UserForm from './pages/UserForm'
import UnderReview from './pages/UnderReview'
import { ToastContainer } from './utils/toast'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/users"
          element={
            <Layout>
              <UserList />
            </Layout>
          }
        />
        <Route
          path="/users/add"
          element={
            <Layout>
              <UserForm />
            </Layout>
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            <Layout>
              <UserForm />
            </Layout>
          }
        />
        <Route
          path="/team"
          element={
            <Layout>
              <UnderReview />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <UnderReview />
            </Layout>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
