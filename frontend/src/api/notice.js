import { apiInstance } from "./index.js";

const api = apiInstance();

function getNotices (success, fail) {
  api.get('/notice').then(success).catch(fail);
}

function getNotice (boardNum, success, fail) {
  api.get(`/notice/${boardNum}`).then(success).catch(fail)
}

function createNotice (post, success, fail) {
  api.post('/notice/regist', JSON.stringify(post)).then(success).catch(fail)
}

function updateNotice (post, success, fail) {
  api.put('/notice/modify', JSON.stringify(post)).then(success).catch(fail)
}

function deleteNotice (boardNo, success, fail) {
  api.delete(`/notice/${boardNo}`).then(success).catch(fail)
}

export { getNotices, getNotice, createNotice, updateNotice, deleteNotice }