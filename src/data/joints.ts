import { pdfImage } from './pdfImages';
import type { StepRef } from './procedures';
import type { SheetOptions } from '../lib/weavingSheet';
import type { JointDiagramKind } from '../components/JointDiagram';

export type WeavingSpec =
  | { tipo: 'ninguno'; motivo?: string }
  | { tipo: 'estandar'; pn: 1 | 2 | 3 | 4 | 5; anchuraMm: string; frecuenciaHz: string }
  | {
      tipo: 'personalizado';
      pnSugerido: 6 | 7 | 8 | 9 | 10;
      descripcion: string;
      anchuraMm: string;
      /** Valores con los que se precarga la calculadora de la capa. */
      calculadora: SheetOptions;
    };

export type LayerAdjust = {
  sintoma: string;
  donde: 'robot' | 'ewm';
  accion: string;
};

export type LayerConfig = {
  id: string;
  nombre: string;
  proposito: string;
  robot: {
    instrucciones: string;
    velocidadAvance: string;
    weaving: WeavingSpec;
    notas?: string[];
  };
  ewm: {
    programa: 'P1' | 'P2' | 'P3' | 'P4';
    modo: string;
    wfs: string;
    uCorr: string;
    dinamica?: string;
    notas?: string[];
  };
  ajustes: LayerAdjust[];
  image?: string;
  caption?: string;
  refs?: StepRef[];
};

export type Joint = {
  id: string;
  titulo: string;
  posicion: { iso: string; aws: string; descripcion: string };
  soporte: 'chapa' | 'tubo';
  croquis: JointDiagramKind;
  preparacion: string;
  materialBase: string;
  consumible: string;
  gas: string;
  capas: LayerConfig[];
  notas?: string[];
  source?: string;
};

