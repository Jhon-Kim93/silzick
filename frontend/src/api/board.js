import { apiInstance } from "./index.js";

const api = apiInstance();

function getRequests (success, fail) {
  api.get('/board').then(success).catch(fail);
}

function getRequest (boardNum, success, fail) {
  api.get(`/board/${boardNum}`).then(success).catch(fail)
}

function createRequest (post, success, fail) {
  api.post('/board/regist', JSON.stringify(post)).then(success).catch(fail)
}

function updateRequest (post, success, fail) {
  api.put('/board/modify', JSON.stringify(post)).then(success).catch(fail)
}

function deleteRequest (boardNo, success, fail) {
  api.delete(`/board/${boardNo}`).then(success).catch(fail)
}

export { getRequests, getRequest, createRequest, updateRequest, deleteRequest }