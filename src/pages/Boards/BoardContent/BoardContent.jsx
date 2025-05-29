import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  useSensor,
  // MouseSensor,
  // TouchSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensor'
import { useEffect, useState, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep, isEmpty } from 'lodash'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { generatePlaceHolderCard } from '~/utils/formatters'
import { moveCardInDifferentColumnAPIs, updateBoardDetailsAPI, updateColumnDetailsAPI} from '~/apis'

import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'


const BoardContent = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const ACTIVE_DRAG_ITEM_TYPE = {
    CARD: 'card',
    COLUMN: 'column'
  }

  const [orderedColumns, setOrderedColumns] = useState([])

  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  const lastOverId = useRef(null)

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500
    }
  })

  const sensors = useSensors(
    mouseSensor,
    touchSensor
  )

  useEffect(() => {
    setOrderedColumns(board.columns)
  }, [board])

  const collisionDetectionStrategy = (args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    //Tim cac diem giao nhau va cham - intersection voi con tro
    const pointerIntersections = pointerWithin(args)

    if (!pointerIntersections?.length) return
    // //Thuat toan phat hien va cham se tra ve 1 mang cac va cham o day
    // const intersections = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)

    //Tim overId dau tien trong dam intersection tren
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      //Neu cai over no la column thi se tim toi cai cardid gan nhat ben trong khu vuc cham do dua vao thuat toan phat hien va cham
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container =>
            container.id !== overId && checkColumn.cardOrderIds?.includes(container.id)
          )
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }

    //Neu overid la null thi tra ve mang rong - tranh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }

  //Tim column theo cardId
  const findColumnByCardId = (cardId) => {
    //Nen dung c.cards thay vi c.cardOrderIds vi o buoc handleDragOver chung ta se lam du lieu cho card hoan chinh truoc roi moi tao ra cardOrderIds moi
    return orderedColumns?.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    over,
    active,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns(prevColumns => {
      if (activeColumn._id === overColumn._id && activeDraggingCardId === overCardId) {
        return prevColumns
      }

      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      //Logic tinh toan cardIndex moi (tren hoac duoi cua overCard) lay chuan ra tu code cua thu vien
      const isBelowOverItem = over && active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      let newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // clone mang OrderedColumnState cu ra 1 cai moi de xu ly data roi return - cap nhat lai OrderedColumnState moi
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // column cu
      if (nextActiveColumn) {
        //Xoa card khoi column active (column cu)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //Them PlaceholderCard khi Column rong
        if (isEmpty(nextActiveColumn?.cards)) {
          nextActiveColumn.cards = [generatePlaceHolderCard(nextActiveColumn)]
        }

        //Cap nhat lai mang CardOrdered cho chuan du lieu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      // column moi
      if (nextOverColumn) {
        // Kiem tra card dang keo co ton tai o overColumn hay chua, neu co thi xoa no truoc
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Them cai card dang keo vao overColumn theo vi tri index moi va cap nhat chuan gia tri column
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          { ...activeDraggingCardData, columnId: nextOverColumn._id })

        //Xoa PlaceholderCard neu ton tai card
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceHolder)

        //Cap nhat lai mang CardOrdered cho chuan du lieu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      console.log('triggerFrom:', triggerFrom)
      // Chi goi API khi ham duoc goi tu handleDragEnd
      if (triggerFrom === 'handleDragEnd') {
        // Goi Api Update
        const cloneBoard = cloneDeep(board)
        const dndOrderedColumnsIds = nextColumns.map(c => c._id)

        cloneBoard.columns = nextColumns
        cloneBoard.columnOrderIds = dndOrderedColumnsIds

        dispatch(updateCurrentActiveBoard(cloneBoard))

        let prevCardOrderIds = nextColumns.find(c => c._id === oldColumnWhenDraggingCard._id)?.cardOrderIds
        //Xu li van de khi keo card cuoi cung ra khoi column
        if (prevCardOrderIds[0].includes('-placeholder-card'))
          prevCardOrderIds = []
        // Goi Api
        moveCardInDifferentColumnAPIs({
          currentCardId: activeDraggingCardId,
          prevColumnId: oldColumnWhenDraggingCard._id,
          prevCardOrderIds,
          nextColumnId: nextOverColumn._id,
          nextCardOrderIds: nextColumns.find(c => c._id === nextOverColumn._id)?.cardOrderIds
        })
      }
      return nextColumns
    })
  }

  const handleDragStart = (event) => {

    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    //Khi bat dau thuc hien keo card
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  const handleDragOver = (event) => {
    // Chi xu ly khi dang keo card, khong xu ly khi keo column
    if (activeDragItemType !== ACTIVE_DRAG_ITEM_TYPE.CARD) return

    const { active, over } = event

    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    // Chi xu ly khi keo card giua 2 column khac nhau
    if (activeColumn?._id !== overColumn?._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        over,
        active,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!active || !over) return

    // Keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      // Su dung oldColumnWhenDraggingCard thay vi tim lai
      const activeColumn = oldColumnWhenDraggingCard
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      // Kiem tra xem co phai keo card giua 2 column khac nhau khong
      if (activeColumn._id !== overColumn._id) {
        // Keo card sang column khac - goi API
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          over,
          active,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        // Keo card trong cung 1 column
        const oldIndexCard = activeColumn?.cards?.findIndex(c => c._id === activeDragItemId)
        const newIndexCard = overColumn?.cards?.findIndex(c => c._id === overCardId)

        // Chi xu ly khi vi tri thay doi
        if (oldIndexCard !== newIndexCard) {
          const dndOrderedCards = arrayMove(activeColumn?.cards, oldIndexCard, newIndexCard)
          const dndOrderedCardsIds = dndOrderedCards.map(c => c._id)

          setOrderedColumns(prevColumns => {
            const nextColumns = cloneDeep(prevColumns)
            const targetColumn = nextColumns.find(c => c._id === overColumn._id)

            targetColumn.cards = dndOrderedCards
            targetColumn.cardOrderIds = dndOrderedCardsIds
            return nextColumns
          })

          // Goi Api
          const cloneBoard = cloneDeep(board)
          const columnToUpdate = cloneBoard.columns.find(column => column._id === activeColumn._id)
          if (columnToUpdate) {
            columnToUpdate.cards = dndOrderedCards
            columnToUpdate.cardOrderIds = dndOrderedCardsIds
          }
          dispatch(updateCurrentActiveBoard(cloneBoard))

          // Goi Api update
          updateColumnDetailsAPI(activeColumn._id, { cardOrderIds: dndOrderedCardsIds })
        }
      }
    }

    // Keo tha column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldIndexColumn = orderedColumns.findIndex(c => c._id === active.id)
        const newIndexColumn = orderedColumns.findIndex(c => c._id === over.id)

        const dndOrderedColumns = arrayMove(orderedColumns, oldIndexColumn, newIndexColumn)

        setOrderedColumns(dndOrderedColumns)

        // Call Api create column and Update board state
        const cloneBoard = cloneDeep(board)
        const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

        cloneBoard.columns = dndOrderedColumns
        cloneBoard.columnOrderIds = dndOrderedColumnsIds

        dispatch(updateCurrentActiveBoard(cloneBoard))

        // Goi Api Update Board
        updateBoardDetailsAPI(cloneBoard._id, { columnOrderIds: dndOrderedColumnsIds })
      }
    }

    // Reset cac state sau khi ket thuc keo tha
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}>
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
          <DragOverlay dropAnimation={dropAnimation}>
            {!activeDragItemType && null}
            {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
            {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
          </DragOverlay>
        </Box >
      </DndContext>
    </>
  )
}
export default BoardContent