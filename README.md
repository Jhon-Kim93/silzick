# 실례지만 직업과 성함이 어떻게 되시나요?
### 활용 기술(FE)
- webRTC(openvidu)
- Vue.js, vuex, axios
- bootstrap

### 프로젝트 소개
- 데스노트를 컨셉으로 변형한 마피아 게임
- 게임 규칙
1. 노트 주인과 경찰총장을 제외한 플레이어는 히든 미션 성공 시 능력 사용이 가능하다.
2. 노트 주인측  
  a. 노트 주인 : 1분마다 능력을 1회 얻어 참가자의 이름과 직업을 적고 원하는 시점에 죽일 수 있다.  
  b. 추종자 : 참가자의 이름과 직업을 적고 원하는 사람을 죽일 수 있다.  
3. 경찰측  
  a. 경찰총장 : 매번 명함교환 시 참여한 2명의 참가자가 각각 진짜를 냈는지 확인이 가능하다.  
  b. 경찰 : 노트 주인측을 검거할 수 있다.  
  c. 방송인 : 자신의 정체를 숨긴 채 채팅을 칠 수 있다.  
  d. 보디가드 : 특정 1인을 죽음으로부터 1회 보호한다.  
4. 승리조건  
  a. 노트 주인측 : 경찰을 모두 죽이면 승  
  b. 경찰측 : 노트 주인을 검거하면 승  
* AWS 서버 유지 불가로 인한 서비스 종료  

### 내가 맡은 역할(FE)
- openvidu활용 백엔드 서버와 게임 기능 구현
- 메인 페이지 및 대기방 구현

### 어려웠던 점
- 솔직히 다 어려웠다. 제대로 된 개발을 처음 해보는 거라 모든 게 어려웠고 재미있었다.

### 배운 점
#### openvidu 사용 경험
: 오픈바이두를 사용하면서 느낀 점은 "누가 옆에서 좀 알려줬으면 좋겠다..."였다. 분명 쉽게 구현 가능한 기능같은데 어디서 레퍼런스를 얻어서 구현해야 할 지를 모르니까 정말 어렵다고 느껴졌다. 그래서 오픈바이두를 처음 사용하는 누군가를 위해 내가 깨달은 기본적인 기능들을 정리해보려 한다.
(주의!🤩) 오픈바이두를 처음 써보는 사람에게 알려주는 아주 기본적인 내용들이다!

1) 용어 정리
- session : 참여자들이 모여있는 하나의 방이라고 생각하면 된다.
  (signal, on과 같은 매서드를 지원한다. 상세 내용은 공식문서를 참고 바람)
- publisher : 자기 자신의 정보(stream 정보가 핵심이며 session.publish()를 통해 등록 가능하다.)
- subscribers : 나 이외의 사람들의 정보다. publisher와 같은 구조이며 publish하게 되면 자동으로 추가된다.
- joinsession : session을 만들고 서버와 연결하는 핵심이자 가장 초기의 실행 함수다.
- OV : 오픈바이두 객체(session을 만듬)
- session.signal(obj) : 인자 값으로 보낼 데이터를 넣는다. (type, data, to 등)
  type에 넣는 값이 signal이름이자 아래 session.on에서 받는 evnet이름이 된다.(백서버에서 관리)
  signal은 행위를 하는 사람이 실행하는 함수고 on은 해당 시그널을 받는 사람한테 등록하는 함수다.
- session.on('event', function) : 특정 'event' 발생 시 실행할 함수를 추가(등록)한다.  ∴ joinsession에 있음
  -> signal로 event를 발생시키면 event를 수신한 모든 참가자에 대해 on()에 등록된 함수가 실행된다.
- session.connect() : 해당 세션에 연결한다.

2) 기본 동작 구성  
- joinsession이 모든 작업의 시발점이다.  
- joinsession의 구성을 살펴보면 먼저 OV객체를 생성하고 세션을 만든다. subscribers를 빈 리스트로 만들고 streamCreated와 streamDestroyed 이벤트를 등록한다. 이 두 이벤트는 각각 session.publish()와 session.unpublish()할 때 자동으로 시그널을 보내도록 설계되어 있다. 즉, 한명의 참여자가 늘거나 줄어들 때, 참여자들의 subscribers에 변화를 주기위한 코드다.(이 부분을 찾는데 오래 걸렸다...)  
- 입력된 값으로 토큰을 발급받고 토큰을 기반으로 특정 세션에 session.connect를 실행한다.  
     (이 때, vuex store에도 관련 정보들을 저장해주도록 하자.) 
- c까지 완료되면 joinsession은 끝이나고 leaveSession함수는 반대로 초기화하는 역할을 한다.  

3) session연결 connect? publish?  
- 처음 보았을 때 "session에 연결한다."라는 개념이 명확하지 않았다. (session.connect에서 .connect가 줄바꿈 되어있는 것도 한 몫 했다...😑..;)  
- 명확한 순서는 session.connect - session.publish - session.unpublish - session.disconnect 순이다.  
- 정리하자면 connect가 session에 연결하는 함수이고 publish는 publisher를 등록하는 함수다. 즉, connect만 되어있고 publisher로 등록되지 않은 사람도 있을 수 있다. (게임에서 옵저버라고 볼 수 있다.)  한마디로 connect가 session에 연결한다라는 개념이라면 publish는 스트리밍 정보를 등록해서 화면에 나오도록 한다라는 개념으로 이해하면 된다. 이 개념을 이용하여 우리 프로젝트에서 "명함교환방"이라는 기능과 사망처리를 구현할 수 있었다.  
