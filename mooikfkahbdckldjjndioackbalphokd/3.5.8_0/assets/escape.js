!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var r in n)("object"==typeof exports?exports:e)[r]=n[r]}}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/assets/",n(n.s=393)}({150:function(e,t,n){"use strict";function r(e){return e.replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&#39;/gi,"'")}function i(e){var t=0,n=-1,r=e,i="",s="",u="",o=!1,a=!1;do{if(t=e.indexOf(" "),(n=e.indexOf(" ",t+1))>=0)for(;"'"!=e.charAt(n-1)&&'"'!=e.charAt(n-1)&&!((n=e.indexOf(" ",n+1))<0););if(t>=0&&n>=0)i=e.substring(t+1,n),r=e.substring(0,t+1),e=e.substring(n);else{if(!(t>=0&&n<0)){o?u+=">":u=e,a=!0;break}i=e.substring(t+1,e.length-1),r=e.substring(0,t+1),e=""}o=!0;var c=i.indexOf("=");if("'"==i.charAt(c+1)&&-1!=i.indexOf("'")){var g=i.indexOf("'"),l=i.lastIndexOf("'");s=i.substring(g+1,l),i=i.substring(0,g+1),i+=(s=f(s))+"'"}if('"'==i.charAt(c+1)&&-1!=i.indexOf('"')){var b=i.indexOf('"'),d=i.lastIndexOf('"');s=i.substring(b+1,d),i=i.substring(0,b+1),i+=(s=f(s))+'"'}u+=r+i}while(!a);return u}function s(e){return e.replace(/[&"'<>]/g,function(e){return{"&":"&amp;",'"':"&quot;","'":"&#39;","<":"&lt;",">":"&gt;"}[e]})}function u(e,t,n){switch(n){case 1:return e+(t+"&amp;");case 2:return e+(t+"&quot;");case 3:return e+(t+"&#39;");case 4:return e+(t+"&lt;");case 5:return e+(t+"&gt;");default:return e}}function f(e){for(var t=-1,n="",r="",i=0,f=void 0,o=!0;o;)f=0,-1!=(t=e.indexOf("&",t+1))?("&amp;"==e.substring(t,t+5)?(f=1,r=e.substring(0,t),e=e.substring(t+5)):"&quot;"==e.substring(t,t+6)?(f=2,r=e.substring(0,t),e=e.substring(t+6)):"&#39;"==e.substring(t,t+5)?(f=3,r=e.substring(0,t),e=e.substring(t+5)):"&lt;"==e.substring(t,t+4)?(f=4,r=e.substring(0,t),e=e.substring(t+4)):"&gt;"==e.substring(t,t+4)&&(f=5,r=e.substring(0,t),e=e.substring(t+4)),0!=f&&(t=-1,n=u(n,r=s(r),f),i=1)):(n+=e,o=!1);return 0==i?s(e):n}function o(e){for(var t=e.indexOf("<"),n=e.indexOf(">"),r="",s="",u="",o=0,a=!0;a;){if(!(t>=0)){f(e),a=!1;break}if(!(n>=0)){f(e),a=!1;break}do{t+=o,r=e.substring(0,t),o=(s=e.substring(t,n+1)).lastIndexOf("<")}while(0!=o);s=i(s),e=e.substring(n+1),u+=f(r)+s,t=e.indexOf("<"),n=0;do{n=e.indexOf(">",n+1)}while(n<t&&-1!=n)}return""!=e&&(u+=f(e)),u}Object.defineProperty(t,"__esModule",{value:!0}),t.unescapeHtml=r,t.escapeHTML=o,window.unescapeHtml=r,window.escapeHTML=o},393:function(e,t,n){e.exports=n(150)}})});
//# sourceMappingURL=escape.js.map