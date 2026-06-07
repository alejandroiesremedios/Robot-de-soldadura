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
