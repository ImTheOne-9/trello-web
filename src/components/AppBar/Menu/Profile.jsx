import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice'
import { useConfirm } from 'material-ui-confirm'
const Profile = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const confirmLogout = useConfirm()
  const handleLogout = async () => {
    const { confirmed } = await confirmLogout({
      title: 'Logout your account',
      description: 'Are you sure you want to logout your account?',
      confirmationText: 'Logout',
      cancellationText: 'Cancel'
    })

    if (confirmed) {
      // Call Api create column and Update board state
      dispatch(logoutUserAPI())
    }
  }
  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="large"
          sx={{ padding: '0' }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 36, height: 36 }}
            alt='Image'
            src= {currentUser?.avatar} />
        </IconButton>
      </Tooltip>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-recent'
        }}
      >
        <MenuItem
          sx={{
            '&:hover': { color: 'success.light'}
          }}
          onClick={handleClose}>
          <Avatar sx={{ width: 28, height: 28, mr: 3 }} src={currentUser?.avatar} /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar sx={{ width: 28, height: 28, mr: 3 }} /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          sx={{
            '&:hover': {
              color: 'warning.dark', 
              '& .logout-icon': { color: 'warning.dark' }
            }
          }}
          onClick={handleLogout}>
          <ListItemIcon>
            <Logout className='logout-icon' fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profile