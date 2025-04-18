import React from 'react'
import Box from '@mui/material/Box'
const BoardContent = () => {
  return (
    <>
      <Box sx={{
        backgroundColor: 'primary.main',
        width: '100%',
        height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
        display: 'flex',
        alignItems: 'center',
        bgcolor: (theme) => theme.palette.mode === 'dark'
          ? theme.applyStyles('dark', { backgroundColor: '#34495e' })
          : theme.applyStyles('light', { backgroundColor: '#1976d2' })
      }}>
        Board content
      </Box>
    </>
  )
}
export default BoardContent