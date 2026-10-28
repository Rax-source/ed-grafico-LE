function run(P){const S=[];let heap=[],G={},fr=[],nid=1;
  const cp=o=>JSON.parse(JSON.stringify(o)),cur=()=>fr.length?fr[fr.length-1].vars:G,F=["dato","sig","ant"];
  const snap=(l,msg)=>{if(S.length>600)throw Error("Demasiados pasos (¿bucle infinito o recursión sin fin?)");
    S.push({l,msg:msg||"",h:cp(heap),v:cp({...G,...(fr.length?cur():{})}),st:fr.map(f=>f.n)})};
  const node=id=>heap.find(x=>x.id===id);
  const err=(m,l)=>{throw Object.assign(Error(m+" (línea "+l+")"),{line:l})};
  const scope=(n,l)=>{const c=cur();if(n in c)return c;if(n in G)return G;err("Variable «"+n+"» no declarada",l)};
  function get(p,l){let v=scope(p[0],l)[p[0]];
    for(let i=1;i<p.length;i++){if(v===null)err("NullPointerException: «"+p[i-1]+"» es null al leer ."+p[i],l);
      if(typeof v!=="string")err("«"+p[i-1]+"» no es un Nodo",l);
      if(!F.includes(p[i]))err("El Nodo no tiene el campo «"+p[i]+"»",l);v=node(v)[p[i]]}return v}
  function ev(e){if("num" in e)return e.num;if(e.nul)return null;
    if(e.nw){const id="n"+nid++;heap.push({id,dato:e.a?ev(e.a):0,sig:null,ant:null});return id}
    if(e.p)return get(e.p,e.l);
    const a=ev(e.a);if(e.o==="!")return !a;if(e.o==="&&")return a&&ev(e.b);if(e.o==="||")return a||ev(e.b);
    const b=ev(e.b);return{"==":a===b,"!=":a!==b,"<":a<b,">":a>b,"+":a+b,"-":a-b}[e.o]}
  function call(s){const args=s.a.map(ev),m=P.methods.find(x=>x.n===s.n&&x.ps.length===args.length);
    if(!m)err("No existe el método «"+s.n+"» con "+args.length+" parámetro(s)",s.l);
    if(fr.length>40)err("Recursión demasiado profunda",s.l);
    const vars={};m.ps.forEach((p,i)=>vars[p.n]=args[i]);
    snap(s.l,"llama a "+s.n);fr.push({n:s.n,vars});snap(m.l,"entra en "+s.n);exec(m.body);fr.pop();snap(s.l,"vuelve de "+s.n)}
  function exec(b){for(const s of b){
    if(s.k==="decl"){cur()[s.n]=s.t==="int"?0:null;snap(s.l)}
    else if(s.k==="call")call(s);
    else if(s.k==="asg"){const v=ev(s.e),p=s.lhs.p;
      if(p.length===1)scope(p[0],s.l)[p[0]]=v;
      else{const o=get(p.slice(0,-1),s.l),f=p[p.length-1];
        if(o===null)err("NullPointerException: «"+p[p.length-2]+"» es null al asignar ."+f,s.l);
        if(!F.includes(f))err("El Nodo no tiene el campo «"+f+"»",s.l);node(o)[f]=v}
      snap(s.l)}
    else if(s.k==="if"){const c=ev(s.c);snap(s.l,"if: "+(c?"verdadero":"falso"));exec(c?s.b:s.e)}
    else{while(true){const c=ev(s.c);snap(s.l,"while: "+(c?"verdadero":"falso, sale del bucle"));if(!c)break;exec(s.b)}}}}
  snap(0,"Estado inicial");
  try{exec(P.attrs);const m=P.methods.find(x=>x.n==="main"&&!x.ps.length);
    if(m){fr.push({n:"main",vars:{}});snap(m.l,"entra en main");exec(m.body);fr.pop();snap(m.l,"fin del programa")}else exec(P.main)}
  catch(e){S.push({...S[S.length-1],l:e.line||0,msg:e.message,error:true})}
  return S}
