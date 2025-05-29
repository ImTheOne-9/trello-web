import React, { useState } from 'react'
import AddCardIcon from '@mui/icons-material/AddCard'
import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TextField, Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import theme from '~/theme'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'
import { createNewCardAPIs, deleteColumnDetailsAPI } from '~/apis'
const Column = ({ column }) => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleSetOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.dismiss()
      toast.error('Please enter a title for the new card')
      return
    }

    const createdCard = await createNewCardAPIs({
      title: newCardTitle,
      columnId: column._id,
      boardId: board._id
    })

    const cloneBoard = cloneDeep(board)
    const columnToUpdate = cloneBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some(c => c.FE_PlaceHolder)) {
        columnToUpdate.cards = [createdCard],
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    dispatch(updateCurrentActiveBoard(cloneBoard))

    toggleSetOpenNewCardForm()
    setNewCardTitle('')
  }

  const confirmDeleteColumn = useConfirm()
  const handleRemoveColumn = async () => {
    const { confirmed } = await confirmDeleteColumn({
      description: 'This action will permanently delete your Column and its Cards! Are you sure?',
      title: 'Delete Column',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    })

    if (confirmed) {
      // Call Api create column and Update board state
      const cloneBoard = cloneDeep(board)

      cloneBoard.columns = cloneBoard.columns.filter(c => c._id !== column._id)
      cloneBoard.columnOrderIds = cloneBoard.columnOrderIds.filter(_id => _id !== column._id)

      dispatch(updateCurrentActiveBoard(cloneBoard))
      deleteColumnDetailsAPI(column._id).then(res => {
        toast.success(res?.deleteResult)
      })
    }
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyle = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    height: '100%'
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const orderedCards = column.cards
  return (
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes} >
      {/*Box column*/}
      <Box
        { ...listeners }
        sx={{
          maxWidth: '300px',
          minWidth: '300px',
          bgcolor: (theme) => theme.palette.mode === 'dark'
            ? theme.applyStyles('dark', { backgroundColor: '#333643' })
            : theme.applyStyles('light', { backgroundColor: '#ebecf0' }),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/*Box column header*/}
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            variant='h6'
            sx={{
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
            {column.title}
          </Typography>
          <Box
            sx={{
              pointerEvents: open ? 'none' : 'auto'
            }}
            aria-hidden={open ? 'true' : undefined}
          >
            <Tooltip title='More option'>
              <ExpandMoreIcon
                sx={{ cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem
                onClick={toggleSetOpenNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .card-remove-icon': {
                      color: 'success.light'
                    }
                  }
                }}>
                <ListItemIcon><AddCardIcon className='card-remove-icon' fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={handleRemoveColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .card-remove-icon': {
                      color: 'warning.dark'
                    }
                  }
                }}>
                <ListItemIcon><DeleteForeverIcon className='card-remove-icon' fontSize="small" /></ListItemIcon>
                <ListItemText className='card-remove-button'>Remove this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box >
        </Box>
        {/*Box list card*/}
        <ListCards cards={orderedCards}/>
        {/*Box column footer*/}
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2
          }}
        >
          {!openNewCardForm ?
            <Box sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Button startIcon={<AddCardIcon />} onClick={toggleSetOpenNewCardForm}>Add new card</Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
            :
            <Box sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                label="Enter card title..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd='true'
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Button
                  onClick={addNewCard}
                  variant='contained' color='success' size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}>Add</Button>
                <Button
                  onClick={toggleSetOpenNewCardForm}
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
      </Box>
    </div>
  )
}

export default Column