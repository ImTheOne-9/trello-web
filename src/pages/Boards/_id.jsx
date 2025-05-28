import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { createNewCardAPIs, createNewColumnAPIs, deleteColumnDetailsAPI, fetchBoardDetailsAPI, moveCardInDifferentColumnAPIs, updateBoardDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { isEmpty } from 'lodash'
import { generatePlaceHolderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'
import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify'
const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    //Tam thoi fix cung boardId, ve sau su dung react-router-dom de lay chuan boardId tu url
    const boardId = '6832e8e3b532db8e6f00a54b'
    // call Api
    fetchBoardDetailsAPI(boardId).then((board) => {
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceHolderCard(column)]
          column.cardOrderIds = [generatePlaceHolderCard(column)._id]
        }else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
      console.log('Board: ', board)
    })
  }, [])

  const createNewColumn = async (data) => {
    const createdColumn = await createNewColumnAPIs({
      ...data,
      boardId: board._id
    })

    createdColumn.cards = [generatePlaceHolderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceHolderCard(createdColumn)._id]

    const cloneBoard = { ...board }
    cloneBoard.columns.push(createdColumn)
    cloneBoard.columnOrderIds.push(createdColumn._id)

    setBoard(cloneBoard)
  }

  const createNewCard = async (data) => {
    const createdCard = await createNewCardAPIs({
      ...data,
      boardId: board._id
    })

    const cloneBoard = { ...board }
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
    setBoard(cloneBoard)
  }

  const moveColumns = (dndOrderedColumns) => {
    const cloneBoard = { ...board }
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    cloneBoard.columns = dndOrderedColumns
    cloneBoard.columnOrderIds = dndOrderedColumnsIds

    setBoard(cloneBoard)

    // Goi Api Update Board
    updateBoardDetailsAPI(cloneBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  const moveCardInSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    const cloneBoard = { ...board }
    const columnToUpdate = cloneBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    setBoard(cloneBoard)

    // Goi Api update
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
  }

  const moveCardInDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const cloneBoard = { ...board }
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    cloneBoard.columns = dndOrderedColumns
    cloneBoard.columnOrderIds = dndOrderedColumnsIds

    setBoard(cloneBoard)
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    //Xu li van de khi keo card cuoi cung ra khoi column
    if (prevCardOrderIds[0].includes('-placeholder-card'))
      prevCardOrderIds = []
    // Goi Api
    moveCardInDifferentColumnAPIs({
      currentCardId: currentCardId,
      prevColumnId: prevColumnId,
      prevCardOrderIds,
      nextColumnId: nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  const deleteColumnDetails = (columnId) => {
    const cloneBoard = { ...board }

    cloneBoard.columns = cloneBoard.columns.filter(c => c._id !== columnId)
    cloneBoard.columnOrderIds = cloneBoard.columnOrderIds.filter(_id => _id !== columnId)

    setBoard(cloneBoard)
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', overflow: 'hidden' }}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInSameColumn={moveCardInSameColumn}
        moveCardInDifferentColumn={moveCardInDifferentColumn}
        deleteColumnDetails={deleteColumnDetails} />
    </Container>
  )
}
export default Board