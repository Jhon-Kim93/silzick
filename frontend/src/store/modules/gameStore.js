import axios from 'axios'
import { OpenVidu } from "openvidu-browser";
import { OPENVIDU_SERVER_URL} from '@/config/index.js'
import { jobs } from './gameUtil.js'
import router from '@/router/index.js'
import { createRoom, nickNameCheck, joinRoom } from '@/api/user.js'
import * as tmPose from '@teachablemachine/pose'
import Swal from 'sweetalert2'

axios.defaults.headers.post["Content-Type"] = "application/json";

const Toast = Swal.mixin({
  toast: true,
  position: 'top-right',
  iconColor: 'white',
  customClass: {
    popup: 'colored-toast'
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: false
})

const gameStore = {
  namespaced: true,

  state: {
    // customed
    join: false,
    isHost: false,
    hostId: undefined,
    nickname: undefined,
    // isReady: false,
    // activeGameStart: false,
    readyStatus: false,
    // participants에 넣는 객체 : {nickname: clientData, connectionId: connectionId}
    participants: [],
    // 마지막에 끝났을 때 승자/패자 정보 보여주기 위한 로그 데이터(participants와 동일), participants는 사망 시 데이터 삭제됨
    // finalInfo는 {connectionId:직업} 리스트로 받는 변수
    participantsLog: [],
    finalInfo: [],
    resultContent:"",

    publisherId: undefined,
    winner: undefined,
    mainGameTimerSevenOrThirty: 30,
    turn : 0,
    
    // Ovenvidu
    OV: undefined,
    OVToken: undefined,
    sessionId: undefined,
    session: undefined,
    publisher: undefined,
    subscribers: [],

    // 명교방
    subOV: undefined,
    subOVToken: undefined,
    subSession: undefined,
    subPublisher: undefined,
    subSubscribers: [],
    receivedCard: '선택 중',

    //mission
    mission: -1,
    random_int: 0,
    //거짓 명함 낼 수 있는 횟수(미션 달성 횟수)
    missionSuccessCount: 1,
    //히든 미션 달성 횟수
    numberOfSkillUsed: 1,
    //그냥 미션인지 히든인지 구분.
    isNormalMission: true,
    options: [
      { value: 'KIRA', text: '노트주인'},
      { value: 'CRIMINAL', text: '추종자'},
      { value: 'L', text: '경찰총장'},
      { value: 'POLICE', text: '경찰'},
      { value: 'GUARD', text: '보디가드'},
      { value: 'BROADCASTER', text: '방송인'},
    ],
    isKIRAorL : false,

    //game
    isAlive: true,
    jobs: jobs,
    myJob: undefined,

    //chatting
    messages: [],

    // Pose
    url : "https://teachablemachine.withgoogle.com/models/Zcd4DPpuu/",
    modelURL: 'https://teachablemachine.withgoogle.com/models/Zcd4DPpuu/model.json',
    metadataURL: 'https://teachablemachine.withgoogle.com/models/Zcd4DPpuu/metadata.json',
    model: undefined,
    webcam: undefined,
    size: 200,

    //memo
    memo:''
  },
  //host입력 없이 join으로 바로 못들어가게 막는데 사용
  getters: {
    getSessionId : function(state){
      return state.sessionId;
    },
    getIsHost : function(state){
      return state.isHost;
    },
    getSession : function(state){
      return state.session;
    }

  },
  
  mutations: {
    GAME_CHECKIN (state) {
      state.join = true
    },
    GAME_CHECKOUT (state) {
      state.join = false
    },
    NICKNAME_UPDATE (state, res) {
        state.nickname = res
    },
    //각 참여자의 nickName, id 담는 리스트.
    SET_PARTICIPANTS(state, res){
      state.participants = res
    },
    SET_PARTICIPANTS_LOG(state, res){
      state.participantsLog = res
    },
    //참여자 전원이 레디를 했는지 판단.
    SET_READY_STATUS(state, res){
      state.readyStatus = res
    },
    IS_ALIVE(state, res){
      state.isAlive = res
    },
    // 메인페이지에서 "방생성" 누르고 들어오면 isHost = true
    IS_HOST (state) {
      state.isHost = true
    },
    SET_PUBLISHER (state, res) {
      state.publisher = res
    },
    SET_OV (state, res) {
      state.OV = res
    },
    SET_SESSIONID (state, sessionId) {
      state.sessionId = sessionId
    },
    SET_SESSION (state, res) {
      state.session = res
    },
    SET_SUBSCRIBERS (state, res) {
      state.subscribers = res
    },
    SET_OVTOKEN (state, res) {
      state.OVToken = res
    },
    SET_MY_PUBLISHER_ID (state, id) {
      state.publisherId = id
    },
    SET_MY_JOB(state, job){
      state.myJob = job
    },
    // 명교방 state 설정하기
    SET_SUB_PUBLISHER (state, res) {
      state.subPublisher = res
    },
    SET_SUB_OV (state, res) {
      state.subOV = res
    },
    SET_SUB_SESSION (state, res) {
      state.subSession = res
    },
    SET_SUB_SUBSCRIBERS (state, res) {
      state.subSubscribers = res
    },
    SET_SUB_OVTOKEN (state, res) {
      state.subOVToken = res
    },
    EXCHANGE_OFF (state) {
      state.subOV = undefined
      state.subPublisher = undefined
      state.subSubscribers = []
    },
    SET_HOST_ID(state, hostId){
      state.hostId = hostId
    },
    SET_TURN(state, res){
      state.turn = res
    },
    COUNT_TURN(state) {
      state.turn ++
      if(state.myJob=="KIRA" && state.turn%2==0){
        state.numberOfSkillUsed ++
      }
    },
    // 명교방 갔다 나오면 타이머 7초로 설정
    SET_MAINGAME_TIMER(state, res) {
      state.mainGameTimerSevenOrThirty = res
    },
    
    //미션 관련 기능
    RANDOM_INT(state,res){
      const min = Math.ceil(res.min)
      const max = Math.floor(res.max)
      state.random_int = Math.floor(Math.random()*(max-min+1))+min
    },
    SET_RANDOM_INT(state, res){
      state.random_int = res
    },
    MISSION_SELECT(state){
      state.mission = state.random_int
      state.random_int = 0
    },
    MISSION_RESET(state){
      state.mission = 0
    },
    //위에거랑 똑같은데 로직이 어디서 꼬인지 몰라서 일단 두개 만들었음.(-1로 초기화용)
    SET_MISSION(state, res){
      state.mission = res
    },
    RECORD_RESET(state){
      state.record = !state.record
    },
    SET_MISSION_SUCCESS(state, count){
      state.missionSuccessCount += count
    },
    RESET_MISSION_SUCCESS(state, res){
      state.missionSuccessCount = res
    },
    IS_NORMAL_MISSION(state, res){
      state.isNormalMission = res
    },
    //스킬 사용 횟수
    SET_NUMBER_OF_SKILL_USE(state, count){
      state.numberOfSkillUsed += count
    },
    RESET_SKILL_USE(state, count){
      state.numberOfSkillUsed = count
    },
    IS_KIRA_OR_L(state, res){
      state.isKIRAorL = res
    },
    SET_OPTIONS(state, options){
      state.options = options
    },
    
    // 채팅 관련 기능
    SET_MESSAGES(state, res) {
      state.messages.push(res)
    },
    RESET_MESSAGES(state){
      state.messages = []
    },

    // 게임 관련 기능
    // 직업 리스트 입력
    GET_JOB_PROPS (state, jobProps) {
      state.jobs = jobProps
    },

    // 직업 정보 내 count 증감
    CHANGE_JOB_COUNT(state, jobProps) {
      state.jobs.forEach(job => {
        if (job.jobName === jobProps.jobName) {
          job.count = jobProps.count
        }
      })
    },

    // 명함교환 시 상대방 확정 카드 자원 관리
    RECEIVE_CARD(state, card) {
      state.receivedCard = card
    },
    // 게임 끝나는 화면 선택
    SET_WINNER(state, winner) {
      state.winner = winner
    },
    FINAL_INFO(state, data) {
      state.finalInfo = data
    },
    
    // 포즈 관련 
    SET_POSE_MODEL(state,res){
      state.model = res
    },
    SET_POSE_WEBCAM(state,res){
      state.webcam = res
    },
    GET_MEMO(state,res){
      state.memo = res
    },
    //경기결과
    GET_RESULT_CONTENT(state,res){
      state.resultContent = res
    }
  },

  actions: {
    //해당 세션에 사용하고자 하는 닉네임이 사용중인지 체크. 사용중이 아니라면 joinSession, subJoinSession하고 닉네임 업데이트.
    nicknameUpdate ({ state, commit, dispatch }, nickname) {
      const validateName = {
        nickName: nickname,
        roomCode: state.sessionId
      }
      nickNameCheck(
        validateName,
        ()=>{
          commit('NICKNAME_UPDATE', nickname)
          dispatch('subJoinSession')
          dispatch('joinSession')
        },
        ()=>{
          
        })
    },
    // ★★★★★★★★★★★★★★겁나 중요함★★★★★★★★★★★★★★★★★
    // 오픈바이두 연결하는 세션만드는 함수, 닉네입 입력 후 참가 누르면 동작함
    async joinSession({ commit, dispatch, state }) {
      // --- Get an OpenVidu object ---
      const OV = new OpenVidu();
      OV.enableProdMode();
      // --- Init a session ---
      const session = OV.initSession();

      const subscribers = [];
      // --- Specify the actions when events take place in the session ---
      
      // On every new Stream received...
      // stream = 영상 송출과 관련된 정보들
      // 세션에 publisher를 등록하면 자동으로 streamCreated가 실행되고 다른사람의 subscribers에 내 stream정보를 담는 로직
      session.on("streamCreated", ({ stream }) => {
        const subscriber = session.subscribe(stream);
        subscriber.ready = false
        subscribers.push(subscriber);
      });
      // On every Stream destroyed...
      session.on("streamDestroyed", ({ stream }) => {
        const index = subscribers.indexOf(stream.streamManager, 0);
        if (index >= 0) {
          subscribers.splice(index, 1);
        }
      });
      
      // On every asynchronous exception...
      session.on("exception", ({ exception }) => {
        console.warn(exception);
      });

      // session.on의 첫번째 인자 = event(String), 두번째 인자 = 앞의 event를 받아서 실행하는 함수(Function)
      // event.data에 채팅 input에서 받은 내용을 parsing해서 state의 messages에 반영
      session.on("signal:chat", (event)=>{
        const { message } = JSON.parse(event.data);
        const { user, chatMessage } = message
        const data = user + " : " + chatMessage
        commit('SET_MESSAGES', data)
      });

      // 게임 관련 시그널 관리
      session.on("signal:game", (event) => {
        // 게임 접속 시 직업 데이터 현황 받기
        switch(event.data.gameStatus){
          case 0 :{
            for (let i=0; i<6; i++) {
              state.jobs.forEach(job => {
                if (job.jobName == event.data[i].jobName) {
                  job.count = event.data[i].count
                }
              })
            }
            break;
          }
          case 1 :{
            let job = event.data
            commit('CHANGE_JOB_COUNT', job)
            break;
          // 게임 접속 시 ready 현황 받기
          } 
          case 2 :{
            state.subscribers.forEach(subscriber => {
              subscriber.ready = event.data[subscriber.stream.connection.connectionId]
            })
            break;
          }
          // 다른사람이 레디했을 때 정보 받아서 바꾸기 + 6명 이상 레디하면 게임시작 활성화
          case 3 :{
            state.subscribers.forEach(subscriber => {
              subscriber.ready = event.data[subscriber.stream.connection.connectionId]
            })
            state.publisher.ready = event.data[state.publisherId]
            if (event.data.readyStatus) {
              commit('SET_READY_STATUS', true)
            } else {
              commit('SET_READY_STATUS', false)
            }
            break;
          // 내 직업 받고 게임 스타트
          } 
          case 4 :{
            commit('SET_MY_JOB', event.data.jobName)
            dispatch('checkIsKIRAorL', event.data.jobName)
            router.push({
              name: 'MainGame'
            })
            break;
          // 직업별 스킬 사용
          }
          case 5 :{
            switch (event.data.skillType) {
              // 키라가 노트에 이름을 적음
              case 'noteWrite':{
                const {writeName} = event.data
                if (writeName) {
                  state.messages.push('System : 누군가의 이름이 노트에 적혔습니다.')
                  Toast.fire({
                    icon: 'warning',
                    title: '경고'
                  })
                } else {
                  state.messages.push('System : 이름과 직업이 일치하지 않습니다.')
                  Toast.fire({
                    icon: 'question',
                    title: '제거 실패'
                  })
                }
                break
              }
              // 키라가 노트에 적힌 사람을 모두 죽임
              case 'noteUse':{
                const results = event.data
                const { cnt } = results
                for (let i = 0; i < cnt; i++) {
                  const {isAlive, userId, connectionId} = results[i]
                  const { clientData } = JSON.parse(userId)
                  if (isAlive) {
                    state.messages.push('System : ' + clientData + '가 보디가드에 의해 보호되었습니다.')
                     Toast.fire({
                      icon: 'info',
                      title: '경호 성공'
                    })
                  } else {
                    if (state.publisher && state.publisherId == connectionId){
                      state.session.unpublish(state.publisher)
                      commit('SET_PUBLISHER', undefined)
                      commit('IS_ALIVE', false)
                    } else if (state.subPublisher && state.publisherId == connectionId){
                      state.subSession.unpublish(state.subPublisher)
                      commit('SET_SUB_PUBLISHER', undefined)
                      commit('IS_ALIVE', false)
                    }
                    dispatch('removeParticipant', connectionId)
                    state.messages.push('System : ' + clientData + '가 심장마비로 사망하였습니다.')
                    Toast.fire({
                      icon: 'warning',
                      title: '부고 소식'
                    })
                    
                  }
                }
                break
              }
              // 명교 확정 시 L에게 True or False 결과 전달
              case 'announceToL':{
                let TF = '거짓'
                if (event.data.result) {
                  TF = '진실'
                }
                const {clientData} = JSON.parse(event.data.userId)
                const message = "System : " + clientData + "는 " + TF + '인 명함을 냈습니다.'
                state.messages.push(message)
                Toast.fire({
                  icon: 'info',
                  title: '알림'
                })
                break
              }
              // 방송인의 방송 기능
              case 'announce':{
                const message = '경찰측 방송 : ' + event.data.announce
                state.messages.push(message)
                Toast.fire({
                  icon: 'success',
                  title: '방송 송출'
                })
                break
              }
              // 보디가드의 보호 기능은 백에서 구현, 확인 메세지만 출력
              case 'protect':{
                const {clientData} = JSON.parse(event.data.userId)
                const message = "System : " + clientData + '을/를 1회 보호합니다.'
                state.messages.push(message)
                Toast.fire({
                  icon: 'success',
                  title: '경호 시작'
                })
                break
              }
              // 경찰의 검거 능력, 키라측이면 죽임
              case 'arrest': {
                const { isCriminal, userId, connectionId} = event.data
                const { clientData } = JSON.parse(userId)
                
                if (isCriminal == true) {
                  state.messages.push('System : 추종자 ' + clientData + '가 검거되었습니다.')
                   Toast.fire({
                    icon: 'success',
                    title: '체포성공'
                  })
                } else {
                  state.messages.push('System : 경찰 ' + clientData + '가 경찰측 체포를 시도하여 해고당했습니다.')
                   Toast.fire({
                    icon: 'error',
                    title: '직위 박탈'
                  })
                }
                // 찾아서 죽이기
                dispatch('removeParticipant', connectionId)
                // 퍼블리셔 지우기
                if (state.publisher && state.publisherId == connectionId){
                  state.session.unpublish(state.publisher)
                  commit('SET_PUBLISHER', undefined)
                  commit('IS_ALIVE', false)
                } else if (state.subPublisher &&state.publisherId == connectionId){
                  state.subSession.unpublish(state.subPublisher)
                  commit('SET_SUB_PUBLISHER', undefined)
                  commit('IS_ALIVE', false)
                }
                break
              }
              case 'kill': {
                const result = event.data
                const { isAlive, userId, connectionId } = result
                const { clientData } = JSON.parse(userId)
                if (isAlive == 0) {
                  state.messages.push('System : ' + clientData + '가 보디가드에 의해 보호되었습니다.')
                   Toast.fire({
                    icon: 'info',
                    title: '경호 성공'
                  })
                } else if (isAlive == 1) {
                  state.messages.push('System : ' + clientData + '의 직업 정보가 일치하지 않습니다.')
                  Toast.fire({
                    icon: 'question',
                    title: '제거 실패'
                  })
                } else {
                  dispatch('removeParticipant', connectionId)
                  if (state.publisher && state.publisherId == connectionId){
                    state.session.unpublish(state.publisher)
                    commit('SET_PUBLISHER', undefined)
                    commit('IS_ALIVE', false)
                  } else if (state.subPublisher && state.publisherId == connectionId){
                    state.subSession.unpublish(state.subPublisher)
                    commit('SET_SUB_PUBLISHER', undefined)
                    commit('IS_ALIVE', false)
                  } 
                  state.messages.push('System : ' + clientData + '가 심장마비로 사망하였습니다.')
                  Toast.fire({
                    icon: 'error',
                    title: '사망 소식'
                  })
                }
                break
              }
            }
            break;
          // 파티스펀트 초기 데이터 받기
          }
          case 7 :{
            const participantsData = event.data
            const { cnt } = participantsData
            for (let i = 0; i < cnt; i++) {
              const { userId, connectionId } = participantsData[i]
              const { clientData } = JSON.parse(userId)
              if(state.publisherId != connectionId){
                state.participants.push({nickname: clientData, connectionId: connectionId})
                state.participantsLog.push({nickname: clientData, connectionId: connectionId})
              }
            }
            state.participantsLog.push({nickname: state.nickname, connectionId: state.publisher.stream.connection.connectionId})
            break;
          }
          case 8 :{
            const winner = event.data.winner
            commit('SET_WINNER', winner)
            if (winner ==='KIRA'){
              commit('GET_RESULT_CONTENT','System : 모든 경찰이 사망했습니다.'+ winner+'측의 승리입니다.')
            }else{
              commit('GET_RESULT_CONTENT','System : 노트측이 모두 체포되었습니다.'+ winner+'측의 승리입니다.')
            }
            let timerInterval
            Swal.fire({
              title: `${state.winner}`,
              html:
                `${state.resultContent}`+
                '게임이 <strong></strong>초 뒤에 종료됩니다.<br/><br/>' ,
              timer: 5000,
              didOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                  Swal.getHtmlContainer().querySelector('strong')
                    .textContent = (Swal.getTimerLeft() / 1000)
                      .toFixed(0)
                }, 100)
              },
              willClose: () => {
                clearInterval(timerInterval)
              }
            })
            setTimeout(() => {
              router.push({ name: 'GameEnd' })
            }, 5000);

            const {data} = event
            commit('FINAL_INFO', data)
            break;
          }
          case 10 :{
            const { user, chatMessage, to, fromName } = event.data
            if(state.publisherId == to){
              const data = user + "의 귓속말 : " + chatMessage
              commit('SET_MESSAGES', data)
            }else{
              const data = fromName + "에게 귓속말 : " + chatMessage
              commit('SET_MESSAGES', data)
            }
            break;
          }
        }
      });
      // 명함교환 방 자동 이동 & 미션 자동 분배
      session.on("signal:autoSystem", (event) => {
        // const action = JSON.parse(event.data).action
        const { action } = event.data
        switch(action){
          case 'nameTurn': {
            commit('COUNT_TURN')
            break;
          }
          // 명교방 가는 사람한테만 보냄
          case 'exchangeNameStart': {
            commit('RECEIVE_CARD','선택 중')
            state.session.unpublish(state.publisher)
            commit('SET_PUBLISHER', undefined)
            let subPublisher = OV.initPublisher(undefined, {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: true, // Whether you want to start publishing with your video enabled or not
              resolution: "1280×720", // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
              mirror: false, // Whether to mirror your local video or not
            });
            //진행하고 있는 미션 초기화.
            dispatch('missionReset')
            commit('SET_SUB_PUBLISHER', subPublisher)
            state.subSession.publish(state.subPublisher)
            router.push({
              name: 'CardExchange',
            })
            break;
          } 
          case 'meetKIRA':{
            const message = "System : 키라측 접선에 성공했습니다."
            state.messages.push(message)
            Toast.fire({
              icon: 'info',
              title: '접선 성공'
            })
            break;
          }
          case 'missionStart':{
            if (state.isKIRAorL == false) {
              //리셋하고
              dispatch('missionReset')
              //히든미션으로 다시 미션 시작.
              dispatch('missionSelect',false)
            }
            break;
          }
          case 'policeMissionStart':{
            const message = "System : 경찰이 히든미션을 시작했습니다!"
            state.messages.push(message)
            break;
          }
        }
        // 두명 중 하나가 퍼블리셔면 언퍼블리시하고 라우터푸시 조인세션?
      })

      //방장이면 sessionCreate부터 해야하므로 getToken으로, 이미 세션 만들어져 있으면 createToken으로 토큰만 만듬.
      if(!state.session && state.isHost){
        await dispatch("getToken", state.sessionId).then((token) => {
          session
          .connect(token, { clientData: state.nickname })
          .then(() => {
            // --- Get your own camera stream with the desired properties ---
            let publisher = OV.initPublisher(undefined, {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: true, // Whether you want to start publishing with your video enabled or not
              resolution: "1280×720", // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
              mirror: false, // Whether to mirror your local video or not
            });
            publisher.ready = false
            commit('SET_OV', OV)
            commit('SET_PUBLISHER', publisher)
            commit('SET_SESSION', session)
            commit('SET_SUBSCRIBERS', subscribers)
            commit('SET_OVTOKEN', token)
            // --- Publish your stream ---
            session.publish(state.publisher)
            commit('SET_MY_PUBLISHER_ID', state.publisher.stream.connection.connectionId)
            router.push({
              name: 'Attend',
            })
          })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }else{
        await dispatch("createToken", state.sessionId).then((token) => {
          session
          .connect(token, { clientData: state.nickname })
          .then(() => {
            // --- Get your own camera stream with the desired properties ---
            let publisher = OV.initPublisher(undefined, {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: true, // Whether you want to start publishing with your video enabled or not
              resolution: "1280×720", // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
              mirror: false, // Whether to mirror your local video or not
            });
            publisher.ready = false
            commit('SET_OV', OV)
            commit('SET_PUBLISHER', publisher)
            commit('SET_SESSION', session)
            commit('SET_SUBSCRIBERS', subscribers)
            commit('SET_OVTOKEN', token)
            // --- Publish your stream ---
            session.publish(state.publisher)
            commit('SET_MY_PUBLISHER_ID', state.publisher.stream.connection.connectionId)
            router.push({
              name: 'Attend',
            })
          })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }
      window.addEventListener("beforeunload", this.leaveSession);
    },
    getToken({ dispatch }, mySessionId) {
      return dispatch('createSession', mySessionId).then((sessionId) =>
        dispatch('createToken', sessionId)
      );
    },
    createSession(context, sessionId) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${OPENVIDU_SERVER_URL}/openvidu/api/sessions`,
            JSON.stringify({
              customSessionId: sessionId,}),
            {
              headers: {
                'Content-Type' : 'application/json'
              },
              auth: {
                username: "OPENVIDUAPP",
                password: process.env.VUE_APP_OPENVIDU_SERVER_SECRET,
              },
            }
          )
          .then((response) =>response.data)
          .then((data) => resolve(data.id))
          .catch((error) => {
            if (error.response.status === 409) {
              resolve(sessionId);
            } else {
              console.warn(
                `No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}`
              );
              if (
                window.confirm(
                  `No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server is up and running at "${OPENVIDU_SERVER_URL}"`
                )
              ) {
                location.assign(`${OPENVIDU_SERVER_URL}/accept-certificate`);
              }
              reject(error.response);
            }
          });
      });
    },
    createToken(context, sessionId) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${OPENVIDU_SERVER_URL}/api/tokens`,JSON.stringify({
              "session": sessionId,}),
            {
              auth: {
                username: "OPENVIDUAPP",
                password: process.env.VUE_APP_OPENVIDU_SERVER_SECRET,
              },
            }
          )
          .then((response) => response.data)
          .then((data) => resolve(data.token))
          .catch((error) => reject(error.response));
      });
    },
    leaveSession({state, commit}) {
      // --- Leave the session by calling 'disconnect' method over the Session object ---
      if (state.session) {
        state.session.disconnect();
        state.subSession.disconnect();

        commit('SET_READY_STATUS', false)
        commit('SET_PARTICIPANTS', [])
        commit('SET_PARTICIPANTS_LOG',[])
        commit('SET_MY_PUBLISHER_ID', undefined)
        commit('SET_WINNER', undefined)
        commit('SET_MISSION', -1)
        commit('SET_RANDOM_INT', 0)
        commit('SET_MISSION_SUCCESS',0)
        commit('RESET_SKILL_USE',0)
        commit('IS_NORMAL_MISSION',true)
        commit('SET_TURN',0)
        commit('RESET_MISSION_SUCCESS',0) 
        commit('NICKNAME_UPDATE', undefined)
        commit('SET_OPTIONS', [
          { value: 'KIRA', text: '노트주인'},
          { value: 'CRIMINAL', text: '추종자'},
          { value: 'L', text: '경찰총장'},
          { value: 'POLICE', text: '경찰'},
          { value: 'GUARD', text: '보디가드'},
          { value: 'BROADCASTER', text: '방송인'},
        ])
        commit('IS_KIRA_OR_L', false)
        commit('IS_ALIVE', true)
        commit('SET_MY_JOB', undefined)
        commit('RESET_MESSAGES')
        commit('GET_JOB_PROPS',jobs)
        // 오픈바이두 리셋
        commit('SET_SESSION', undefined)
        commit('SET_PUBLISHER', undefined)
        commit('SET_OV', undefined)
        commit('SET_OVTOKEN', undefined)
        commit('SET_SUBSCRIBERS', [])

        commit('SET_SUB_OV', undefined)
        commit('SET_SUB_SESSION', undefined)
        commit('SET_SUB_OVTOKEN', undefined)
        commit('SET_SUB_SUBSCRIBERS', [])



      }
      // window.removeEventListener("beforeunload", this.leaveSession);
    },
    // 명교방 관련 기능
    exchange ({state}) {
      state.subSession.publish(state.subPublisher)
      // dispatch('subJoinSession')
      router.push({
        name: "CardExchange"
      })
    },
    exchangeOff ({commit, state}) {
      commit('EXCHANGE_OFF')
      state.session.publish(state.publisher)
    },
    subJoinSession({ commit, dispatch, state }) {
      // --- Get an OpenVidu object ---
      const subOV = new OpenVidu();
      subOV.enableProdMode();
      // --- Init a session ---
      const subSession = subOV.initSession();
      const subSubscribers = [];
      
      // --- Specify the actions when events take place in the session ---
      
      // On every new Stream received...
      subSession.on("streamCreated", ({ stream }) => {
        const subSubscriber = subSession.subscribe(stream);
        subSubscribers.push(subSubscriber);
      });
      // On every Stream destroyed...
      subSession.on("streamDestroyed", ({ stream }) => {
        const subIndex = subSubscribers.indexOf(stream.streamManager, 0);
        if (subIndex >= 0) {
          subSubscribers.splice(subIndex, 1);
        }
      });
      // On every asynchronous exception...
      subSession.on("exception", ({ exception }) => {
        console.warn(exception);
      });

      subSession.on("signal:exchangeCard", (event) => {
        const receivedCard = JSON.parse(event.data)
        const jobName = receivedCard.jobName
        const nickname = receivedCard.nickname
        if(state.nickname != nickname){
          dispatch('receiveCard', jobName)
        }
      })
      
      //방장이면 sessionCreate부터 해야하므로 getToken으로, 이미 세션 만들어져 있으면 createToken으로 토큰만 만듬.
      if(!state.session && state.isHost){
        dispatch("getToken", 'sub' + state.sessionId).then((subToken) => {
          subSession
          .connect(subToken, { clientData: state.nickname })
          .then(() => {
            // --- Get your own camera stream with the desired properties ---
            commit('SET_SUB_OV', subOV)
            commit('SET_SUB_SESSION', subSession)
            commit('SET_SUB_OVTOKEN', subToken)
            commit('SET_SUB_SUBSCRIBERS', subSubscribers)
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
        window.addEventListener("beforeunload", this.leaveSession);
      }else{
        dispatch("createToken", 'sub' + state.sessionId).then((subToken) => {
          subSession
          .connect(subToken, { clientData: state.nickname })
          .then(() => {
            // --- Get your own camera stream with the desired properties ---
            commit('SET_SUB_OV', subOV)
            commit('SET_SUB_SESSION', subSession)
            commit('SET_SUB_OVTOKEN', subToken)
            commit('SET_SUB_SUBSCRIBERS', subSubscribers)
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
        window.addEventListener("beforeunload", this.leaveSession);
      }
    },

    // 채팅 관련 통신
    sendMessage ({ state }, message) {
      state.session.signal({
        type: 'chat',
        data: JSON.stringify({message}),
        to: [],
      })
    },
    sendMessageWhisper ({ state }, messageData) {
      const from = state.participants.find((participant)=>{
        if(participant.connectionId == messageData.to){
          return participant
        }
      })
      console.log(from)
      state.session.signal({
        type: 'game',
        data: {
          gameStatus: 10,
          user: messageData.user,
          chatMessage: messageData.chatMessage,
          to: messageData.to,
          fromName : from.nickname
        },
        to: [],
      })
      
    },
    setReady ({state}) {
      state.session.signal({
        type: 'game',
        data: {
          gameStatus: 3
        },
        to: [],
      })
    },

    // 게임 기능
    removeParticipant({state}, connectionId) {
      const participant = state.participants.find(participant => {return participant.connectionId === connectionId})
      const idx = state.participants.indexOf(participant)
      if (idx > -1) { state.participants.splice(idx, 1) }
    },
    changeJobCount({ state }, jobProps) {
      state.session.signal({
        type: 'game',
        data: jobProps,
        to: [],
      })
    },

    getReadyStatus({state}) {
      state.session.signal({
        type: 'game',
        data: {
          gameStatus: 2
        },
        to: [],
      })
    },
    getJobsState({state}) {
      state.session.signal({
        type: 'game',
        data: {
          gameStatus: 0
        },
        to: [],
      })
    },
    exitCard({state, commit}) {
      // 메인게임 화면 타이머 7초짜리로 변경
      commit('SET_MAINGAME_TIMER', false)
      state.subSession.unpublish(state.subPublisher)
      commit('SET_SUB_PUBLISHER', undefined)
      let publisher = state.OV.initPublisher(undefined, {
        audioSource: undefined, // The source of audio. If undefined default microphone
        videoSource: undefined, // The source of video. If undefined default webcam
        publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
        publishVideo: true, // Whether you want to start publishing with your video enabled or not
        resolution: "1280×720", // The resolution of your video
        frameRate: 30, // The frame rate of your video
        insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
        mirror: false, // Whether to mirror your local video or not
      });
      if (state.isAlive){
        commit('SET_PUBLISHER', publisher)
        state.session.publish(state.publisher)
      }
      router.push({
        name: 'MainGame'
      })
    },
    receiveCard({commit}, card) {
      commit('RECEIVE_CARD', card)
    },

    //미션 관련 기능
    randomInt({commit},res){
      commit('RANDOM_INT',res)
    },
    missionSelect({commit,dispatch},isNormalMission){
      //미션 종류 선택
      dispatch('randomInt',{min:1,max:2})
      commit('MISSION_SELECT')
      //미션이 일반미션인지, 히든인지.
      commit('IS_NORMAL_MISSION',isNormalMission)
    },
    missionReset({commit}){
      commit('MISSION_RESET')
    },
    missionSuccess({commit}, count){
      commit('SET_MISSION_SUCCESS', count)
    },
    numberOfSkillUse({commit},count){
      commit('SET_NUMBER_OF_SKILL_USE',count)
    },
    checkIsKIRAorL({commit}, jobName){
      if(jobName == 'KIRA' || jobName == 'L'){
        commit('IS_KIRA_OR_L', true);
      }else{
        commit('IS_KIRA_OR_L', false);
      }
    },
    changeOption({state}){
      //키라랑 엘이면 그냥 모두 사용가능하게 두고.
      if(!state.isKIRAorL){
        //키라랑 엘이 아니면 미션 카운트가 1이상일때만 모두 사용가능.
        if(state.isKIRAorL || state.missionSuccessCount>0){
          state.options.map((option)=>{
            if(option.value!="선택 중"){
              option.disabled = false
            }
          })
          //그게 아니면 자기직업만 낼 수 있음.
        }else{
          state.options.map((option)=>{
            if(option.value == state.myJob){
              option.disabled = false
            }else{
              option.disabled = true
            }
          })
        }
      }
    },
    async init ({state,commit}) {
      const model = await tmPose.load(state.modelURL, state.metadataURL)
      const flip = true
      const webcam = new tmPose.Webcam(state.size, state.size, flip)
      commit('SET_POSE_MODEL',model)
      commit('SET_POSE_WEBCAM',webcam)
      await state.webcam.setup()
      await state.webcam.play()
    },

    //입장 관련 기능
    //방장이 방 생성
    createRoomRequest({commit}, userId){
      createRoom(
        userId,
        ({data})=>{
          //호스트로 바꾸기.
          commit('IS_HOST')
          commit('SET_HOST_ID', userId)
          commit('SET_SESSIONID',data)
          router.push({ name : 'Join' })
      },
      (err)=>{
        if(err == "Error: Request failed with status code 403"){
          Swal.fire({
            icon: 'error',
            title: '로그인 중복 에러',
            text: '로그아웃 후 다시 로그인해주세요.',
          })
        }else{
          Swal.fire({
            icon: 'error',
            title: '방 초기화 실패',
            text: '방이 아직 초기화 되지 않았습니다! 잠시후 다시 시도해주세요.',
          })
        }
      })
    },

    //게스트 참여
    guestJoinRoom({commit}, hostId){
      joinRoom(
        hostId,
        ({data})=>{
          commit('SET_SESSIONID', data)
          commit('SET_HOST_ID', hostId)
          router.push({ name : 'Join' })
        },
        ()=>{
          Swal.fire({
            icon: 'error',
            title: '방생성이 에러',
            text: '호스트가 아직 방을 생성하지 않았거나 초기화 되지 않았습니다.!',
          })
        })
    },
    getMemo({commit},res){
      commit('GET_MEMO',res)
    },

    //게임 종료 후 되돌아가기 
    gameReset({dispatch}){
      dispatch('leaveSession')
      router.push({
        name: 'Join',
      })
    }
  },
  changeJobNameEToK(context, res){
    switch(res){
      case 'KIRA' :{
        return '노트주인'
      }
      case 'POLICE' :{
        return '경찰'
      }
      case 'L' :{
        return '경찰총장'
      }
      case 'CRIMINAL' :{
        return '추종자'
      }
      case 'GUARD' :{
        return '보디가드'
      }
      case 'BROADCASTER' :{
        return '방송인'
      }
    }
  },
  
}

export default gameStore;