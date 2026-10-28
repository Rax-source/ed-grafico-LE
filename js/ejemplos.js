const ind=s=>s.split("\n").map(l=>"  "+l).join("\n").replace(/ +\n/g,"\n").replace(/ +$/,"");
const SET=`i = 6;
while (i > 0) {
  p = new Nodo(i);
  insInicio(p);
  i = i - 1;
}
//@ desde aquí se ve paso a paso
`;
const D=(...v)=>["p",...v].map(x=>"Nodo "+x+";\n").join("")+"int i;\n\n";
const E=(met,v,post)=>"Nodo cab;\n\n"+met+"\nvoid main() {\n"+ind(D(...v)+SET+post)+"\n}";
const FIND=(v,d)=>v+" = cab;\nwhile ("+v+".dato != "+d+") {\n  "+v+" = "+v+".sig;\n}\n";
const LDE_INI=`void insInicio(Nodo p) {
  if (p != null) {
    p.sig = cab;
    if (cab != null) {
      cab.ant = p;
    }
    cab = p;
  }
}
`;
const LDE_INTER=`void insInter(Nodo p, Nodo q) {
  if (q != null && p != null) {
    p.sig = q.sig;
    q.sig = p;
    if (p.sig != null) {
      p.sig.ant = p;
    }
    p.ant = q;
  }
}
`;
const LDE_ELIM=`void elimInter(Nodo p) {
  if (p != null) {
    p.ant.sig = p.sig;
    if (p.sig != null) {
      p.sig.ant = p.ant;
    }
    p.sig = null;
    p.ant = null;
  }
}
`;
const LDE_ELIMINI=`void elimInicio() {
  Nodo p;
  if (cab != null) {
    p = cab;
    cab = p.sig;
    if (cab != null) {
      cab.ant = null;
    }
    p.sig = null;
  }
}
`;
const LDE_LIB=`void liberarMem(Nodo p) {
  if (p != null) {
    liberarMem(p.sig);
    p.sig = null;
    p.ant = null;
  }
}

void liberarMem() {
  liberarMem(cab);
  cab = null;
}
`;
const LES_INI=`void insInicio(Nodo p) {
  if (p != null) {
    p.sig = cab;
    cab = p;
  }
}
`;
const LES_INTER=`void insInter(Nodo p, Nodo q) {
  if (q != null && p != null) {
    p.sig = q.sig;
    q.sig = p;
  }
}
`;
const LES_ELIM=`void elimInter(Nodo p, Nodo q) {
  if (p != null && q != null) {
    q.sig = p.sig;
    p.sig = null;
  }
}
`;
const LES_ELIMINI=`void elimInicio() {
  Nodo p;
  if (cab != null) {
    p = cab;
    cab = p.sig;
    p.sig = null;
  }
}
`;
const LES_LIB=`void liberarMem(Nodo p) {
  if (p != null) {
    liberarMem(p.sig);
    p.sig = null;
  }
}

void liberarMem() {
  liberarMem(cab);
  cab = null;
}
`;
const EX={
"LDE: insertar al inicio":E(LDE_INI,[],"p = new Nodo(7);\ninsInicio(p);"),
"LDE: insertar en medio (entre el 3 y el 4)":E(LDE_INI+"\n"+LDE_INTER,["q"],FIND("q",3)+"p = new Nodo(7);\ninsInter(p, q);"),
"LDE: recorrido hacia adelante y hacia atrás":E(LDE_INI,[],"p = cab;\nwhile (p.sig != null) {\n  // procesar(p);\n  p = p.sig;\n}\nwhile (p != null) {\n  // procesar(p);\n  p = p.ant;\n}"),
"LDE: eliminar nodo intermedio (el 4)":E(LDE_INI+"\n"+LDE_ELIM,[],FIND("p",4)+"elimInter(p);"),
"LDE: eliminar nodo final (el 6)":E(LDE_INI+"\n"+LDE_ELIM,[],FIND("p",6)+"elimInter(p);"),
"LDE: eliminar nodo inicial":E(LDE_INI+"\n"+LDE_ELIMINI,[],"elimInicio();"),
"LDE: liberar memoria (recursivo)":E(LDE_INI+"\n"+LDE_LIB,[],"liberarMem();"),
"LES: insertar al inicio":E(LES_INI,[],"p = new Nodo(7);\ninsInicio(p);"),
"LES: insertar en medio (entre el 3 y el 4)":E(LES_INI+"\n"+LES_INTER,["q"],FIND("q",3)+"p = new Nodo(7);\ninsInter(p, q);"),
"LES: recorrido":E(LES_INI,[],"p = cab;\nwhile (p != null) {\n  // procesar(p);\n  p = p.sig;\n}"),
"LES: eliminar nodo intermedio (el 4)":E(LES_INI+"\n"+LES_ELIM,["q"],FIND("q",3)+"p = q.sig;\nelimInter(p, q);"),
"LES: eliminar nodo inicial":E(LES_INI+"\n"+LES_ELIMINI,[],"elimInicio();"),
"LES: liberar memoria (recursivo)":E(LES_INI+"\n"+LES_LIB,[],"liberarMem();")
};
const $=i=>document.getElementById(i);
