javascript:(async()=>{
  const sid=location.pathname.match(/\/chat\/s\/([a-f0-9-]+)/i)?.[1];
  if(!sid)return alert('Открой чат DeepSeek');
  const t=JSON.parse(localStorage.getItem('userToken')||'{}').value;
  if(!t)return alert('Залогинься в DeepSeek');
  try{
    const r=await fetch('https://chat.deepseek.com/api/v0/chat/history_messages?chat_session_id='+sid,{credentials:'include',headers:{Authorization:'Bearer '+t}});
    const j=await r.json();
    const msgs=j.data.biz_data.chat_messages;
    let out='# '+(j.data.biz_data.chat_session.title||'DeepSeek')+'\n\n';
    for(const m of msgs){
      let txt='';
      for(const f of m.fragments||[]){
        if(m.role==='USER'&&f.type==='REQUEST')txt+=f.content+'\n\n';
        if(m.role==='USER'&&f.type==='FILE'&&f.files)txt+='[Файл: '+f.files.map(x=>x.file_name).join(', ')+']\n\n';
        if(m.role==='ASSISTANT'&&f.type==='RESPONSE')txt+=f.content+'\n\n'
      }
      if(txt.trim())out+='*** '+m.role+' ***\n\n'+txt.trim()+'\n\n--------------------------------------------------\n\n'
    }
    const old=document.getElementById('ds-export-overlay');
    if(old)old.remove();
    const d=document.createElement('div');
    d.id='ds-export-overlay';
    d.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:#fff;z-index:2147483647;padding:8px;box-sizing:border-box;overflow:auto;';
    const ta=document.createElement('textarea');
    ta.value=out;
    ta.readOnly=true;
    ta.style.cssText='width:100%;height:85vh;font-family:monospace;font-size:11px;padding:8px;border:1px solid #ccc;box-sizing:border-box;';
    const btn=document.createElement('button');
    btn.textContent='Закрыть';
    btn.style.cssText='display:block;width:100%;padding:12px;margin-top:8px;background:#4a6cf7;color:#fff;border:none;border-radius:8px;font-size:16px;';
    btn.onclick=()=>d.remove();
    const hint=document.createElement('div');
    hint.textContent='Долгое нажатие -> Выделить всё -> Копировать';
    hint.style.cssText='font-family:sans-serif;font-size:13px;color:#666;margin-bottom:6px;text-align:center;';
    d.appendChild(hint);
    d.appendChild(ta);
    d.appendChild(btn);
    document.body.appendChild(d);
    setTimeout(()=>{ta.focus();ta.select();},200);
  }catch(e){
    alert('Ошибка: '+e.message);
  }
})();
