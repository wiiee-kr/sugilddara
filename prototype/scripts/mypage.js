'use strict';
(() => {
  const storageKey='chabak-profile-v1', M=CommunityModel;
  const name=document.querySelector('#profile-name'), dialog=document.querySelector('#profile-dialog'), input=document.querySelector('#nickname');
  const fileInput=document.querySelector('#profile-file'), preview=document.querySelector('#photo-preview'), photo=document.querySelector('.profile-image');
  const form=document.querySelector('#profile-form'), submit=form.querySelector('[type=submit]');
  let draftPhoto='', photoVersion=0, noticeTimer;
  const readProfile=()=>JSON.parse(localStorage.getItem(storageKey))||{};
  const community=()=>JSON.parse(localStorage.getItem('chabak-community-latest-v2'))||M.migrate(JSON.parse(localStorage.getItem('chabak-community-v1')));
  function message(id,text){const el=document.getElementById(id);el.textContent=text;el.hidden=!text;}
  function toast(text){const n=document.querySelector('#notice');n.textContent=text;n.hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>n.hidden=true,4500);}
  function validate(){
    const nickname=input.value.normalize('NFC');
    let error='';
    if(!nickname)error='닉네임을 입력해 주세요.';
    else if(!M.validNickname(nickname))error='한글·영문·숫자만 사용해 1~20자로 입력해 주세요. 공백과 특수문자는 사용할 수 없어요.';
    else {try{if(M.nicknameTaken(community(),nickname))error='이미 사용 중인 닉네임이에요. 다른 닉네임을 입력해 주세요.';}catch{error='닉네임 중복을 확인하지 못했어요. 다시 시도해 주세요.';}}
    input.setAttribute('aria-invalid',String(!!error));message('nickname-error',error);return !error;
  }
  try{name.textContent=M.ensureNickname(community(),localStorage);photo.src=M.avatarSource('me',name.textContent);}catch{toast('저장된 프로필을 불러오지 못했어요.');}
  function open(){
    input.value=name.textContent;draftPhoto=photo.src;preview.src=draftPhoto;fileInput.value='';
    ['nickname-error','photo-error','save-error'].forEach(id=>message(id,''));input.removeAttribute('aria-invalid');submit.disabled=false;
    window.prepareDialogActions(dialog);dialog.showModal();document.querySelector('#choose-photo').focus();
  }
  document.querySelector('#edit-profile').addEventListener('click',open);
  document.querySelector('#edit-profile-photo').addEventListener('click',()=>{open();fileInput.click();});
  document.querySelector('#choose-photo').addEventListener('click',()=>fileInput.click());
  document.querySelector('#cancel-edit').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{photoVersion++;submit.disabled=false;});
  input.addEventListener('input',e=>{if(!e.isComposing)validate();});input.addEventListener('compositionend',validate);input.addEventListener('blur',validate);
  fileInput.addEventListener('change',async()=>{
    const file=fileInput.files[0];if(!file)return;const version=++photoVersion;message('photo-error','');
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)){message('photo-error','JPG, PNG, WebP 사진을 선택해 주세요.');return;}
    if(file.size>10*1024*1024){message('photo-error','10MB 이하의 사진을 선택해 주세요.');return;}
    submit.disabled=true;const url=URL.createObjectURL(file);
    try{
      const img=new Image();img.src=url;await img.decode();
      const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
      const side=Math.min(img.naturalWidth,img.naturalHeight);
      canvas.getContext('2d').drawImage(img,(img.naturalWidth-side)/2,(img.naturalHeight-side)/2,side,side,0,0,512,512);
      const result=canvas.toDataURL('image/jpeg',.85);
      if(version===photoVersion&&dialog.open){draftPhoto=result;preview.src=result;}
    }catch{if(version===photoVersion)message('photo-error','사진을 불러오지 못했어요. 다른 사진을 선택해 주세요.');}
    finally{URL.revokeObjectURL(url);if(version===photoVersion)submit.disabled=false;}
  });
  form.addEventListener('submit',e=>{
    e.preventDefault();if(submit.disabled)return;if(!validate()){input.focus();return;}
    try{const profile=readProfile();profile.nickname=input.value.normalize('NFC');if(draftPhoto.startsWith('data:image/'))profile.photo=draftPhoto;localStorage.setItem(storageKey,JSON.stringify(profile));name.textContent=profile.nickname;photo.src=draftPhoto;window.dispatchEvent(new Event('profile-updated'));dialog.close();toast('프로필을 저장했어요.');}
    catch{message('save-error','프로필을 저장하지 못했어요. 저장 공간을 확인하고 다시 시도해 주세요.');}
  });
})();
