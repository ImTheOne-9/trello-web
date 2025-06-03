import React, { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { createNewCardAPIs, createNewColumnAPIs, deleteColumnDetailsAPI, moveCardInDifferentColumnAPIs, updateBoardDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceHolderCard } from '~/utils/formatters'
import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
const Board = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  let { boardId } = useParams()

  useEffect(() => {
    //Tam thoi fix cung boardId, ve sau su dung react-router-dom de lay chuan boardId tu url
    // const boardId = '6832e8e3b532db8e6f00a54b'
    // call Api
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  if (!board) {
    return (<PageLoadingSpinner caption='Loading board ...'/>)
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', overflow: 'hidden' }}>
      <AppBar />
      <BoardBar/>
      <BoardContent/>
    </Container>
  )
}
export default Board