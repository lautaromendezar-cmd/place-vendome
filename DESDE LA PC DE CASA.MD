Repo: main está limpio y ya pusheado a github.com/lautaromendezar-cmd/place-vendome — nada pendiente de subir.
En la PC de la oficina: git clone https://github.com/lautaromendezar-cmd/place-vendome.git (o git pull si ya lo tenés clonado), luego npm install y npm run dev.
.env* está en .gitignore — como no hay ningún .env en este repo local, no hay variables de entorno que migrar. Si en algún momento agregás credenciales (Sanity, WhatsApp API, etc.) vas a tener que copiarlas manualmente a la otra PC, porque git no las va a llevar.
Pendientes activos (según lo último que quedó anotado): conectar WhatsApp real y los endpoints de los formularios — nada de eso está bloqueando el pull, es simplemente lo próximo a resolver.

