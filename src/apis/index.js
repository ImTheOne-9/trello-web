import axiosClient from './axiosClient'

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axiosClient.get(`/v1/boards/${boardId}`)
  return response.data
}

export const createNewColumnAPIs = async (columnData) => {
  const response = await axiosClient.post('/v1/columns', columnData)
  return response.data
}

export const createNewCardAPIs = async (cardData) => {
  const response = await axiosClient.post('/v1/cards', cardData)
  return response.data
}