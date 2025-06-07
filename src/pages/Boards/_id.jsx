import React, { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
const Board = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  let { boardId } = useParams()

  useEffect(() => {
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  if (!board) {
    return (<PageLoadingSpinner caption='Loading board ...'/>)
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', overflow: 'hidden' }}>
      {/**Check dong mo dua  theo state isShowModalActiveCard trong redux
       * Moi thoi diem chi ton tai 1 activeCard
      */}
      <ActiveCard/>
      <AppBar />
      <BoardBar/>
      <BoardContent/>
    </Container>
  )
}
export default Board