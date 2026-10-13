# Nuestro pequeño universo — Spec de diseño

Fecha: 2026-10-13
Estado: pendiente de revisión por Nacho

## 1. Propósito

Web de cumpleaños para Larita, que cumple 21 el 17/10/2026. La abre desde su
celular mediante un link. Es una experiencia interactiva de cinco escenas:
caja de regalo, historia con fotos, quiz de pareja, cartitas y carta final
nocturna con un mensaje de cierre.

Éxito significa que:

- Larita puede recorrer las cinco escenas de principio a fin en su celular
  sin trabas, errores ni contenido de relleno a la vista.
- Todo el contenido personal sale de `contenido-personal.txt` y de las fotos
  entregadas. No hay anécdotas, fechas ni datos inventados.
- Nacho puede cambiar cualquier texto, foto o pregunta editando un solo
  archivo.
- Se cumplen los 17 criterios de aceptación de `prompt.txt` (sección 17).

Fuentes: `prompt.txt` (requisitos) y `contenido-personal.txt` (contenido).
Si se contradicen, vale lo decidido en esta spec.

## 2. Decisiones tomadas en el brainstorming

| Tema | Decisión |
|---|---|
| Arquitectura | Máquina de escenas: una página, una escena visible por vez |
| Quiz | Mixto: 3 preguntas de dato real y 2 de humor; 4 opciones; sin puntaje |
| Regalo final | Solo un mensaje corto firmado por Nacho, con confeti |
| Música | Preparada pero sin archivo; el botón no se muestra hasta configurarla |
| Fechas de las fotos | Sin fecha (no se proporcionaron) |
| Persistencia | Ninguna: al recargar, vuelve a la caja |
| Despliegue | Lo hace Nacho; el proyecto queda listo para Vercel |

## 3. Stack

- Next.js (última versión estable) con App Router y TypeScript.
- Tailwind CSS, más CSS propio donde mejore el resultado.
- Framer Motion para animaciones. Lucide React para iconos.
- `next/font` para las tipografías (se sirven desde el propio sitio): una
  serif para títulos, una sans para textos y controles, una manuscrita para
  notas cortas.
- Vitest para tests de lógica.
- Sin backend, base de datos, autenticación, analítica ni APIs externas.
- Sin librerías de confeti o partículas: se hacen con SVG y Framer Motion.

## 4. Arquitectura

### 4.1 Estado central

`src/state/experience.ts` exporta el reducer, el estado inicial y los tipos.
No depende de React ni de la UI.

```ts
type SceneId = "intro" | "memories" | "quiz" | "notes" | "final";

interface ExperienceState {
  scene: SceneId;
  maxReached: SceneId;                 // escena más avanzada alcanzada
  quizAnswers: Record<string, string>; // id de pregunta -> id de opción
  openedNotes: string[];               // ids de cartitas abiertas
  giftRevealed: boolean;
}

type ExperienceAction =
  | { type: "next" }
  | { type: "back" }
  | { type: "answerQuiz"; questionId: string; optionId: string }
  | { type: "openNote"; noteId: string }
  | { type: "revealGift" }
  | { type: "restart" };
```

Reglas:

- `next` avanza una escena y actualiza `maxReached`. En `final` no hace nada.
- `back` retrocede una escena. En `intro` no hace nada.
- `answerQuiz` guarda la primera respuesta de cada pregunta; no se puede
  cambiar después.
- `openNote` es idempotente.
- `restart` vuelve al estado inicial completo.
- El estado vive en memoria. No se usa `localStorage`.

Qué habilita el botón de continuar es responsabilidad de cada escena, no del
reducer: la caja abierta (escena 1), el final del álbum (2), el resultado del
quiz (3), las ocho cartitas abiertas (4).

### 4.2 Estructura de archivos

