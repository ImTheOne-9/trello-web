import React from 'react'
import Box from '@mui/material/Box'
import Card from './Card/Card'
const ListCards = () => {
  return (
    <>
      <Box
        sx={{
          p: '0 5px',
          m: '0 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) => `calc(
                ${theme.trello.boardContentHeight} - 
                ${theme.spacing(5)} -
                ${theme.trello.columnHeaderHeight} -
                ${theme.trello.columnFooterHeight}
              )`,
          '&::-webkit-scrollbar-thumb': {
            background: '#ced0da',
            borderRadius: '8px'
          },
          /* Handle on hover */
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#bfc2cf'
          }
        }}
      >
        <Card />
        <Card hideMedia />
      </Box>
    </>
  )
}

export default ListCards