/* UI state for the HTML prototype; no API calls. */
(function(root) {
'use strict';
const replyNames=['다정한마음','숲속산책','산들바람','햇살한줌','푸른바다'];
const length=s=>Array.from(String(s)).length;
const uid=()=>globalThis.crypto?.randomUUID?.()||`item-${Date.now()}-${Math.random().toString(36).slice(2)}`;
function validDraft(d){
  if(!d.title.trim()||!d.body.trim()||length(d.title)>40||length(d.body)>2000)return false;
  const a=d.options||[];
  return !a.length||(a.length>=2&&a.length<=10&&a.every(s=>s.trim()&&length(s.trim())<=100)&&new Set(a.map(s=>s.trim())).size===a.length);
}
function seed(){
 const now=Date.now();
 const posts=[
 {id:'demo-poll',title:'여행지에 도착하면 무엇부터 하세요?',body:'짐을 풀고 동네 시장에 가면 여행이 시작된 기분이에요.\n여러분의 첫 일정도 궁금해요.',author:'포근한구름',user:'cloud',created:now-300000,likes:12,liked:false,poll:{options:[{text:'동네 시장 구경하기',votes:18},{text:'숙소 근처 둘러보기',votes:7},{text:'현지 음식 맛보기',votes:5}],myOption:null}},
 {id:'demo-replies',title:'리스본 골목에서 만난 작은 빵집',body:'아침에 숙소 근처 빵집에서 갓 구운 에그타르트를 먹었어요.\n다음 날에도 같은 자리에 앉아 커피 한 잔을 마셨답니다.',author:'느린오후',user:'afternoon',created:now-1800000,likes:8,liked:false},
 {id:'demo-mine',title:'오늘은 일정을 하나만 잡았어요',body:'미술관만 예약하고 오후는 비워 뒀어요.\n광장에서 우연히 들은 연주가 이번 여행에서 가장 기억에 남네요.',author:'여행동행',user:'me',created:now-3600000,likes:3,liked:false},
 {id:'demo-voted',title:'기차 여행에 챙겨 가는 간식은?',body:'내일은 기차로 세 시간 이동해요.\n여러분은 긴 이동에 어떤 간식을 챙기세요?',author:'초록산책',user:'walk',created:now-7200000,likes:2,liked:false,poll:{options:[{text:'초콜릿이나 말린 과일',votes:12},{text:'김밥이나 작은 주먹밥',votes:8}],myOption:0}}
 ];
 const comments=[{id:'root1',post:'demo-poll',parent:null,author:'차분한바람',user:'wind',body:'저는 동네 시장부터 가요. 제철 과일을 구경하는 재미가 있어요.',created:now-240000,likes:5,liked:false},
 {id:'root2',post:'demo-poll',parent:null,author:'여행동행',user:'me',body:'숙소에 짐을 두고 근처 식당부터 찾아요.',created:now-180000,likes:1,liked:false},
 {id:'root3',post:'demo-replies',parent:null,author:'반짝이는별',user:'star',body:'저도 거기서 먹은 에그타르트가 생각나요.',created:now-900000,likes:4,liked:false}];
 ['저도 시장에 들러요!','저는 역에서 시내로 들어가는 시간도 좋아해요.','카페에 앉아 거리 구경하는 것도 좋죠.','시장에서는 작은 간식을 하나씩 맛봐요.','같은 도시도 계절마다 느낌이 다르더라고요.','다음 여행에선 저도 시장부터 가봐야겠어요.'].forEach((body,i)=>comments.push({id:`reply${i}`,post:'demo-poll',parent:'root1',author:i===5?'포근한구름':replyNames[i],user:i===5?'cloud':`reply-user-${i}`,body,created:now-150000+i*10000,likes:i===0?2:0,liked:false}));
 return {version:2,posts,comments,blocked:[],reports:[],hidden:[]};
}
function migrate(old){
 const data=seed();
 if(!old||!Array.isArray(old.posts)||!Array.isArray(old.comments))return data;
 // Clone legacy data: the original localStorage entry is never overwritten.
 const legacy=JSON.parse(JSON.stringify(old));
 data.posts.unshift(...legacy.posts.map(p=>({...p,user:p.author==='나'?'me':p.author})));
 data.comments.unshift(...legacy.comments.map(c=>({...c,parent:c.parent||null,user:c.author==='나'?'me':c.author,likes:c.likes||0,liked:!!c.liked})));
 data.blocked=legacy.blocked||[];data.reports=legacy.reports||[];return data;
}
function threads(comments){
 const parents=new Set(comments.filter(c=>!c.parent).map(c=>c.id));
 return comments.filter(c=>!c.parent||!parents.has(c.parent)).map(parent=>({parent,replies:comments.filter(c=>c.parent===parent.id).sort((a,b)=>a.created-b.created)}));
}
function vote(post,index){
 if(!post?.poll||post.poll.myOption!=null||!Number.isInteger(index)||!post.poll.options[index])return false;
 post.poll.options[index].votes++;post.poll.myOption=index;return true;
}
function addComment(data,postId,body,parent,author='여행동행'){
 const post=data.posts.find(p=>p.id===postId&&!p.deleted);
 if(!post||!body.trim()||length(body)>500)throw Error('댓글은 1~500자로 입력해 주세요.');
 if(parent&&!data.comments.some(c=>c.id===parent&&c.post===postId&&!c.parent&&!c.deleted&&!data.blocked.includes(c.user)))throw Error('댓글을 남길 수 없는 대상입니다.');
 const comment={id:uid(),post:postId,parent:parent||null,body:body.trim(),user:'me',author,created:Date.now(),likes:0,liked:false};
 data.comments.push(comment);return comment;
}

function refreshTravelSamples(data){
 const posts=[{"id": "demo-poll", "oldTitle": "소개팅 다음 날, 먼저 연락해도 될까요?", "oldBody": "어제 대화도 잘 통하고 분위기도 좋았어요.\n다음에 또 만나고 싶은데 제가 먼저 연락해도 괜찮을까요?", "title": "산에 갈 때 가장 기다려지는 순간은?", "body": "오르는 동안에는 숨이 차다가도 능선에 서면 기분이 달라져요.\n여러분은 산행 중 어떤 순간을 가장 좋아하시나요?", "options": ["나무 사이 숲길 걷기", "정상에서 풍경 바라보기", "쉬면서 간식 나눠 먹기"]}, {"id": "demo-replies", "oldTitle": "편하게 이야기 나눌 수 있는 사람이 좋아요", "oldBody": "특별한 일을 하지 않아도 함께 있으면 편안한 사람.\n여러분은 어떤 순간에 그런 마음을 느끼나요?", "title": "정상보다 오래 기억에 남은 숲길", "body": "이번 산행에서는 정상 사진보다 숲길 사진을 더 많이 찍었어요.\n나뭇잎 사이로 빛이 들어오는데 자꾸 멈춰 서게 되더라고요. 여러분도 그런 길이 있나요?", "options": []}, {"id": "demo-mine", "oldTitle": "작은 배려 하나가 오래 기억에 남네요", "oldBody": "좋아하는 간식을 기억해 뒀다가 챙겨 줬어요.\n사소한데 하루 종일 기분이 좋더라고요.", "title": "처음으로 쉬엄쉬엄 끝까지 걸었어요", "body": "자꾸 앞사람 속도를 따라가려다가 이번에는 제 속도로 걸어봤어요.\n중간중간 풍경도 보고 쉬면서 다녀오니 산행이 훨씬 즐거웠습니다.", "options": []}, {"id": "demo-voted", "oldTitle": "주말 데이트, 어떤 시간이 더 좋아요?", "oldBody": "집에서 쉬는 시간과 밖에서 함께 보내는 시간 중 어떤 쪽을 더 좋아하시나요?", "title": "등산 배낭에 꼭 넣는 간식은?", "body": "주말 산행 준비하면서 간식부터 고르고 있어요.\n여러분은 달콤한 간식과 든든한 간식 중 무엇을 더 좋아하세요?", "options": ["초콜릿이나 말린 과일", "김밥이나 작은 주먹밥"]}, {"id": "p1", "oldTitle": "요즘 푹 빠진 취미가 있나요?", "oldBody": "저는 요즘 퇴근하고 짧게 그림을 그려요.\n잘 그리지는 못해도 하루를 마무리하는 시간이 생겨서 좋더라고요.\n\n다들 요즘 어떤 취미를 즐기고 있나요?", "title": "요즘 자주 걷는 동네 뒷산이 있나요?", "body": "퇴근 후 가끔 동네 뒷산을 걸어요.\n멀리 가지 않아도 나무 사이를 걷고 나면 머리가 맑아지더라고요.\n여러분만의 가까운 산책 코스가 궁금해요.", "options": []}, {"id": "p2", "oldTitle": "주말에 읽기 좋은 책 추천해 주세요", "oldBody": "오랜만에 서점에 가려고 하는데 가볍게 읽을 수 있는 책이 궁금해요.\n최근에 재미있게 읽은 책이 있으면 알려주세요.", "title": "등산 배낭 정리, 다들 어떻게 하세요?", "body": "산에 다녀오면 배낭 안이 늘 뒤죽박죽이에요.\n작은 물건을 찾기 쉽게 정리하는 나만의 방법이 있나요?", "options": []}, {"id": "p3", "oldTitle": "오늘 작은 목표 하나 달성했어요", "oldBody": "미뤄두었던 책상 정리를 끝냈어요.\n마음까지 가벼워지네요.", "title": "오늘은 가까운 산에서 일몰을 봤어요", "body": "익숙한 풍경인데도 노을이 더해지니 새롭게 보였어요.\n잠깐 앉아서 바라본 하늘이 오래 기억에 남을 것 같아요.", "options": []}];
 const comments=[{"id": "root1", "oldBody": "저는 좋았으면 먼저 연락해요. 가볍게 시작해 보세요!", "body": "저는 숲길 걸을 때가 제일 좋아요. 바람 소리가 좋더라고요."}, {"id": "root2", "oldBody": "먼저 안부부터 물어보는 것도 좋겠네요.", "body": "저도 정상 풍경을 보면 올라오길 잘했다는 생각이 들어요."}, {"id": "root3", "oldBody": "말없이 있어도 어색하지 않을 때요.", "body": "저도 햇빛 들어오는 숲길에서는 꼭 사진을 찍어요."}, {"id": "reply0", "oldBody": "맞아요. 저도 먼저 연락했어요.", "body": "맞아요. 숲길에서는 발걸음도 느려져요."}, {"id": "reply1", "oldBody": "짧게 안부부터 물어보면 덜 부담될 것 같아요.", "body": "저는 새소리 들으면서 걷는 시간이 좋아요."}, {"id": "reply2", "oldBody": "저도 비슷한 고민 중이에요.", "body": "나무 그늘에서 쉬는 순간도 좋죠."}, {"id": "reply3", "oldBody": "좋은 인연으로 이어졌으면 좋겠어요.", "body": "산에서 먹는 주먹밥도 빠질 수 없어요."}, {"id": "reply4", "oldBody": "마음이 가면 표현해 보는 것도 좋죠.", "body": "같은 길도 계절마다 느낌이 다르더라고요."}, {"id": "reply5", "oldBody": "용기 내볼게요. 고마워요!", "body": "다음 산행에서는 숲길 풍경도 더 담아봐야겠어요."}, {"id": "c1", "oldBody": "저는 산책하면서 사진 찍고 있어요.", "body": "저도 가까운 뒷산에서 나무 사진 찍는 걸 좋아해요."}, {"id": "c2", "oldBody": "그림 좋네요! 저도 시작해 보고 싶어요.", "body": "가까운 산부터 자주 걸어봐야겠어요!"}];
 const legacyTrips=[{"title": "기차로 다녀오기 좋은 여행지가 있나요?", "body": "다음 주말엔 기차를 타고 하루 다녀오려고 해요. 역 근처에서 둘러볼 만한 곳을 알려주세요."}, {"title": "여행 가방은 어떻게 정리하세요?", "body": "충전기나 작은 물건을 찾기 쉽게 정리하는 방법이 궁금해요."}, {"title": "오늘은 바닷가에서 일몰을 봤어요", "body": "숙소 앞 바닷가에 앉아 해가 지는 모습을 한참 바라봤어요."}];
 const legacyReplies=["저는 강릉에 다녀왔어요.", "다음에는 기차로 가보고 싶어요!"];
 const samples=seed();
 for (const [index, change] of posts.entries()) {
   const post=data.posts.find(p=>p.id===change.id);
   if (!post || post.modified || post.updated) continue;
   if (!((post.title===change.title && post.body===change.body) || (post.title===change.oldTitle && post.body===change.oldBody))) continue;
   const next=samples.posts.find(p=>p.id===post.id) || legacyTrips[index-4];
   post.title=next.title;
   post.body=next.body;
   if (next.poll && post.poll) post.poll.options.forEach((option,i)=>{if(next.poll.options[i]) option.text=next.poll.options[i].text;});
 }
 for (const [index,change] of comments.entries()) {
   const comment=data.comments.find(c=>c.id===change.id);
   if (comment && !comment.modified && !comment.updated && [change.oldBody,change.body].includes(comment.body))
     comment.body=samples.comments.find(c=>c.id===comment.id)?.body || legacyReplies[index-9];
 }
 return data;
}
function refreshNicknames(data,nickname='여행동행'){
 for(const item of [...data.posts,...data.comments]){
  if(item.user==='me')item.author=nickname;
  const index=replyNames.findIndex((_,i)=>item.user===`reply-user-${i}`);
  if(index>=0&&/^다정한마음[1-5]$/.test(item.author))item.author=replyNames[index];
 }
 return data;
}
function nicknameTaken(data,nickname){
 const normalized=nickname.trim().normalize('NFC').toLowerCase();
 return [...seed().posts,...seed().comments,...data.posts,...data.comments].some(item=>item.user!=='me'&&item.author.trim().normalize('NFC').toLowerCase()===normalized);
}
function validNickname(value){
 return typeof value==='string'&&/^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9]{1,20}$/.test(value.normalize('NFC'));
}
function randomNickname(data){
 const adjectives=['느긋한','씩씩한','반가운','맑은','푸른','고요한','가벼운','즐거운'];
 const nouns=['여행자','바다','기차','나침반','비행기','돛단배','파도','구름'];
 const base=adjectives[Math.floor(Math.random()*adjectives.length)]+nouns[Math.floor(Math.random()*nouns.length)];
 let suffix=Math.floor(Math.random()*10000);
 let nickname=base+suffix;
 while(nicknameTaken(data,nickname)){nickname=base+(++suffix);}
 return nickname;
}
function ensureNickname(data,storage){
 let profile;try{profile=JSON.parse(storage.getItem('chabak-profile-v1'));}catch{}
 const current=profile?.nickname?.normalize('NFC');
 if(validNickname(current)&&!nicknameTaken(data,current))return current;
 const nickname=randomNickname(data);
 storage.setItem('chabak-profile-v1',JSON.stringify({...profile,nickname}));
 return nickname;
}
// Fixed local photos keep a public nickname consistent across posts and replies.
const profilePhotos={'포근한구름':10,'느린오후':11,'초록산책':12,'차분한바람':13,'반짝이는별':14,'다정한마음':15,'숲속산책':16,'산들바람':17,'햇살한줌':18,'푸른바다':19,'소소':20,'책갈피':21};
function avatarSource(user,nickname){
 const fallback='assets/travel-plane.svg';
 if(user==='me'){
   try{
     const photo=JSON.parse(root.localStorage.getItem('chabak-profile-v1'))?.photo;
     if(typeof photo==='string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(photo))return photo;
   }catch{}
   return fallback;
 }
 const name=String(nickname||user).normalize('NFC');
 return Object.hasOwn(profilePhotos,name) ? `assets/avatars/photo-${profilePhotos[name]}.jpg` : fallback;
}
const api={validNickname,randomNickname,ensureNickname,avatarSource,refreshNicknames,nicknameTaken,refreshTravelSamples,length,uid,validDraft,seed,migrate,threads,vote,addComment};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CommunityModel=api;
})(globalThis);
