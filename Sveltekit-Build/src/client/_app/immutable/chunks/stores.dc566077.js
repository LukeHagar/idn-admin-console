import{w as a}from"./index.09b1afef.js";import{Q as s,r as l}from"./scheduler.10bc074a.js";const n="modalStore";function f(){const t=s(n);if(!t)throw new Error("modalStore is not initialized. Please ensure that `initializeStores()` is invoked in the root layout file of this app!");return t}function h(){const t=u();return l(n,t)}function u(){const{subscribe:t,set:r,update:o}=a([]);return{subscribe:t,set:r,update:o,trigger:e=>o(i=>(i.push(e),i)),close:()=>o(e=>(e.length>0&&e.shift(),e)),clear:()=>r([])}}export{f as g,h as i};