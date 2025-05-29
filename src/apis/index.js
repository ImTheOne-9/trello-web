import axiosClient from './axiosClient'


// UPDATE
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axiosClient.put(`/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardInDifferentColumnAPIs = async (updateData) => {
  const response = await axiosClient.put('/v1/boards/supports/moveCards', updateData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axiosClient.put(`/v1/columns/${columnId}`, updateData)
  return response.data
}

// CREATE
export const createNewColumnAPIs = async (columnData) => {
  const response = await axiosClient.post('/v1/columns', columnData)
  return response.data
}

export const createNewCardAPIs = async (cardData) => {
  const response = await axiosClient.post('/v1/cards', cardData)
  return response.data
}

//DELETE
export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axiosClient.delete(`/v1/columns/${columnId}`)
  return response.data
}