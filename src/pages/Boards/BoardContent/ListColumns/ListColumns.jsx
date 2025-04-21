import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
const ListColumns = ({ columns }) => {
  return (
    <>
      <Box sx={{
        bgcolor: 'inherit',
        height: '100%',
        width: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}>
        {columns?.map(column => <Column key={column._id} column={column}/>)}

        {/* Add new column */}
        <Box sx={{
          minWidth: '200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: '6px',
          bgcolor: '#ffffff3d',
          height: 'fit-content'
        }}>
          <Button
            startIcon={<NoteAddIcon />}
            sx={{
              color: 'white',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 1
            }}
          >
            Add new column
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default ListColumns