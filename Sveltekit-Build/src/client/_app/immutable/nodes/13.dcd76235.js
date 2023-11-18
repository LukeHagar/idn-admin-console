import{s as ve,f as i,a as S,g as d,h as f,S as ue,c as j,d as h,j as v,i as _e,A as t,z as ie,R as me,l as w,m as A,u as ge,n as V}from"../chunks/scheduler.10bc074a.js";import{e as de}from"../chunks/each.ac7da970.js";import{S as Te,i as be}from"../chunks/index.7b3d626a.js";import{g as Ee}from"../chunks/stores.dc566077.js";import"../chunks/ProgressBar.svelte_svelte_type_style_lang.ae9fcbec.js";const ye=async({fetch:a})=>({sources:(await a("/api/sailpoint/sources")).json()}),Me=Object.freeze(Object.defineProperty({__proto__:null,load:ye},Symbol.toStringTag,{value:"Module"}));function he(a,e,u){const n=a.slice();return n[4]=e[u],n}function fe(a){let e,u,n,_=a[4].name+"",T,b,c,p,s=a[4].description+"",r,g,l,m,y=a[4].type+"",D,$,C,M,B=a[4].authoritative?"True":"False",L,q,F,O,H=a[4].healthy?"True":"False",N,z,J,k,E,U,I,Y,x,Q="View",G,K,W;function pe(){return a[2](a[4])}return{c(){e=i("tr"),u=i("td"),n=i("p"),T=w(_),b=S(),c=i("td"),p=i("p"),r=w(s),g=S(),l=i("td"),m=i("p"),D=w(y),$=S(),C=i("td"),M=i("p"),L=w(B),q=S(),F=i("td"),O=i("p"),N=w(H),J=S(),k=i("td"),E=i("a"),U=w("Open"),Y=S(),x=i("button"),x.textContent=Q,G=S(),this.h()},l(P){e=d(P,"TR",{});var o=f(e);u=d(o,"TD",{});var X=f(u);n=d(X,"P",{class:!0});var Z=f(n);T=A(Z,_),Z.forEach(h),X.forEach(h),b=j(o),c=d(o,"TD",{});var ee=f(c);p=d(ee,"P",{class:!0});var te=f(p);r=A(te,s),te.forEach(h),ee.forEach(h),g=j(o),l=d(o,"TD",{});var ae=f(l);m=d(ae,"P",{class:!0});var le=f(m);D=A(le,y),le.forEach(h),ae.forEach(h),$=j(o),C=d(o,"TD",{});var se=f(C);M=d(se,"P",{class:!0});var re=f(M);L=A(re,B),re.forEach(h),se.forEach(h),q=j(o),F=d(o,"TD",{});var oe=f(F);O=d(oe,"P",{class:!0});var ne=f(O);N=A(ne,H),ne.forEach(h),oe.forEach(h),J=j(o),k=d(o,"TD",{class:!0});var R=f(k);E=d(R,"A",{href:!0,class:!0,"data-sveltekit-preload-data":!0});var ce=f(E);U=A(ce,"Open"),ce.forEach(h),Y=j(R),x=d(R,"BUTTON",{class:!0,"data-svelte-h":!0}),ue(x)!=="svelte-9ysj5b"&&(x.textContent=Q),R.forEach(h),G=j(o),o.forEach(h),this.h()},h(){v(n,"class","text-center"),v(p,"class","text-center"),v(m,"class","text-center"),v(M,"class","text-center"),v(O,"class",z="text-center font-bold "+(a[4].healthy?"text-green-500":"text-red-500")),v(E,"href",I=`/home/sources/${a[4].id}`),v(E,"class","btn variant-filled-primary text-white"),v(E,"data-sveltekit-preload-data","hover"),v(x,"class","btn variant-filled-primary text-white"),v(k,"class","flex flex-col justify-center gap-1")},m(P,o){_e(P,e,o),t(e,u),t(u,n),t(n,T),t(e,b),t(e,c),t(c,p),t(p,r),t(e,g),t(e,l),t(l,m),t(m,D),t(e,$),t(e,C),t(C,M),t(M,L),t(e,q),t(e,F),t(F,O),t(O,N),t(e,J),t(e,k),t(k,E),t(E,U),t(k,Y),t(k,x),t(e,G),K||(W=ge(x,"click",pe),K=!0)},p(P,o){a=P,o&1&&_!==(_=a[4].name+"")&&V(T,_),o&1&&s!==(s=a[4].description+"")&&V(r,s),o&1&&y!==(y=a[4].type+"")&&V(D,y),o&1&&B!==(B=a[4].authoritative?"True":"False")&&V(L,B),o&1&&H!==(H=a[4].healthy?"True":"False")&&V(N,H),o&1&&z!==(z="text-center font-bold "+(a[4].healthy?"text-green-500":"text-red-500"))&&v(O,"class",z),o&1&&I!==(I=`/home/sources/${a[4].id}`)&&v(E,"href",I)},d(P){P&&h(e),K=!1,W()}}}function De(a){let e,u,n,_,T="<th>Name</th> <th>Description</th> <th>Type</th> <th>Authoritative</th> <th>Healthy</th> <th></th>",b,c,p=de(a[0].sources),s=[];for(let r=0;r<p.length;r+=1)s[r]=fe(he(a,p,r));return{c(){e=i("div"),u=i("div"),n=i("table"),_=i("thead"),_.innerHTML=T,b=S(),c=i("tbody");for(let r=0;r<s.length;r+=1)s[r].c();this.h()},l(r){e=d(r,"DIV",{class:!0});var g=f(e);u=d(g,"DIV",{class:!0});var l=f(u);n=d(l,"TABLE",{class:!0});var m=f(n);_=d(m,"THEAD",{"data-svelte-h":!0}),ue(_)!=="svelte-g75gtt"&&(_.innerHTML=T),b=j(m),c=d(m,"TBODY",{});var y=f(c);for(let D=0;D<s.length;D+=1)s[D].l(y);y.forEach(h),m.forEach(h),l.forEach(h),g.forEach(h),this.h()},h(){v(n,"class","table"),v(u,"class","flex justify-center flex-col align-middle"),v(e,"class","p-4")},m(r,g){_e(r,e,g),t(e,u),t(u,n),t(n,_),t(n,b),t(n,c);for(let l=0;l<s.length;l+=1)s[l]&&s[l].m(c,null)},p(r,[g]){if(g&3){p=de(r[0].sources);let l;for(l=0;l<p.length;l+=1){const m=he(r,p,l);s[l]?s[l].p(m,g):(s[l]=fe(m),s[l].c(),s[l].m(c,null))}for(;l<s.length;l+=1)s[l].d(1);s.length=p.length}},i:ie,o:ie,d(r){r&&h(e),me(s,r)}}}function ke(a,e,u){const n=Ee();let{data:_}=e;console.log(_);function T(c){const p={type:"component",component:"codeBlockModal",meta:{code:JSON.stringify(c,null,4),language:"json"}};n.trigger(p)}const b=c=>T(c);return a.$$set=c=>{"data"in c&&u(0,_=c.data)},[_,T,b]}class we extends Te{constructor(e){super(),be(this,e,ke,De,ve,{data:0})}}export{we as component,Me as universal};