```
src/
  app/
    layout.tsx          fuentes, metadatos, noindex
    page.tsx            monta BirthdayExperience
    globals.css         tokens de color, textura de papel, reduced-motion
  components/
    experience/
      BirthdayExperience.tsx   useReducer + AnimatePresence entre escenas
      IntroScene.tsx
      MemoriesScene.tsx
      CoupleQuizScene.tsx
      LoveNotesScene.tsx
      FinalLetterScene.tsx
    ui/
      SceneShell.tsx           marco común: fondo, áreas seguras, volver/continuar
      GiftBox.tsx
      Polaroid.tsx
      PhotoModal.tsx
      Envelope.tsx
      StarryHeart.tsx
      ProgressIndicator.tsx
      MusicToggle.tsx
      Confetti.tsx
      Doodles.tsx              garabatos SVG decorativos
  config/
    birthday.ts
  lib/
    daysTogether.ts
  state/
    experience.ts
  types/
    birthday.ts
public/
  images/memories/   foto-01.jpg ... foto-09.jpg (ya existen)
  images/final/      foto-favorita.jpg (ya existe)
  audio/             vacía, con un .gitkeep
```

Cada escena recibe por props el trozo de estado que necesita y el `dispatch`.
Ningún componente contiene textos personales: todos leen de `birthday.ts`.

### 4.3 Navegación

- Cabecera fija y discreta: cinco puntos de progreso a la izquierda y el
  botón de música a la derecha (solo si hay música configurada).
- Botón "Volver" desde la escena 2 en adelante.
- Botón de continuar en cada escena, visible solo cuando corresponde.
- "Volver a ver" al final ejecuta `restart`.
- Al cambiar de escena, el scroll vuelve arriba y el foco pasa al título de
  la escena nueva.
- El botón "atrás" del navegador no se intercepta.

## 5. Contenido: `src/config/birthday.ts`

Un único objeto tipado por `BirthdayConfig` (`src/types/birthday.ts`).

```ts
interface BirthdayConfig {
  people: { from: string; to: string };
  age?: number;
  birthday: string;            // "17/10"
  relationshipStart?: string;  // ISO: "2023-07-16"
  intro: { lines: string[]; hint: string; cta: string };
  memories: { intro: string; continueLabel: string; photos: MemoryPhoto[] };
  quiz: { title: string; questions: QuizQuestion[]; result: string; continueLabel: string };
  notes: { title: string; items: LoveNote[]; unlockedText: string; continueLabel: string };
  final: {
    intro: string;
    favoritePhoto?: Photo;
    letter: string[];          // un elemento por párrafo
    closing: string;
    giftButton: string;
    giftMessage: { text: string; signature: string };
    restartLabel: string;
  };
  music?: { src: string; title?: string };
}

interface Photo { src: string; alt: string; width: number; height: number }
interface MemoryPhoto extends Photo { caption: string; date?: string; description?: string }
interface QuizOption { id: string; label: string; reaction?: string }
interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId?: string;    // ausente en preguntas de humor
  correctReaction?: string;    // al acertar
  missReaction?: string;       // al no acertar; cariñosa, muestra la correcta
}
interface LoveNote { id: string; title: string; message: string }
```

### 5.1 Criterio de corrección de textos

Se corrigen solo tildes y errores de tipeo evidentes. No se cambian palabras,
orden ni registro ("iconic", "primer foto", "te lo mereces" quedan igual).

### 5.2 Datos básicos

- De: Nacho Iuzzo (firma corta: "Nacho"). Para: Larita. Edad: 21.
- Cumpleaños: 17/10. Inicio de la relación: 16/07/2023.

### 5.3 Fotos de recuerdos (en este orden)

