// ---------- dibujo ----------
const NS="http://www.w3.org/2000/svg";
function draw(st){const h=st.h,v=st.v,ord=[],seen=new Set(),pos={};
  const visit=id=>{while(typeof id==="string"&&!seen.has(id)){seen.add(id);ord.push(id);id=h.find(x=>x.id===id).sig}};
  Object.values(v).forEach(visit);h.forEach(n=>visit(n.id));ord.forEach((id,i)=>pos[id]=i);
  const live=new Set(),q=Object.values(v).filter(x=>typeof x==="string");
  while(q.length){const id=q.pop();if(live.has(id))continue;live.add(id);const n=h.find(x=>x.id===id);[n.sig,n.ant].forEach(x=>x&&q.push(x))}
  const X=i=>40+i*150,Y=130,W=108,By=Y+40;let s=`<defs>
  <marker id="ma" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" style="fill:var(--ac)"/></marker>
  <marker id="mb" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" style="fill:var(--ac2)"/></marker></defs>`;
  ord.forEach((id,i)=>{const n=h.find(x=>x.id===id),x=X(i),on=live.has(id);
    s+=`<g opacity="${on?1:.45}"><rect class="nd" x="${x}" y="${Y}" width="${W}" height="40" rx="6"${on?"":' stroke-dasharray="4 3"'}/>
    <line class="dv" x1="${x+30}" y1="${Y}" x2="${x+30}" y2="${By}"/><line class="dv" x1="${x+78}" y1="${Y}" x2="${x+78}" y2="${By}"/>
    <text x="${x+15}" y="${Y+25}" text-anchor="middle">${n.ant?"•":"∅"}</text>
    <text x="${x+54}" y="${Y+25}" text-anchor="middle" font-weight="600">${n.dato}</text>
    <text x="${x+93}" y="${Y+25}" text-anchor="middle">${n.sig?"•":"∅"}</text>
    ${on?"":`<text x="${x+54}" y="${By+16}" text-anchor="middle" style="fill:var(--mu);font-size:11px">sin referencia</text>`}`;
    if(n.sig){const j=pos[n.sig],sx=x+93;
      if(j===i+1)s+=`<path class="sg" d="M${sx} ${Y+20}L${X(j)} ${Y+20}" marker-end="url(#ma)"/>`;
      else{const ex=j===i?x+72:X(j)+90,d=40+Math.min(Math.abs(j-i),5)*15;s+=`<path class="sg" d="M${sx} ${Y}C${sx} ${Y-d},${ex} ${Y-d},${ex} ${Y}" marker-end="url(#ma)"/>`}}
    if(n.ant){const j=pos[n.ant],ax=x+15,ex=j===i?x+36:X(j)+18,d=36+Math.min(Math.abs(j-i),5)*14;
      s+=`<path class="an" d="M${ax} ${By}C${ax} ${By+d},${ex} ${By+d},${ex} ${By}" marker-end="url(#mb)"/>`}
    s+="</g>"});
  const k={};let leg=[];
  Object.entries(v).forEach(([nm,val])=>{if(typeof val==="string"){const i=pos[val],c=k[val]=(k[val]||0)+1,w=nm.length*8+14;
      s+=`<rect class="chip" x="${X(i)}" y="${Y-6-c*20}" width="${w}" height="18" rx="4"/><text class="ct" x="${X(i)+7}" y="${Y-6-c*20+13}">${nm}</text>`}
    else leg.push(nm+" = "+(val===null?"null":val))});
  if(leg.length)s+=`<text x="40" y="262" style="fill:var(--mu)">${leg.join("    ")}</text>`;
  if(!ord.length)s+=`<text x="40" y="140" style="fill:var(--mu)">Aún no hay nodos.</text>`;
  const svg=$("svg");svg.innerHTML=s;svg.setAttribute("width",Math.max(600,X(ord.length)+40))}
