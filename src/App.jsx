import Board from '~/pages/Boards/_id'
import { Routes, Route, Navigate, Outlet } from 'react-router'
import NotFound from '~/pages/404/NotFound.jsx'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
const ProtectedRoute = ({ user }) => {
  console.log(user)
  if (!user) {
    return <Navigate to='/login' replace={true} />
  }
  return <Outlet/>
}
function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      {/* Redirect route*/}
      <Route path='/' element={
        <Navigate to='boards/6832e8e3b532db8e6f00a54b' replace={true}/>
      }/>
      <Route element={<ProtectedRoute user={currentUser}/>}>
        {/* Board detail*/}
        <Route path='/boards/:boardId' element={<Board />} />
        {/* user Setting */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>
      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification/>}/>

      {/* 404 route*/}
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}
export default App
