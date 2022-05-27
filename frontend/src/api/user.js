import { apiInstance } from "./index.js";

const api = apiInstance();

async function login (user, success, fail) {
  await api.post('/user/login', JSON.stringify(user)).then(success).catch(fail);
}

function signup (user, success, fail) {
 api.post('/user/signup', JSON.stringify(user)).then(success).catch(fail);
}

function createRoom(userId, success, fail){
  api.get(`room/create/${userId}`).then(success).catch(fail);
}

function joinRoom(hostId, success, fail){
  api.get(`room/join/${hostId}`).then(success).catch(fail);
}

function nickNameCheck(validateName, success, fail){
  api.post('room/nickName', JSON.stringify(validateName)).then(success).catch(fail);
}

export { login, signup, createRoom, joinRoom, nickNameCheck}