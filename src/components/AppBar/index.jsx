import React from 'react'
import ModeSelect from '~/components/ModeSelect'
import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import TrelloIcon from '~/assets/trello.svg?react'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspace from './Menu/Workspace'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import Template from './Menu/Template'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profile from './Menu/Profile'
import { IconButton, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@emotion/react'
import Drawer from '@mui/material/Drawer';
const AppBar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = React.useState(false)
  const handleDrawerOpen = (open) => {
    setOpen(open)
  }
  return (
    <>
      <Box px={4} sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile ?
            <IconButton onClick={() => handleDrawerOpen(true)}>
              <MenuIcon sx={{ color: 'primary.main' }} />
            </IconButton>
            :
            <AppsIcon sx={{ color: 'primary.main' }} />
          }
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={TrelloIcon} fontSize='small' inheritViewBox sx={{ color: 'primary.main' }} />
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }}>Trello</Typography>
          </Box>
          {!isMobile &&
            <>
              <Workspace />
              <Recent />
              <Starred />
              <Template />
              <Button variant="outlined">Create</Button>
            </>
          }
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }} >
          <TextField id="outlined-search" label="Search..." type="search" size='small' sx={{ minWidth: '50px' }} />

          <ModeSelect />
          <Tooltip title="Notification">
            <Badge variant="dot" color="secondary">
              <NotificationsNoneIcon sx={{ color: 'primary.main', cursor: 'pointer' }} />
            </Badge>
          </Tooltip>

          <Tooltip title="Help">
            <HelpOutlineIcon sx={{ color: 'primary.main', cursor: 'pointer' }} />
          </Tooltip>
          <Profile />
        </Box>
      </Box>
      <Drawer anchor='left' open={open} onClose={() => handleDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }} >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={TrelloIcon} fontSize='small' inheritViewBox sx={{ color: 'primary.main' }} />
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }}>Trello</Typography>
          </Box>
          <Workspace />
          <Recent />
          <Starred />
          <Template />
          <Box mt={2}>
            <Button variant="outlined" fullWidth>Create</Button>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
export default AppBar