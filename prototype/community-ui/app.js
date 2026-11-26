'use strict';
(() => {
const M=CommunityModel, root=document.querySelector('#app'), modal=document.querySelector('#sheet'), toastNode=document.querySelector('#toast');
const key='chabak-community-latest-v2',draftKey=key+'-draft';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={check:'m5 12 4 4L19 6',heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z',comment:'M21 11.5a8.4 8.4 0 0 1-8.8 8.4 8.9 8.9 0 0 1-3.8-.9L3 20l1.3-4.3a8.2 8.2 0 0 1-.9-3.8A8.4 8.4 0 0 1 12 3.5a8.5 8.5 0 0 1 9 8Z',edit:'M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z',search:'M20 20l-4-4 M18 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',home:'M3 10l9-7 9 7v11H3Z',profile:'M3 21c0-7 18-7 18 0 M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0',poll:'M5 20V10 M12 20V4 M19 20v-8',send:'M5 12h14 M13 6l6 6-6 6'};
const icon=n=>n==='back'||n==='share'
  ? `<svg class="navigation-icon navigation-icon--${n}" viewBox="0 0 24 24" aria-hidden="true"><use href="${hostLink('assets/navigation-icons.svg')}#${n}"/></svg>`
  : n==='more'?'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>':`<svg viewBox="0 0 24 24" class="${n==='comment'?'comment-icon':n==='send'?'send-icon':n}" aria-hidden="true"><path d="${paths[n]||paths.comment}"/></svg>`;
const btn=(label,action,extra='',cls='')=>`<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
const ib=(name,action,label,extra='')=>btn(icon(name),action,`aria-label="${esc(label)}" ${extra}`,'icon');
let data,storageOK=true;
try{data=JSON.parse(localStorage.getItem(key));if(!data||data.version!==2||!Array.isArray(data.posts)||!Array.isArray(data.comments))data=M.migrate(JSON.parse(localStorage.getItem('chabak-community-v1')));}catch{data=M.seed();storageOK=false;}
M.refreshTravelSamples(data);
let sessionNickname;
function myNickname(){try{sessionNickname=M.ensureNickname(data,localStorage);}catch{sessionNickname??=M.randomNickname(data);}return sessionNickname;}
M.refreshNicknames(data,myNickname());
data.blocked??=[];data.reports??=[];data.hidden??=[];
const blockedSamples=[
 {user:'demo-blocked-forest',author:'골목여행'},
 {user:'demo-blocked-summit',author:'주말엔기차'},
 {user:'demo-blocked-cloud',author:'구름따라걷는사람'}
];
// Seed the requested design samples once so unblocking remains persistent.
if(!data.blockedSamplesAdded){
 data.blocked.push(...blockedSamples.map(person=>person.user).filter(user=>!data.blocked.includes(user)));
 data.blockedSamplesAdded=true;
 try{localStorage.setItem(key,JSON.stringify(data));}catch{storageOK=false;}
}

// Preserve the profile shown when blocked, independently of later profile changes.
data.blockedProfiles??={};
function captureBlockedProfile(person){
 return {user:person.user,author:person.author,avatar:M.avatarSource(person.user,person.author)};
}
let migratedBlockedProfiles=false;
for(const user of data.blocked){
 if(Object.hasOwn(data.blockedProfiles,user))continue;
 const person=data.posts.find(p=>p.user===user)||data.comments.find(c=>c.user===user)||blockedSamples.find(p=>p.user===user)||{user,author:user};
 data.blockedProfiles[user]=captureBlockedProfile(person);
 migratedBlockedProfiles=true;
}
if(migratedBlockedProfiles){try{localStorage.setItem(key,JSON.stringify(data));}catch{storageOK=false;}}

// Add the requested liked-post sample once; keep subsequent unlike/delete choices.
const likedSample=data.posts.find(p=>p.id==='demo-liked-hike');
if(likedSample && !likedSample.updated && !likedSample.modified && likedSample.body==='이번 주말에는 정상에 빨리 오르기보다 숲길을 천천히 걸어봤어요.\n나무 사이로 비치는 햇살과 바람 소리 덕분에 오래 기억에 남는 산행이 됐어요.') likedSample.body='항구 근처에서 트램을 내려 바닷가를 걸었어요. 작은 카페에서 본 노을이 이번 여행에서 가장 기억에 남아요.';
if(!data.likedPostSampleAdded){
 data.posts.push({id:'demo-liked-hike',title:'천천히 걸으니 보이는 풍경이 달랐어요',body:'항구 근처에서 트램을 내려 바닷가를 걸었어요. 작은 카페에서 본 노을이 이번 여행에서 가장 기억에 남아요.',author:'초록산책',user:'walk',created:Date.now()-3600000,likes:1,liked:true});
 data.likedPostSampleAdded=true;
 try{localStorage.setItem(key,JSON.stringify(data));}catch{storageOK=false;}
}

let route=readRoute(),limit=20,query='',draft=null,reply=null,commentText='',selected=null,origin='/',timer,lastFocus;
const expanded={},scrolls=new Map();
function readRoute(){if(location.hash==='#/network-error')return '/';try{return decodeURIComponent(location.hash.slice(1))||'/';}catch{return '/';}}
const post=id=>data.posts.find(p=>p.id===id&&!p.deleted);
const blocked=user=>data.blocked.includes(user);
const visible=p=>p&&!p.deleted&&!blocked(p.user)&&!data.hidden.includes(p.id);
const comments=id=>data.comments.filter(c=>c.post===id);
const count=id=>comments(id).filter(c=>!c.deleted).length;
const total=p=>p.poll.options.reduce((n,o)=>n+o.votes,0);
const time=t=>{const n=Math.max(0,Math.floor((Date.now()-t)/60000));return n<1?'방금 전':n<60?`${n}분 전`:n<1440?`${Math.floor(n/60)}시간 전`:`${Math.floor(n/1440)}일 전`;};
function toast(message){clearTimeout(timer);toastNode.textContent=message;toastNode.hidden=false;timer=setTimeout(()=>toastNode.hidden=true,3000);}
function save(){try{localStorage.setItem(key,JSON.stringify(data));storageOK=true;}catch{storageOK=false;toast('브라우저에 저장하지 못했어요. 변경 내용은 현재 화면에서만 유지돼요.');}}
function saveDraft(){if(!draft||draft.id)return;try{localStorage.setItem(draftKey,JSON.stringify(draft));}catch{toast('임시 글을 저장하지 못했어요.');}}
function newDraft(){let d;try{d=JSON.parse(localStorage.getItem(draftKey));}catch{}return d&&typeof d.title==='string'&&typeof d.body==='string'&&Array.isArray(d.options)?{title:d.title,body:d.body,options:d.options}:{title:'',body:'',options:[]};}
function remember(){const v=root.querySelector('.view');if(v)scrolls.set(route,v.scrollTop);}
function go(next,{replace=false}={}){remember();saveDraft();if(modal.open)modal.close();const old=route;route=next;history[replace?'replaceState':'pushState'](null,'',`#${encodeURI(next)}`);if(old!==next){reply=null;commentText='';selected=null;draft=null;}render();}
function back(){if(route==='/'||route==='/community-empty'){location.href=hostLink('index.html#home');return;}if(route.startsWith('/write')||route.startsWith('/edit'))return go(origin);if(route.startsWith('/post/'))return go(origin.startsWith('/post/')?'/':origin);if(route==='/blocked'){location.href=hostLink('my-settings.html#settings');return;}if(route.startsWith('/activity')){location.href=hostLink('mypage.html');return;}go('/');}
function hostLink(file){return document.body.dataset.hostPrefix+file;}
function avatarUrl(user,author){const source=M.avatarSource(user,author);return source.startsWith('data:')?source:hostLink(source);}
function avatar(person){return `<img class="profile-thumbnail" src="${esc(avatarUrl(person.user,person.author))}" alt="" width="32" height="32">`;}
function header(title,right='',backButton=true,rightInBar=false){return `<header class="topbar"><div class="app-bar__leading">${backButton?ib('back','back','뒤로가기'):''}${title ? `<h1>${esc(title)}</h1>` : ''}</div>${rightInBar&&right?`<div class="app-bar__actions">${right}</div>`:''}</header>${right&&!rightInBar?`<div class="page-actions">${right}</div>`:''}`;}
function action(name,value,act,id,liked=false){return btn(`${icon(name)}${value==null?'':`<span>${value}</span>`}`,act,`data-id="${esc(id)}" aria-label="${name==='heart'?'좋아요':name==='share'?'게시글 공유하기':'댓글'}${value==null?'':` ${value}개`}" ${name==='heart'?`aria-pressed="${liked}"`:''}`,`action ${liked?'liked':''}`);}
function card(p){const preview=p.poll?`<div class="poll-preview">${p.poll.options.slice(0,3).map(o=>`<div class="preview-option">${esc(o.text)}</div>`).join('')}<p class="voters">${total(p)}명 참여</p></div>`:'';return `<article class="post"><a class="post-link" href="#/post/${esc(p.id)}" data-route="/post/${esc(p.id)}"><h2>${esc(p.title)}</h2><p class="excerpt">${esc(p.body)}</p>${preview}</a><div class="actions">${action('heart',p.likes,'like',p.id,p.liked)}${action('comment',count(p.id),'open-comments',p.id)}<time class="post-time">${time(p.created)}</time></div></article>`;}
function communityEmpty(){return '<img class="travel-empty-image" src="assets/empty-travel-plane.png" width="120" height="92" alt=""><h2 class="edge-state__title">오늘의 내 이야기는?</h2><p class="edge-state__description">기억에 남는 여행 이야기를 들려주세요.</p>';}
function storyBanner(){
  return btn('<strong>우리, 여행 이야기 나눠요</strong><span>잠깐의 풍경도, 소소한 이야기도 들려주세요</span>',
    'write','aria-label="우리, 여행 이야기 나눠요. 글쓰기"','story-banner');
}
function list(){const filtered=data.posts.filter(p=>visible(p)).sort((a,b)=>b.created-a.created);return header('커뮤니티',ib('search','search','검색'),false,true)+`<div class="view" id="list-view">${storyBanner()}<div id="post-list" class="${filtered.length?'':'story-list-empty'}">${filtered.slice(0,limit).map(card).join('')||communityEmpty()}</div><div class="list-bottom" data-more="${filtered.length>limit}"></div></div>${btn('<svg class="write-solid" viewBox="0 0 24 24" aria-hidden="true"><path d="m16.3 3.3 4.4 4.4.9-.9a3.1 3.1 0 0 0-4.4-4.4l-.9.9ZM15.2 4.4 4.1 15.5a2 2 0 0 0-.5.9l-1.1 4.3a.7.7 0 0 0 .8.8l4.3-1.1a2 2 0 0 0 .9-.5L19.6 8.8l-4.4-4.4Z"/></svg>','write','aria-label="글쓰기"','fab')}`;}
function poll(p){return `<div class="poll" aria-label="투표">${p.poll.options.map((o,i)=>btn(`<span>${esc(o.text)}</span>${p.poll.myOption!=null?`<span class="result">${(total(p)?o.votes/total(p)*100:0).toFixed(1)}% · ${o.votes}표</span>`:''}`,'select-vote',`data-option="${i}" aria-pressed="${(p.poll.myOption??selected)===i}" ${p.poll.myOption!=null?'disabled':''}`,'poll-option')).join('')}<p class="voters">${total(p)}명 참여</p>${btn(p.poll.myOption!=null?'투표 완료':'투표하기','vote',`data-id="${esc(p.id)}" ${p.poll.myOption!=null||selected==null?'disabled':''}`,'primary')}</div>`;}
function comment(c,p,isReply=false){const exception=c.deleted?'삭제된 댓글입니다.':blocked(c.user)?'차단한 유저입니다.':c.hidden?'숨김 처리된 댓글입니다.':'';return `<article class="comment ${isReply?'reply':''}" id="comment-${esc(c.id)}" data-comment="${esc(c.id)}">${avatar(c)}<div class="comment-content"><div class="comment-top"><span class="name">${esc(c.author)}${c.user===p.user?' · 작성자':''}${c.user==='me'?' · 나':''}</span><time>${time(c.created)}</time>${exception?'':btn(icon('more'),'comment-menu',`data-id="${esc(c.id)}" aria-label="댓글 더보기"`,'more')}</div><p class="comment-body ${exception?'exception':''}">${esc(exception||c.body)}</p>${c.modified&&!exception?'<p class="modified">수정됨</p>':''}${exception?'':`<div class="actions">${action('heart',c.likes||0,'comment-like',c.id,c.liked)}${isReply?'':btn('댓글','reply',`data-id="${esc(c.id)}"`,'reply-button')}</div>`}</div></article>`;}
function thread(t,p){const n=t.replies.length<5?t.replies.length:(expanded[t.parent.id]??4);return comment(t.parent,p)+t.replies.slice(0,n).map(c=>comment(c,p,true)).join('')+(t.replies.length>=5?`<div class="reply-controls">${n<t.replies.length?btn('댓글 더보기','replies-more',`data-id="${esc(t.parent.id)}"`):''}${n>0?btn('접기','replies-collapse',`data-id="${esc(t.parent.id)}"`):''}</div>`:'');}
function resizeCommentInput(){const input=root.querySelector('#comment-input');if(!input)return;input.style.height='auto';input.style.height=`${Math.min(input.scrollHeight,84)}px`;input.style.overflowY=input.scrollHeight>84?'auto':'hidden';}
function composer(){return `<form class="composer" id="comment-form">${reply?`<div class="recipient">to.${esc(reply.author)} ${btn('×','cancel-reply','aria-label="답글 대상 취소"')}</div>`:''}<div class="composer-row"><label class="sr-only" for="comment-input">댓글 내용</label><textarea id="comment-input" maxlength="500" rows="1" placeholder="${reply?'댓글을 남겨주세요':'댓글로 생각을 남겨주세요'}">${esc(commentText)}</textarea><button class="send" type="submit" aria-label="댓글 등록" ${commentText.trim()?'':'disabled'}>${icon('send')}</button></div></form>`;}
function detail(id){const p=post(id);if(!visible(p))return header('')+'<div class="view"><div class="data-empty"><div class="edge-state__icon edge-state__icon--plane" aria-hidden="true"></div><p class="edge-state__description">삭제되었거나 숨김·차단된 게시글입니다</p></div></div>';const photos=(p.photos||[p.photo]).filter(s=>/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s||''));return header('',ib('more','post-menu','게시글 더보기',`data-id="${esc(p.id)}"`),true,true)+`<div class="view"><article class="detail"><h2>${esc(p.title)}</h2><div class="meta author-profile">${avatar(p)}<div class="author-info"><span class="author">${esc(p.author)}</span><time>${time(p.created)}</time></div></div>${p.modified||p.updated?'<p class="modified">수정됨</p>':''}<p class="body-copy">${esc(p.body)}</p>${photos.map(s=>`<img class="legacy-photo" src="${s}" alt="기존 게시글 첨부 사진">`).join('')}${p.poll?poll(p):''}<div class="actions">${action('heart',p.likes,'like',p.id,p.liked)}${action('comment',count(p.id),'focus-comment',p.id)}${action('share',null,'share',p.id)}</div></article><h2 class="comments-heading">댓글 ${count(p.id)}</h2>${comments(p.id).length?M.threads(comments(p.id)).map(t=>thread(t,p)).join(''):'<div class="comments-empty"><svg class="comments-empty__icon" viewBox="0 0 64 56" aria-hidden="true"><defs><linearGradient id="comment-empty-fill" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0%" stop-color="#f0f0f2"/><stop offset="100%" stop-color="#dcdce0"/></linearGradient></defs><path d="M32 5C16 5 5 14 5 26c0 12 11 21 27 21 4 0 8-.6 11-1.8l10 6-2.6-10C56 37.6 59 32.3 59 26 59 14 48 5 32 5Z" fill="url(#comment-empty-fill)" stroke="#e1e1e5" stroke-width=".7"/></svg><p>내가 첫 댓글을 달아봐요!</p></div>'}<div class="detail-spacer"></div></div>${composer()}`;}
function optionError(text){return M.length(text.trim())>100?'100자 이하로 입력해 주세요.':text.trim()&&draft.options.filter(s=>s.trim()===text.trim()).length>1?'중복된 선택지예요.':'';}
function editor(editId){const p=editId?post(editId):null;if(editId&&(!p||p.user!=='me'||(p.poll&&total(p)>0)))return header('글 수정')+'<div class="data-empty"><div class="edge-state__icon edge-state__icon--plane" aria-hidden="true"></div><p class="edge-state__description">수정할 수 없는 글입니다</p></div>';if(!draft)draft=p?{id:p.id,title:p.title,body:p.body,options:p.poll?p.poll.options.map(o=>o.text):[]}:newDraft();return header(p?'글 수정':'글쓰기',`<button type="submit" form="write-form" class="icon" aria-label="${p?'수정':'등록'}" ${M.validDraft(draft)?'':'disabled'}>${icon('check')}</button>`,true,true)+`<div class="view"><form class="editor ${draft.options.length?'has-poll':''}" id="write-form"><label class="sr-only" for="write-title">제목</label><input id="write-title" class="editor-title" name="title" maxlength="40" value="${esc(draft.title)}" placeholder="제목을 입력해주세요. (필수)" required><label class="sr-only" for="write-body">내용</label><textarea id="write-body" class="editor-body" name="body" maxlength="2000" rows="${draft.options.length?3:8}" placeholder="이야기를 써주세요. (필수)" required>${esc(draft.body)}</textarea>${draft.options.length?`<div class="poll-editor">${draft.options.map((s,i)=>`<div class="option-field"><label class="sr-only" for="option-${i}">선택지 ${i+1}</label><input id="option-${i}" data-option-input="${i}" value="${esc(s)}" placeholder="선택지 ${i+1} (필수)" aria-describedby="option-error-${i}" ${p?'readonly':''}>${i>=2&&!p?btn('×','remove-option',`data-index="${i}" aria-label="선택지 ${i+1} 삭제"`):''}</div><p class="field-error" id="option-error-${i}">${esc(optionError(s))}</p>`).join('')}${!p&&draft.options.length<10?btn('+ 추가하기','add-option','','add-option'):''}${!p?btn('투표 삭제','remove-poll','','remove-poll'):''}</div>`:'<div class="guide"><strong>서로를 존중하는 글을 작성해 주세요.</strong>개인정보, 욕설, 광고, 성범죄 유도 내용은 운영 정책에 따라 숨김 처리될 수 있습니다.</div>'}</form></div>${!p?`<div class="toolbar">${btn(`<span class="chart-icon" aria-hidden="true"></span> 투표`,'add-poll','','poll-add')}<span class="draft-status">자동 임시저장 중</span></div>`:''}`;}
function activityEmpty(which){const message={posts:'아직 작성한 글이 없어요',comments:'아직 작성한 댓글이 없어요',likes:'아직 좋아요한 글이 없어요'}[which]||'아직 작성한 글이 없어요';return `<div class="activity-empty"><div class="edge-state__icon edge-state__icon--plane activity-empty__icon" aria-hidden="true"></div><p class="edge-state__description">${message}</p></div>`;}
function activity(which){const tabs=[['posts','작성한 글'],['comments','작성한 댓글'],['likes','좋아요한 글']];const list=data.posts.filter(p=>visible(p)&&(which==='likes'?p.liked:p.user==='me')).sort((a,b)=>b.created-a.created);return header('내 활동')+`<div class="view"><nav class="activity-tabs" aria-label="내 활동 종류">${tabs.map(([id,label])=>`<a href="#/activity/${id}" data-route="/activity/${id}" ${which===id?'aria-current="page"':''}>${label}</a>`).join('')}</nav>${which==='comments'?(data.comments.filter(c=>c.user==='me'&&!c.deleted&&visible(post(c.post))).map(c=>`<article class="post activity-comment"><a class="activity-comment__link" data-route="/post/${esc(c.post)}/comment/${esc(c.id)}" href="#/post/${esc(c.post)}/comment/${esc(c.id)}"><h2 class="activity-comment__body">${esc(c.body)}</h2><p class="activity-comment__context"><span class="activity-comment__post-title">${esc(post(c.post).title)}</span></p><time class="activity-comment__time">${time(c.created)}</time></a></article>`).join('')||activityEmpty('comments')):(list.map(card).join('')||activityEmpty(which))}</div>`;}
function searchResults(){
  const term=query.trim().toLowerCase();
  if(!term)return '<div class="data-empty search-prompt"><div class="edge-state__icon edge-state__icon--community" aria-hidden="true"></div><p class="edge-state__description">찾는 이야기의 키워드를 입력해봐요!</p></div>';
  const posts=data.posts
    .filter(p=>visible(p)&&[p.title,p.body].some(value=>value.toLowerCase().includes(term)))
    .sort((a,b)=>b.created-a.created);
  return posts.map(card).join('')||'<div class="data-empty"><div class="edge-state__icon edge-state__icon--plane" aria-hidden="true"></div><p class="edge-state__description">검색 결과가 없어요</p></div>';
}
function notifications(){return header('알림센터')+'<div class="view edge-state"><div class="edge-state__icon edge-state__icon--plane" aria-hidden="true"></div><p class="edge-state__description">아직 온 알림이 없어요</p></div>';}
function blockedPage(){
 const rows=data.blocked.map(user=>{
  const person=data.blockedProfiles[user];
  return `<li class="blocked-row"><div class="blocked-user"><img class="profile-thumbnail" src="${esc(person.avatar.startsWith('data:')?person.avatar:hostLink(person.avatar))}" alt="" width="40" height="40"><span class="blocked-name">${esc(person.author)}</span></div>${btn('차단 해제','unblock-confirm',`data-id="${esc(user)}" aria-label="${esc(person.author)} 차단 해제"`,'unblock-button')}</li>`;
 }).join('');
 return header('차단한 사용자','',true,true)+`<div class="view blocked-view">${rows?`<ul class="blocked-list" aria-label="차단한 사용자">${rows}</ul>`:'<div class="data-empty"><div class="edge-state__icon edge-state__icon--plane" aria-hidden="true"></div><p class="edge-state__description">차단한 사용자가 없어요</p></div>'}</div>`;
}
function render(){M.refreshNicknames(data,myNickname());const parts=route.split('/').filter(Boolean);if(parts[0]==='post'&&parts[2]==='comment'){const target=data.comments.find(c=>c.id===parts[3]);if(target?.parent)expanded[target.parent]=comments(target.post).filter(c=>c.parent===target.parent).length;}let html;if(!parts.length||parts[0]==='community-empty')html=list();else if(parts[0]==='post')html=detail(parts[1]);else if(parts[0]==='write')html=editor();else if(parts[0]==='edit')html=editor(parts[1]);else if(parts[0]==='activity')html=activity(parts[1]||'posts');else if(parts[0]==='search')html=header('검색','',true,true)+`<div class="view"><div class="searchbox"><label class="sr-only" for="query">게시글 검색</label><div class="ds-search-field"><input id="query" type="search" placeholder="커뮤니티에서 어떤 글을 찾나요?" value="${esc(query)}"><button class="ds-search-clear" type="button" aria-label="검색어 지우기"></button></div></div><div id="search-results">${searchResults()}</div></div>`;else if(parts[0]==='blocked')html=blockedPage();else if(parts[0]==='notifications')html=notifications();else html=header('커뮤니티')+'<div class="data-empty"><div class="edge-state__icon edge-state__icon--plane" aria-hidden="true"></div><p class="edge-state__description">화면을 찾을 수 없습니다</p></div>';document.querySelector('.app-nav').hidden = parts.length > 0 && parts[0] !== 'community-empty';
root.innerHTML=html;resizeCommentInput();if(!storageOK)root.insertAdjacentHTML('afterbegin','<p class="warning">브라우저 저장이 제한되어 현재 화면에서만 유지됩니다.</p>');const v=root.querySelector('.view');if(v)v.scrollTop=scrolls.get(route)||0;if(parts[2]==='comment'){const c=data.comments.find(c=>c.id===parts[3]);if(c?.parent)expanded[c.parent]=comments(c.post).filter(x=>x.parent===c.parent).length;const el=document.getElementById(`comment-${parts[3]}`);el?.classList.add('highlight');el?.scrollIntoView({block:'center'});}document.title='수길따라 · '+(parts[0]==='notifications'?'알림센터':parts[0]==='write'?'글쓰기':parts[0]==='post'?'게시글':'커뮤니티');}
function refresh(){const active=document.activeElement;const id=active?.id;const selection=active&&'selectionStart' in active?[active.selectionStart,active.selectionEnd]:null;remember();render();if(id){const next=document.getElementById(id);next?.focus({preventScroll:true});if(selection&&next?.setSelectionRange)next.setSelectionRange(...selection);}}
function openSheet(title,body){modal.dataset.risky='false';lastFocus=document.activeElement;if(modal.open)modal.close();modal.innerHTML=`<div class="grabber" aria-hidden="true"></div><h2 id="sheet-title" ${title?'':'class="sr-only"'}>${esc(title||'메뉴')}</h2>${body}`;window.prepareDialogActions(modal);modal.showModal();}
function menu(kind,id){const obj=kind==='post'?post(id):data.comments.find(c=>c.id===id);if(!obj)return;const own=obj.user==='me',reported=data.reports.some(r=>r.kind===kind&&r.target===id);const extra=`data-kind="${kind}" data-id="${esc(id)}"`;openSheet('',(own?btn('수정하기','edit',extra,'menu-action')+btn('삭제하기','delete-confirm',extra,'menu-action danger'):(kind==='post'?btn('숨기기','hide',extra,'menu-action'):'')+btn('작성자 차단하기','block-confirm',extra,'menu-action')+(!reported?btn('신고하기','report',extra,'menu-action danger'):'')));}
function confirmSheet(title,body,action,extra,label){const risky=['delete','block','report'].includes(action);openSheet(title,`<p>${body}</p>${btn(label,action,extra,risky?'danger':'primary')}${btn('취소','close','',risky?'primary':'cancel')}`);}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('복사했어요.');}catch{openSheet('본문 복사',`<textarea readonly aria-label="복사할 내용">${esc(text)}</textarea><p>내용을 선택해서 복사해 주세요.</p>`);}}
function targetFrom(b){return b.dataset.kind==='post'?post(b.dataset.id):data.comments.find(c=>c.id===b.dataset.id);}
async function onClick(e){const link=e.target.closest('[data-route]');if(link&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey){e.preventDefault();if(route==='/'||route.startsWith('/activity')||route==='/search')origin=route;const c=link.dataset.route.split('/comment/')[1];if(c){const item=data.comments.find(x=>x.id===c);if(item?.parent)expanded[item.parent]=99999;}go(link.dataset.route);return;}const b=e.target.closest('button[data-action]');if(!b||b.disabled)return;const id=b.dataset.id,kind=b.dataset.kind,extra=`data-kind="${kind}" data-id="${esc(id)}"`;switch(b.dataset.action){
case 'back':back();break;
case 'write':origin=route;go('/write');break;
case 'search':query='';go('/search');if(document.documentElement.hasAttribute('data-keyboard-focus'))root.querySelector('#query')?.focus();break;
case 'notifications':go('/notifications');break;
case 'blocked':go('/blocked');break;
case 'like':{const p=post(id);if(!visible(p))break;p.liked=!p.liked;p.likes=Math.max(0,p.likes+(p.liked?1:-1));save();refresh();break;}
case 'comment-like':{const c=data.comments.find(c=>c.id===id);if(!c||c.deleted||blocked(c.user))break;c.liked=!c.liked;c.likes=Math.max(0,(c.likes||0)+(c.liked?1:-1));save();refresh();break;}
case 'open-comments':origin=route;go(`/post/${id}`);root.querySelector('#comment-input')?.focus();break;
case 'focus-comment':root.querySelector('#comment-input')?.focus();break;
case 'select-vote':selected=Number(b.dataset.option);refresh();break;
case 'vote':{const p=post(id);if(M.vote(p,selected)){save();refresh();toast('투표가 완료됐어요.');}break;}
case 'reply':reply=data.comments.find(c=>c.id===id);refresh();root.querySelector('#comment-input')?.focus();break;
case 'cancel-reply':reply=null;refresh();root.querySelector('#comment-input')?.focus();break;
case 'replies-more':expanded[id]=(expanded[id]??4)+4;refresh();break;
case 'replies-collapse':expanded[id]=0;refresh();document.getElementById(`comment-${id}`)?.scrollIntoView({block:'center'});break;
case 'add-poll':if(draft&&!draft.id&&!draft.options.length){draft.options=['',''];saveDraft();refresh();root.querySelector('#option-0')?.focus();}break;
case 'add-option':if(draft&&!draft.id&&draft.options.length<10){draft.options.push('');saveDraft();refresh();root.querySelector(`#option-${draft.options.length-1}`)?.focus();}break;
case 'remove-option':if(draft&&!draft.id&&Number(b.dataset.index)>=2){draft.options.splice(Number(b.dataset.index),1);saveDraft();refresh();}break;
case 'remove-poll':if(draft&&!draft.id){draft.options=[];saveDraft();refresh();}break;
case 'post-menu':menu('post',id);break;
case 'comment-menu':menu('comment',id);break;
case 'close':modal.close();break;
case 'share':{const p=post(id);if(p)await copy(`${location.href.split('#')[0]}#/post/${p.id}`);break;}
case 'edit':{const obj=targetFrom(b);if(!obj||obj.user!=='me')break;modal.close();if(kind==='post'){if(obj.poll&&total(obj)>0){toast('투표 참여자가 있어 글을 수정할 수 없어요.');break;}origin=route;go(`/edit/${id}`);}else openSheet('댓글 수정',`<form id="edit-comment" data-id="${esc(id)}"><label class="sr-only" for="edited-comment">댓글 내용</label><textarea id="edited-comment" maxlength="500" required>${esc(obj.body)}</textarea><button type="submit" class="primary">수정</button></form>${btn('취소','close','','cancel')}`);break;}
case 'delete-confirm':confirmSheet(kind==='post'?'글을 삭제할까요?':'댓글을 삭제할까요?','삭제한 내용은 복구할 수 없어요.','delete',extra,'삭제');break;
case 'delete':{const obj=targetFrom(b);if(obj?.user==='me'){obj.deleted=true;save();modal.close();if(kind==='post')go('/');else refresh();toast('삭제했어요.');}break;}
case 'hide':if(post(id)){data.hidden.push(id);save();modal.close();go('/');}break;
case 'block-confirm':confirmSheet('이 작성자를 차단할까요?','차단한 작성자의 게시글과 댓글은 보이지 않아요.','block',extra,'작성자 차단하기');break;
case 'block':{const obj=targetFrom(b);if(obj&&obj.user!=='me'){if(!blocked(obj.user)){data.blocked.push(obj.user);data.blockedProfiles[obj.user]=captureBlockedProfile(obj);}save();modal.close();if(kind==='post')go('/');else refresh();toast('작성자를 차단했어요.');}break;}
case 'unblock-confirm':confirmSheet('차단을 해제할까요?','이 사용자의 글과 댓글을 다시 볼 수 있어요.','unblock',`data-id="${esc(id)}"`,'차단 해제');break;
case 'unblock':modal.close();data.blocked=data.blocked.filter(u=>u!==id);delete data.blockedProfiles[id];save();refresh();if(storageOK)toast('차단을 해제했어요.');break;
case 'report':openSheet('신고 사유를 선택해 주세요.',`<form id="report-form" ${extra}><p>신고 내용은 브라우저 시연용으로만 저장됩니다.</p>${['욕설·비방·혐오 표현','성적·선정적인 내용','광고·홍보·도배','개인정보 노출 또는 사칭','폭력·위협·불법적인 내용'].map((s,i)=>`<label class="reason"><input type="radio" name="reason" value="${i}" required>${s}</label>`).join('')}<button class="primary" type="submit" disabled>신고하기</button></form>`);break;
}}
root.addEventListener('click',onClick);modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientY<r.top||e.clientX<r.left||e.clientX>r.right)modal.close();}onClick(e);});
modal.addEventListener('close',()=>{if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});});
root.addEventListener('input',e=>{const t=e.target;if(t.id==='comment-input'){commentText=t.value;root.querySelector('.send').disabled=!commentText.trim();resizeCommentInput();}else if(t.id==='query'){query=t.value;root.querySelector('#search-results').innerHTML=searchResults();}else if(t.closest('#write-form')&&draft){if(t.dataset.optionInput!==undefined)draft.options[Number(t.dataset.optionInput)]=t.value;else if(t.name)draft[t.name]=t.value;root.querySelector('[form=write-form]').disabled=!M.validDraft(draft);draft.options.forEach((s,i)=>{const el=document.getElementById(`option-error-${i}`);if(el)el.textContent=optionError(s);});saveDraft();}});
modal.addEventListener('change',e=>{if(e.target.closest('#report-form'))modal.querySelector('[type=submit]').disabled=!modal.querySelector('[name=reason]:checked');});
root.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='comment-form'){const p=post(route.split('/')[2]);if(!visible(p))return;try{const c=M.addComment(data,p.id,commentText,reply?.id,myNickname());if(c.parent)expanded[c.parent]=comments(p.id).filter(x=>x.parent===c.parent).length;commentText='';reply=null;save();refresh();document.getElementById(`comment-${c.id}`)?.scrollIntoView({block:'center'});toast('댓글을 등록했어요.');}catch(error){toast(error.message);}}else if(e.target.id==='write-form'&&draft&&M.validDraft(draft)){let p=draft.id?post(draft.id):null;if(draft.id&&(!p||p.user!=='me'||p.poll&&total(p)>0))return;if(p){Object.assign(p,{title:draft.title.trim(),body:draft.body.trim(),modified:true});}else{p={id:M.uid(),title:draft.title.trim(),body:draft.body.trim(),user:'me',author:myNickname(),created:Date.now(),likes:0,liked:false};if(draft.options.length)p.poll={options:draft.options.map(s=>({text:s.trim(),votes:0})),myOption:null};data.posts.unshift(p);try{localStorage.removeItem(draftKey);}catch{}}save();draft=null;origin='/';go(`/post/${p.id}`,{replace:true});toast('글을 저장했어요.');}});
modal.addEventListener('submit',e=>{e.preventDefault();const f=e.target;if(f.id==='edit-comment'){const c=data.comments.find(c=>c.id===f.dataset.id);const body=f.querySelector('textarea').value.trim();if(c?.user!=='me'||!body||M.length(body)>500)return;c.body=body;c.modified=true;save();modal.close();refresh();}else if(f.id==='report-form'){const reason=f.querySelector('[name=reason]:checked')?.value;if(reason==null)return;data.reports.push({kind:f.dataset.kind,target:f.dataset.id,reason,created:Date.now()});save();modal.close();toast('시연용 신고가 저장됐어요. 실제로 전송되지는 않아요.');}});
root.addEventListener('scroll',e=>{if(e.target.id==='list-view'&&e.target.scrollHeight-e.target.scrollTop-e.target.clientHeight<160&&root.querySelector('[data-more=true]')){limit+=20;refresh();}},true);
window.addEventListener('popstate',()=>{remember();saveDraft();route=readRoute();draft=null;reply=null;commentText='';selected=null;if(modal.open)modal.close();render();});
window.addEventListener('resize',resizeCommentInput);
window.addEventListener('pagehide',saveDraft);
render();
})();