| # | Archivo | Tamaño | Epígrafe |
|---|---|---|---|
| 1 | foto-01.jpg | 960×1280 | La primer foto iconic de Larita y Nacho Iuzzo |
| 2 | foto-02.jpg | 768×1024 | Super mirada |
| 3 | foto-03.jpg | 900×1600 | Año nuevo con la más linda del mundo mundial |
| 4 | foto-04.jpg | 720×1280 | Un poquito de vitamina C con mi novia en el río |
| 5 | foto-05.jpg | 1080×1920 | Re bandidos con mi novia |
| 6 | foto-06.jpg | 1600×900 | Super fogata especial para mi novia |
| 7 | foto-07.jpg | 1600×900 | Larita la más barrabrava |
| 8 | foto-08.jpg | 1200×1600 | Larita y Nacho Iuzzo siendo los más iconics del mundo |
| 9 | foto-09.jpg | 1600×1200 | Re concierto de Ángela Torres y la vida rosa |

Son 6 verticales y 3 horizontales (06, 07 y 09). En las fotos 04 a 09 el
texto venía en la línea del título de `contenido-personal.txt` y se usa como
epígrafe. Los tamaños se confirman leyendo cada archivo al implementar. Los
textos alternativos describen la foto de forma neutra (por ejemplo, "Larita y
Nacho en una cancha de fútbol") sin agregar datos que no estén a la vista.

Foto favorita: `images/final/foto-favorita.jpg` (1200×1600).

### 5.4 Quiz

| # | Pregunta | Opciones (correcta en negrita) |
|---|---|---|
| 1 | ¿Qué día empezó nuestro pequeño universo? | **16/07/2023**, 17/10/2023, 16/06/2023, 07/06/2023 |
| 2 | ¿A quién fuimos a ver en ese re concierto? | **Ángela Torres**, Emilia, Tini, Nicki Nicole |
| 3 | En la foto de los re bandidos, ¿quién es Luigi? | **Larita**, Nacho, Los dos, Ninguno |
| 4 | ¿Quién es la más linda del mundo mundial? | Larita / Obvio que Larita / La novia de Nacho / Todas las anteriores |
| 5 | ¿Quién ama más a quién? | Yo / Vos / Empate técnico / Esto no se discute |

- Preguntas 1 a 3: tienen `correctOptionId`, `correctReaction` y
  `missReaction`. Nacho confirmó que Larita es Luigi.
- Preguntas 4 y 5: sin `correctOptionId`; cada opción trae su `reaction`.
- Las reacciones son frases cortas, cariñosas y graciosas que no afirman
  hechos nuevos sobre la pareja. Se redactan al implementar y quedan
  editables en la config.
- Resultado final fijo, independiente de las respuestas: "Resultado oficial:
  sos la novia más iconic del mundo."

### 5.5 Cartitas

Ocho notas. Los títulos de los sobres son neutros y numerados ("Razón n.º 1"
a "Razón n.º 8"). Mensajes:

1. Amo a mi novia porque siempre lo da todo por mejorar
2. Amo a mi novia porque es la más buena del mundo
3. Amo a mi novia porque es la más trabajadora y estudiosa del mundo
4. Amo a mi novia porque siempre me demuestra todo su amor de la manera más linda
5. Amo a mi novia porque es la más tierna y chiquita del mundo
6. Amo a mi novia porque es la más enojoncita y me encanta su carita de enojada
7. Amo a mi novia porque siempre nos reímos juntos
8. Amo a mi novia porque lo es todo para mí

Detalle desbloqueable: una nota extra con los días que llevan juntos,
calculados desde `relationshipStart` hasta el momento en que se muestra
("Llevamos N días juntos, y contando."). Si `relationshipStart` no está
configurado, la nota muestra solo un corazón y el botón de continuar.

### 5.6 Carta final

Texto original con seis correcciones (mas→más dos veces, dias→días,
ojala→ojalá, asi→así, infito→infinito), dividido en cuatro párrafos por sus
puntos:

> Felices 21 a mi novia, espero que pases el día más lindo y que disfrutes
> mucho, te lo mereces más que nadie por todo lo que sos y todo lo que haces
> día a día.
>
> Me encanta pasar los días con mi novia y poder acompañarte otra vez en tu
> cumpleaños sabiendo que es un día tan especial para vos, ojalá sea así
> siempre.
>
> Gracias por siempre querer ser mejor y preocuparte por nosotros para que
> seamos mejores juntos.
>
> Sos la más linda y buena del mundo, te amo infinito.

Cierre: "Feliz cumpleaños, mi amor. ♡"

Mensaje final (tras "¿Abrimos tu último regalito?"):

> Gracias por dejarme acompañarte un cumpleaños más. Te amo infinito.
> — Nacho

## 6. Dirección visual

Paleta base (se ajustan tonos solo si hace falta para el contraste):

| Token | Valor | Uso |
|---|---|---|
| crema | #FFF5F2 | Fondo general |
| rosa pastel | #F8DCE6 | Superficies secundarias |
| rosa intenso | #EBA8C0 | Acentos, botones |
| lavanda | #C9B8E8 | Acentos, detalles |
| ciruela | #57394D | Texto, contornos |
| blanco | #FFFFFF | Polaroids, tarjetas |
| noche | violeta oscuro derivado del ciruela | Fondo de la escena 5 |

Estilo: scrapbook contemporáneo. Textura de papel sutil, polaroids con sombra
suave, cinta de papel, garabatos SVG escasos. Sin glassmorphism, sin glow
generalizado, a lo sumo un degradado por escena. Nada se mueve en bucle salvo
el titilar de unas pocas estrellas en la escena 5.

## 7. Escenas

### 7.1 Intro: la caja

- Ocupa el viewport. Dos líneas de texto arriba, caja al centro, pista
  "Tocá la caja" abajo.
- `GiftBox` es SVG en capas (base, tapa, moño) dentro de un `<button>` con
  etiqueta accesible.
- Al activarla: el moño se desata y cae, la tapa salta y rota hacia atrás, la
  caja rebota una vez y salen unas 12 partículas que se desvanecen. Después
  aparece "Descubrir mi regalo", que despacha `next`.
- La caja se abre una sola vez; al volver a esta escena ya aparece abierta.

### 7.2 Memories: nuestra historia

- Introducción y detalle "desde el 16/07/2023" (solo si hay fecha).
- Scroll vertical con las polaroids en orden. Alternan lado; rotación de
  0° a 3° según un patrón fijo (no aleatorio, para evitar diferencias entre
  servidor y cliente). Horizontales a ancho completo, verticales más
  angostas. Cada foto conserva su proporción real.
- Cada polaroid entra con un fundido y un desplazamiento corto al entrar en
  pantalla, una sola vez.
- Epígrafe en manuscrita debajo de cada foto.
- Cada polaroid es un `<button>` que abre `PhotoModal`: foto completa dentro
  del viewport, epígrafe, anterior/siguiente, cierre con botón, toque en el
  fondo o Escape, foco atrapado y devuelto al cerrar.
- En escritorio: dos columnas desfasadas con ancho máximo.
- Al final, botón para ir al quiz.

### 7.3 Quiz

- Una pregunta por pantalla sobre una tarjeta tipo ficha, barra de progreso
  y cuatro botones de al menos 48 px de alto.
- Al elegir: se marca la opción, se bloquean las demás, aparece la reacción
  con un rebote breve y unas pocas estrellas, y se habilita "Siguiente".
- En preguntas con respuesta correcta, si no acierta se resalta la correcta
  junto a la `missReaction`. Sin puntaje, sin colores de error.
- Tras la última: pantalla de resultado y botón de continuar.
- Si vuelve a la escena, ve el resultado directamente.

### 7.4 Notes: cartitas

- Ocho sobres sobre un fondo de corcho claro, en grilla de 2 columnas en
  celular y 4 en escritorio, con rotaciones leves fijas y sin superponerse.
- Cada sobre es un `<button>`. Al tocarlo se abre la solapa y sale la nota
  con el mensaje. Queda abierto mientras dure la sesión.
- Contador manuscrito: "te quedan N por abrir" / "¡las abriste todas!".
- Con las ocho abiertas aparece el detalle de días juntos y el botón de
  continuar.

### 7.5 Final: la carta

Secuencia automática al entrar, de unos 6 a 8 segundos:

1. El fondo pasa de crema a noche.
2. Aparecen unas 40 estrellas en posiciones fijas; unas 6 titilan.
3. `StarryHeart` enciende sus puntos uno por uno.
4. Aparece el texto introductorio y la foto favorita como polaroid.
5. Se despliega la carta en papel crema, serif, con sus párrafos.
6. Cierre "Feliz cumpleaños, mi amor. ♡" y botón "¿Abrimos tu último
   regalito?".

Al tocar el botón: `revealGift`, confeti breve (unas 40 piezas, una sola
vez) y la tarjeta con el mensaje final y "Volver a ver". Si vuelve a esta
escena, la secuencia no se repite y todo aparece ya revelado.

## 8. Música

- `MusicToggle` se renderiza solo si `config.music` existe.
- Nunca reproduce sola. Un `<audio>` con `preload="none"` y `loop`.
- El botón alterna reproducir y pausar, con `aria-pressed` e icono según
  estado.
- Si `play()` rechaza o el archivo da error, vuelve a "pausado" y muestra un
  aviso breve. No afecta a la navegación.

## 9. Movimiento reducido y accesibilidad

- Con `prefers-reduced-motion`: solo fundidos. Sin rebotes, partículas,
  confeti ni titileo; la secuencia final muestra cada paso con un fundido.
- HTML semántico, un `<h1>`/`<h2>` por escena, todos los controles son
  `<button>` reales con foco visible.
- Contraste AA para texto, también sobre el fondo noche.
- Nada depende de hover. Áreas táctiles de al menos 44×44 px.
- Áreas seguras con `env(safe-area-inset-*)`. Sin scroll horizontal.

## 10. Manejo de errores

| Situación | Comportamiento |
|---|---|
| Falta o falla una foto | `Polaroid` muestra un marcador con la ruta esperada; el álbum y el modal siguen funcionando |
| Falta la foto favorita | La escena final omite ese paso |
| Falla el audio | Estado "pausado" y aviso breve |
| Sin música configurada | No hay botón |
| Campo opcional vacío | El elemento no se dibuja |
| Recarga | Vuelve a la caja |

## 11. Rendimiento

- `next/image` con `width`/`height` reales y `sizes` adecuados. Prioridad
  solo para las dos primeras fotos; el resto, carga diferida.
- Solo la escena actual está montada.
- Animaciones sobre `transform` y `opacity`.
- Página estática (sin funciones de servidor).

## 12. Verificación

Tests con Vitest:

- Reducer: `next`/`back` en los extremos, `maxReached`, respuesta única por
  pregunta, `openNote` idempotente, `restart`.
- Config: cada `src` de foto existe en `public/`; entre 4 y 5 preguntas, cada
  una con 2 a 4 opciones y reacción para todos los casos;
  `correctOptionId` apunta a una opción existente; 8 cartitas; carta no vacía.
- `daysTogether`: fechas conocidas y fecha de inicio ausente.

Manual, antes de entregar:

- `lint`, chequeo de TypeScript y `build` sin errores.
- Recorrido completo de las cinco escenas en el navegador a 390×844 y en
  escritorio, con la consola abierta.
- Prueba con una foto renombrada, con movimiento reducido activado y solo
  con teclado.
- Informe de los 17 criterios de `prompt.txt`, cada uno como verificado o no
  verificado.

No se puede probar desde este entorno un celular real: Nacho debe abrirla en
su teléfono antes de compartirla.

## 13. Despliegue y README

- Listo para Vercel sin configuración adicional. El deploy lo hace Nacho.
- `robots: noindex` en los metadatos.
- README en español: cómo ejecutarla, dónde cambiar textos y preguntas, dónde
  van fotos y música, cómo editar la carta y el mensaje final, cómo
  publicarla en Vercel.

## 14. Fuera de alcance

- Guardar progreso entre visitas.
- Contraseña o protección del link.
- Sonidos por interacción.
- Cualquier servicio externo.
