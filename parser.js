function lex(s){const r=/(\s+)|(\/\/[^\n]*)|([A-Za-z_]\w*)|(\d+)|(==|!=|&&|\|\||[{}();=.<>+\-!,\[\]])|(.)/g;let m,l=1;const o=[];
  while(m=r.exec(s)){if(m[1])l+=(m[1].match(/\n/g)||[]).length;else if(m[2]){}else if(m[6])throw Error("Carácter no válido «"+m[6]+"» (línea "+l+")");else o.push({v:m[0],l,n:!!m[4]})}
  o.push({v:"EOF",l});return o}
function parse(T){let i=0;const pk=()=>T[i],nx=()=>T[i++];
  const ex=v=>{const t=nx();if(t.v!==v)throw Error("Se esperaba «"+v+"» (línea "+t.l+")");return t};
  const block=()=>{ex("{");const a=[];while(pk().v!=="}"){if(pk().v==="EOF")throw Error("Falta cerrar «}»");a.push(st(false))}ex("}");return a};
  const body=()=>pk().v==="{"?block():[st(false)];
  function st(top){const t=pk();
    if(t.v==="if"){nx();ex("(");const c=cond();ex(")");const b=body();let e=[];if(pk().v==="else"){nx();e=body()}return{k:"if",c,b,e,l:t.l}}
    if(t.v==="while"){nx();ex("(");const c=cond();ex(")");return{k:"while",c,b:body(),l:t.l}}
    if(t.v==="Nodo"||t.v==="int"){if(!top)throw Error("Las declaraciones van al inicio del método, no dentro de if/while (línea "+t.l+")");
      nx();const n=nx().v;if(pk().v==="=")throw Error("Separa la declaración de la asignación: escribe «"+t.v+" "+n+";» y en otra línea «"+n+" = ...;» (línea "+t.l+")");
      ex(";");return{k:"decl",n,t:t.v,l:t.l}}
    if(/^[A-Za-z_]/.test(t.v)&&T[i+1].v==="("){nx();nx();const a=[];while(pk().v!==")"&&pk().v!=="EOF"){a.push(expr());if(pk().v===",")nx()}ex(")");ex(";");return{k:"call",n:t.v,a,l:t.l}}
    const lhs=path();ex("=");const e=expr();ex(";");return{k:"asg",lhs,e,l:t.l}}
  function path(){const t=nx();if(!/^[A-Za-z_]/.test(t.v))throw Error("Sentencia no válida (línea "+t.l+")");const p=[t.v];while(pk().v==="."){nx();p.push(nx().v)}return{p,l:t.l}}
  function cond(){let a=cmp();while(pk().v==="&&"||pk().v==="||"){const o=nx().v;a={o,a,b:cmp()}}return a}
  function cmp(){if(pk().v==="!"){nx();return{o:"!",a:cmp()}}const a=expr();if(["==","!=","<",">"].includes(pk().v)){const o=nx().v;return{o,a,b:expr()}}return a}
  function expr(){let a=term();while(pk().v==="+"||pk().v==="-"){const o=nx().v;a={o,a,b:term()}}return a}
  function term(){const t=pk();if(t.n){nx();return{num:+t.v}}if(t.v==="null"){nx();return{nul:1}}
    if(t.v==="new"){nx();ex("Nodo");ex("(");let a=null;if(pk().v!==")")a=expr();ex(")");return{nw:1,a}}
    if(t.v==="("){nx();const c=cond();ex(")");return c}return path()}
  function seq(){const a=[];let dOK=true;
    while(pk().v!=="}"){if(pk().v==="EOF")throw Error("Falta cerrar «}»");const t=pk(),isD=t.v==="Nodo"||t.v==="int";
      if(isD&&!dOK)throw Error("Todas las declaraciones van al inicio, antes de las asignaciones (línea "+t.l+")");
      if(!isD)dOK=false;a.push(st(true))}return a}
  const P={attrs:[],methods:[],main:[]};let dOK=true;
  while(pk().v!=="EOF"){const t=pk();
    if(t.v==="public"||t.v==="static"||t.v==="void"){
      while(pk().v==="public"||pk().v==="static")nx();ex("void");const n=nx().v;ex("(");const ps=[];
      while(pk().v!==")"&&pk().v!=="EOF"){const ty=nx().v;
        if(ty==="String"){while(pk().v!==")"&&pk().v!=="EOF")nx();break}
        if(ty!=="Nodo"&&ty!=="int")throw Error("Tipo de parámetro no válido «"+ty+"» (línea "+t.l+")");
        ps.push({t:ty,n:nx().v});if(pk().v===",")nx()}
      ex(")");ex("{");const b=[];let d2=true;
      while(pk().v!=="}"){if(pk().v==="EOF")throw Error("Falta cerrar «}»");const u=pk(),isD=u.v==="Nodo"||u.v==="int";
        if(isD&&!d2)throw Error("Todas las declaraciones van al inicio del método, antes de las asignaciones (línea "+u.l+")");
        if(!isD)d2=false;b.push(st(true))}
      ex("}");P.methods.push({n,ps,body:b,l:t.l});dOK=false}
    else{const isD=t.v==="Nodo"||t.v==="int";
      if(isD&&!dOK)throw Error("Todas las declaraciones van al inicio, antes de las asignaciones y métodos (línea "+t.l+")");
      if(!isD)dOK=false;(isD?P.attrs:P.main).push(st(true))}}
  return P}
