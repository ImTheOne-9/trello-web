import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
const BoardContent = ({ board }) => {
  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  return (
    <>
      <Box sx={{
        backgroundColor: 'primary.main',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => theme.palette.mode === 'dark'
          ? theme.applyStyles('dark', { backgroundColor: '#34495e' })
          : theme.applyStyles('light', { backgroundColor: '#1976d2' }),
        p: '3px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
      </Box >
    </>
  )
}
export default BoardContent