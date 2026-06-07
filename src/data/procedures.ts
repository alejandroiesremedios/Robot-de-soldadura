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
    id: 'job-ewm',
    title: 'Crear un programa dentro de un JOB (EWM)',
    category: 'Soldadura',
    summary:
      'Qué es un JOB del Titan XQ 350 Plus, qué es una curva sinérgica, y cómo guardar varios programas (P1..P15) dentro del mismo JOB para reutilizarlos desde el robot llamándolos por número.',
    steps: [
      'Entiende qué es un JOB. Un JOB es la "receta maestra" que fija el modo de soldadura y la curva sinérgica para una combinación concreta de material + gas + diámetro de hilo. Es como elegir un menú del día en un restaurante: cuando seleccionas un JOB, la fuente carga de golpe el modo de proceso (estándar, pulsado, forceArc, coldArc…), la curva sinérgica calibrada por EWM para esa combinación, los tiempos de pre-gas/post-gas, las rampas de arranque/cráter y las protecciones. Lo que SÍ cambia entre programas dentro del mismo JOB son los puntos de trabajo (WFS, corrección de tensión, dinámica, slope, gas). Lo que NO cambia es la curva sinérgica ni el modo de proceso.',
      'Entiende qué es una curva sinérgica. La fuente EWM tiene una tabla precalibrada en fábrica que relaciona la velocidad de hilo (WFS, m/min) con la corriente (A) y la tensión (V) óptimas para ese material + gas + diámetro. Al ser "sinérgica" significa que con un único mando (la velocidad de hilo) la fuente ya elige la corriente y la tensión que tocan; tú solo retocas con la corrección de tensión (U-corr ±) si quieres un arco más corto o más largo. Cada JOB lleva pegada la curva sinérgica de su combinación; por eso cambiar de acero a aluminio no es cambiar de programa sino de JOB.',
      'Localiza la familia de JOBs disponible en el Titan XQ 350 Plus. La memoria del Expert XQ 2.0 viene con familias preconfiguradas: acero al carbono SG2/SG3 con gas M21 (Ar+18%CO₂) en pulsado y estándar, inoxidable 308/316 con gas M12/M11, aluminio AlMg5/AlSi5 con Ar puro en pulsado, CuSi3/CuAl8 (brazing) con Ar, tubular FCAW rutilo/metálico con M21, y bloques de JOBs de usuario libres para que guardes tus propias recetas. Cada combinación ocupa varios números de JOB según el diámetro (Ø 0,8 / Ø 1,0 / Ø 1,2). Antes de crear programas, asegúrate de tener seleccionado el JOB correcto (material + gas + diámetro reales del puesto).',
      'Selecciona el JOB en la fuente. En el panel Expert XQ 2.0: pulsa el botón de selección de JOB y gira la rueda hasta el número del JOB de tu combinación (por ejemplo, JOB nº __ para acero SG2 + M21 + Ø 1,0 mm pulsado). Confirma. La pantalla muestra el JOB activo y la curva sinérgica cargada. A partir de aquí, todos los cambios que hagas se guardan dentro de ese JOB.',
      'Entiende la estructura de programas P0..P15 dentro del JOB. Cada JOB tiene 16 espacios: P0 es el modo MANUAL (los mandos físicos de la fuente fijan WFS y corrección de tensión en directo) y P1..P15 son recetas guardadas. Tú decides cuántas usas: para un acero en PB+PF con cuatro pasadas distintas, puedes usar P1=PB raíz, P2=PB relleno, P3=PF raíz, P4=PF relleno y dejar P5..P15 libres. El robot llamará al programa que necesite por número desde el dato auxiliar del WS de cada cordón.',
      'Crea el primer programa P1. Con el JOB activo, entra al modo Expert (botón Expert XQ 2.0) y selecciona el espacio de programa P1. Ajusta los parámetros que diferencian esta receta del resto: velocidad de hilo (WFS, m/min) para el punto de trabajo deseado, corrección de tensión (U-corr, ±V) para acortar o alargar el arco respecto a la curva sinérgica, dinámica (kick del arco), slope de arranque/cráter si la pieza lo pide, modo de gas. La curva sinérgica del JOB no se toca — solo te mueves sobre ella con WFS y U-corr.',
      'Guarda P1 dentro del JOB. Sigue la secuencia "Save program" del menú Expert (la concreta la indica el panel; suele ser pulsar Save → seleccionar nº de programa → confirmar). Verifica que la pantalla refleja "P1 guardado" y que al recargar P1 los valores son los que acabas de introducir.',
      'Repite para P2, P3, P4… cada uno con su receta. Ejemplo para una unión a tope acero en posición PB+PF: P1 = PB raíz (WFS 7,5 m/min, U-corr 0 V), P2 = PB relleno (WFS 9,5 m/min, U-corr +1 V), P3 = PF raíz (WFS 4,5 m/min, U-corr −1 V, dinámica baja para no descolgar), P4 = PF relleno (WFS 6,0 m/min, U-corr 0 V). Los espacios P5..P15 quedan libres para añadir capa de peinado, otras posiciones o variantes del mismo JOB.',
      'Llama el programa desde el robot. En el TP del Kawasaki, dentro del estado/condición de soldadura que vas a usar en el WS del cordón, configura el campo "JOB" con el número del JOB activo y el campo "Programa" con P1, P2, P3 o P4 según la pasada. La fuente recibe ese par (JOB nº + Pnº) por la interfaz robot↔EWM cuando el robot ejecuta el WS, y entrega exactamente los parámetros que guardaste en ese programa.',
      'Verifica en banco antes de soldar la pieza real. Con probeta del mismo material, espesor y posición: ejecuta el cordón en modo CHECK con la soldadura HABILITADA y comprueba que la fuente arranca con los valores correctos (lectura de WFS y U en la pantalla del panel coincide con lo guardado). Si algo no encaja, edita el programa correspondiente (P1, P2…) en la fuente, no en el robot — un mismo programa puede dar resultados muy distintos retocando solo WFS y U-corr sin cambiar el JOB.',
    ],
    notes: [
      'Lo que NO puedes hacer dentro de un mismo JOB: cambiar de material (de acero a aluminio), cambiar de gas (de M21 a Ar puro), cambiar de diámetro de hilo (de Ø 1,0 a Ø 1,2) ni saltar de pulsado a estándar/coldArc. Cualquiera de esos cambios obliga a seleccionar otro JOB.',
      'La curva sinérgica es propiedad del JOB, no del programa. Por eso al cambiar de P1 a P2 dentro del mismo JOB la fuente no recalcula la curva — solo se mueve a otro punto de trabajo sobre la misma curva.',
      'P0 es el modo MANUAL no sinérgico: los mandos físicos de la fuente fijan los parámetros en directo, sin curva. Útil para probar puntos rápidamente; no lo llama el robot porque no es una receta guardada.',
      'Las capturas reales del panel Expert XQ 2.0 se añadirán cuando se hagan en el taller. Hasta entonces, este procedimiento se apoya en el manual EWM y en la descripción funcional del panel.',
    ],
    source: 'Web oficial ewm-group.com (Titan XQ 350 Plus). Capturas pendientes del panel Expert XQ 2.0.',
  },
  {
    id: 'programa-basico',
    title: 'Programa de soldadura básico — un cordón entre dos puntos (AC / WS / WC / WE)',
    category: 'Soldadura',
    summary:
      'Cómo enseñar al robot un cordón completo desde cero: ir manualmente con el TP hasta un punto de aproximación seguro, arrancar el arco, recorrer la trayectoria de soldadura, apagar el arco y escapar a un punto fuera de la pieza. El cordón usa cuatro instrucciones encadenadas — AC (movimiento de aire), WS (inicio de soldadura), WC (continuación de soldadura) y WE (fin de soldadura) — que se graban con REC junto con la pose del robot. Es el procedimiento estructural sobre el que se apoyan todos los demás: weaving, touch sensing, base de datos de condiciones, etc.',
    cover: {
      src: pdfImage('arc_welding', 65),
      caption:
        'Figura 5.1 del manual: trayectoria estándar de aprendizaje. P0 = inicio de trabajo, P1 = inicio de soldadura, P2 = continuación, P3 = fin de soldadura, P4 = escape, P5 = fin de trabajo (Arc Welding §5.8.3).',
    },
    steps: [
      {
        text:
          'Estudia la geometría y dibuja la trayectoria sobre papel antes de tocar el TP. Para un cordón sencillo necesitas 5 puntos: P0 punto de aproximación seguro fuera de la pieza, P1 inicio del cordón (donde arranca el arco), P2 puntos intermedios (los que haga falta para definir la curva), P3 fin del cordón (donde se apaga el arco), P4 punto de escape — alejado de la pieza, lo bastante para que el soplete pueda moverse libremente al volver al inicio del programa. Un programa real cierra en P5 = HOME, pero el cordón en sí va de P1 a P3.',
        image: pdfImage('arc_welding', 60),
        caption:
          'Flujo básico §5.7.1: P0 → P1 (arco ON) → P2 → P3 (arco OFF) → P3 escape. Caso de cordón recto de redondeo horizontal entre dos puntos (Arc Welding §5.7.1).',
        refs: [
          { to: 'instrucciones-punto', label: 'AC / WS / WC / WE' },
          { to: 'interpolaciones', label: 'Joint / Linear / Circular' },
        ],
      },
      {
        text:
          'Decide qué interpolación lleva cada tramo. Regla práctica: P0 → P1 en JOINT (movimiento rápido entre articulaciones, sin importarle la trayectoria mientras llega bien); P1 → P2 → P3 en LINEAR (línea recta entre puntos, imprescindible mientras se suelda); P3 → P4 normalmente LINEAR o JOINT según haya o no obstáculos. Si el cordón tiene una curva (p. ej. una redonda) usa CIRCULAR1 con un punto intermedio que marque la curva.',
        refs: [{ to: 'interpolaciones', label: 'Interpolaciones explicadas' }],
      },
      {
        text:
          'Decide el estado de soldadura ANTES de empezar a grabar. El número de estado de soldadura (Weld condition N.º) es un puntero a una entrada de la base de datos de condiciones (Aux 0420 / 1403) que guarda velocidad, corriente, tensión, frecuencia y patrón de weaving, etc. Si la entrada que vas a usar no existe todavía, créala primero (procedimiento de Aux 0420) o usa el modo "directo" introduciendo los valores en el propio paso. Para un cordón sencillo de prueba, el estado 0 suele venir con valores razonables de fábrica.',
        image: pdfImage('arc_welding', 61),
        caption:
          'Datos auxiliares vs. estado de soldadura (§5.7.2). Auxiliares = movimiento (velocidad, precisión, timer); estado = arco (velocidad de soldadura, corriente, tensión, weaving).',
        refs: [{ to: 'estado-soldadura', label: 'Qué es un estado de soldadura' }],
      },
      {
        text:
          'Comprueba qué incluye un "estado de soldadura". Hay tres bloques: (a) estado básico — Weld Speed (cm/min) + señales de salida 1/2/3/4 (típicamente corriente, tensión, weaving y libre); (b) estado de cráter — los mismos parámetros pero solo aplicables en el WE para el tratamiento del cráter al cerrar; (c) estado de punto de arco — para soldadura por puntos AS, no para cordón. Si tu pieza pide tratamiento de cráter, asegúrate de que el estado tiene Crater output signals configuradas.',
        image: pdfImage('arc_welding', 62),
        caption:
          'Tabla §5.7.2.2: tipos de condiciones disponibles dentro de un estado de soldadura.',
      },
      {
        text:
          'Crea o abre el programa. En el TP: <PROGRAM> → escribe un nombre (p. ej. "pg10") → ENTER. Si ya existe, cárgalo. El cursor queda en el paso 1 vacío, listo para grabar. La cabecera de la pantalla muestra el nombre del programa y la fila de instrucción/interpolación/velocidad/precisión/timer del paso activo.',
        image: pdfImage('arc_welding', 66),
        caption:
          'Pantalla de aprendizaje del programa pg10 con el contenido a instruir (§5.8.3, Figura 5.2).',
        refs: [{ to: 'teach-pendant', label: 'Pantalla de aprendizaje' }],
      },
      {
        text:
          'Paso 1 — grabar P0 (aproximación, AC). Pulsa DEADMAN + las teclas de eje (+/–) para llevar la punta del soplete a P0, un punto seguro a 30-50 mm de la pieza sobre la zona donde arrancará el cordón. En la fila de datos auxiliares: instrucción = AC (movimiento de aire, arco apagado), interpolación = JOINT, velocidad = 9 (rápido), precisión = 2 (suelto), timer = 0. Pulsa REC. El controlador graba pose + auxiliares como paso 1 y avanza el contador. La pantalla muestra ahora la fila del paso 2 vacía.',
        image: pdfImage('arc_welding', 67),
        caption:
          'Paso 1 grabado: AC en P0. Figura 5.3 del manual con el cursor ya en el paso 2 (Arc Welding §5.8.3).',
        refs: [
          { to: 'grabar-punto', label: 'Cómo se graba un punto' },
          { to: 'instrucciones-punto', label: 'Qué es AC' },
        ],
      },
      {
        text:
          'Paso 2 — grabar P1 (inicio del cordón, WS). Cambia al modo de coordenadas BASE con <COORD> para mover el TCP en X/Y/Z del mundo. Si la antorcha pide un ángulo concreto (p. ej. 45° entre chapas para un cordón en ángulo), ajusta con A+JT6+/–. Mueve la punta del soplete cerca de P1, luego baja <TEACH SPEED> a velocidad 1 (avance lento) y posiciona con precisión sobre el punto exacto de inicio del cordón. En auxiliares: instrucción = WS, interpolación = LINEAR, velocidad = 9, timer = 0, estado de soldadura = el N.º elegido. Pulsa REC. WS marca el inicio del arco — el robot encenderá el arco al llegar a este punto.',
        image: pdfImage('arc_welding', 68),
        caption:
          'Paso 2 — Modo COORD base, ajuste de ángulo del soplete con A+JT6, posicionamiento fino con TEACH SPEED = 1, instrucción WS lineal (Arc Welding §5.8.3, paso 2).',
        refs: [
          { to: 'instrucciones-punto', label: 'Qué es WS' },
          { to: 'partes-robot', label: 'Sistemas de coordenadas' },
        ],
      },
      {
        text:
          'Paso 3 — grabar P2 (continuación del cordón, WC). Sin levantar el soplete (estás soldando), mueve la punta a P2 en modo base con avance lento. Si vas a hacer el WC en línea recta con el WS, basta moverse de frente; si la geometría del cordón te obliga a un punto intermedio que no estaría en la línea base, usa el modo de coordenadas de HERRAMIENTA y desplaza con Z- temporalmente para no chocar con la chapa mientras posicionas. En auxiliares: instrucción = WC, interpolación = LINEAR, estado de soldadura = mismo N.º que el WS. Pulsa REC. Repite tantos WC como puntos intermedios tenga el cordón — cada cambio de dirección necesita su WC.',
        image: pdfImage('arc_welding', 69),
        caption:
          'Paso 3 — WC en P2 con técnica de escape Z- en modo herramienta para posicionar sin chocar (Arc Welding §5.8.3, paso 3).',
        refs: [{ to: 'instrucciones-punto', label: 'Qué es WC' }],
      },
      {
        text:
          'Paso 4 — grabar P3 (fin del cordón, WE). Última posición sobre el cordón, donde el robot apagará el arco. Posiciona y graba: instrucción = WE, interpolación = LINEAR, estado de soldadura = mismo N.º. WE es el único punto donde se aplica el "tratamiento de cráter" — un escalón final de corriente y tensión más bajas durante un tiempo corto (p. ej. 0,5 s) que rellena el cráter y evita la grieta de cráter típica al cortar el arco bruscamente. Si el estado N.º que usas tiene Crater output signals configuradas, esto pasa automáticamente; si no, el arco se corta seco.',
        image: pdfImage('arc_welding', 70),
        caption:
          'Paso 4 — WE en P3. Solo el WE refleja el tratamiento de cráter del estado de soldadura (Arc Welding §5.8.3, paso 4).',
        refs: [{ to: 'instrucciones-punto', label: 'Qué es WE' }],
      },
      {
        text:
          'Paso 5 — grabar P4 (escape, AC). Cambia al modo de coordenadas HERRAMIENTA y pulsa Z- para retirar el soplete perpendicularmente a la chapa unos 20-30 mm. Esto saca la antorcha de la zona del cordón en línea recta sin riesgo de arrastrar gotas calientes por la pieza. Si necesitas alejarte más para volver al inicio del programa sin chocar con utillaje, sigue moviéndote a un punto P4 cómodo. En auxiliares: instrucción = AC (arco ya está apagado desde el WE), interpolación = LINEAR, velocidad = 9, precisión = 2, timer = 0. Pulsa REC.',
        image: pdfImage('arc_welding', 71),
        caption:
          'Paso 5 — AC en P4 tras escape Z- en modo herramienta. Figura 5.7 del manual con el cursor en el paso 6 (Arc Welding §5.8.3, paso 5).',
        refs: [{ to: 'instrucciones-punto', label: 'AC tras WE' }],
      },
      {
        text:
          'Cierra el programa con el retorno a HOME. Graba un último paso AC con interpolación JOINT, velocidad 9, precisión 2 a la pose de HOME del robot (la misma desde la que arranca cualquier programa). Esto deja al robot listo para reiniciar el ciclo o ir a otro programa. Si tu robot vuelve a HOME desde el código (función POS HOME) no hace falta el paso final, pero es buena práctica grabarlo explícitamente.',
        refs: [{ to: 'home', label: 'Qué es la posición HOME' }],
      },
      {
        text:
          'Verifica el programa en CHECK con la soldadura DESACTIVADA (Aux para deshabilitar arco). Pulsa <CHECK> y recorre paso a paso con CYCLE START a velocidad reducida. Observa: que P0 deja la antorcha donde quieres antes de tocar la pieza, que la trayectoria de soldadura no choca con utillaje, que el ángulo del soplete es razonable a lo largo del cordón, que el escape P4 efectivamente saca la antorcha. Si algo falla, edita el paso problemático con MOD (modificar sin reaprender la instrucción) — no uses REC para corregir un paso, REC graba un nuevo paso.',
        refs: [{ to: 'teach-pendant', label: 'Modo CHECK' }],
      },
      {
        text:
          'Repite en CHECK con soldadura HABILITADA sobre probeta del mismo material, espesor y posición. Revisa: el arco arranca limpio en P1 (sin chisporroteo prolongado), el cordón es continuo sin interrupciones de P1 a P3, el cráter en P3 queda relleno (sin agujero ni grieta), la longitud y la anchura coinciden con lo esperado. Si algo no encaja, lo más rápido es ajustar el estado de soldadura (subir o bajar WFS, U-corr, velocidad) sin tocar el programa — un mismo programa puede dar resultados muy distintos con estados de soldadura distintos.',
        refs: [{ to: 'estado-soldadura', label: 'Estado de soldadura' }],
      },
      {
        text:
          'Pasa a modo AUTO para producción. Asegúrate de que no hay nadie dentro de la valla, lleva el override al 100 % (o al que pida la pieza), selecciona el programa con <PROGRAM SELECT> y pulsa CYCLE START. El robot ejecutará la secuencia HOME → P0 → arco ON en P1 → cordón hasta P3 → arco OFF → escape P4 → HOME, y se detendrá hasta el siguiente ciclo. Cualquier error de soldadura (E6502 fallo de arco, etc.) detiene el robot en el punto del fallo y obliga a investigar antes de seguir.',
        refs: [{ to: 'teach-pendant', label: 'Modos TEACH / CHECK / AUTO' }],
      },
    ],
    notes: [
      'Regla AC / WS / WC / WE: AC = arco apagado (movimiento de aire), WS = inicio de arco, WC = continuación con arco ON, WE = fin de arco. Un cordón mínimo es WS → WE; con un punto intermedio, WS → WC → WE.',
      'El estado de soldadura del WS, WC y WE debe ser el mismo dentro de un cordón salvo que quieras cambiar parámetros a mitad de soldadura (raro y normalmente desaconsejado en cordones cortos).',
      'Solo el WE aplica tratamiento de cráter. Si quieres rellenar el cráter, configúralo en la base de datos de condiciones, no en el WE punto a punto.',
      'Para añadir weaving al cordón, los datos de weaving se introducen en los datos auxiliares del WC y WE — el WS no acepta weaving. Procedimiento aparte.',
      'Si necesitas modificar un punto ya grabado sin perder la instrucción, usa MOD (no REC). REC graba un paso nuevo; MOD actualiza el actual. Procedimiento aparte (REC vs MOD).',
      'Las velocidades de auxiliares (9, 1 lento) son codificadas — son índices que se traducen a mm/s o cm/min en la configuración del controlador. La velocidad real del arco la fija el estado de soldadura (Weld Speed en cm/min), no la velocidad de auxiliares.',
    ],
    source:
      'Arc Welding Operation Manual (Serie E) §5.6, §5.7 y §5.8 (especialmente §5.8.3 con la figura 5.1 y los 5 pasos de aprendizaje del cordón pg10).',
  },
  {
    id: 'weaving',
    title: 'Añadir weaving (oscilación) a un cordón — usar un patrón estándar PN=1..5',
    category: 'Soldadura',
    summary:
      'Convierte un cordón recto en oscilante eligiendo Anchura, Frecuencia y uno de los 6 patrones estándar (Standard, PN=1..5) en los datos auxiliares de los puntos WC y WE. Para crear un patrón propio (PN=6..10, personalizado) ver el procedimiento "Crear patrón de weaving personalizado".',
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
          '¿NECESITAS UN PATRÓN QUE NO ESTÁ EN PN=1..5? Si la forma del cordón te pide un patrón que no es ninguno de los seis estándar (por ejemplo, triangular con paradas en los flancos para una unión a tope vertical ascendente, o un patrón con aumento de corriente en los vértices), tienes que crearte el tuyo en una de las posiciones libres PN=6..10. El paso a paso completo de cómo dibujarlo, rellenar la hoja de puntos y cargarlo por Aux 1404-11 está en el procedimiento "Crear patrón de weaving personalizado (especial, Aux 1404-11)". Cuando lo tengas guardado, vuelve aquí y úsalo como un PN más en los datos auxiliares del WC/WE.',
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
      },
      {
        text:
          'Parámetros recomendados para 3F ascendente (cordón en ángulo, 1 pasada o raíz + cap). Pasada única / raíz: Patrón PN=2 · Anchura WV 4-6 mm · Frecuencia 1,0-1,5 Hz · Vel. hilo 5,5-6,5 m/min · U-corr −1 a 0 V · Vel. avance 8-12 cm/min · Modo pulsado · Stick-out 10-12 mm · Antorcha a 45° entre chapas, push 5-10°. Si haces segunda pasada (peinado para a ≥ 8 mm): aumentar WV a 6-8 mm y bajar frecuencia a 0,8-1,2 Hz, manteniendo el resto.',
        refs: [
          { to: 'instrucciones-punto', label: 'WS / WC / WE' },
          { to: 'estado-soldadura', label: 'Estado de soldadura' },
        ],
      },
      {
        text:
          'Parámetros recomendados para 3G ascendente (a tope V 60°, tres pasadas). 1) RAÍZ sin weaving: Vel. hilo 4,0-4,5 m/min · U-corr 0 V · Vel. avance ~10 cm/min · Modo short-arc o pulsado bajo · Stick-out 10-12 mm. Cordón recto, sin oscilar, para asegurar penetración en la separación de raíz. 2) RELLENO con weaving triangular: Patrón PN=2 · WV 8-10 mm · Frecuencia 0,8-1,2 Hz · Vel. hilo 6,0-7,0 m/min · U-corr −1 V · Vel. avance 6-9 cm/min · Modo pulsado. 3) PEINADO (cap) con triángulo más ancho para cubrir cantos: PN=2 · WV 10-14 mm (sobrepasar 1-2 mm cada borde del chaflán) · Frecuencia 0,7-1,0 Hz · Vel. hilo 6,5-7,5 m/min · Vel. avance 5-7 cm/min · Modo pulsado.',
        refs: [
          { to: 'instrucciones-punto', label: 'WS / WC / WE por pasada' },
          { to: 'estado-soldadura', label: 'Estado de soldadura por pasada' },
        ],
      },
      {
        text:
          'Configura el weaving en el TP. Con el cursor en el WC del cordón, abre "Weaving data" en los datos auxiliares e introduce los tres valores (PN=2, WV, frecuencia) según el caso. Repite en cada WC y en el WE de cierre. Si tu JOB del EWM tiene programas separados para raíz/relleno/peinado (recomendado en 3G), cada WS llama a su programa y el weaving se introduce sobre los WC/WE de esa pasada. El procedimiento completo de configuración paso a paso está en "Añadir weaving (oscilación) a un cordón".',
        refs: [{ to: 'teach-pendant', label: 'Mover cursor en el TP' }],
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
    title: 'Crear patrón de weaving personalizado (especial, Aux 1404-11) — modificar tiempos y paradas en vértices',
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
        refs: [{ to: 'teach-pendant', label: 'Acceso a Aux desde el TP' }],
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
