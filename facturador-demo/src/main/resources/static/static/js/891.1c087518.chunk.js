"use strict";(self.webpackChunkfacturador_masmas=self.webpackChunkfacturador_masmas||[]).push([[891],{8919:function(e,t,r){r.r(t),r.d(t,{default:function(){return f}});var n=r(885),a=r(2791),s=r(3504),o=r(7115),i=r(4112),c=r(6344),u=r(7692),l=r(7428),d=r(184);function f(){var e=(0,a.useState)(""),t=(0,n.Z)(e,2),r=t[0],f=t[1],m=(0,a.useState)(""),x=(0,n.Z)(m,2),b=x[0],j=x[1],g=(0,a.useState)(""),Z=(0,n.Z)(g,2),p=Z[0],h=Z[1],v=(0,a.useState)(!1),y=(0,n.Z)(v,2),S=y[0],k=y[1];function w(e,t){if(!e)return h(t);h("")}return(0,d.jsxs)(c.l0,{onSubmit:function(){(i.Z.names(r)||i.Z.email(r))&&i.Z.password(b)?(k(!0),(0,o.Z)(r,b,w)):h("Usuario o contrase\xf1a incorrecta")},title:"Iniciar sesi\xf3n",children:[(0,d.jsx)(c.gN,{icon:(0,d.jsx)(u.EDj,{}),label:"Nombre o correo electr\xf3nico",bind:[r,f]}),(0,d.jsx)(c.gN,{icon:(0,d.jsx)(u.XTK,{}),label:"Contrase\xf1a",type:"password",bind:[b,j]}),(0,d.jsx)(c.v0,{type:"error",message:p}),S?(0,d.jsx)(l.gb,{}):(0,d.jsx)(c.zx,{type:"submit",text:"Ingresar"}),(0,d.jsx)("a",{href:"about:blank",target:"_blank",className:"link",style:{textDecoration:"none"},children:"Olvid\xe9 mi contrase\xf1a"}),(0,d.jsxs)("p",{style:{textAlign:"center",cursor:"default"},children:["\xbfNo tienes una cuenta? ",(0,d.jsx)(s.rU,{to:"registrarse",style:{textDecoration:"none"},children:"Crea una nueva"})]})]})}},7115:function(e,t,r){r.d(t,{Z:function(){return s}});var n=r(9245),a=r(1803);function s(e,t,r){(0,n.Z)("POST","auth/login",{body:JSON.stringify({usernameOrEmail:e.trim(),password:t.trim()})},(function(e,t){if(200===e)return localStorage.clear(),(0,a.Z)(t),r(!0),void window.location.reload();if(404===e)return void r(!1,"Usuario o contrase\xf1a incorrecta");r(!1,t)}))}}}]);
//# sourceMappingURL=891.1c087518.chunk.js.map