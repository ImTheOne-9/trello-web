import AppsIcon from '@mui/icons-material/Apps'
import CloseIcon from '@mui/icons-material/Close'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, useMediaQuery } from '@mui/material'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import InputAdornment from '@mui/material/InputAdornment'
import { useTheme } from '@mui/material/styles'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React from 'react'
import TrelloIcon from '~/assets/trello.svg?react'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import Profile from './Menu/Profile'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import Template from './Menu/Template'
import Workspace from './Menu/Workspace'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
const AppBar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const handleDrawerOpen = (open) => {
    setOpen(open)
  }
  return (
    <>
      <Box
        px={2}
        sx={{
          width: '100%',
          height: (theme) => theme.trello.appBarHeight,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: (theme) => theme.palette.mode === 'dark'
            ? theme.applyStyles('dark', { backgroundColor: '#2c3e50' })
            : theme.applyStyles('light', { backgroundColor: '#1565c0' })
        }}
      >
        {/* Left: Logo và menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile ? (
            <IconButton onClick={() => handleDrawerOpen(true)}>
              <MenuIcon sx={{ color: 'white' }} />
            </IconButton>
          ) : (
            <Link to='/boards'>
              <Tooltip title='Board List'>
                <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
              </Tooltip>
            </Link>
          )}
          <Link to='/'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SvgIcon component={TrelloIcon} fontSize="small" inheritViewBox sx={{ color: 'white' }} />
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                Trello
              </Typography>
            </Box>
          </Link>
        </Box>

        {/* Center: Search */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 1}}>
          <TextField
            id="outlined-search"
            label="Search..."
            type="text"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'white' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <CloseIcon
                    fontSize="small"
                    sx={{
                      color: search ? 'white' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSearch('')}
                  />
                </InputAdornment>
              )
            }}
            sx={{
              width: '100%',
              maxWidth: '500px',
              '& label': { color: 'white' },
              '& input': { color: 'white' },
              '& label.Mui-focused': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' }
              }
            }}
          />
          <Button
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white'
              }
            }}> Create
          </Button>
        </Box>

        {/* Right: Icon và profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ModeSelect />
          <Notifications/>
          <Tooltip title="Help">
            <HelpOutlineIcon sx={{ color: 'white', cursor: 'pointer' }} />
          </Tooltip>
          <Profile />
        </Box>
      </Box>

      <Drawer anchor='left' open={open} onClose={() => handleDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }} >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={TrelloIcon} fontSize='small' inheritViewBox sx={{ color: 'white' }} />
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Trello</Typography>
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