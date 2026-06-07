import { pdfImage } from './pdfImages';

export type StepRef = {
  /** id del fundamento (clave de FUNDAMENTOS_DETAILS) */
  to: string;
  /** etiqueta corta que aparece en el chip */
  label: string;
};

export type ProcedureStep =
  | string
  | {
      text: string;
      image?: string;
      caption?: string;
      refs?: StepRef[];
    };

export type Procedure = {
  id: string;
  title: string;
  category: 'Robot' | 'Soldadura' | 'Mantenimiento';
  summary: string;
  steps: ProcedureStep[];
  notes?: string[];
  source?: string;
  /** Imagen de portada del procedimiento (visión general). */
  cover?: { src: string; caption?: string };
};

export const PROCEDURES: Procedure[] = [
  {
    id: 'encendido',
    title: 'Encendido del robot',
    category: 'Robot',
    summary:
      'Procedimiento de encendido del controlador Serie E y activación de la alimentación a los motores.',
    steps: [
      'Comprobar que las setas de emergencia están desbloqueadas y que la zona del robot está despejada.',
      'Encender el interruptor principal del armario del controlador.',
      'Esperar al arranque completo del sistema y a que el TP (teach pendant) muestre la pantalla de operación.',
      'Activar la alimentación a los motores: pulsar el botón MOTOR ON / ENABLE en el armario o en el TP.',
      'Verificar que no hay errores activos en pantalla. Si los hay, anotarlos en el diario y consultar la sección Códigos de error.',
    ],
    notes: [
      'Si tras encender no se activa la alimentación a motores, revisar circuito de emergencia (setas, valla, puerta de seguridad).',
    ],
    source: 'Manual de operaciones Serie E, §3.1',
  },
  {
    id: 'apagado',
    title: 'Apagado del robot',
    category: 'Robot',
    summary: 'Procedimiento ordenado de apagado del sistema.',
    steps: [
      'Llevar el robot a la posición de HOME desde el programa o en manual.',
      'Pasar el modo a TEACH.',
      'Desactivar la alimentación a los motores (MOTOR OFF).',
      'Apagar el interruptor principal del armario.',
      'Cerrar la llave de gas de protección y desconectar la alimentación del EWM si procede.',
    ],
    source: 'Manual de operaciones Serie E, §3.2',
  },
  {
    id: 'parada-emergencia',
    title: 'Parada de emergencia y recuperación',
    category: 'Robot',
    summary: 'Cómo actuar tras una parada de emergencia.',
    steps: [
      'Pulsar la seta de emergencia más cercana. El robot se detiene inmediatamente.',
      'Identificar la causa de la parada antes de rearmar.',
      'Cuando la zona sea segura: desbloquear la seta girándola.',
      'En el TP confirmar la alarma de emergencia (reset/clear).',
      'Reactivar la alimentación de motores (MOTOR ON).',
      'Comprobar la posición del robot antes de continuar el programa; si hay duda, llevar a HOME en CHECK.',
    ],
    notes: ['Anotar cada parada de emergencia en el diario indicando causa y solución.'],
    source: 'Manual de operaciones Serie E, §3.3',
  },
  {
    id: 'wire-check',
    title: 'Wire check (comprobación de hilo)',
    category: 'Soldadura',
    summary:
      'Asegura que el hilo sobresale del tubo de contacto una distancia fija. El robot lo lleva contra una pieza conductora, hace contacto y ajusta el largo del hilo. Útil antes de soldar o antes de un touch sensing.',
    cover: {
      src: pdfImage('wire_check', 3),
      caption:
        'Esquema del PDF original: punto A (aproximación), punto B (contacto con la pieza) y punto C (salida).',
    },
    steps: [
      {
        text:
          'Configurar las velocidades de hilo del wire check en el menú AUX 14.Arc Weld → 04.Arc Weld Setting → 10.TouchSensing. Ajustar "Retract Speed" (velocidad de retracción del hilo) y "Inching speed" (velocidad de salida del hilo durante la búsqueda).',
        image: pdfImage('wire_check', 2),
        caption:
          'Pantalla del teach pendant con los dos parámetros: Retract Speed (1 %) y Inching speed (8 %) como valores de ejemplo.',
        refs: [{ to: 'teach-pendant', label: 'Menú AUX en el TP' }],
      },
      {
        text:
          'Crear un programa nuevo. Todos los puntos llevarán la instrucción AC (Air Cut, movimiento sin soldar). La interpolación de cada punto se elige aparte (JOINT para acercarse, LINEAR cuando interese trayectoria recta).',
        image: pdfImage('wire_check', 3),
        caption:
          'Ejemplo: HOME (AC JOINT) → Punto A (AC JOINT) → recorrido (AC LINEAR) → Punto B con opción Wire Check → Punto C (AC LINEAR) → HOME (AC JOINT).',
        refs: [
          { to: 'instrucciones-punto', label: 'Instrucción AC' },
          { to: 'interpolaciones', label: 'JOINT / LINEAR' },
        ],
      },
      {
        text:
          'Grabar el punto de HOME (posición de reposo segura). Mismo punto al inicio y al final del programa.',
        refs: [
          { to: 'home', label: 'Qué es HOME' },
          { to: 'grabar-punto', label: 'Cómo grabar un punto' },
        ],
      },
      {
        text:
          'Grabar el punto A: posición de aproximación. Desde A el robot llegará a B y, llegado B, retraerá el hilo a la velocidad "Retract Speed" para luego volver a sacarlo a "Inching speed" buscando contacto.',
        refs: [{ to: 'grabar-punto', label: 'Cómo grabar un punto' }],
      },
      {
        text:
          'Grabar el punto B: posición exacta donde el extremo del hilo debe tocar la mesa (o referencia conductora) cuando esté con el largo deseado. La distancia de B a la mesa fija el largo final del hilo después del check.',
        refs: [{ to: 'grabar-punto', label: 'Cómo grabar un punto' }],
      },
      {
        text:
          'En la línea del punto B añadir la opción Touch Sensing → 3.Wire check. Para ello, con el cursor en la línea de B pulsar el botón "+" del TP, elegir "Touch Sensing", y dentro "3.Wire check".',
        image: pdfImage('wire_check', 4),
        caption:
          'En el TP: tecla "+" para añadir opción auxiliar al punto. Aparece la lista de Touch Sensing y se elige opción 3 (Wire check). En la línea de auxiliares del punto queda marcada "Wire Check".',
        refs: [
          { to: 'teach-pendant', label: 'Tecla "+" del TP' },
          { to: 'touch-sensing-wire-check', label: 'Touch sensing vs wire check' },
        ],
      },
      {
        text:
          'Grabar el punto C: posición de salida tras el wire check, alejado de la pieza para evitar colisiones al volver a HOME.',
        refs: [
          { to: 'home', label: 'Qué es HOME' },
          { to: 'grabar-punto', label: 'Cómo grabar un punto' },
        ],
      },
      {
        text:
          'Cerrar el programa volviendo al punto de HOME. Probar el programa en modo CHECK a velocidad baja antes de lanzarlo en automático.',
        refs: [
          { to: 'home', label: 'Qué es HOME' },
          { to: 'teach-pendant', label: 'Modo CHECK' },
        ],
      },
    ],
    notes: [
      'AC (Air Cut) significa que ese punto no enciende el arco: el robot solo se mueve. Está explicado en Instrucciones fundamentales → Instrucciones del punto.',
      'La precisión del wire check depende de que la pieza/mesa sea conductora y de la calibración del extremo del hilo.',
    ],
    source: 'wire_check.pdf (LARRAIOZ Elektronika)',
  },
  {
    id: 'touch-sensing',
    title: 'Touch sensing (detección de pieza)',
    category: 'Soldadura',
    summary:
      'Detecta la posición real de la pieza tocándola con el hilo y corrige las desviaciones de los puntos posteriores. Permite hasta 3 patrones (Mother, Daughter, Niña).',
    cover: {
      src: pdfImage('touch_sensing', 3),
      caption:
        'Los 7 patrones de búsqueda y el esquema de combinación madre / hija / niña (Touch_sensing.pdf §1.2).',
    },
    steps: [
      {
        text:
          'Configurar distancia y velocidad de detección en AUX 14.Arc Weld → 04.Arc Weld Setting → 10.Touch Sensing. "Distance" es el recorrido máximo que el hilo buscará antes de declarar fallo; "Speed" es la velocidad de aproximación. Ejemplo del manual: 20 mm a 8 % (Mother) + 20 mm a 8 % (Daughter) → recorrido total ~40 mm a velocidad 8.',
        image: pdfImage('touch_sensing', 2),
        caption:
          'Pantalla AUX 14 → 04 → 10 Touch Sensing: parámetros Distance y Speed, y esquema del recorrido de búsqueda del hilo (Touch_sensing.pdf §1.1).',
        refs: [
          { to: 'teach-pendant', label: 'Menú AUX en el TP' },
          { to: 'touch-sensing-wire-check', label: 'Touch sensing vs wire check' },
        ],
      },
      {
        text:
          'Elegir patrones según la desviación esperada. Hay 7 patrones; los más usados: patrón 1 (desviación en una sola dirección, p. ej. eje Z), patrón 7 (desviación en traslación + orientación sobre una superficie). Se pueden combinar hasta tres patrones a la vez en una misma pieza: madre, hija y niña.',
        image: pdfImage('touch_sensing', 3),
        caption:
          'Catálogo de los 7 patrones disponibles y ejemplo de combinación de tres patrones simultáneos (madre/hija/niña).',
      },
      {
        text:
          'Estudiar el reparto de patrones para la pieza. Ejemplo del manual: patrón 1 como madre (corrige desviación vertical de la pieza) y patrón 7 como hija (corrige traslación + orientación sobre la superficie horizontal).',
        image: pdfImage('touch_sensing', 4),
        caption:
          'Esquema del patrón 1 (un toque, desviación en una dirección) y del patrón 7 (cuatro toques: A1+B1, A2+B2, A3+B3 — traslación + orientación).',
      },
      {
        text:
          'Crear un programa nuevo. Todos los puntos de detección llevan la instrucción AC (Air Cut, sin soldar). El programa tiene la estructura: HOME → A1 Work Reset Mother → B1 Work Modify Mother → salida → A1 Work Modify Daughter → B1 Daughter → A2 Daughter → B2 Daughter → A3 Daughter → B3 Daughter → HOME.',
        image: pdfImage('touch_sensing', 5),
        caption:
          'Programa Block-teaching completo y los dos esquemas de puntos: vista lateral con A1/B1 del patrón 1 (madre) y vista cenital con A1..A3/B1..B3 del patrón 7 (hija).',
        refs: [
          { to: 'instrucciones-punto', label: 'Instrucción AC' },
          { to: 'grabar-punto', label: 'Cómo grabar un punto' },
        ],
      },
      {
        text:
          'Punto 11: HOME (posición segura, AC JOINT). Punto 12: A1 Work Reset → Mother (el "Reset Mother" borra cualquier corrección anterior y prepara la búsqueda). Punto 13: B1 Work Modify → Mother → Pattern 1, tocando la pieza con el hilo en el sentido del eje a corregir.',
        image: pdfImage('touch_sensing', 6),
        caption:
          'Pasos 11-13 del programa: HOME, A1 con opción Work Reset → Mother y B1 con opción Work Modify → Mother → Pattern 1 (Touch_sensing.pdf §1.3).',
        refs: [
          { to: 'home', label: 'Qué es HOME' },
          { to: 'touch-sensing-wire-check', label: 'Mother / Daughter / Niña' },
        ],
      },
      {
        text:
          'Punto 14: salida del patrón 1, evitando colisión con la pieza. Importante: entre A1 y B1 no se debe variar la coordenada del eje en el que NO se corrige (Z en este ejemplo) — A1 y B1 deben quedar a la misma altura sobre la pieza.',
        image: pdfImage('touch_sensing', 7),
        caption:
          'Punto 14 (salida del patrón 1) y comienzo del patrón 7 con A1 Work Modify → Daughter → Pattern 7 (Touch_sensing.pdf §1.3).',
      },
      {
        text:
          'Patrón 7 (Daughter): repetir A/B tres veces. Punto 15: A1 Work Modify → Daughter → Pattern 7. Punto 16: B1 Daughter. Punto 17: salida intermedia. Puntos 18-19: A2/B2 Daughter. Punto 20: salida. Puntos 21-22: A3/B3 Daughter. El ángulo deseado en A3 es 90° respecto a las superficies tocadas (admisible 30°–150°).',
        image: pdfImage('touch_sensing', 7),
        caption:
          'Secuencia A2/B2 y A3/B3 del patrón 7 (Daughter). Cada par mide una dirección distinta de la superficie.',
      },
      {
        text:
          'Cerrar el programa volviendo a HOME. A partir del punto B3 todos los puntos que se graben después se corregirán automáticamente al mover la pieza. Probar el programa en modo CHECK a velocidad baja antes de ejecutar en automático.',
        refs: [
          { to: 'home', label: 'Qué es HOME' },
          { to: 'teach-pendant', label: 'Modo CHECK' },
        ],
      },
    ],
    notes: [
      'Work Reset → Mother resetea también las correcciones Daughter y Niña.',
      'El ángulo deseado en A3 es 90° respecto a la superficie tocada (rango admisible 30°-150°).',
      'AC, Mother/Daughter/Niña y los patrones están explicados en Instrucciones fundamentales.',
    ],
    source: 'Touch_sensing.pdf (LARRAIOZ Elektronika)',
  },
  {
    id: 'weaving',
    title: 'Añadir weaving (oscilación) a un cordón',
    category: 'Soldadura',
    summary:
      'Convierte un cordón recto en oscilante para ensancharlo, repartir mejor el calor o rellenar un chaflán. Se hace eligiendo Anchura, Frecuencia y Patrón en los datos auxiliares de los puntos WC y WE.',
    cover: {
      src: pdfImage('arc_welding', 216),
      caption:
        'Direcciones del weaving (vertical / lateral / horizontal) y anchura WV (Arc Welding §10.2).',
    },
    steps: [
      {
        text:
          'Punto de partida: programa con un cordón ya enseñado (WS al inicio, uno o más WC intermedios y un WE final). Si todavía no tienes el cordón, primero hazlo recto y luego vuelve a este procedimiento — el weaving se añade sobre un cordón que ya funciona.',
        refs: [
          { to: 'instrucciones-punto', label: 'WS / WC / WE' },
          { to: 'interpolaciones', label: 'Interpolación (normalmente LINEAR)' },
        ],
      },
      {
        text:
          'Decide los tres parámetros antes de tocar el TP. Anchura WV (mm): cuánto abre el zigzag. Frecuencia (Hz): ondas por segundo (a más frecuencia, ondas más juntas). Patrón (PN): la forma de la oscilación. Para un cordón corriente de relleno, un buen punto de partida es PN = 1 (armónico simple con parada en ambos extremos), WV 2-4 mm y 1-2 Hz, pero conviene afinar con probetas.',
        refs: [{ to: 'weaving', label: 'Qué significa cada parámetro' }],
      },
      {
        text:
          'Mira la lista de patrones estándar del controlador y elige uno. Vienen seis cargados de fábrica: Standard (armónico simple), PN=1 (armónico con paradas), PN=2 (triangular), PN=3 (triangular recíproco), PN=4 (circular CW), PN=5 (circular CCW). Los PN 6 a 10 están vacíos — son los huecos para los patrones personalizados de la opción especial.',
        image: pdfImage('arc_welding', 213),
        caption:
          'Tabla de los seis patrones estándar de weaving registrados en el robot (Arc Welding §10.1.1).',
      },
      {
        text:
          'En el TP, abre el programa y pon el cursor en el primer punto WC del cordón. El weaving se mete en datos auxiliares de WC y WE — el WS (inicio de soldadura) no acepta datos de weaving, la oscilación arranca desde el primer WC.',
        image: pdfImage('arc_welding', 56),
        caption:
          'Apartado §5.5.12: los datos de weaving (Width, Frequency, Pattern N.º) están disponibles para WC y WE, no para WS.',
        refs: [{ to: 'teach-pendant', label: 'Mover el cursor en el TP' }],
      },
      {
        text:
          'Con el cursor en el WC, navega por la fila de datos auxiliares con las flechas / hasta llegar a "Weaving data" (datos de desplazamiento lateral). Pulsa ENTER para abrir la pantalla de configuración.',
        refs: [{ to: 'teach-pendant', label: 'Teclas del TP' }],
      },
      {
        text:
          'Introduce los tres valores: Weaving pattern N.º (el PN que elegiste — 1, 2, 3, 4, 5 o "Standard"), Weaving width (anchura en mm), Weaving frequency (frecuencia en Hz). Confirma con ENTER. La fila de auxiliares del WC queda marcada con el dato de weaving.',
      },
      {
        text:
          'Repite el dato en cada WC adicional del cordón y también en el WE de cierre. Atajo útil: si los siguientes WC y el WE llevan el mismo weaving, normalmente el controlador hereda el dato del WC anterior — verifica que sí en tu programa, si no, repítelo manualmente. El cambio de dato en un WC posterior se aplica desde ese punto hasta el siguiente cambio.',
      },
      {
        text:
          'Prueba en CHECK con la soldadura desactivada. Por defecto el robot recorre la línea base sin oscilar y muestra "Weaving OFF" en pantalla — esto es a propósito, así verificas trayectoria sin esperar al zigzag.',
        image: pdfImage('arc_welding', 78),
        caption:
          'Indicador "Weaving OFF" en pantalla durante CHECK con soldadura deshabilitada (Arc Welding §6.2).',
        refs: [{ to: 'teach-pendant', label: 'Modo CHECK' }],
      },
      {
        text:
          'Si quieres ver también la oscilación en CHECK (para validar que la anchura cabe sin chocar con la pieza/utillaje), cambia Aux. 140409 → "Weaving Motion at Weld Off" a Enable (Habilitar). Recuerda volver a dejarlo como lo tenías al terminar la prueba.',
      },
      {
        text:
          'Solda una probeta del mismo material y espesor. Mide la anchura real del cordón, observa la penetración en los extremos y revisa que no haya mordeduras en los laterales. Si hace falta, ajusta: más anchura → cordón más ancho; más frecuencia → ondas más cerradas; cambio de patrón → distinto reparto del calor (p. ej. triangular concentra más en el centro que armónico).',
      },
    ],
    notes: [
      'El weaving se introduce en WC y WE; el WS no acepta datos de weaving.',
      'Patrones PN=6..10 requieren la opción "Special Pattern Weaving" (Aux 1404-11). Tiene procedimiento aparte.',
      'Para soldadura de chapa fina, mejor empezar sin weaving y añadir solo si el cordón es estrecho o irregular: oscilar mete más calor.',
    ],
    source: 'Arc Welding Operation Manual (Serie E), §5.5.12, §6.2 y §10.',
  },
  {
    id: 'weaving-3f-3g',
    title: 'Weaving triangular para 3F y 3G ascendente (GMAW, acero, hilo Ø1,0)',
    category: 'Soldadura',
    summary:
      'Configuración del weaving en patrón triangular (PN=2) para soldar acero al carbono en posición vertical ascendente, tanto en cordón en ángulo (3F) como a tope con chaflán en V (3G). Hilo macizo G3Si1 / ER70S-6 de Ø1,0 mm con gas M21 (Ar + 18% CO₂). El triángulo es el patrón clásico de "árbol de Navidad" para vertical ascendente: distribuye el calor, funde los cantos del chaflán y deja que la gravedad consolide el baño sin descolgarlo.',
    cover: {
      src: pdfImage('arc_welding', 213),
      caption:
        'Tabla de patrones estándar de weaving del controlador (Arc Welding §10.1.1). PN = 2 es el triangular.',
    },
    steps: [
      {
        text:
          'Identifica bien la posición. Nomenclatura: 3F (AWS A3.0) = PF en ISO 6947 — cordón en ángulo (fillet) vertical ascendente, unión en T o L. 3G (AWS) = PF (ISO) para a tope con chaflán — chapas alineadas con preparación en V, soldadura ascendente. En ambas el cordón sube; lo que cambia es la geometría de la unión y, por tanto, los parámetros del weaving.',
      },
      {
        text:
          'Verifica el material y la preparación. Caso de partida: acero al carbono S235/S275, 10 mm de espesor. Para 3F: unión en T o L, sin preparación, garganta a = 6-8 mm en 1-2 pasadas. Para 3G: preparación en V 60°, talón 1-2 mm, separación de raíz 2-3 mm, tres pasadas (raíz + relleno + peinado). Consumibles para ambos: hilo macizo G3Si1 (equivalente ER70S-6) de Ø1,0 mm y gas M21 (Ar + 18 % CO₂).',
      },
      {
        text:
          'Elige el patrón triangular: PN = 2 en la tabla del controlador. Es el clásico zigzag con vértices arriba/abajo que va avanzando. Para vertical ascendente es la opción de partida estándar — concentra el calor en los laterales (al hacer pausa breve en los vértices) y consolida el centro al volver a pasar. Si tras pruebas el cordón pide más fusión simétrica en los cantos, se puede probar PN = 3 (triangular recíproco).',
        image: pdfImage('arc_welding', 213),
        caption:
          'Patrón PN=2 (Triangular) entre los seis patrones de fábrica (Arc Welding §10.1.1).',
        refs: [{ to: 'weaving', label: 'Qué es PN, WV y frecuencia' }],
      },
      {
        text:
          'Parámetros recomendados para 3F ascendente (cordón en ángulo, 1 pasada o raíz + cap). Pasada única / raíz: Patrón PN=2 · Anchura WV 4-6 mm · Frecuencia 1,0-1,5 Hz · Vel. hilo 5,5-6,5 m/min · U-corr −1 a 0 V · Vel. avance 8-12 cm/min · Modo pulsado · Stick-out 10-12 mm · Antorcha a 45° entre chapas, push 5-10°. Si haces segunda pasada (peinado para a ≥ 8 mm): aumentar WV a 6-8 mm y bajar frecuencia a 0,8-1,2 Hz, manteniendo el resto.',
        refs: [
          { to: 'instrucciones-punto', label: 'WS / WC / WE' },
          { to: 'job-ewm', label: 'Programa del JOB en el EWM' },
        ],
      },
      {
        text:
          'Parámetros recomendados para 3G ascendente (a tope V 60°, tres pasadas). 1) RAÍZ sin weaving: Vel. hilo 4,0-4,5 m/min · U-corr 0 V · Vel. avance ~10 cm/min · Modo short-arc o pulsado bajo · Stick-out 10-12 mm. Cordón recto, sin oscilar, para asegurar penetración en la separación de raíz. 2) RELLENO con weaving triangular: Patrón PN=2 · WV 8-10 mm · Frecuencia 0,8-1,2 Hz · Vel. hilo 6,0-7,0 m/min · U-corr −1 V · Vel. avance 6-9 cm/min · Modo pulsado. 3) PEINADO (cap) con triángulo más ancho para cubrir cantos: PN=2 · WV 10-14 mm (sobrepasar 1-2 mm cada borde del chaflán) · Frecuencia 0,7-1,0 Hz · Vel. hilo 6,5-7,5 m/min · Vel. avance 5-7 cm/min · Modo pulsado.',
        refs: [
          { to: 'instrucciones-punto', label: 'WS / WC / WE por pasada' },
          { to: 'job-ewm', label: 'Programas P1/P2/P3 del JOB' },
        ],
      },
      {
        text:
          'Configura el weaving en el TP. Con el cursor en el WC del cordón, abre "Weaving data" en los datos auxiliares e introduce los tres valores (PN=2, WV, frecuencia) según el caso. Repite en cada WC y en el WE de cierre. Si tu JOB del EWM tiene programas separados para raíz/relleno/peinado (recomendado en 3G), cada WS llama a su programa y el weaving se introduce sobre los WC/WE de esa pasada. El procedimiento completo de configuración paso a paso está en "Añadir weaving (oscilación) a un cordón".',
        refs: [
          { to: 'weaving', label: 'Procedimiento general de weaving' },
          { to: 'teach-pendant', label: 'Mover cursor en el TP' },
        ],
      },
      {
        text:
          'Prueba siempre en probeta antes de la pieza real. Solda una probeta del mismo material, espesor, posición y preparación. Mide: penetración (rotura o macro), garganta efectiva (3F), perfil del cordón sin mordeduras laterales (3G), ausencia de descuelgues en el centro. Si descuelga: bajar WV o subir frecuencia o subir velocidad de avance. Si los cantos no funden: subir WV o bajar frecuencia o subir corriente (más WFS). Si hay mordedura lateral: bajar U-corr o bajar WV.',
        refs: [{ to: 'teach-pendant', label: 'Modo CHECK para validar trayectoria' }],
      },
      {
        text:
          'Calificación del procedimiento (WPS/WPQR). Estos valores son punto de partida orientativo, no un WPS calificado. Para trabajos sujetos a norma (presión, estructural, ferroviario, etc.) el procedimiento debe calificarse por ensayo según EN ISO 15614-1 (o ASME IX) con probeta, ensayos destructivos y emisión del WPQR. Una vez calificado se redacta el WPS definitivo y se ciñe a sus rangos.',
      },
    ],
    notes: [
      'Vertical ascendente con triángulo: la regla de oro es ir despacio. La vel. de avance baja (5-12 cm/min según pasada) es lo que permite que el baño se solidifique antes de descolgar.',
      'Si el resultado con PN=2 no satisface tras varias probetas, considerar crear un patrón personalizado por Aux 1404-11 (opción "Special Pattern Weaving"). Procedimiento detallado en "Crear patrón especial de weaving (Aux 1404-11)".',
      'Pulsado vs short-arc: para vertical ascendente, pulsado da menos calor por unidad de longitud y mejor control del baño. En raíz, short-arc también vale por su penetración corta y controlada.',
      'Recuerda: los valores tabulados asumen probeta limpia, sin pintura ni cascarilla. Una unión sucia exige más calor (mayor WFS) y arruina el cordón.',
    ],
    source:
      'Arc Welding Operation Manual (Serie E) §5.5.12, §6.2, §10. Posiciones según AWS A3.0 / ISO 6947. Parámetros orientativos basados en práctica habitual GMAW con G3Si1 Ø1,0 + M21; calificación final por ensayo según EN ISO 15614-1.',
  },
  {
    id: 'weaving-especial',
    title: 'Crear patrón especial de weaving (Aux 1404-11) — modificar tiempos y paradas en vértices',
    category: 'Soldadura',
    summary:
      'Cuando los seis patrones de fábrica (Standard, PN=1..5) no dan la forma o el reparto de calor que la unión necesita, se crea un patrón especial en una de las posiciones libres PN=6..10. A diferencia de los estándar, en el patrón especial tú defines punto a punto cuánto % del ciclo dura cada tramo, dónde el soplete se queda parado (placa horizontal, placa vertical o centro) y cuánto sube/baja la corriente o la tensión en cada instante. Es la herramienta que pide una unión a tope en vertical ascendente: triángulo con paradas medidas en los flancos del chaflán para fundir bien los cantos y caída controlada hacia el centro para que el baño no descuelgue. Requiere la opción "Special Pattern Weaving" instalada (Aux 1404-11).',
    cover: {
      src: pdfImage('arc_welding', 219),
      caption:
        'Patrón triangular estándar PN=2: movimiento + relación temporal en un ciclo (Arc Welding §10.2). El patrón especial te permite redibujar esta misma figura cambiando los porcentajes de tiempo y añadiendo paradas.',
    },
    steps: [
      {
        text:
          'Entiende la diferencia con los estándar antes de empezar. En PN=1..5 solo eliges anchura (WV), frecuencia (Hz) y número de patrón — la forma del ciclo está fijada por el robot. En el patrón especial defines hasta 15 puntos por ciclo y, para cada punto, asignas un "tiempo (%)" entre 0 y 100 que indica en qué instante del ciclo el soplete debe estar en esa posición. La diferencia entre dos tiempos consecutivos es lo que dura ese tramo. Así puedes hacer que un lado tarde más que otro, o que el soplete se quede parado en el vértice para meter más calor.',
        image: pdfImage('arc_welding', 220),
        caption:
          'PN=3 estándar (triangular recíproco con parada en ambos extremos y centro). La idea de "parar en el vértice" ya está en los estándar; con el patrón especial decides tú el % de parada (Arc Welding §10.2).',
        refs: [{ to: 'weaving', label: 'Recordar qué es PN, WV y frecuencia' }],
      },
      {
        text:
          'Comprueba que tienes la opción instalada. Mira en Aux 0207 (Function setting) si aparece "Special Pattern Weaving". Si no, el menú Aux 1404-11 no existirá y los PN del 6 al 10 seguirán marcados como "No registrado" en la tabla de patrones. La opción se compra a Kawasaki y se activa con clave; si no la tienes, el resto del procedimiento es académico.',
        image: pdfImage('arc_welding', 213),
        caption:
          'Tabla de patrones registrados en el robot. Los PN 6 a 10 figuran como "No registrado" — son los huecos que rellena el patrón especial (Arc Welding §10.1.1).',
      },
      {
        text:
          'Aprende el sistema de coordenadas del weaving especial: X = dirección horizontal del soplete (avance del cordón, hacia delante/atrás), Y = dirección lateral (perpendicular al cordón, lo que define la anchura), Z = dirección vertical (arriba/abajo del soplete). Además puedes inclinar el soplete: ángulo de péndulo (giro alrededor de la punta) hasta ±10°, con negativo hacia la placa vertical. Cada valor punto a punto se da como % de la amplitud total: ±100 % es el máximo en esa dirección, 0 % es la línea base del cordón.',
        image: pdfImage('arc_welding', 227),
        caption:
          'Sistema de coordenadas del patrón especial: X horizontal, Y lateral, Z vertical y rotación del ángulo del soplete (Arc Welding §10.4.1).',
      },
      {
        text:
          'Sigue el diagrama de flujo de creación (5 pasos): (1) dibujar el ciclo de movimiento deseado, (2) elegir el origen de aprendizaje y la anchura, (3) crear los diagramas de expansión por direcciones (X, Y, Z), (4) rellenar la hoja de puntos con tiempo y porcentajes, (5) cargar los datos en el robot por Aux 1404-11. Aplica los cinco pasos antes de tocar el TP — los errores se detectan en papel mucho más rápido que en máquina.',
        image: pdfImage('arc_welding', 230),
        caption:
          'Diagrama de flujo para crear un patrón especial (Arc Welding §10.4.2). Hay hoja en blanco en el Apéndice 3 del manual para fotocopiar.',
      },
      {
        text:
          'Paso 1 — Dibujar el ciclo. En papel, dibuja un solo ciclo del movimiento de la punta del soplete tal y como lo quieres ver desde encima. Si quieres que la oscilación empiece y termine en el mismo sitio (lo normal), el primer y el último punto deben tener amplitud 0 en todas las direcciones — así el ciclo cierra y se repite limpio. Máximo 15 puntos. Para un triangular con paradas, 4-6 puntos suelen bastar.',
      },
      {
        text:
          'Paso 2 — Origen de aprendizaje y anchura. El origen de aprendizaje es el punto del TP donde se inscribe el patrón (normalmente el WC del cordón); ahí la amplitud vale 0. La anchura del weaving se establece por defecto a 90° respecto al eje del soplete, pero en una junta a tope puedes alinearla con la dirección de la ranura (caso 2) — esto es lo que necesitas para que el soplete recorra los flancos del chaflán y no la chapa plana.',
        image: pdfImage('arc_welding', 234),
        caption:
          'Caso 2 del manual — junta a tope con chaflán en V (talón 4 mm, separación de raíz 4 mm) con soplete inclinado a 22,5°. La anchura del weaving se alinea con la ranura, no con la horizontal (Arc Welding §10.4.2).',
      },
      {
        text:
          'Paso 3 — Diagrama de expansión por direcciones. Para cada dirección (X horizontal, Y lateral, Z vertical) dibuja un gráfico tiempo-amplitud: en el eje horizontal el % del ciclo (0 a 100), en el vertical el % de amplitud (-100 a +100). En el caso 1 del manual (junta de redondeo, soldadura horizontal plana) el patrón triangular con parada en placas tiene 26 % de tiempo de parada en la placa horizontal y 26 % en la vertical — ahí ves cómo se grafica: tramos planos en el extremo (la parada) y tramos en rampa (el desplazamiento).',
        image: pdfImage('arc_welding', 233),
        caption:
          'Diagrama de expansión del Caso 1: anchura 6 mm, tiempo de parada 26 % en placa horizontal y 26 % en placa vertical. El soplete tarda 26 % del ciclo en cada flanco (Arc Welding §10.4.2).',
      },
      {
        text:
          'Paso 4 — Rellenar la hoja punto a punto. Para cada uno de los 15 puntos máximo, escribe: Tiempo (%) acumulado dentro del ciclo, X lat (%), Y lateral (%), Z vertical (%), Ángulo del soplete (°), aumento de corriente (%) y aumento de tensión (%). Los puntos van ordenados por tiempo creciente. La diferencia entre el "Tiempo" de un punto y el siguiente es la duración de ese tramo. Para una parada en un vértice, basta poner dos puntos consecutivos con la misma posición (X/Y/Z iguales) y dejar entre sus tiempos el % de parada que quieras: por ejemplo, punto 2 con tiempo 20 % y punto 3 con tiempo 30 % a la misma posición = parada del 10 % en ese extremo.',
        image: pdfImage('arc_welding', 235),
        caption:
          'Hoja de cumplimentación del Caso 2 (manual §10.4.2). Cinco puntos del ciclo: tiempos 12 / 38 / 50 / 62 / 88 %, con paradas implícitas en los extremos.',
      },
      {
        text:
          'Aumento de corriente y tensión en las paradas (opcional pero útil). En las columnas Corriente (%) y Tensión (%) puedes pedir que durante ese punto el EWM suba un % la salida — típicamente +20 % en los extremos del triangular, para meter calor extra y fundir bien el canto sin pasarse en el centro. Esta función obliga a configurar Aux 1413 "Special Pattern Weaving Boost Target Exempt" indicando qué señales de salida aumentan. Si no quieres tocar la corriente, deja esas columnas a 0.',
        image: pdfImage('arc_welding', 312),
        caption:
          'Apéndice 3 — Triangular con parada en ambos extremos y aumento de corriente del 20 % en los puntos 2-3 y 7-8 (las paradas). 9 puntos, 10 % de parada en cada placa (Arc Welding Apéndice 3).',
      },
      {
        text:
          'Paso 5 — Cargar en el robot por Aux 1404-11. En el TP: <AUX> → 1404 → 11 "Special Pattern Weaving". Elige el número de PN libre (6 a 10), introduce los puntos uno a uno con los valores de la hoja, y al final introduce los tiempos globales de parada en placa horizontal, placa vertical y centro (en %). Guarda. A partir de aquí el PN nuevo aparece en la lista junto a los estándar y se usa en los datos auxiliares del WC/WE exactamente igual que un PN de fábrica.',
        refs: [
          { to: 'weaving', label: 'Asignar el PN al WC/WE del cordón' },
          { to: 'teach-pendant', label: 'Acceso a Aux desde el TP' },
        ],
      },
      {
        text:
          'Aplicación a unión a tope vertical ascendente (3G / PF). Plantilla recomendada como punto de partida — chapa de 10 mm con preparación V 60°, separación raíz 3 mm, hilo G3Si1 Ø1,0, M21: PN=6 triangular con 6 puntos, anchura = ancho del chaflán + 2 mm, tiempo de parada 20-25 % en cada flanco (placa vertical y placa horizontal del chaflán), tiempo central rápido (5-10 %), aumento de corriente +15-20 % en los puntos de parada. Esto es la versión "a medida" del Apéndice 3 (p.306, triangular para ranura bisel único 22,5°). Calibrar con probetas y ajustar.',
        image: pdfImage('arc_welding', 306),
        caption:
          'Apéndice 3 — Patrón triangular horizontal para ranura con bisel único a 22,5°. 3 puntos del ciclo (tiempos 25 / 50 / 75 %), sin paradas: punto de partida que conviene modificar añadiendo paradas para 3G (Arc Welding Apéndice 3).',
        refs: [{ to: 'weaving-3f-3g', label: 'Caso aplicado 3F/3G con PN=2 estándar' }],
      },
      {
        text:
          'Aplicación a cordón en horizontal con paradas (referencia más simple para coger soltura). Para una junta de redondeo en horizontal plana, el patrón triangular con paradas 26 % / 26 % del Apéndice 3 (p.302) es el ejemplo "de libro": 4 puntos, anchura 6 mm, sin aumento de corriente. Sirve como banco de pruebas antes de meterse con un patrón vertical ascendente, que es mucho más sensible al tiempo de parada y al ángulo del soplete.',
        image: pdfImage('arc_welding', 302),
        caption:
          'Apéndice 3 — Triangular con parada en ambos extremos para junta de redondeo, horizontal plana. 4 puntos, tiempos 12 / 38 / 62 / 88 %, anchura 6 mm (Arc Welding Apéndice 3).',
      },
      {
        text:
          'Verifica antes de soldar. En CHECK con soldadura deshabilitada y Aux 140409 → Weaving Motion at Weld Off = Enable, recorre el cordón a velocidad lenta y observa que la trayectoria coincide con la figura que dibujaste, que la anchura cabe en la ranura y que las paradas se producen en los puntos correctos. Si el robot da E1123 "Speed error jtXX", es que pides demasiada anchura en demasiado poco tiempo: baja la frecuencia o reduce la anchura. Si el patrón no arranca, revisa que el origen de aprendizaje del primer punto tiene amplitud 0 — si no, el ciclo no cierra y el robot se queja.',
        refs: [{ to: 'weaving', label: 'Habilitar Weaving Motion at Weld Off' }],
      },
      {
        text:
          'Probeta y ajuste fino. Solda probeta con el mismo material, espesor, posición y preparación que la pieza real. Mide el cordón y revisa: si los flancos del chaflán no funden, sube el tiempo de parada en ese punto (de 20 % a 25 %) o sube el aumento de corriente (de +15 % a +20 %); si el centro descuelga, baja el tiempo en el punto central o sube la velocidad de avance; si el cordón sale asimétrico, revisa que los porcentajes en los puntos espejo (p. ej. 2 y 4 en un triángulo simétrico) son iguales con signo cambiado. Reitera hasta resultado válido antes de guardar el patrón como definitivo.',
      },
    ],
    notes: [
      'Requiere la opción "Special Pattern Weaving" instalada en el controlador. Si no la tienes, los PN 6..10 no existen.',
      'Máximo 15 puntos por ciclo. El primer y el último deben tener amplitud 0 en X/Y/Z para que el ciclo cierre y se repita limpio.',
      'Una parada se hace metiendo dos puntos consecutivos con la misma posición; el tiempo de parada es la diferencia entre sus % de tiempo.',
      'Para vertical ascendente el ángulo del soplete (péndulo, ±10°) es tan importante como el reparto de tiempos: dirige el calor hacia los cantos.',
      'Si vas a usar el aumento de corriente/tensión en los puntos, configura antes Aux 1413 "Special Pattern Weaving Boost Target Exempt".',
      'Calificación normativa: igual que con patrones estándar, una soldadura con patrón especial sujeta a norma (EN ISO 15614-1 o ASME IX) debe calificarse por ensayo. El patrón forma parte del WPS.',
    ],
    source:
      'Arc Welding Operation Manual (Serie E) §10.3, §10.4 y Apéndice 3 (ejemplos A-8 a A-19). Opción Aux 1404-11 Special Pattern Weaving.',
  },
  {
    id: 'cambio-hilo',
    title: 'Cambio de bobina de hilo',
    category: 'Mantenimiento',
    summary: 'Sustitución de la bobina cuando se agota o se cambia de material/diámetro.',
    steps: [
      'Parar el programa y poner el robot en TEACH.',
      'Cortar el hilo cerca de la antorcha y retirarlo desde la bobina con la función de retracción manual del EWM (jog hilo atrás).',
      'Abrir el cubículo de la bobina, soltar la tuerca/freno y retirar la bobina agotada.',
      'Montar la nueva bobina cuidando el sentido de giro correcto.',
      'Pasar el hilo por el sistema de arrastre asegurando que asienta en la garganta del rodillo correcto al diámetro/material.',
      'Ajustar la presión del rodillo (lo justo para arrastrar sin aplastar).',
      'Inchar hilo (jog adelante) hasta que salga por la boquilla.',
      'Cortar el hilo a la longitud habitual (stick-out) y comprobar wire check.',
    ],
    notes: [
      'Si cambia material o diámetro: actualizar JOB en el EWM y revisar parámetros.',
      'Limpiar los rodillos y soplar la sirga si hay polvo de cobre o cascarilla.',
    ],
  },
  {
    id: 'cambio-boquilla',
    title: 'Cambio de boquilla / tobera',
    category: 'Mantenimiento',
    summary: 'Sustitución de tubo de contacto, difusor y tobera cuando hay pegaduras o desgaste.',
    steps: [
      'Apagar la antorcha desde el TP y dejarla enfriar.',
      'Soltar la tobera (boquilla externa) tirando o roscando según modelo.',
      'Desenroscar el tubo de contacto (punta).',
      'Limpiar o sustituir el difusor de gas.',
      'Montar tubo de contacto nuevo del diámetro correcto para el hilo.',
      'Montar tobera nueva o limpia.',
      'Aplicar antiproyecciones a la tobera y el tubo de contacto.',
      'Comprobar wire check y disparar un cordón corto de prueba.',
    ],
    notes: [
      'No reutilizar tubos de contacto deformados: causan errores de arco y desviación de hilo.',
    ],
  },
];
