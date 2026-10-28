// ---------- interfaz ----------
let S=[],idx=0,timer=null,lines=[];
Object.keys(EX).forEach(k=>$("ex").add(new Option(k,k)));
const load=()=>{$("code").value=EX[$("ex").value];stop();showEditor()};
$("ex").onchange=load;
function showEditor(){$("code").style.display="";$("view").style.display="none";$("edit").hidden=true;S=[];$("cnt").textContent="";$("info").textContent="Pulsa Ejecutar para ver el diagrama paso a paso.";$("info").className="";draw({h:[],v:{}})}
function show(i){idx=Math.max(0,Math.min(S.length-1,i));const st=S[idx];draw(st);
  document.querySelectorAll(".ln").forEach((e,n)=>e.classList.toggle("on",n+1===st.l));
  $("cnt").textContent="Paso "+idx+" de "+(S.length-1);
  $("info").className=st.error?"err":"";$("info").textContent=(st.msg||(st.l?"Línea "+st.l+" ejecutada.":""))+(st.st&&st.st.length>1?"   Pila: "+st.st.join(" → "):"");
  const on=document.querySelector(".ln.on");if(on)on.scrollIntoView({block:"nearest"})}
function stop(){clearInterval(timer);timer=null;$("play").textContent="Reproducir"}
function start(){if(idx>=S.length-1)show(0);$("play").textContent="Pausar";timer=setInterval(()=>{if(idx>=S.length-1)return stop();show(idx+1)},+$("spd").value)}
$("run").onclick=()=>{stop();try{S=run(parse(lex($("code").value)))}catch(e){showEditor();$("info").textContent=e.message;$("info").className="err";return}
  lines=$("code").value.split("\n");const mk=lines.findIndex(t=>t.includes("//@"))+1;if(mk){const k=S.findIndex(s=>s.l>mk);if(k>0){S=S.slice(k-1);S[0]={...S[0],l:mk,msg:"Estado inicial (la preparación de la lista se omitió)"}}}const v=$("view");v.innerHTML="";
  lines.forEach((t,n)=>{const d=document.createElement("span");d.className="ln";const b=document.createElement("b");b.textContent=n+1;d.append(b,t||" ");v.append(d)});
  $("code").style.display="none";v.style.display="block";$("edit").hidden=false;show(0)};
$("edit").onclick=()=>{stop();showEditor()};
$("b0").onclick=()=>{stop();show(0)};$("b1").onclick=()=>{stop();show(idx-1)};
$("b2").onclick=()=>{stop();show(idx+1)};$("b3").onclick=()=>{stop();show(S.length-1)};
$("play").onclick=()=>{if(!S.length)return;timer?stop():start()};
document.addEventListener("keydown",e=>{if(e.target.tagName==="TEXTAREA"||!S.length)return;
  if(e.key==="ArrowRight"){stop();show(idx+1)}if(e.key==="ArrowLeft"){stop();show(idx-1)}});
load();
