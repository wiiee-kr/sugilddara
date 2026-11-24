'use strict';
const KEY='sugilddara-packing-v1';
const clone=x=>JSON.parse(JSON.stringify(x));
const uid=()=>typeof crypto.randomUUID==='function'?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const defaults=[['여권·결제','여권','결제 카드'],['의류','갈아입을 옷','겉옷','속옷','양말'],['건강·위생','평소 먹는 약','세면도구'],['전자기기','휴대전화','충전기','멀티 어댑터'],['여행 서류','항공권','숙소 예약 확인서']].map(([name,...names],order)=>({id:uid(),name,builtin:true,order,items:names.map(name=>({id:uid(),name,selected:true,done:false}))}));
let db={base:defaults,lists:[]};let storageError=false;
try{const raw=localStorage.getItem(KEY);if(raw){const value=JSON.parse(raw);if(!Array.isArray(value.base)||!Array.isArray(value.lists))throw Error();db=value;}}catch{storageError=true;}
// Upgrade the starter template while keeping custom items and saved trips.
if (!db.travelTemplate) {
  const previous = [['기본','배낭','등산화'],['의류·보온','바람막이','보온 재킷','장갑','모자'],['식량','식수','행동식'],['야영','텐트','침낭','랜턴'],['기타 등산장비','등산스틱','아이젠']];
  for (const group of db.base) {
    const index = previous.findIndex(([name]) => group.builtin && group.name === name);
    if (index < 0) continue;
    const next = defaults[index];
    group.name = next.name;
    for (const item of group.items) {
      const position = previous[index].indexOf(item.name, 1);
      if (position > 0) item.name = next.items[position - 1].name;
    }
  }
  db.travelTemplate = true;
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { storageError = true; }
}
let mode='home',draft=null,dirty=false,dragged=null,toastTimer;
const app=document.querySelector('#app'),dialog=document.querySelector('#dialog');
function persist(){try{localStorage.setItem(KEY,JSON.stringify(db));return true;}catch{toast('저장 공간이 부족하거나 저장이 차단됐어요. 현재 화면에서만 유지돼요.');return false;}}
function toast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.style.display='none',4000);}
const groups=()=>draft.groups;
const stats=gs=>{const items=gs.flatMap(g=>g.items);return{total:items.length,done:items.filter(i=>i.done).length};};
const progress=gs=>{const s=stats(gs),pct=s.total?Math.round(s.done/s.total*100):0;return `<div class="progress-label"><span><b>${mode==='home'?'🧳 ':''}${s.done} / ${s.total}개</b></span></div><progress value="${s.done}" max="${s.total||1}" aria-label="준비 완료 ${pct}%"></progress>`;};
const dateLabel=d=>d?`${Number(d.slice(5,7))}/${Number(d.slice(8,10))}`:'';
function cardTitle(list){
  const date=dateLabel(list.date);
  const title=list.title || '여행 준비물';
  if(!date || title===date || title.startsWith(date+' ')) return title;
  return date+' '+title;
}
function renderListCard(list){
  const title=esc(cardTitle(list));
  const id=esc(list.id);
  return `<article class="card packing-list-card" data-action="open" data-id="${id}" tabindex="0" aria-label="${title} 열기"><div class="card-title"><h2>${title}</h2><button class="menu" data-action="list-menu" data-id="${id}" aria-label="${title} 더보기"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg></button></div>${progress(list.groups)}</article>`;
}
function saveDetail(){if(mode==='detail'){db.lists=db.lists.map(l=>l.id===draft.id?clone(draft):l);persist();}}
function changed(){dirty=true;saveDetail();render();}
function header(title){return `<header><div class="app-bar__leading">${mode!=='home'?'<button class="app-bar__icon" data-action="back" aria-label="뒤로가기"><svg class="navigation-icon navigation-icon--back" viewBox="0 0 24 24" aria-hidden="true"><use href="assets/navigation-icons.svg#back"/></svg></button>':''}<strong>${mode==='new'?'새 체크리스트':mode==='base'?'내 준비물 양식 편집':mode==='detail'?esc(draft.title):'준비물'}</strong></div>${mode==='home'?`<div class="app-bar__actions"><button class="app-bar__icon" data-action="home-menu" aria-label="준비물 더보기"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg></button></div>`:''}${mode==='new'?`<div class="app-bar__actions"><button class="app-bar__icon app-bar__confirm" data-action="create" aria-label="만들기" ${selectedCount()?'':'disabled'}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg></button></div>`:''}${mode==='detail'?`<div class="app-bar__actions"><button class="app-bar__icon" data-action="list-menu" data-id="${esc(draft.id)}" aria-label="체크리스트 더보기"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg></button></div>`:''}</header>${mode==='home'?`<h1>${title}</h1>`:''}`;}
function render(){
document.body.classList.toggle('packing-new',mode==='new');
document.body.classList.toggle('packing-base',mode==='base');
document.body.classList.toggle('packing-detail',mode==='detail');
if(mode==='home'){app.innerHTML=header('하나씩 챙기면, 떠날 준비 끝! ✈️')+`<div class="stack packing-home-actions"><button class="primary" data-action="new">+ 새 체크리스트</button></div>`+(db.lists.length?db.lists.map(renderListCard).join(''):'<div class="data-empty"><img class="travel-empty-image" src="assets/empty-travel-plane.png" width="120" height="92" alt=""><p class="edge-state__description">아직 여행 준비물 목록이 없어요<br>첫 체크리스트를 만들어 보세요</p></div>');return;}
const isBase=mode==='base',isNew=mode==='new';
app.innerHTML=header(isBase?'내 준비물 양식 편집':isNew?'새 체크리스트':esc(draft.title))+(isBase?'<p class="notice">나만의 체크리스트 양식을 만들어봐요!<br>한번 만들어두면, 다음부턴 빠르게 완성되는 체크리스트!</p>':isNew?`<label class="field trip-field"><span>출발일</span><input id="trip-date" type="date" value="${esc(draft.date)}" required></label><label class="field trip-field"><span>제목</span><input id="trip-title" maxlength="${newTitleLimit}" placeholder="제목을 입력해 주세요 (선택)" value="${esc(draft.title)}"></label><div class="section-head"><h2>이번 여행 준비물</h2></div>`:`<div class="trip-detail-date"><p class="muted"><svg class="trip-date-icon" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M4 10h16"/></g></svg>${esc(draft.date.replaceAll('-','.'))}</p></div>${progress(groups())}`)+renderGroups()+renderEmptyGroup()+(isBase?'<div class="sticky"><button class="primary wide packing-save" data-action="save-base">저장하기</button></div>':'');

app.querySelectorAll('[data-parent]').forEach(el=>{const g=groups().find(g=>g.id===el.dataset.parent);const count=g.items.filter(i=>mode==='detail'?i.done:i.selected).length;el.indeterminate=count>0&&count<g.items.length;});
}
function selectedCount(){return groups().flatMap(g=>g.items).filter(i=>i.selected).length;}
function renderGroups(){return groups().map(g=>{const n=g.items.filter(i=>mode==='detail'?i.done:i.selected).length;return `<section class="group" data-group="${g.id}"><div class="group-head">${mode!=='base'?`<label><input type="checkbox" data-parent="${g.id}" ${g.items.length&&n===g.items.length?'checked':''}>${esc(g.name)}<small>${n}/${g.items.length}</small></label>`:`<input class="base-name-input base-group-name" data-base-name data-g="${g.id}" value="${esc(g.name)}" aria-label="카테고리 이름" maxlength="60" enterkeyhint="done">`}${mode==='base'?`<button class="menu base-remove" data-action="base-remove" data-g="${g.id}" aria-label="${esc(g.name)} 카테고리 삭제">−</button>`:`<button class="menu" data-action="group-menu" data-g="${g.id}" aria-label="${esc(g.name)} 카테고리 메뉴"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg></button>`}</div>${g.items.map(i=>`<div class="item ${mode==='detail'&&i.done?'done':''}" draggable="${mode!=='base'}" data-g="${g.id}" data-i="${i.id}">${mode==='base'?`<input class="base-name-input" data-base-name data-g="${g.id}" data-i="${i.id}" value="${esc(i.name)}" aria-label="준비물 이름" maxlength="60" enterkeyhint="done">`:`<label><input type="checkbox" data-item="${i.id}" data-g="${g.id}" ${(mode==='new'?i.selected:i.done)?'checked':''}><span class="item-name">${esc(i.name)}</span></label>`}${mode==='base'?`<button class="menu base-remove" data-action="base-remove" data-g="${g.id}" data-i="${i.id}" aria-label="${esc(i.name)} 삭제">−</button>`:`<button class="menu" data-action="item-menu" data-g="${g.id}" data-i="${i.id}" aria-label="${esc(i.name)} 항목 메뉴"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg></button>`}</div>`).join('')}<button class="add" data-action="add-item" data-g="${g.id}">＋ 새 항목 추가</button></section>`;}).join('')||'<div class="data-empty"><div class="edge-state__icon edge-state__icon--plane" aria-hidden="true"></div><p class="edge-state__description">카테고리를 추가해 준비물을 넣어 보세요</p></div>';}
function renderEmptyGroup(){return `<section class="group group--empty" aria-label="새 카테고리"><div class="group-head"><input class="group-name-input" id="new-group-name" aria-label="새 카테고리 이름" placeholder="카테고리 이름" maxlength="60" value="${esc(draft.pendingGroupName||'')}"></div><button class="add" data-action="add-empty-group-item">＋ 새 항목 추가</button></section>`;}
function addEmptyGroupItem(){const input=app.querySelector('#new-group-name'),name=input.value.trim();if(!name){toast('카테고리 이름을 입력해 주세요.');input.focus();return;}if(groups().some(g=>g.name===name)){toast('같은 카테고리가 이미 있어요.');input.focus();return;}const group={id:uid(),name,builtin:false,items:[]};groups().push(group);delete draft.pendingGroupName;changed();itemAdd(group.id);}
function showDialog(title,body,onSubmit){dialog.dataset.risky=String(['삭제할까요?','체크리스트 삭제','변경 내용을 나갈까요?'].includes(title));dialog.innerHTML=`<form><h2>${esc(title)}</h2>${body}<div class="actions"><button type="button" data-close>취소</button>${onSubmit?'<button class="primary" type="submit">확인</button>':''}</div></form>`;dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.querySelector('form').onsubmit=e=>{e.preventDefault();if(onSubmit)onSubmit(new FormData(e.target));};window.prepareDialogActions(dialog);dialog.showModal();}
function nameField(value='',label='이름',maxLength=60){return `<label class="field"><span>${label}</span><input name="name" value="${esc(value)}" required maxlength="${maxLength}" autofocus></label>`;}
function groupOptions(selected){return `<label class="field"><span>넣을 카테고리</span><select name="group">${groups().map(g=>`<option value="${g.id}" ${g.id===selected?'selected':''}>${esc(g.name)}</option>`).join('')}</select></label>`;}
function textValue(fd){const n=String(fd.get('name')||'').trim();if(!n){toast('이름을 입력해 주세요.');return null;}return n;}
function itemAdd(gid){if(!groups().length){toast('먼저 카테고리를 만들어 주세요.');addGroup();return;}showDialog('새 준비물 추가',nameField('','준비물 이름')+groupOptions(gid),fd=>{const name=textValue(fd);if(!name)return;const g=groups().find(g=>g.id===fd.get('group'));if(g.items.some(i=>i.name===name)){toast('같은 이름의 준비물이 이미 있어요.');return;}g.items.push({id:uid(),name,selected:true,done:false});dialog.close();changed();toast(mode==='base'?'기본 목록에 추가했어요. 저장 버튼을 눌러 주세요.':'이번 여행에 추가했어요.');});}
function addGroup(){showDialog('새 카테고리',nameField('','카테고리 이름'),fd=>{const name=textValue(fd);if(!name)return;if(groups().some(g=>g.name===name)){toast('같은 카테고리가 이미 있어요.');return;}groups().push({id:uid(),name,builtin:false,items:[]});dialog.close();changed();});}
function move(gid,iid,target){if(gid===target)return;const from=groups().find(g=>g.id===gid),to=groups().find(g=>g.id===target),i=from.items.find(i=>i.id===iid);if(to.items.some(x=>x.name===i.name)){toast('이 카테고리에 같은 준비물이 있어요.');return;}from.items=from.items.filter(x=>x.id!==iid);to.items.push(i);changed();toast(`${to.name}(으)로 옮겼어요.`);}
function menu(gid,iid,anchor){const g=groups().find(g=>g.id===gid),i=iid?g.items.find(i=>i.id===iid):null;if(mode==='new'&&anchor){openOverflow(anchor,[{label:'이름 수정하기',run:()=>runAction('rename')},...(i?[{label:'다른 카테고리로 이동',run:()=>runAction('move')}]:[]),{label:'삭제하기',danger:true,run:()=>runAction('delete')}]);return;}showDialog(i?i.name:g.name,`<div class="stack"><button type="button" data-menu="rename">이름 수정하기</button>${i?'<button type="button" data-menu="move">다른 카테고리로 이동</button>':''}<button type="button" data-menu="delete">삭제하기</button></div>`);dialog.querySelectorAll('[data-menu]').forEach(b=>b.onclick=()=>{dialog.close();runAction(b.dataset.menu);});function runAction(action){if(action==='rename'){showDialog('이름 수정',nameField((i||g).name),fd=>{const name=textValue(fd);if(!name)return;const siblings=i?g.items:groups();if(siblings.some(x=>x!==(i||g)&&x.name===name)){toast('같은 이름이 이미 있어요.');return;}(i||g).name=name;dialog.close();changed();});}if(action==='move'){showDialog('다른 카테고리로 이동',groupOptions(gid),fd=>{dialog.close();move(gid,iid,fd.get('group'));});}if(action==='delete'){showDialog('삭제할까요?',`<p>${esc((i||g).name)}${i?'':'과(와) 하위 준비물'}을 ${mode==='base'?'기본 목록':'이번 목록'}에서 삭제해요.</p>`,()=>{if(i)g.items=g.items.filter(x=>x.id!==iid);else draft.groups=groups().filter(x=>x.id!==gid);dialog.close();changed();});}}}
function editTrip(list=draft){showDialog('여행 정보 수정',`<label class="field"><span>날짜</span><input name="date" type="date" required value="${esc(list.date)}"></label>`+nameField(list.title,'제목',Math.max(16,list.title.length)),fd=>{const name=textValue(fd);if(!name)return;list.date=fd.get('date');list.title=name;dialog.close();if(mode==='detail'){draft=clone(list);changed();}else{persist();render();}});}

