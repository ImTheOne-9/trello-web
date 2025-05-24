import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI } from '~/apis'
const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    //Tam thoi fix cung boardId, ve sau su dung react-router-dom de lay chuan boardId tu url
    const boardId = '68302f427fb6ccbf0904057f'
    // call Api
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board)
    })
  }, [])
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', overflow: 'hidden' }}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent board={board}/>
    </Container>
  )
}
export default Board