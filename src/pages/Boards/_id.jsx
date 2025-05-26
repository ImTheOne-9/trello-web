import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { createNewCardAPIs, createNewColumnAPIs, fetchBoardDetailsAPI } from '~/apis'
import { isEmpty } from 'lodash'
import { generatePlaceHolderCard } from '~/utils/formatters'
const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    //Tam thoi fix cung boardId, ve sau su dung react-router-dom de lay chuan boardId tu url
    const boardId = '6832e8e3b532db8e6f00a54b'
    // call Api
    fetchBoardDetailsAPI(boardId).then((board) => {
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceHolderCard(column)]
          column.cardOrderIds = [generatePlaceHolderCard(column)._id]
        }
      })
      setBoard(board)
    })
  }, [])

  const createNewColumn = async (data) => {
    const createdColumn = await createNewColumnAPIs({
      ...data,
      boardId: board._id
    })
    console.log('column:', createdColumn)
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

    console.log('card:', createdCard)
    const cloneBoard = { ...board }
    const columnToUpdate = cloneBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(cloneBoard)
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', overflow: 'hidden' }}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}/>
    </Container>
  )
}
export default Board