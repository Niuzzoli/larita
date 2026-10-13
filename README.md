# Nuestro pequeño universo

Web de cumpleaños para Larita: una caja de regalo, un álbum de fotos, un quiz,
ocho cartitas y una carta final.

## Cómo ejecutarla

Necesitás Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. Para verla como en un celular, usá las herramientas
de desarrollo del navegador (F12) y elegí un dispositivo móvil.

## Dónde se cambia cada cosa

Todo el contenido está en **`src/config/birthday.ts`**. No hace falta tocar
ningún otro archivo.

| Quiero cambiar... | Buscá en `birthday.ts` |
|---|---|
| Los textos de la caja | `intro` |
| Las fotos y sus epígrafes | `memories.photos` |
| Las preguntas del quiz | `quiz.questions` |
| Las cartitas | `notes.items` |
| La carta final | `final.letter` (un texto entre comillas por párrafo) |
| El mensaje del último regalito | `final.giftMessage` |
| La foto favorita | `final.favoritePhoto` |
| La música | `music` (al final del archivo) |

Después de editar, corré `npm test`: avisa si falta una foto, si una pregunta
quedó sin reacción o si la carta quedó vacía.

### Fotos

- Recuerdos: `public/images/memories/`
- Foto final: `public/images/final/`

Para cambiar una foto, reemplazá el archivo con el mismo nombre. Si la nueva
tiene otro tamaño, actualizá `width` y `height` en `birthday.ts` (en Windows:
clic derecho sobre el archivo, Propiedades, Detalles).

Para agregar una foto, copiala a `public/images/memories/` y sumá un bloque a
`memories.photos`, en el orden en que querés que aparezca:

```ts
{
  src: "/images/memories/foto-10.jpg",
  width: 1200,
  height: 1600,
  caption: "El texto manuscrito que va debajo",
  alt: "Descripción corta de lo que se ve en la foto",
},
```

Si un archivo falta, la web no se rompe: muestra un marcador con la ruta donde
hay que ponerlo.

### Quiz

Hay dos tipos de pregunta:

- **Con respuesta correcta:** lleva `correctOptionId`, `correctReaction` (si
  acierta) y `missReaction` (si no acierta).
- **De humor, todas valen:** no lleva `correctOptionId`, y cada opción tiene
  su propia `reaction`.

Tienen que ser entre 4 y 5 preguntas, con 2 a 4 opciones cada una.

### Música

1. Copiá la canción a `public/audio/` (por ejemplo `nuestra-cancion.mp3`).
2. En `birthday.ts`, descomentá la línea `music` y poné el nombre del archivo.

La música nunca empieza sola: aparece un botón arriba a la derecha para
activarla. Usá solo un archivo que tengas derecho a publicar.

## Antes de compartirla

```bash
npm test
npm run lint
npm run build
```

Los tres tienen que terminar sin errores. Después abrila en tu propio celular
y recorrela completa una vez.

## Publicarla en Vercel

**Opción A, desde GitHub:**

1. Creá un repositorio **privado** en GitHub (tiene fotos personales) y subí
   el proyecto.
2. En https://vercel.com, "Add New" → "Project" e importá el repositorio.
3. Dejá la configuración por defecto y tocá "Deploy".

**Opción B, desde la terminal:**

```bash
npx vercel          # crea una versión de prueba
npx vercel --prod   # publica la definitiva
```

Vercel te da un link. Cualquiera que lo tenga puede abrir la web, así que
compartilo solo con ella. La página pide a los buscadores que no la indexen.
