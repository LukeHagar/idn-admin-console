import{s as B,f as c,g as i,h as _,d,j as n,i as T,z as C,l as L,a as w,m as M,c as b,S as F,A as s}from"../chunks/scheduler.10bc074a.js";import{e as G}from"../chunks/each.ac7da970.js";import{S as J,i as K}from"../chunks/index.7b3d626a.js";import{r as N}from"../chunks/reports.b2ca66e3.js";function O(m,a,e){const o=m.slice();return o[0]=a[e],o}function Q(m,a){let e,o,h,u,t=a[0].name+"",l,r,p,v,V="Summary",D,x,g,H=a[0].description+"",I,A,E,S;return{key:m,first:null,c(){e=c("a"),o=c("header"),h=c("div"),u=c("div"),l=L(t),r=w(),p=c("div"),v=c("h3"),v.textContent=V,D=w(),x=c("article"),g=c("p"),I=L(H),A=w(),E=c("hr"),S=w(),this.h()},l(y){e=i(y,"A",{class:!0,"data-sveltekit-preload-data":!0,href:!0});var f=_(e);o=i(f,"HEADER",{});var R=_(o);h=i(R,"DIV",{class:!0});var j=_(h);u=i(j,"DIV",{class:!0});var P=_(u);l=M(P,t),P.forEach(d),j.forEach(d),R.forEach(d),r=b(f),p=i(f,"DIV",{class:!0});var k=_(p);v=i(k,"H3",{class:!0,"data-toc-ignore":!0,"data-svelte-h":!0}),F(v)!=="svelte-6huxvk"&&(v.textContent=V),D=b(k),x=i(k,"ARTICLE",{});var q=_(x);g=i(q,"P",{});var z=_(g);I=M(z,H),z.forEach(d),q.forEach(d),k.forEach(d),A=b(f),E=i(f,"HR",{class:!0}),S=b(f),f.forEach(d),this.h()},h(){n(u,"class","text font-bold text-white uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[24px]"),n(h,"class","w-full aspect-[21/9] relative bg-[#526bf8] overflow-hidden"),n(v,"class","h3"),n(v,"data-toc-ignore",""),n(p,"class","p-4 space-y-4"),n(E,"class","opacity-50"),n(e,"class","card card-hover overflow-hidden w-modal-slim"),n(e,"data-sveltekit-preload-data","hover"),n(e,"href",a[0].url),this.first=e},m(y,f){T(y,e,f),s(e,o),s(o,h),s(h,u),s(u,l),s(e,r),s(e,p),s(p,v),s(p,D),s(p,x),s(x,g),s(g,I),s(e,A),s(e,E),s(e,S)},p:C,d(y){y&&d(e)}}}function U(m){let a,e=[],o=new Map,h=G(N);const u=t=>t[0].url;for(let t=0;t<h.length;t+=1){let l=O(m,h,t),r=u(l);o.set(r,e[t]=Q(r,l))}return{c(){a=c("div");for(let t=0;t<e.length;t+=1)e[t].c();this.h()},l(t){a=i(t,"DIV",{class:!0});var l=_(a);for(let r=0;r<e.length;r+=1)e[r].l(l);l.forEach(d),this.h()},h(){n(a,"class","flex flex-row flex-wrap gap-4 p-4 justify-center")},m(t,l){T(t,a,l);for(let r=0;r<e.length;r+=1)e[r]&&e[r].m(a,null)},p:C,i:C,o:C,d(t){t&&d(a);for(let l=0;l<e.length;l+=1)e[l].d()}}}class $ extends J{constructor(a){super(),K(this,a,null,U,B,{})}}export{$ as component};