import axiosClient from './axiosClient'

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axiosClient.get(`/v1/boards/${boardId}`)
  return response.data
}