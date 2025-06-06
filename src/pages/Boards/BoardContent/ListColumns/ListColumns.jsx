import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import theme from '~/theme'
import { toast } from 'react-toastify'
import { cloneDeep } from 'lodash'
import { createNewColumnAPIs } from '~/apis'
import { generatePlaceHolderCard } from '~/utils/formatters'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
const ListColumns = ({ columns }) => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const [openNewColumn, setOpenNewColumn] = useState(false)
  const toggleSetOpenNewColumn = () => setOpenNewColumn(!openNewColumn)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumnTitle = async() => {
    if (!newColumnTitle) {
      toast.dismiss()
      toast.error('Please enter a title for the new column', {
        position: 'bottom-left'
      })
      return
    }

    // Call Api create column and Update board state
    const createdColumn = await createNewColumnAPIs({
      title: newColumnTitle,
      boardId: board._id
    })

    createdColumn.cards = [generatePlaceHolderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceHolderCard(createdColumn)._id]

    const cloneBoard = cloneDeep(board)
    cloneBoard.columns.push(createdColumn)
    cloneBoard.columnOrderIds.push(createdColumn._id)

    // Update data to redux store
    dispatch(updateCurrentActiveBoard(cloneBoard))

    toggleSetOpenNewColumn()
    setNewColumnTitle('')
  }
  return (
    <>
      <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
        <Box sx={{
          bgcolor: 'inherit',
          height: '100%',
          width: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden'
        }}>
          {columns?.map(column =>
            <Column key={column._id} column={column}/>)}
          {!openNewColumn ?
            <Box
              onClick= {toggleSetOpenNewColumn}
              sx={{
                minWidth: '250px',
                maxWidth: '250px',
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
            :
            <Box sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <TextField
                label="Enter column title..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                sx={{
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
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Button
                  onClick={addNewColumnTitle}
                  className='interceptor-loading'
                  variant='contained' color='success' size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}>Add Column</Button>
                <Button
                  onClick= {toggleSetOpenNewColumn}
                  variant='contained' color='warning' size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.warning.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.warning.main }
                  }}>Close</Button>
              </Box>
            </Box>
          }

        </Box>
      </SortableContext>
    </>
  )
}

export default ListColumns