export const JOINTS: Joint[] = [
  {
    id: 'tope-v60-pf',
    titulo: 'A tope, V 60°, gap 4 mm — vertical ascendente',
    posicion: {
      iso: 'PF (UNE-EN ISO 6947)',
      aws: '3G ascendente (AWS/ASME IX)',
      descripcion: 'Chapas verticales, el cordón sube luchando contra la gravedad.',
    },
    soporte: 'chapa',
    croquis: 'tope-v',
    preparacion: 'V 60° (30° por chapa) · talón 2 mm · separación de raíz (gap) 4 mm · espesor 10 mm',
    materialBase: 'S235JR (1.0038, UNE-EN 10025-2) o similar',
    consumible: 'Hilo macizo G3Si1 (UNE-EN ISO 14341-A) / ER70S-6 (AWS A5.18) · Ø1,0 mm',
    gas: 'M21 (Ar + 18 % CO₂, UNE-EN ISO 14175)',
    capas: [
      {
        id: 'raiz',
        nombre: 'Capa 1 — Raíz',
        proposito:
          'Une las dos chapas por el fondo del chaflán puenteando el gap de 4 mm. Es la capa que manda: si la raíz no penetra o se cae, todo lo demás sobra.',
        robot: {
          instrucciones:
            'WS en el inicio del chaflán → WC en cada cambio de plano → WE arriba. Interpolación LINEAR. El soplete apunta al centro del gap, ángulo de empuje 5-10° hacia arriba.',
          velocidadAvance: '8-10 cm/min',
          weaving: {
            tipo: 'estandar',
            pn: 1,
            anchuraMm: '2-3',
            frecuenciaHz: '1,2-1,5',
          },
          notas: [
            'Con gap de 4 mm un péndulo leve (PN=1) ayuda a mojar los dos talones sin perforar. Si el gap real es menor (2-3 mm), prueba primero sin weaving.',
            'Graba los puntos con la chapa puenteada por puntos de fijación cada 80-100 mm.',
          ],
        },
        ewm: {
          programa: 'P1',
          modo: 'Short-arc (estándar, no pulsado)',
          wfs: '3,5-4,5 m/min',
          uCorr: '−1 a 0 V',
          dinamica: 'Baja (arco suave, menos chisporroteo en el talón)',
          notas: ['El arco corto controla el baño en el gap; el pulsado aquí mete demasiada energía.'],
        },
        ajustes: [
          { sintoma: 'Perfora el gap (ojales)', donde: 'ewm', accion: 'Baja WFS 0,5 m/min o sube la velocidad de avance en el robot.' },
          { sintoma: 'No penetra / raíz fría', donde: 'ewm', accion: 'Sube WFS 0,5 m/min o reduce el avance a 8 cm/min.' },
          { sintoma: 'Se pega a un talón y deja el otro sin fundir', donde: 'robot', accion: 'Centra el TCP en el gap (reaprende los puntos con MOD) o añade weaving PN=1 de 2 mm.' },
        ],
        refs: [
          { to: 'programa-multicapa', label: 'Programa del robot completo (4 capas)', kind: 'procedimiento' },
          { to: 'programa-basico', label: 'Estructura WS/WC/WE', kind: 'procedimiento' },
          { to: 'job-ewm', label: 'Guardar P1..P4 dentro del JOB (EWM)', kind: 'procedimiento' },
          { to: 'estado-soldadura', label: 'Estado de soldadura' },
        ],
      },
      {
        id: 'hot-pass',
        nombre: 'Capa 2 — Refuerzo de raíz (hot pass)',
        proposito:
          'Refunde la superficie de la raíz, limpia los restos de silicatos y rellena las mordeduras del talón antes de las capas gruesas. Va caliente y rápida.',
        robot: {
          instrucciones:
            'Mismo programa, segundo cordón: WS → WC → WE sobre la raíz. LINEAR. El WS de esta capa llama a P2 en su estado de soldadura.',
          velocidadAvance: '10-12 cm/min',
          weaving: {
            tipo: 'estandar',
            pn: 2,
            anchuraMm: '4-5',
            frecuenciaHz: '1,2',
          },
          notas: ['Triangular suave: solo busca cubrir la raíz de lado a lado, sin paradas largas.'],
        },
        ewm: {
          programa: 'P2',
          modo: 'Pulsado',
          wfs: '5,5-6,5 m/min',
          uCorr: '0 V',
          notas: ['Antes de soldar: cepillar la raíz y quitar silicatos (esquinas del chaflán).'],
        },
        ajustes: [
          { sintoma: 'Socava los flancos del chaflán', donde: 'ewm', accion: 'Baja U-corr a −1 V (arco más corto).' },
          { sintoma: 'Queda abultada y estrecha', donde: 'robot', accion: 'Sube la anchura del weaving a 5 mm o baja la frecuencia a 1 Hz.' },
        ],
        refs: [{ to: 'weaving', label: 'Configurar weaving estándar', kind: 'procedimiento' }],
      },
      {
        id: 'relleno',
        nombre: 'Capa 3 — Relleno',
        proposito:
          'Rellena el grueso del chaflán. En 10 mm normalmente basta una capa de relleno entre el hot pass y el peinado. Aquí entra el patrón personalizado: paradas en los flancos para fundir los cantos y paso rápido por el centro para que el baño no descuelgue.',
        robot: {
          instrucciones:
            'WS → WC → WE. LINEAR. El WS llama a P3. El weaving es un patrón personalizado guardado en PN=6 (crearlo antes con Aux 1404-11).',
          velocidadAvance: '6-9 cm/min',
          weaving: {
            tipo: 'personalizado',
            pnSugerido: 6,
            descripcion:
              'Triangular con parada de 0,2-0,25 s en cada flanco y +15-20 % de corriente durante las paradas. El centro se cruza rápido.',
            anchuraMm: 'ancho actual del chaflán − 1 (≈ 8-10)',
            calculadora: { frecuenciaHz: 1, paradaIzqS: 0.25, paradaDchaS: 0.25, boostCorrientePct: 15 },
          },
          notas: ['La hoja de puntos de abajo sale de la calculadora; ajústala y teclea el resultado en Aux 1404-11 → PN 6.'],
        },
        ewm: {
          programa: 'P3',
          modo: 'Pulsado',
          wfs: '6,0-7,0 m/min',
          uCorr: '−1 V',
          notas: ['El boost de corriente en las paradas lo aplica el patrón del robot (Aux 1413), no toques el JOB para eso.'],
        },
        ajustes: [
          { sintoma: 'Flancos sin fundir', donde: 'robot', accion: 'Sube la parada de ese flanco de 0,25 a 0,3 s con la calculadora y recarga el PN.' },
          { sintoma: 'El centro descuelga', donde: 'robot', accion: 'Reduce las paradas o sube el avance a 9 cm/min; el cruce central debe ser rápido.' },
          { sintoma: 'Falta material (capa hundida)', donde: 'ewm', accion: 'Sube WFS a 7,0 m/min manteniendo el avance.' },
        ],
        image: pdfImage('arc_welding', 233),
        caption:
          'Diagrama de expansión con tiempos de parada en los flancos (Arc Welding §10.4.2). Es la misma idea que genera la calculadora.',
        refs: [
          { to: 'weaving-especial', label: 'Crear el patrón en Aux 1404-11', kind: 'procedimiento' },
        ],
      },
      {
        id: 'peinado',
        nombre: 'Capa 4 — Peinado (cap)',
        proposito:
          'Capa vista. Debe sobrepasar 1-2 mm cada borde del chaflán con transición suave y sin mordeduras. El patrón personalizado permite afinar cada lado por separado — por ejemplo 0,1 s más de parada en el lado izquierdo si ese borde queda frío.',
        robot: {
          instrucciones:
            'WS → WC → WE. LINEAR. El WS llama a P4. Patrón personalizado en PN=7, más ancho y más lento que el del relleno.',
          velocidadAvance: '5-7 cm/min',
          weaving: {
            tipo: 'personalizado',
            pnSugerido: 7,
            descripcion:
              'Triangular ancho (chaflán + 2 mm) con paradas de 0,2-0,3 s por flanco, ajustables por separado: si un borde queda frío, dale 0,1 s más solo a ese lado.',
            anchuraMm: 'ancho del chaflán + 2 (≈ 13-14)',
            calculadora: { frecuenciaHz: 0.8, paradaIzqS: 0.3, paradaDchaS: 0.2, boostCorrientePct: 0 },
          },
          notas: [
            'La calculadora viene precargada con el ejemplo asimétrico: 0,1 s más a la izquierda (a 0,8 Hz son 8 puntos de % más en ese vértice).',
          ],
        },
        ewm: {
          programa: 'P4',
          modo: 'Pulsado',
          wfs: '6,5-7,5 m/min',
          uCorr: '0 V',
          notas: ['Si los bordes muerden, baja U-corr a −1 V antes de tocar el weaving.'],
        },
        ajustes: [
          { sintoma: 'Borde izquierdo frío / sin mojar', donde: 'robot', accion: 'Suma 0,1 s a la parada izquierda con la calculadora y recarga PN=7.' },
          { sintoma: 'Mordedura en un borde', donde: 'ewm', accion: 'Baja U-corr a −1 V; si persiste, baja WFS 0,5 m/min.' },
          { sintoma: 'Sobre-espesor excesivo (> 3 mm)', donde: 'robot', accion: 'Sube el avance a 7 cm/min o reparte en dos cordones de peinado.' },
        ],
        image: pdfImage('arc_welding', 312),
        caption:
          'Apéndice 3 del manual: triangular con paradas y aumento de corriente en los extremos — la plantilla de la que parte este peinado.',
        refs: [
          { to: 'weaving-especial', label: 'Crear el patrón en Aux 1404-11', kind: 'procedimiento' },
          { to: 'posiciones-soldadura', label: 'Posición PF / 3G' },
        ],
      },
    ],
    notas: [
      'Convención de programas DENTRO del mismo JOB de acero del EWM (variaciones P1..P15 del JOB, no programas del robot): P1 = raíz, P2 = hot pass, P3 = relleno, P4 = peinado. P0 queda como manual y P5..P15 libres. Igual en todas las fichas.',
      'Valores orientativos como punto de partida: calibrar siempre con probeta del mismo material, espesor y posición antes de la pieza real.',
      'Para trabajos sujetos a norma, el procedimiento debe calificarse por ensayo (EN ISO 15614-1 o ASME IX); estos valores no son un WPS.',
      'Entre capas: dejar enfriar por debajo de la temperatura entre pasadas (~250 °C para S235JR), cepillar y revisar visualmente antes de la siguiente.',
    ],
    source:
      'Lado robot: Arc Welding Operation Manual (Serie E) §5.8, §10.3-10.4 y Apéndice 3. Lado EWM: valores de partida de práctica GMAW (sin PDF de EWM todavía); posiciones según UNE-EN ISO 6947 / AWS A3.0.',
  },
  {
    id: 'filete-pf',
    titulo: 'Filete en T — vertical ascendente',
    posicion: {
      iso: 'PF (UNE-EN ISO 6947)',
      aws: '3F ascendente (AWS/ASME IX)',
      descripcion:
        'Cordón en ángulo (fillet) con el eje vertical: la unión en T está de pie y el cordón sube. La gravedad tira del baño hacia abajo, así que se avanza despacio y el weaving reparte el calor entre las dos chapas.',
    },
    soporte: 'chapa',
    croquis: 'filete-t',
    preparacion: 'Unión en T sin preparación · garganta a = 6-8 mm (cateto z ≈ 8-11 mm) · chapas de 10 mm',
    materialBase: 'S235JR (1.0038, UNE-EN 10025-2) o similar',
    consumible: 'Hilo macizo G3Si1 (UNE-EN ISO 14341-A) / ER70S-6 (AWS A5.18) · Ø1,0 mm',
    gas: 'M21 (Ar + 18 % CO₂, UNE-EN ISO 14175)',
    capas: [
      {
        id: 'raiz',
        nombre: 'Capa 1 — Raíz (o pasada única)',
        proposito:
          'Funde el rincón de la T y forma la garganta. Para a = 6 mm esta pasada puede ser la única; para a ≥ 8 mm queda como raíz y se remata con peinado. Debe mojar las DOS chapas por igual — el defecto típico del filete es cargar el baño en una y dejar la otra fría.',
        robot: {
          instrucciones:
            'WS abajo en el rincón → WC si la junta cambia de plano → WE arriba. Interpolación LINEAR. Antorcha a 45° exactos entre las dos chapas, con 5-10° de empuje hacia arriba. El TCP apunta al vértice del rincón.',
          velocidadAvance: '8-12 cm/min',
          weaving: {
            tipo: 'estandar',
            pn: 2,
            anchuraMm: '4-6',
            frecuenciaHz: '1,0-1,5',
          },
          notas: [
            'El triangular PN=2 con vértices hacia las chapas es el patrón de partida estándar en 3F (ver procedimiento "Weaving triangular para 3F y 3G").',
            'Si el robot no mantiene los 45° en todo el recorrido, corrige la orientación en los puntos (A+JT6) antes de tocar parámetros.',
          ],
        },
        ewm: {
          programa: 'P1',
          modo: 'Pulsado',
          wfs: '5,5-6,5 m/min',
          uCorr: '−1 a 0 V',
          notas: ['Pulsado mejor que short-arc en vertical ascendente: menos calor por unidad de longitud y mejor control del baño.'],
        },
        ajustes: [
          { sintoma: 'El baño descuelga por el centro', donde: 'robot', accion: 'Baja la anchura del weaving a 4 mm o sube la frecuencia a 1,5 Hz o sube el avance a 12 cm/min.' },
          { sintoma: 'Una chapa queda fría (no moja)', donde: 'robot', accion: 'Revisa que la antorcha va a 45° exactos; si la orientación es buena, pasa al patrón personalizado del peinado con más parada en ese lado.' },
          { sintoma: 'Garganta insuficiente (a < 6 mm)', donde: 'ewm', accion: 'Sube WFS a 6,5 m/min o baja el avance a 8 cm/min; si no llega, planifica segunda pasada.' },
          { sintoma: 'Mordedura en la chapa vertical', donde: 'ewm', accion: 'Baja U-corr a −1 V (arco más corto).' },
        ],
        image: pdfImage('arc_welding', 219),
        caption:
          'Patrón triangular PN=2: movimiento y reparto temporal del ciclo (Arc Welding §10.2). Es el weaving de partida para el filete ascendente.',
        refs: [
          { to: 'weaving-3f-3g', label: 'Parámetros 3F completos', kind: 'procedimiento' },
          { to: 'programa-basico', label: 'Estructura WS/WC/WE', kind: 'procedimiento' },
          { to: 'job-ewm', label: 'Guardar P1/P4 dentro del JOB (EWM)', kind: 'procedimiento' },
        ],
      },
      {
        id: 'peinado',
        nombre: 'Capa 2 — Peinado (solo si a ≥ 8 mm)',
        proposito:
          'Completa la garganta y deja la cara del cordón plana o ligeramente convexa. Aquí es donde el patrón personalizado paga: paradas independientes por lado para igualar el mojado de las dos chapas (la chapa de arriba suele pedir algo más de parada porque la gravedad le roba material).',
        robot: {
          instrucciones:
            'Segundo bloque WS → WE en el mismo programa del robot, con el TCP ~2 mm más afuera del rincón que la raíz. El WS de esta capa llama a P4. Se usa PN=8 para no pisar los patrones de la ficha a tope (PN=6 relleno, PN=7 peinado).',
          velocidadAvance: '6-9 cm/min',
          weaving: {
            tipo: 'personalizado',
            pnSugerido: 8,
            descripcion:
              'Triangular ancho (6-8 mm) con parada de 0,2-0,25 s por lado, ajustables por separado: si la chapa superior queda baja de material, dale 0,05-0,1 s más a su lado con la calculadora.',
            anchuraMm: '6-8',
            calculadora: { frecuenciaHz: 1, paradaIzqS: 0.25, paradaDchaS: 0.2, boostCorrientePct: 0 },
          },
          notas: [
            'Convención en esta ficha: izquierda = chapa vertical (la de arriba en el rincón), derecha = chapa base. La calculadora viene precargada con 0,05 s más en el lado de la chapa vertical.',
          ],
        },
        ewm: {
          programa: 'P4',
          modo: 'Pulsado',
          wfs: '6,0-7,0 m/min',
          uCorr: '0 V',
          notas: ['Se usa P4 (no P2) para mantener la convención de todas las fichas: P4 = peinado. P2 y P3 quedan libres en este caso.'],
        },
        ajustes: [
          { sintoma: 'La chapa superior queda baja de material', donde: 'robot', accion: 'Suma 0,05-0,1 s a la parada de ese lado con la calculadora y recarga PN=8.' },
          { sintoma: 'Cara del cordón convexa en exceso', donde: 'robot', accion: 'Sube el avance a 9 cm/min o ensancha el weaving a 8 mm.' },
          { sintoma: 'Mordedura en los bordes del cordón', donde: 'ewm', accion: 'Baja U-corr a −1 V; si persiste, baja WFS 0,5 m/min.' },
        ],
        image: pdfImage('arc_welding', 302),
        caption:
          'Apéndice 3: triangular con parada en ambos extremos para junta de redondeo (fillet). La versión asimétrica para PF sale de la calculadora cambiando el reparto de tiempos.',
        refs: [
          { to: 'weaving-especial', label: 'Crear PN=8 en Aux 1404-11', kind: 'procedimiento' },
          { to: 'programa-multicapa', label: 'Encadenar las 2 capas en un programa', kind: 'procedimiento' },
          { to: 'posiciones-soldadura', label: 'Posición PF / 3F' },
        ],
      },
    ],
    notas: [
      'Convención de programas dentro del JOB de acero: P1 = raíz (o pasada única) y P4 = peinado — los mismos huecos que en el resto de fichas, P2/P3 quedan libres aquí.',
      'Garganta vs cateto: a = 6 mm equivale a cateto z ≈ 8,5 mm (z = a·√2). Mide el cateto con galga, que es lo fácil de medir en taller.',
      '¿Una o dos pasadas? a = 6 mm sale en una; a = 8 mm pide raíz + peinado. Sobredimensionar la garganta no es gratis: más calor, más deformación y más coste.',
      'Regla de oro del vertical ascendente: despacio. El avance bajo (6-12 cm/min) es lo que deja solidificar el baño antes de que descuelgue.',
      'Valores orientativos como punto de partida: calibrar con probeta y, para trabajo sujeto a norma, calificar por ensayo (EN ISO 15614-1 o ASME IX).',
    ],
    source:
      'Lado robot: Arc Welding Operation Manual (Serie E) §10 y Apéndice 3; parámetros base del procedimiento "Weaving triangular para 3F y 3G". Lado EWM: valores de partida de práctica GMAW; posiciones según UNE-EN ISO 6947 / AWS A3.0.',
  },
];
