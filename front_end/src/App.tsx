import { Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { RequireRole } from './components/routing/RequireRole'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Users = lazy(() => import('./pages/Users'))
const Applications = lazy(() => import('./pages/Applications'))
const ApplicationDetail = lazy(() => import('./pages/ApplicationDetail'))
const Jobs = lazy(() => import('./pages/Jobs'))
const JobBoard = lazy(() => import('./pages/JobBoard'))
const Login = lazy(() => import('./pages/auth/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Suspense fallback={<div className="p-6">Chargement...</div>}>
      <Routes>
        <Route element={<AppLayout />}> 
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <RequireRole><Dashboard /></RequireRole>
          } />
          <Route path="/users" element={
            <RequireRole roles={["admin"]}><Users /></RequireRole>
          } />
          <Route path="/applications" element={
            <RequireRole roles={["admin", "recruteur", "candidat"]}><Applications /></RequireRole>
          } />
          <Route path="/postes" element={
            <RequireRole roles={["candidat"]}><JobBoard /></RequireRole>
          } />
          <Route path="/applications/:id" element={
            <RequireRole roles={["admin", "recruteur", "candidat"]}><ApplicationDetail /></RequireRole>
          } />
          <Route path="/jobs" element={
            <RequireRole roles={["admin", "recruteur"]}><Jobs /></RequireRole>
          } />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}


