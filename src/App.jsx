import Board from '~/pages/Boards/_id'
import { Routes, Route, Navigate } from 'react-router'
import NotFound from '~/pages/404/NotFound.jsx'
import Auth from '~/pages/Auth/Auth'
function App() {
  return (
    <Routes>
      {/* Redirect route*/}
      <Route path='/' element={
        <Navigate to='boards/6832e8e3b532db8e6f00a54b' replace={true}/>
      }/>
      {/* Board detail*/}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />

      {/* 404 route*/}
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}
export default App
