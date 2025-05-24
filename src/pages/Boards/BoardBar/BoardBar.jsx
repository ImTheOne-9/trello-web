import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'
const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
const BoardBar = ({ board }) => {
  return (
    <>
      <Box px={2} sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        bgcolor: (theme) => theme.palette.mode === 'dark'
          ? theme.applyStyles('dark', { backgroundColor: '#34495e' })
          : theme.applyStyles('light', { backgroundColor: '#1976d2' }),
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={board?.description}>
            <Chip
              sx={MENU_STYLES}
              icon={<DashboardIcon />}
              label={board?.title}
              clickable />
          </Tooltip>
          <Chip
            sx={MENU_STYLES}
            icon={<VpnLockIcon />}
            label={capitalizeFirstLetter(board?.type)}
            clickable />
          <Chip
            sx={MENU_STYLES}
            icon={<AddToDriveIcon />}
            label="Add To Google Drive"
            clickable />
          <Chip
            sx={MENU_STYLES}
            icon={<BoltIcon />}
            label="Automation"
            clickable />
          <Chip
            sx={MENU_STYLES}
            icon={<FilterListIcon />}
            label="Filters"
            clickable />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white'
              }
            }}
          >
            Invite
          </Button>
          <AvatarGroup
            max={3}
            sx={{
              gap: '10px',
              '& .MuiAvatar-root': {
                width: 34,
                height: 34,
                fontSize: 16,
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                '&:first-of-type': { bgcolor: '#a4b0be' }
              }
            }}>
            <Tooltip title='avatar'>
              <Avatar alt="c" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGoz4yAOvONcl0w8zez5qIU-zOPcEbqsxjhw&s" />
            </Tooltip>
            <Tooltip title='avatar'>
              <Avatar alt="avatar" src="/static/images/avatar/1.jpg" />
            </Tooltip>
            <Tooltip title='avatar'>
              <Avatar alt="avatar" src="/static/images/avatar/1.jpg" />
            </Tooltip>
            <Tooltip title='avatar'>
              <Avatar alt="avatar" src="/static/images/avatar/1.jpg" />
            </Tooltip>
            <Tooltip title='avatar'>
              <Avatar alt="avatar" src="/static/images/avatar/1.jpg" />
            </Tooltip>
          </AvatarGroup>
        </Box>
      </Box>
    </>
  )
}
export default BoardBar