let overflowMenu=null,overflowAnchor=null;
function closeOverflow(restore=false){if(!overflowMenu)return;overflowMenu.remove();overflowMenu=null;overflowAnchor?.setAttribute('aria-expanded','false');if(restore&&overflowAnchor?.isConnected)overflowAnchor.focus();overflowAnchor=null;}
function openOverflow(anchor,options){
if(overflowAnchor===anchor){closeOverflow(true);return;}
closeOverflow();overflowAnchor=anchor;anchor.setAttribute('aria-haspopup','menu');anchor.setAttribute('aria-expanded','true');
const menu=document.createElement('div');overflowMenu=menu;menu.className='packing-overflow';menu.setAttribute('role','menu');menu.setAttribute('aria-label',anchor.getAttribute('aria-label')||'더보기');
options.forEach(option=>{const button=document.createElement('button');button.type='button';button.setAttribute('role','menuitem');button.textContent=option.label;if(option.danger)button.className='danger';button.onclick=()=>{closeOverflow(true);option.run();};menu.append(button);});
document.body.append(menu);const r=anchor.getBoundingClientRect(),gap=8,edge=16,w=menu.offsetWidth,h=menu.offsetHeight;
menu.style.left=Math.max(edge,Math.min(r.right-w,innerWidth-w-edge))+'px';menu.style.top=Math.max(edge,r.bottom+gap+h<=innerHeight-edge?r.bottom+gap:r.top-h-gap)+'px';menu.querySelector('button').focus();
menu.onkeydown=e=>{const items=[...menu.querySelectorAll('button')],index=items.indexOf(document.activeElement);if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();items[e.key==='Home'?0:e.key==='End'?items.length-1:(index+(e.key==='ArrowDown'?1:-1)+items.length)%items.length].focus();}if(e.key==='Tab')closeOverflow();};
}
document.addEventListener('pointerdown',e=>{if(overflowMenu&&!overflowMenu.contains(e.target)&&!overflowAnchor?.contains(e.target))closeOverflow();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overflowMenu){e.preventDefault();closeOverflow(true);}});
window.addEventListener('resize',()=>closeOverflow());
window.addEventListener('scroll',()=>closeOverflow(),true);
function leave(){if((mode==='base'||mode==='new')&&dirty){showDialog('변경 내용을 나갈까요?', '<p>저장하지 않은 변경 내용은 사라져요.</p>',()=>{dialog.close();mode='home';draft=null;dirty=false;render();});}else{mode='home';draft=null;dirty=false;render();}}
let newTitleLimit=16;
function startNew(source, title=source?.title || '', courseId=source?.courseId){newTitleLimit=Math.max(16,title.length);mode='new';draft={id:uid(),title,date:today(),groups:clone(source?source.groups:db.base)};if(courseId)draft.courseId=courseId;draft.groups.forEach(g=>g.items.forEach(i=>{i.done=false;i.selected=true;}));dirty=false;render();window.scrollTo(0,0);}
app.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const {action,id,g,i}=b.dataset;
if(action==='home-menu')openOverflow(b,[{label:'내 준비물 양식 편집',run:()=>{mode='base';draft={groups:clone(db.base)};dirty=false;render();window.scrollTo(0,0);}}]);
if(action==='add-empty-group-item')addEmptyGroupItem();if(action==='new')startNew();if(action==='base'){mode='base';draft={groups:clone(db.base)};dirty=false;render();window.scrollTo(0,0);}if(action==='back')leave();if(action==='copy')startNew(db.lists.find(l=>l.id===id));if(action==='open'){mode='detail';draft=clone(db.lists.find(l=>l.id===id));dirty=false;render();window.scrollTo(0,0);}if(action==='add-group')addGroup();if(action==='add-item')itemAdd(g);if(action==='group-menu'||action==='item-menu')menu(g,i,b);
if(action==='base-remove'&&mode==='base'){const group=groups().find(x=>x.id===g);if(!group)return;if(i)group.items=group.items.filter(x=>x.id!==i);else draft.groups=groups().filter(x=>x.id!==g);changed();}
if(action==='save-base'){db.base=clone(groups());const ok=persist();dirty=false;mode='home';render();if(ok)toast('기본 준비물을 저장했어요. 다음 목록부터 적용돼요.');}
if(action==='create'){const date=document.querySelector('#trip-date');if(!date.reportValidity())return;if(document.querySelector('#trip-title').value.trim().length>newTitleLimit){toast(`제목은 ${newTitleLimit}자까지 입력할 수 있어요.`);return;}if(!selectedCount())return;draft.date=date.value;draft.title=document.querySelector('#trip-title').value.trim()||`${dateLabel(draft.date)} 여행 준비물`;draft.groups=groups().map(g=>({...g,items:g.items.filter(i=>i.selected).map(i=>({...i,done:false}))})).filter(g=>g.items.length);delete draft.pendingGroupName;db.lists.unshift(clone(draft));persist();mode='home';draft=null;dirty=false;render();window.scrollTo(0,0);}
if(action==='trip-edit')editTrip();
if(action==='list-menu'){const l=db.lists.find(l=>l.id===id);if(!l)return;openOverflow(b,[{label:'제목 및 일자 수정하기',run:()=>editTrip(l)},{label:'복사해서 새로 만들기',run:()=>startNew(l)},{label:'삭제하기',danger:true,run:()=>showDialog('체크리스트 삭제',`<p>‘${esc(l.title)}’ 목록을 삭제할까요?</p>`,()=>{db.lists=db.lists.filter(l=>l.id!==id);persist();dialog.close();if(mode==='detail'){mode='home';draft=null;dirty=false;}render();})}]);}
});
app.addEventListener('focusout',e=>{
const input=e.target;if(!input.matches('[data-base-name]')||mode!=='base')return;
const group=groups().find(g=>g.id===input.dataset.g);if(!group)return;
const target=input.dataset.i?group.items.find(i=>i.id===input.dataset.i):group;if(!target)return;
const name=input.value.trim(),siblings=input.dataset.i?group.items:groups();
if(!name||siblings.some(x=>x!==target&&x.name===name)){input.value=target.name;toast(!name?'이름을 입력해 주세요.':'같은 이름이 이미 있어요.');return;}
if(target.name!==name){target.name=name;dirty=true;}
input.value=name;
input.nextElementSibling?.setAttribute('aria-label',name+(input.dataset.i?' 삭제':' 카테고리 삭제'));
});
app.addEventListener('keydown',e=>{
if(!e.target.matches('[data-base-name]')||e.isComposing)return;
if(e.key==='Enter'){e.preventDefault();e.target.blur();}
if(e.key==='Escape'){const group=groups().find(g=>g.id===e.target.dataset.g);const target=e.target.dataset.i?group.items.find(i=>i.id===e.target.dataset.i):group;e.target.value=target.name;e.target.blur();}
});
app.addEventListener('keydown',e=>{if(e.target.matches('.packing-list-card')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.target.click();}});
app.addEventListener('input',e=>{if(e.target.id==='new-group-name'){draft.pendingGroupName=e.target.value;dirty=true;}if(e.target.id==='trip-title'){draft.title=e.target.value;dirty=true;}if(e.target.id==='trip-date'){draft.date=e.target.value;dirty=true;}});
app.addEventListener('change',e=>{const t=e.target;if(t.dataset.parent){groups().find(g=>g.id===t.dataset.parent).items.forEach(i=>{i[mode==='detail'?'done':'selected']=t.checked;});changed();}if(t.dataset.item){const i=groups().find(g=>g.id===t.dataset.g).items.find(i=>i.id===t.dataset.item);i[mode==='new'?'selected':'done']=t.checked;changed();}});
app.addEventListener('dragstart',e=>{const row=e.target.closest('[data-i].item');if(!row)return;dragged={g:row.dataset.g,i:row.dataset.i};e.dataTransfer.setData('text/plain',row.dataset.i);});
app.addEventListener('dragover',e=>{const group=e.target.closest('[data-group]');if(group&&dragged){e.preventDefault();group.classList.add('drop');}});
app.addEventListener('dragleave',e=>{const group=e.target.closest('[data-group]');if(group&&!group.contains(e.relatedTarget))group.classList.remove('drop');});
app.addEventListener('drop',e=>{const group=e.target.closest('[data-group]');if(group&&dragged){e.preventDefault();move(dragged.g,dragged.i,group.dataset.group);}dragged=null;app.querySelectorAll('.drop').forEach(x=>x.classList.remove('drop'));});
app.addEventListener('dragend',()=>{dragged=null;app.querySelectorAll('.drop').forEach(x=>x.classList.remove('drop'));});
let holdTimer=null,held=false;
app.addEventListener('pointerdown',e=>{if(mode==='base')return;const row=e.target.closest('.item,.group-head');if(!row||e.target.closest('button,input'))return;held=false;holdTimer=setTimeout(()=>{held=true;const section=row.closest('[data-group]');if(section)menu(section.dataset.group,row.dataset.i,row.querySelector('.menu'));},650);});
for(const event of ['pointerup','pointercancel','pointermove','dragstart'])app.addEventListener(event,()=>clearTimeout(holdTimer));
app.addEventListener('click',e=>{if(held){e.preventDefault();e.stopPropagation();held=false;}},true);
window.addEventListener('beforeunload',e=>{if(dirty&&(mode==='base'||mode==='new')){e.preventDefault();e.returnValue='';}});
const entryUrl=new URL(window.location.href);
const courseTitle=entryUrl.searchParams.get('courseTitle');
if(courseTitle){
  const courseId=entryUrl.searchParams.get('courseId');
  entryUrl.searchParams.delete('courseId');
  entryUrl.searchParams.delete('courseTitle');
  history.replaceState(null,'',entryUrl);
  startNew(null,courseTitle,courseId);
}else{
  render();
}
if(storageError)toast('저장된 데이터를 읽지 못했어요. 기본 목록으로 시작합니다.');
