import { Link } from 'react-router-dom';
import { pdfImage } from '../data/pdfImages';
import ZoomableImage from '../components/ZoomableImage';

type Subsection = {
  id: string;
  title: string;
  blurb: string;
  to: string;
};

const SUBSECTIONS: Subsection[] = [
  {
    id: 'partes-robot',
    title: 'Partes del robot',
    blurb: 'Brazo Kawasaki BA006L: ejes, eslabones, antorcha y armario controlador Serie E.',
    to: '/fundamentos/partes-robot',
  },
  {
    id: 'teach-pendant',
    title: 'Teach pendant (TP)',
    blurb: 'Disposición del mando, teclas principales, modos (TEACH/REPEAT/CHECK) y pantallas.',
    to: '/fundamentos/teach-pendant',
  },
  {
    id: 'grabar-punto',
    title: 'Grabar (enseñar) un punto',
    blurb: 'Cómo registrar un punto en un programa: JOG, posición, instrucción, interpolación, REC.',
    to: '/fundamentos/grabar-punto',
  },
  {
    id: 'home',
    title: 'Posición HOME',
    blurb: 'Qué es la posición HOME, por qué se pone al inicio y al final, cómo llevar el robot a HOME.',
    to: '/fundamentos/home',
  },
  {
    id: 'instrucciones-punto',
    title: 'Instrucciones del punto (AC, WS, WC, WE, AS)',
    blurb: 'Qué hace el robot en cada punto enseñado: aproximación, inicio/continuación/fin de soldadura, arc spot.',
    to: '/fundamentos/instrucciones-punto',
  },
  {
    id: 'interpolaciones',
    title: 'Interpolaciones (JOINT / LINEAR)',
    blurb: 'Cómo se mueve el robot entre dos puntos: por eje a eje, en recta, en circular.',
    to: '/fundamentos/interpolaciones',
  },
  {
    id: 'touch-sensing-wire-check',
    title: 'Touch sensing y wire check',
    blurb: 'Para qué sirven, en qué se diferencian y dónde se configuran en el TP.',
    to: '/fundamentos/touch-sensing-wire-check',
  },
  {
    id: 'weaving',
    title: 'Weaving (oscilación lateral)',
    blurb:
      'Movimiento oscilante de la antorcha para ensanchar el cordón. Parámetros: anchura, frecuencia y patrón.',
    to: '/fundamentos/weaving',
  },
  {
    id: 'job-ewm',
    title: 'JOB (EWM Titan XQ 350 Plus)',
    blurb:
      'Qué es un JOB en la fuente, qué fija (material/gas/hilo/proceso) y qué se puede variar con los programas P0..P15 dentro del mismo JOB.',
    to: '/fundamentos/job-ewm',
  },
];

export default function Fundamentos() {
  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold leading-tight">Instrucciones fundamentales</h1>
        <p className="text-sm text-slate-300">
          Conceptos previos antes de seguir cualquier procedimiento. Si en una guía no entiendes una sigla
          (AC, JOG, TCP, JOB…), búscala aquí.
        </p>
      </header>

      <ul className="space-y-3">
        {SUBSECTIONS.map((s) => (
          <li key={s.id}>
            <Link
              to={s.to}
              className="card block active:scale-[0.99] bg-gradient-to-br from-indigo-500/15 to-indigo-700/5 border-indigo-400/30"
            >
              <h2 className="font-semibold leading-tight">{s.title}</h2>
              <p className="text-xs text-slate-300 mt-1 leading-snug">{s.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>

      <PreviewInstrucciones />
    </div>
  );
}

// Tarjeta de vista previa para que el usuario, sin pinchar, ya entienda
// la sección más citada: instrucciones del punto.
function PreviewInstrucciones() {
  return (
    <section className="card space-y-3">
      <h2 className="font-semibold">Vista rápida: instrucciones del punto</h2>
      <p className="text-sm text-slate-300">
        Cada punto enseñado lleva una "instrucción" que indica qué hace el robot al pasar por él.
        Las cinco básicas en soldadura por arco son:
      </p>
      <ul className="text-sm space-y-2">
        <li>
          <span className="chip bg-sky-500/25 text-sky-100 border border-sky-400/40 mr-2">AC</span>
          Air Cut. Movimiento <span className="text-slate-300">sin soldar</span>. Punto de aproximación.
        </li>
        <li>
          <span className="chip bg-emerald-500/25 text-emerald-100 border border-emerald-400/40 mr-2">WS</span>
          Weld Start. <span className="text-slate-300">Inicio</span> de la soldadura.
        </li>
        <li>
          <span className="chip bg-amber-500/25 text-amber-100 border border-amber-400/40 mr-2">WC</span>
          Weld Continue. Punto <span className="text-slate-300">intermedio</span> del cordón.
        </li>
        <li>
          <span className="chip bg-rose-500/25 text-rose-100 border border-rose-400/40 mr-2">WE</span>
          Weld End. <span className="text-slate-300">Fin</span> de la soldadura.
        </li>
        <li>
          <span className="chip bg-fuchsia-500/25 text-fuchsia-100 border border-fuchsia-400/40 mr-2">AS</span>
          Arc Spot. Soldadura <span className="text-slate-300">por puntos de arco</span>.
        </li>
      </ul>
      <p className="text-xs text-slate-400 italic">
        Fuente: Arc Welding Operation Manual (E series), §5.6 — Procedimiento de registro normal.
      </p>
    </section>
  );
}

// Detalle de cada subsección
type Detail = {
  title: string;
  category?: string;
  body: React.ReactNode;
};

export const FUNDAMENTOS_DETAILS: Record<string, Detail> = {
  'partes-robot': {
    title: 'Partes del robot',
    body: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-slate-300">
          El sistema está formado por el <strong>brazo Kawasaki BA006L</strong>, su{' '}
          <strong>armario controlador Serie E</strong>, el <strong>teach pendant</strong> y, en este
          caso, una <strong>fuente EWM Titan XQ 350 Plus</strong> con su antorcha y el sistema de
          arrastre de hilo.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Brazo BA006L</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>6 ejes (JT1 a JT6). Cada uno gira sobre su servomotor.</li>
          <li>Base, eslabón inferior, eslabón superior, muñeca y brida de herramienta.</li>
          <li>
            En la brida va montada la <strong>antorcha</strong> del EWM, definida en el TCP (Tool
            Center Point).
          </li>
        </ul>
        <PdfFigure
          src={pdfImage('serie_e', 98)}
          caption="Nombres de cada eje del brazo de 6 ejes (Serie E §4.1.1)."
        />

        <h3 className="font-semibold text-base text-slate-100">Armario controlador (Serie E)</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>Interruptor general de encendido/apagado.</li>
          <li>Botón <strong>MOTOR ON</strong> y seta de emergencia exteriores.</li>
          <li>Comunica con la fuente EWM (selecciona JOB y arranca arco).</li>
        </ul>
        <PdfFigure
          src={pdfImage('serie_e', 24)}
          caption="Apariencia del controlador Serie E con su panel de operaciones (Serie E §2.1)."
        />
        <PdfFigure
          src={pdfImage('serie_e', 26)}
          caption="Panel de operaciones del armario: interruptor general, MOTOR ON, seta de emergencia y selector de modo."
        />

        <p className="text-xs text-slate-400 italic">
          Fuente: 90203-1104DSB Operation Manual (Serie E), §2.1 y §4.1.1.
        </p>
      </div>
    ),
  },
  'teach-pendant': {
    title: 'Teach pendant (TP)',
    body: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-slate-300">
          El teach pendant es el mando con pantalla que se usa para enseñar y operar el robot.
          Tiene tres modos básicos en el selector:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>
            <strong>TEACH</strong>: enseñanza. El robot solo se mueve con el TP a velocidad limitada.
          </li>
          <li>
            <strong>REPEAT</strong>: ejecución automática del programa.
          </li>
          <li>
            <strong>CHECK</strong>: prueba paso a paso del programa con seguridad activa.
          </li>
        </ul>

        <h3 className="font-semibold text-base text-slate-100">Apariencia del TP</h3>
        <p className="text-slate-300">
          El TP físico tiene dos zonas bien diferenciadas: la <strong>Operation Screen</strong> (pantalla
          táctil donde aparecen menús, programas y datos del robot) y el <strong>Hard Key</strong>{' '}
          (teclado de membrana fijo con las teclas más usadas). Esta captura, tomada del simulador
          <strong> K-ROSET</strong>, muestra el teclado completo a color y en buena resolución:
        </p>
        <PdfFigure
          src={pdfImage('k_roset', 164)}
          caption="Vista del TP virtual del K-ROSET (idéntico al físico) con las dos zonas etiquetadas: Operation Screen arriba (táctil) y Hard Key abajo (teclado de membrana). Fuente: K-ROSET Instruction Manual §4.1.1.2."
        />
        <p className="text-slate-300">
          Y por completar, el esquema técnico del Serie E con los elementos físicos del propio
          mando (gatillos de hombre muerto, llave de bloqueo, seta de emergencia), que no se ven en
          el simulador:
        </p>
        <PdfFigure
          src={pdfImage('serie_e', 29)}
          caption="Disposición del TP físico: pantalla, teclado de membrana, interruptor de bloque de enseñanza, interruptores de hombre muerto (gatillos) e interruptor de paro de emergencia (Serie E §2.3)."
        />

        <h3 className="font-semibold text-base text-slate-100">Teclas principales</h3>
        <p className="text-slate-300">
          Teclas que aparecen en los procedimientos:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>
            <strong>AUX</strong> + número: entra en un menú auxiliar concreto. Ej. AUX 14 = Arc Weld.
          </li>
          <li>
            <strong>JOG</strong>: mover el robot manualmente eje a eje o por coordenadas.
          </li>
          <li>
            <strong>+</strong>: añade una instrucción/opción auxiliar a la línea del programa.
          </li>
          <li>
            <strong>J/E</strong>, <strong>A/B/C…</strong>: teclas para introducir parámetros y cambiar
            de campo.
          </li>
          <li>
            <strong>REC</strong> (Sobreescribir/Recordar): registra/sobrescribe el punto actual.
          </li>
          <li>
            <strong>A</strong> (función): pulsada junto con otra tecla activa su función secundaria.
          </li>
          <li>
            <strong>CHECK</strong>: prueba paso a paso con seguridad activa.
          </li>
        </ul>
        <PdfFigure
          src={pdfImage('serie_e', 30)}
          caption="Tabla de funciones de las teclas materiales del TP (Serie E §2.4). Para cada tecla se indica la función principal y la función al pulsarse junto a la tecla A."
        />
        <PdfFigure
          src={pdfImage('serie_e', 31)}
          caption="Continuación del teclado: tecla ↵ (Enter), Reset, captura de pantalla a USB y verificación rápida."
        />

        <h3 className="font-semibold text-base text-slate-100">Pantallas del TP</h3>
        <p className="text-slate-200">
          La pantalla táctil está dividida en tres áreas: <strong>A</strong> (cabecera de estado),{' '}
          <strong>B</strong> y <strong>C</strong> (área de trabajo). Las áreas B y C se activan/conmutan
          y cambian de color según el modo (azul en TEACH, verde en REPEAT).
        </p>
        <PdfFigure
          src={pdfImage('serie_e', 37)}
          caption="Distribución de las pantallas del TP en áreas A, B y C (Serie E §2.5)."
        />

        <p className="text-xs text-slate-400 italic">
          Fuente: 90203-1104DSB Operation Manual (Serie E), §2.3-§2.5.
        </p>
      </div>
    ),
  },
  'grabar-punto': {
    title: 'Grabar (enseñar) un punto',
    body: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-slate-300">
          "Grabar un punto" significa <strong>añadir una línea</strong> a un programa: la posición del
          robot en ese instante, junto con la instrucción y la interpolación que se le quieran asociar.
          Se hace siempre con el selector en <strong>TEACH</strong>.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Pasos generales</h3>
        <ol className="list-decimal list-inside space-y-2 text-slate-200">
          <li>
            Selector del TP en <strong>TEACH</strong>. Habilitar motores (MOTOR ON) y mantener el
            "enable" del TP pulsado para poder mover el robot.
          </li>
          <li>
            Mover el robot a la posición deseada con <strong>JOG</strong> (eje a eje o por coordenadas
            base/herramienta).
          </li>
          <li>
            Colocar el cursor en la línea del programa donde se quiere insertar el punto. Si el cursor
            está al final del programa, el nuevo punto se añade después; si está sobre una línea
            existente, esa línea se reemplaza/modifica según el modo de edición.
          </li>
          <li>
            Elegir la <strong>instrucción</strong> de ese punto (AC, WS, WC, WE, AS) y la{' '}
            <strong>interpolación</strong> (JOINT, LINEAR, CIRCULAR). En la fila de edición del TP las
            opciones rotan al pulsar el campo.
          </li>
          <li>
            Pulsar la tecla de registro (<strong>REC</strong> o equivalente, según pantalla del TP) para
            grabar el punto.
          </li>
          <li>
            Verificar que la nueva línea aparece en el programa con la instrucción, interpolación y
            posición correctas.
          </li>
        </ol>

        <h3 className="font-semibold text-base text-slate-100">Modificar un punto ya grabado</h3>
        <ol className="list-decimal list-inside space-y-2 text-slate-200">
          <li>Colocar el cursor sobre la línea del punto a modificar.</li>
          <li>Mover el robot a la nueva posición con JOG.</li>
          <li>Volver a pulsar REC: el punto se actualiza con la nueva posición.</li>
        </ol>

        <PdfFigure
          src={pdfImage('serie_e', 125)}
          caption="Datos de pose que se registran al grabar un punto: posición XYZ del TCP, orientación y configuración del brazo (Serie E §5.4)."
        />
        <PdfFigure
          src={pdfImage('serie_e', 127)}
          caption="Procedimiento de enseñanza paso a paso desde el TP (Serie E §5.5.2)."
        />
        <PdfFigure
          src={pdfImage('serie_e', 132)}
          caption="Pantalla de creación de un programa nuevo (Serie E §5.6.1)."
        />
        <PdfFigure
          src={pdfImage('serie_e', 137)}
          caption="Pantalla para añadir un paso al programa (Serie E §5.6.2)."
        />

        <h3 className="font-semibold text-base text-slate-100">Disposición de la pantalla de aprendizaje</h3>
        <p className="text-slate-300">
          Al enseñar la pantalla del TP se divide en tres zonas: <strong>área de programa</strong>{' '}
          (líneas grabadas), <strong>fila de instrucciones</strong> (AC/WS/WC/WE/AS) y{' '}
          <strong>fila de parámetros</strong> (velocidad, precisión, auxiliares). La tecla{' '}
          <span className="font-mono">A</span> + flechas mueve el cursor entre filas.
        </p>
        <PdfFigure
          src={pdfImage('arc_welding', 46)}
          caption="Pantalla de aprendizaje: área de programa, fila de instrucciones y fila de parámetros (Arc Welding §5.4)."
        />

        <p className="text-xs text-slate-400 italic">
          Fuentes: 90203-1104DSB Operation Manual (Serie E), §5.4-§5.6; 90203-1036DSB Arc Welding
          Operation Manual, §5.4.
        </p>
      </div>
    ),
  },
  'home': {
    title: 'Posición HOME',
    body: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-slate-300">
          <strong>HOME</strong> es una posición predeterminada del robot considerada <strong>segura</strong>:
          alejada de la pieza, de las herramientas y del operario. Sirve como punto de partida conocido y
          como punto de retorno.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Por qué se usa</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>
            <strong>Primer y último punto</strong> de casi todos los programas. Garantiza que el robot
            arranca y termina en una pose segura, repetible y conocida.
          </li>
          <li>
            <strong>Punto de retorno</strong> tras una parada de emergencia o un error, cuando hay duda
            de la posición real del robot.
          </li>
          <li>
            <strong>Posición de aparcamiento</strong> cuando no se está soldando, para no estorbar en la
            mesa.
          </li>
        </ul>

        <h3 className="font-semibold text-base text-slate-100">Cómo llevar el robot a HOME</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>
            Manualmente: en modo TEACH, con JOG, llevarlo eje a eje hasta la pose HOME.
          </li>
          <li>
            Desde un programa: ejecutar el programa de HOME o las primeras líneas del programa actual
            en modo CHECK.
          </li>
          <li>
            Si hay duda de dónde está el robot tras un error o e-stop, llevarlo a HOME en CHECK a
            velocidad baja antes de continuar.
          </li>
        </ul>

        <h3 className="font-semibold text-base text-slate-100">Cómo se graba el punto HOME en un programa</h3>
        <p className="text-slate-200">
          Es un punto más: se enseña como cualquier otro (ver "Grabar un punto"), normalmente con
          instrucción <strong>AC</strong> e interpolación <strong>JOINT</strong>, porque interesa que el
          robot llegue a la pose con su movimiento más natural y rápido sin soldar.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Dónde se configura la pose HOME</h3>
        <p className="text-slate-200">
          La pose HOME se ajusta en{' '}
          <span className="font-mono text-slate-100">AUX 0402 Posición de inicio</span>{' '}
          (equivalente a las instrucciones <span className="font-mono">SETHOME / SET2HOME</span>{' '}
          del lenguaje AS). En esa pantalla se ven los valores actuales de cada eje y se pueden
          modificar manualmente.
        </p>
        <PdfFigure
          src={pdfImage('serie_e', 214)}
          caption="Pantalla AUX 0402 — Posición de inicio. Selecciona qué HOME ajustar (HOME 1 / HOME 2) y abre el editor de pose (Serie E §4.2 — AUX 0402)."
        />
        <PdfFigure
          src={pdfImage('serie_e', 215)}
          caption="Editor de la pose HOME: se introducen valores numéricos para cada eje (JT1..JT6) o se captura la pose actual del robot."
        />

        <p className="text-xs text-slate-400 italic">
          Fuente: 90203-1104DSB Operation Manual (Serie E), AUX 0402 — Posición de inicio.
          Pendiente: documentar en el manual del taller la pose HOME exacta de esta célula.
        </p>
      </div>
    ),
  },
  'instrucciones-punto': {
    title: 'Instrucciones del punto',
    body: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-slate-300">
          Cuando enseñas un punto, además de la posición y la interpolación tienes que decirle al
          robot <strong>qué tipo de instrucción</strong> es ese punto. Eso es lo que diferencia un
          movimiento de aproximación de uno donde el robot arranca o termina la soldadura.
        </p>
        <p className="text-slate-300">
          En el manual Arc Welding (E series, §5.6) la fila de edición muestra esta secuencia:
          <span className="font-mono text-slate-100"> AC → WS → WC → WE → AS → AC</span>.
        </p>

        <div className="space-y-2">
          <InstrCard tag="AC" name="Air Cut" color="sky">
            Mover el robot al punto objetivo <strong>sin soldar</strong>. Es el típico "punto de
            aproximación". Todo programa empieza y termina con instrucciones AC (HOME, entradas, salidas).
            En wire check y touch sensing <strong>todos</strong> los puntos llevan AC.
          </InstrCard>
          <InstrCard tag="WS" name="Weld Start" color="emerald">
            <strong>Inicia</strong> el arco. Al llegar a este punto el robot dispara la salida hacia la
            fuente EWM (con el JOB seleccionado) y empieza a soldar.
          </InstrCard>
          <InstrCard tag="WC" name="Weld Continue" color="amber">
            Punto <strong>intermedio</strong> del cordón. Mantiene el arco encendido entre WS y WE.
            Usado para cambiar parámetros a mitad del cordón o seguir una trayectoria curva.
          </InstrCard>
          <InstrCard tag="WE" name="Weld End" color="rose">
            <strong>Termina</strong> el cordón. Apaga el arco y aplica las condiciones de fin de
            soldadura (crater fill, control de gas, etc.).
          </InstrCard>
          <InstrCard tag="AS" name="Arc Spot" color="fuchsia">
            Soldadura <strong>por puntos de arco</strong>: el robot llega, dispara un punto de arco con
            duración fija y sigue. Útil en puntos cortos sustitutos del soldeo por puntos por resistencia.
          </InstrCard>
        </div>

        <p className="text-slate-300">
          Detalle importante: la <strong>instrucción</strong> (AC/WS/WC/WE/AS) y la{' '}
          <strong>interpolación</strong> (JOINT/LINEAR) son cosas distintas y se eligen por separado.
          Un mismo punto AC puede ser JOINT (movimiento articular) o LINEAR (recta).
        </p>

        <h3 className="font-semibold text-base text-slate-100">Tabla del manual</h3>
        <p className="text-slate-300">
          Tabla original del Arc Welding (§5.5) con los datos auxiliares que pueden establecerse o
          modificarse para cada tipo de punto:
        </p>
        <PdfFigure
          src={pdfImage('arc_welding', 49)}
          caption="Tipos de puntos de enseñanza (AC, WS, WC, WE) y datos auxiliares de cada uno (Arc Welding §5.5)."
        />

        <h3 className="font-semibold text-base text-slate-100">Ejemplo: cordón horizontal (P0→P3)</h3>
        <p className="text-slate-300">
          Flujo básico de soldadura con un cordón recto entre P1 y P2: el robot parte de P0 (AC),
          baja a P1 (WS, inicio del arco), recorre el cordón hasta P2 (WE, fin del arco) y vuelve a
          P3 (AC, retorno).
        </p>
        <PdfFigure
          src={pdfImage('arc_welding', 60)}
          caption="Flujo básico de aprendizaje con cuatro puntos: AC → WS → WE → AC (Arc Welding §5.7.1)."
        />

        <h3 className="font-semibold text-base text-slate-100">Ejemplo con punto de escape (P0..P5)</h3>
        <p className="text-slate-300">
          Caso real con un punto de escape: cuando el cordón termina en una esquina o el robot no
          puede salir en recta, se añade un punto AC intermedio que aleja la antorcha antes de
          volver a HOME.
        </p>
        <PdfFigure
          src={pdfImage('arc_welding', 65)}
          caption="Figura 5.1: cordón con punto de inicio P1, continuación P2, fin P3, escape P4 y retorno P5 (Arc Welding §5.8.3)."
        />

        <h3 className="font-semibold text-base text-slate-100">Cómo se introducen en el TP</h3>
        <p className="text-slate-300">
          En la pantalla de aprendizaje las instrucciones se ven y se cambian en la{' '}
          <strong>fila de instrucciones</strong>, separada de la posición y de los parámetros:
        </p>
        <PdfFigure
          src={pdfImage('arc_welding', 48)}
          caption="Estructura de la pantalla de aprendizaje: instrucciones de elemento y parámetros correspondientes (Arc Welding §5.5)."
        />

        <p className="text-xs text-slate-400 italic">
          Fuente: 90203-1036DSB Arc Welding Operation Manual (Serie E), §5.4-§5.8 — Aprendizaje y
          registro de programa.
        </p>
      </div>
    ),
  },
  'interpolaciones': {
    title: 'Interpolaciones',
    body: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-slate-300">
          La <strong>interpolación</strong> define <em>cómo</em> se mueve el robot entre dos puntos
          enseñados. La instrucción (AC/WS/WC/WE/AS) dice <em>qué hace</em> al llegar; la interpolación
          dice <em>cómo viaja</em> hasta llegar.
        </p>

        <div className="space-y-2">
          <InstrCard tag="JOINT" name="Movimiento articular" color="sky">
            Cada eje (JT1..JT6) recorre su trayectoria al mismo tiempo y termina a la vez. El TCP
            describe una curva, no una recta. Es el movimiento más rápido y más seguro para llegar a
            posiciones de aproximación, retornos a HOME, etc.
          </InstrCard>
          <InstrCard tag="LINEAR" name="Movimiento lineal" color="emerald">
            El TCP sigue una <strong>línea recta</strong> en el espacio entre dos puntos. Se usa para
            seguir cordones de soldadura rectos o aproximaciones donde importa la trayectoria.
          </InstrCard>
          <InstrCard tag="CIRCULAR" name="Movimiento circular" color="amber">
            El TCP sigue una curva en arco entre tres puntos. Se usa para cordones curvos.
          </InstrCard>
        </div>

        <h3 className="font-semibold text-base text-slate-100">Tabla del manual</h3>
        <p className="text-slate-300">
          La Serie E distingue dos circulares: <strong>Circular1</strong> (paso por punto auxiliar)
          y <strong>Circular2</strong> (misma forma que el punto anterior). La columna de la derecha
          indica qué instrucciones de punto (AC/WS/WC/WE/AS) acepta cada interpolación:
        </p>
        <PdfFigure
          src={pdfImage('arc_welding', 51)}
          caption="Tabla de interpolaciones JOINT, Linear, Circular1 y Circular2, con las instrucciones de punto que admite cada una (Arc Welding §5.5.2)."
        />

        <p className="text-slate-300">
          En las pantallas del TP, la interpolación aparece junto a la instrucción y los parámetros de
          velocidad/precisión. Ejemplo de línea de programa de un wire check:
        </p>
        <pre className="text-xs bg-slate-900/60 p-3 rounded-lg overflow-x-auto text-slate-200">
{`1 AC JOINT  2 1 0
2 AC LINEAR 2 1 0
3 AC LINEAR 2 1 0 [Wire Check]
4 AC LINEAR 2 1 0
5 AC JOINT  2 1 0`}
        </pre>
        <p className="text-xs text-slate-400">
          Todas las líneas son AC (sin soldar). Las que se aproximan/salen son JOINT, y las que viajan
          en recta hacia la pieza son LINEAR.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Sistemas de coordenadas para el JOG</h3>
        <p className="text-slate-300">
          Aunque la interpolación define el movimiento al ejecutar el programa, también es importante
          el <strong>sistema de coordenadas</strong> con el que se mueve el robot en modo manual (JOG).
          La Serie E ofrece tres modos:
        </p>
        <PdfFigure
          src={pdfImage('serie_e', 101)}
          caption="Modo coordenadas de eje: cada tecla mueve un eje (JT1..JT6) por separado (Serie E §4.2.1)."
        />
        <PdfFigure
          src={pdfImage('serie_e', 103)}
          caption="Modo coordenadas de base: el TCP se mueve respecto al sistema X/Y/Z fijo a la base del robot (Serie E §4.2.2)."
        />
        <PdfFigure
          src={pdfImage('serie_e', 105)}
          caption="Modo coordenadas de herramienta: el TCP se mueve respecto al sistema X/Y/Z definido en la antorcha (Serie E §4.2.3)."
        />

        <h3 className="font-semibold text-base text-slate-100">Cómo se introduce la interpolación en el programa</h3>
        <PdfFigure
          src={pdfImage('serie_e', 114)}
          caption="Pantalla del TP para elegir la instrucción de interpolación (JOINT, LINEAR, CIRCULAR) del punto (Serie E §5.3.1)."
        />

        <p className="text-xs text-slate-400 italic">
          Fuente: 90203-1104DSB Operation Manual (Serie E), §4.2 (coordenadas) y §5.3.1 (interpolación).
        </p>
      </div>
    ),
  },
  'touch-sensing-wire-check': {
    title: 'Touch sensing y wire check',
    body: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-slate-300">
          Las dos funciones usan el <strong>hilo como sensor de contacto</strong>: cuando toca una
          referencia conductora (mesa o pieza) cierra circuito y el controlador detecta el contacto.
          A partir de ahí cada función hace una cosa distinta.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Wire check</h3>
        <p>
          Sirve para <strong>ajustar el largo del hilo</strong> que sobresale del tubo de contacto
          (stick-out). El robot retrae el hilo y vuelve a sacarlo hasta hacer contacto en un punto de
          referencia. Útil antes de empezar a soldar o antes de un touch sensing.
        </p>
        <figure className="overflow-hidden rounded-xl border border-slate-700/60">
          <ZoomableImage
            src={pdfImage('wire_check', 3)}
            alt="Esquema wire check"
            className="w-full h-auto bg-white"
          />
          <figcaption className="text-xs text-slate-300 px-3 py-2 bg-slate-900/40">
            Esquema del PDF: punto A (aproximación), punto B (contacto con la pieza) y punto C
            (salida). Todos los puntos AC.
          </figcaption>
        </figure>

        <h3 className="font-semibold text-base text-slate-100">Touch sensing</h3>
        <p>
          Sirve para <strong>localizar la pieza real</strong>: el robot toca con el hilo en uno o
          varios puntos y, comparando la posición tocada con la posición enseñada, calcula la
          desviación de la pieza y la aplica a los puntos siguientes del programa. Permite usar 3
          patrones simultáneos: <strong>Mother</strong>, <strong>Daughter</strong> y{' '}
          <strong>Niña</strong>.
        </p>
        <figure className="overflow-hidden rounded-xl border border-slate-700/60">
          <ZoomableImage
            src={pdfImage('touch_sensing', 2)}
            alt="Configuración touch sensing"
            className="w-full h-auto bg-white"
          />
          <figcaption className="text-xs text-slate-300 px-3 py-2 bg-slate-900/40">
            Pantalla de configuración de touch sensing: distancia y velocidad de búsqueda.
          </figcaption>
        </figure>

        <p className="text-slate-300">
          Las dos funciones <strong>se configuran en el mismo sitio</strong>:
          <span className="font-mono text-slate-100"> AUX 14.Arc Weld → 04.Arc Weld Setting → 10.Touch Sensing</span>.
        </p>

        <p className="text-xs text-slate-400 italic">
          Fuentes: wire_check.pdf y Touch_sensing.pdf (LARRAIOZ Elektronika).
        </p>
      </div>
    ),
  },
  'job-ewm': {
    title: 'JOB (EWM Titan XQ 350 Plus)',
    body: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-slate-300">
          Un <strong>JOB</strong> en la fuente <strong>EWM Titan XQ 350 Plus</strong> es una{' '}
          <strong>receta de soldadura</strong> guardada en su memoria que define todo lo necesario
          para soldar una combinación concreta. Al elegir esa combinación, la fuente carga internamente
          una <strong>curva sinérgica</strong> calibrada en fábrica — la relación entre velocidad de
          hilo, intensidad y tensión que mantiene el arco estable para ese caso. Esa curva{' '}
          <em>es</em> el JOB.
        </p>

        <p className="text-slate-300">
          La metáfora útil: el JOB es el <strong>"plato del menú"</strong> (ingredientes fijos =
          material + gas + hilo + proceso). Dentro de cada plato puedes pedir{' '}
          <strong>variaciones</strong> (más hecho, menos sal): eso son los{' '}
          <strong>programas P0..P15</strong> dentro del JOB.
        </p>

        <JobDiagram />

        <h3 className="font-semibold text-base text-slate-100">Qué fija el JOB (no se toca por programa)</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li><strong>Proceso</strong>: MIG/MAG estándar, pulsado, ForceArc, ColdArc, rootArc, superPuls…</li>
          <li><strong>Material base</strong>: acero al carbono, inoxidable, aluminio, CuSi…</li>
          <li><strong>Gas de protección</strong>: M21, M20, M12, C1, I1…</li>
          <li><strong>Diámetro de hilo</strong>: 0,8 / 1,0 / 1,2 / 1,6 mm.</li>
          <li><strong>Curva sinérgica</strong>: lo que ata todo lo anterior y mantiene el arco estable.</li>
        </ul>
        <p className="text-slate-400 text-xs">
          Si cambias cualquiera de esos cinco, cambias de JOB. No puedes "convertir" un JOB de acero
          en uno de aluminio modificando parámetros.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Qué puede variar entre programas P1..P15</h3>
        <p className="text-slate-300">
          Cada programa dentro de un mismo JOB es un <strong>preset de correcciones y punto de
          trabajo</strong> sobre esa curva sinérgica. P0 es el modo manual (mando libre); P1..P15 son
          recetas guardadas que se llaman desde el robot o el panel:
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-700/60">
          <table className="w-full text-xs">
            <thead className="bg-slate-800/60 text-slate-200">
              <tr>
                <th className="text-left px-3 py-2">Parámetro</th>
                <th className="text-left px-3 py-2">Qué hace</th>
                <th className="text-left px-3 py-2">Rango típico</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>Velocidad de hilo (WFS)</strong></td>
                <td className="px-3 py-2 align-top">
                  Mueve el punto de operación a lo largo de la curva. Más WFS = más I y más U
                  automáticamente.
                </td>
                <td className="px-3 py-2 align-top">Todo el rango útil del JOB (p. ej. 3-14 m/min)</td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>Corrección de tensión (U-corr)</strong></td>
                <td className="px-3 py-2 align-top">
                  Ajusta U respecto a lo que la sinergia te da, sin tocar I. Arco más largo (+) o más
                  corto (−).
                </td>
                <td className="px-3 py-2 align-top">±3 V típico</td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>Dinámica de arco</strong></td>
                <td className="px-3 py-2 align-top">Rigidez del arco (concentrado/blando).</td>
                <td className="px-3 py-2 align-top">−9…+9 ó 0-100 según menú</td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>Corrección long. arco (pulsado)</strong></td>
                <td className="px-3 py-2 align-top">Análogo a U-corr pero específico de pulsado.</td>
                <td className="px-3 py-2 align-top">±30 % aprox.</td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>Pre-flow / Post-flow gas</strong></td>
                <td className="px-3 py-2 align-top">Tiempo de gas antes y después del arco.</td>
                <td className="px-3 py-2 align-top">0-20 s</td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>Slope arranque / cráter</strong></td>
                <td className="px-3 py-2 align-top">
                  Rampa de subida al iniciar y bajada para rellenar cráter al cerrar.
                </td>
                <td className="px-3 py-2 align-top">Tiempo + WFS objetivo</td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>Pulsado on/off</strong></td>
                <td className="px-3 py-2 align-top">
                  Conmutar estándar/pulsado dentro del mismo JOB si la fuente lo permite.
                </td>
                <td className="px-3 py-2 align-top">Sí / No</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold text-base text-slate-100">Ejemplo: un mismo JOB, cuatro recetas</h3>
        <p className="text-slate-300">
          JOB de <em>acero al carbono · M21 · hilo Ø1,0</em>. Caso real: el mismo cordón en posición
          PB (horizontal-vertical) y en PF (vertical ascendente), con raíz y relleno por posición:
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-700/60">
          <table className="w-full text-xs">
            <thead className="bg-slate-800/60 text-slate-200">
              <tr>
                <th className="text-left px-3 py-2">Programa</th>
                <th className="text-left px-3 py-2">Caso</th>
                <th className="text-left px-3 py-2">WFS</th>
                <th className="text-left px-3 py-2">U-corr</th>
                <th className="text-left px-3 py-2">Notas</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2"><strong>P1</strong></td>
                <td className="px-3 py-2">PB raíz</td>
                <td className="px-3 py-2">7,5 m/min</td>
                <td className="px-3 py-2">0</td>
                <td className="px-3 py-2">Estándar o pulsado</td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2"><strong>P2</strong></td>
                <td className="px-3 py-2">PB relleno</td>
                <td className="px-3 py-2">9,5 m/min</td>
                <td className="px-3 py-2">+1 V</td>
                <td className="px-3 py-2">Estándar</td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2"><strong>P3</strong></td>
                <td className="px-3 py-2">PF raíz</td>
                <td className="px-3 py-2">4,5 m/min</td>
                <td className="px-3 py-2">−1 V</td>
                <td className="px-3 py-2">Pulsado bajo, weaving OFF</td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2"><strong>P4</strong></td>
                <td className="px-3 py-2">PF relleno</td>
                <td className="px-3 py-2">6 m/min</td>
                <td className="px-3 py-2">0</td>
                <td className="px-3 py-2">Pulsado, weaving ON</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-slate-300">
          Una sola curva sinérgica, cuatro recetas. En el TP del robot llamas a la condición C1, C2,
          C3 o C4 (Aux 0420 del Kawasaki) y cada una apunta a JOB X / Pn correspondiente.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Lo que NO puedes hacer dentro del mismo JOB</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>Cambiar material / gas / hilo → necesitas otro JOB.</li>
          <li>Sacar la WFS fuera del rango sinérgico del JOB (te dará warning de "fuera de curva").</li>
          <li>
            Forzar combinaciones I/U incoherentes con la curva (la U-corr tiene un margen limitado
            justo para evitar esto).
          </li>
        </ul>

        <h3 className="font-semibold text-base text-slate-100">JOBs disponibles en la fuente</h3>
        <p className="text-slate-300">
          La Titan XQ 350 Plus admite hasta <strong>510 JOBs</strong> en memoria. EWM precarga de
          fábrica una biblioteca con los casos más comunes; los huecos restantes quedan libres para
          que tú guardes los tuyos. La biblioteca de fábrica se organiza por{' '}
          <strong>proceso × material × gas × diámetro de hilo</strong>:
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-700/60">
          <table className="w-full text-xs">
            <thead className="bg-slate-800/60 text-slate-200">
              <tr>
                <th className="text-left px-3 py-2">Familia</th>
                <th className="text-left px-3 py-2">Material típico</th>
                <th className="text-left px-3 py-2">Gas</th>
                <th className="text-left px-3 py-2">Hilo Ø (mm)</th>
                <th className="text-left px-3 py-2">Procesos habituales</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>Acero al carbono</strong></td>
                <td className="px-3 py-2 align-top">G3Si1, G4Si1 (ER70S-6)</td>
                <td className="px-3 py-2 align-top">M21, M20, C1</td>
                <td className="px-3 py-2 align-top">0,8 · 1,0 · 1,2</td>
                <td className="px-3 py-2 align-top">
                  Estándar, pulsado, <em>rootArc</em>, <em>ForceArc</em>, <em>ColdArc</em>
                </td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>Inoxidable</strong></td>
                <td className="px-3 py-2 align-top">CrNi 19/9, 308LSi, 316LSi</td>
                <td className="px-3 py-2 align-top">M12, M11, Ar+2%CO₂</td>
                <td className="px-3 py-2 align-top">0,8 · 1,0 · 1,2</td>
                <td className="px-3 py-2 align-top">Estándar, pulsado, <em>superPuls</em></td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>Aluminio</strong></td>
                <td className="px-3 py-2 align-top">AlMg5, AlMg4.5Mn, AlSi5</td>
                <td className="px-3 py-2 align-top">I1 (Ar 100 %)</td>
                <td className="px-3 py-2 align-top">1,0 · 1,2 · 1,6</td>
                <td className="px-3 py-2 align-top">Pulsado, <em>superPuls</em>, <em>ColdArc</em></td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>CuSi / CuAl</strong></td>
                <td className="px-3 py-2 align-top">CuSi3, CuAl8</td>
                <td className="px-3 py-2 align-top">I1 (Ar 100 %)</td>
                <td className="px-3 py-2 align-top">1,0 · 1,2</td>
                <td className="px-3 py-2 align-top">
                  Pulsado, <em>ColdArc</em> (soldeo MIG-brazing chapa galvanizada)
                </td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>Hilo tubular / aportes especiales</strong></td>
                <td className="px-3 py-2 align-top">Rutilo, básico, metal cored</td>
                <td className="px-3 py-2 align-top">M21, C1</td>
                <td className="px-3 py-2 align-top">1,2 · 1,4 · 1,6</td>
                <td className="px-3 py-2 align-top">Estándar, pulsado</td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 align-top"><strong>JOBs de usuario</strong></td>
                <td className="px-3 py-2 align-top">—</td>
                <td className="px-3 py-2 align-top">—</td>
                <td className="px-3 py-2 align-top">—</td>
                <td className="px-3 py-2 align-top">
                  Huecos libres para guardar combinaciones propias.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-slate-400 text-xs italic">
          Importante: la tabla anterior es la estructura <em>típica</em> de la biblioteca de fábrica.
          Los <strong>números de JOB exactos</strong> (qué JOB es cuál) dependen del firmware y de
          los paquetes contratados con tu máquina. Para tener el listado real de tu Titan XQ 350 Plus,
          confirmar en la propia fuente (ver paso siguiente) y completar aquí.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Cómo ver el listado real desde la fuente</h3>
        <ol className="list-decimal list-inside space-y-1 text-slate-200">
          <li>Entrar en <strong>Modo Expert</strong> del panel de la Titan XQ.</li>
          <li>
            Menú <span className="font-mono text-slate-100">JOB → Lista de JOBs</span> (o equivalente en
            tu firmware: la pantalla muestra número, material, gas, Ø hilo y proceso).
          </li>
          <li>
            Anotar los JOBs precargados y los huecos libres. Esa lista es la "biblioteca real" de tu
            máquina.
          </li>
        </ol>

        <p className="text-slate-300">
          Para soldar el robot con un JOB concreto, ese número es el que se le pasa a la fuente
          desde el Kawasaki (ver{' '}
          <Link to="/fundamentos/instrucciones-punto" className="text-indigo-300 underline">
            Instrucciones del punto (WS/WC)
          </Link>{' '}
          y la base de datos de condiciones Aux 0420 del controlador).
        </p>

        <p className="text-xs text-slate-400 italic">
          Fuentes: documentación EWM Expert XQ 2.0 (ewm-group.com / manualslib). Pendiente: capturas
          de pantalla del menú real de la Titan XQ 350 Plus y completar la tabla con los JOBs
          concretos de esta máquina.
        </p>
      </div>
    ),
  },
  'weaving': {
    title: 'Weaving (oscilación lateral)',
    body: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-slate-300">
          El <strong>weaving</strong> (en el manual en español, "desplazamiento lateral") es el
          movimiento <strong>oscilante</strong> que hace la antorcha mientras suelda, en vez de
          avanzar en línea recta. Se usa para <strong>ensanchar el cordón</strong>, repartir mejor
          el calor o rellenar un chaflán ancho de una sola pasada.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Los tres parámetros</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>
            <strong>Anchura (Weaving width, WV)</strong>: cuánto se separa la punta de la línea
            central, en mm. Es la "amplitud" del zigzag.
          </li>
          <li>
            <strong>Frecuencia (Weaving frequency)</strong>: cuántas oscilaciones completas por
            segundo (Hz). A más frecuencia, más juntas las "ondas" del cordón.
          </li>
          <li>
            <strong>Patrón (Pattern N.º, PN)</strong>: la <em>forma</em> de la oscilación. El
            controlador trae 6 patrones estándar (ver más abajo) y, si está la opción instalada,
            permite crear hasta 5 patrones propios (PN=6 a PN=10).
          </li>
        </ul>

        <h3 className="font-semibold text-base text-slate-100">Sistema de ejes del weaving</h3>
        <p className="text-slate-300">
          El manual define tres direcciones referidas a la antorcha y al avance, no a los ejes del
          robot:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>
            <strong>Vertical</strong>: dirección de la antorcha (+ hacia arriba, alejándose de la
            pieza).
          </li>
          <li>
            <strong>Lateral</strong>: perpendicular a la antorcha y al avance. Es donde "abre" el
            zigzag.
          </li>
          <li>
            <strong>Horizontal</strong>: dirección del movimiento de soldadura (+ hacia delante).
          </li>
        </ul>
        <PdfFigure
          src={pdfImage('arc_welding', 216)}
          caption="Direcciones vertical / lateral / horizontal del weaving y anchura WV (Arc Welding §10.2)."
        />

        <h3 className="font-semibold text-base text-slate-100">Patrones estándar</h3>
        <p className="text-slate-300">
          El controlador trae estos seis patrones ya cargados (un genérico "Standard" + cinco con
          número PN=1..5):
        </p>
        <PdfFigure
          src={pdfImage('arc_welding', 213)}
          caption="Tabla de patrones estándar registrados (Arc Welding §10.1.1): Simple harmonic, Simple harmonic both ends stop, Triangular, Reciprocating triangular, Circular CW y Circular CCW."
        />
        <PdfFigure
          src={pdfImage('arc_welding', 217)}
          caption="Relación entre frecuencia y ciclo, y ejemplo del PN=1 (armónico simple con parada en ambos extremos) a 0,5 Hz, 1 Hz y 2 Hz."
        />

        <h3 className="font-semibold text-base text-slate-100">Dónde se mete en el programa</h3>
        <p>
          Los datos de weaving se introducen en los datos auxiliares de los puntos{' '}
          <span className="chip bg-amber-500/25 text-amber-100 border border-amber-400/40 mr-1">
            WC
          </span>{' '}
          y{' '}
          <span className="chip bg-rose-500/25 text-rose-100 border border-rose-400/40 mr-1">
            WE
          </span>{' '}
          — los puntos del cordón propiamente dicho. El{' '}
          <span className="chip bg-emerald-500/25 text-emerald-100 border border-emerald-400/40 mr-1">
            WS
          </span>{' '}
          (inicio de soldadura) lleva el dato de arco pero no de weaving (la oscilación arranca
          desde el primer WC).
        </p>
        <PdfFigure
          src={pdfImage('arc_welding', 56)}
          caption="Apartado §5.5.12: los datos de weaving (Width, Frequency, Pattern) están disponibles para las instrucciones WC y WE."
        />

        <h3 className="font-semibold text-base text-slate-100">
          Comportamiento en CHECK (soldadura desactivada)
        </h3>
        <p className="text-slate-300">
          Cuando se prueba el programa sin soldar (modo CHECK con weld OFF), por defecto el robot{' '}
          <strong>no oscila</strong>: recorre la línea base para que puedas verificar la
          trayectoria sin perder tiempo con el zigzag. La pantalla muestra el aviso "Weaving OFF"
          como recordatorio.
        </p>
        <PdfFigure
          src={pdfImage('arc_welding', 78)}
          caption='Indicador "Weaving OFF" en pantalla cuando la soldadura está deshabilitada y el ajuste "Weaving Motion at Weld Off" está en Disable (Arc Welding §6.2).'
        />
        <p className="text-slate-300">
          Si quieres comprobar también el zigzag en CHECK, hay que activar
          <span className="font-mono text-slate-100"> Aux. 140409 → Weaving Motion at Weld Off = Enable</span>.
        </p>

        <p className="text-xs text-slate-400 italic">
          Fuente: Arc Welding Operation Manual (Serie E), §5.5.12 (datos en WC/WE), §6.2 (CHECK
          sin oscilar) y §10 (patrones estándar y patrón especial opcional).
        </p>
      </div>
    ),
  },
};

function PdfFigure({ src, caption }: { src: string; caption: string }) {
  if (!src) return null;
  return (
    <figure className="overflow-hidden rounded-xl border border-slate-700/60">
      <ZoomableImage src={src} alt={caption} className="w-full h-auto bg-white" />
      <figcaption className="text-xs text-slate-300 px-3 py-2 bg-slate-900/40">
        {caption}
      </figcaption>
    </figure>
  );
}

// Diagrama conceptual del JOB y sus 16 programas P0..P15.
// Pensado para móvil: el bloque JOB arriba (lo que NO se toca por programa),
// y debajo una rejilla de 16 tarjetas P0..P15 (lo que SÍ varía por programa).
function JobDiagram() {
  const programs: { id: string; label: string; example: string; highlight?: boolean }[] = [
    { id: 'P0', label: 'Manual', example: 'WFS libre', highlight: true },
    { id: 'P1', label: 'PB raíz', example: '7,5 m/min · 0 V' },
    { id: 'P2', label: 'PB relleno', example: '9,5 m/min · +1 V' },
    { id: 'P3', label: 'PF raíz', example: '4,5 m/min · −1 V' },
    { id: 'P4', label: 'PF relleno', example: '6,0 m/min · 0 V' },
    { id: 'P5', label: '—', example: 'libre' },
    { id: 'P6', label: '—', example: 'libre' },
    { id: 'P7', label: '—', example: 'libre' },
    { id: 'P8', label: '—', example: 'libre' },
    { id: 'P9', label: '—', example: 'libre' },
    { id: 'P10', label: '—', example: 'libre' },
    { id: 'P11', label: '—', example: 'libre' },
    { id: 'P12', label: '—', example: 'libre' },
    { id: 'P13', label: '—', example: 'libre' },
    { id: 'P14', label: '—', example: 'libre' },
    { id: 'P15', label: '—', example: 'libre' },
  ];

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-3 sm:p-4 space-y-3">
      {/* Cabecera: el JOB (lo invariante) */}
      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
        <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">
          JOB nº __
        </div>
        <div className="font-semibold text-emerald-50 mt-0.5">
          Acero al carbono · Gas M21 · Hilo Ø 1,0 mm · Pulsado
        </div>
        <div className="text-xs text-emerald-200/80 mt-1">
          Curva sinérgica fija (la relación I–U–WFS calibrada por EWM). No se toca por programa.
        </div>
      </div>

      {/* Flecha "contiene" */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-700" />
        <span>contiene 16 programas</span>
        <span className="h-px flex-1 bg-slate-700" />
      </div>

      {/* Rejilla de programas P0..P15 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {programs.map((p) => (
          <div
            key={p.id}
            className={
              p.highlight
                ? 'rounded-lg border border-amber-500/50 bg-amber-500/10 p-2'
                : p.label === '—'
                ? 'rounded-lg border border-slate-700/60 bg-slate-800/30 p-2 opacity-60'
                : 'rounded-lg border border-indigo-500/40 bg-indigo-500/10 p-2'
            }
          >
            <div
              className={
                p.highlight
                  ? 'font-mono font-bold text-amber-200 text-sm'
                  : p.label === '—'
                  ? 'font-mono font-bold text-slate-400 text-sm'
                  : 'font-mono font-bold text-indigo-200 text-sm'
              }
            >
              {p.id}
            </div>
            <div
              className={
                p.label === '—'
                  ? 'text-[11px] text-slate-500 leading-tight mt-0.5'
                  : 'text-[11px] text-slate-200 leading-tight mt-0.5'
              }
            >
              {p.label}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{p.example}</div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-400 leading-snug">
        Cada programa ajusta <strong>WFS, corrección de tensión, dinámica, slope y gas</strong> sobre
        la misma curva sinérgica. <span className="text-amber-300 font-semibold">P0</span> es el modo
        manual; <span className="text-indigo-300 font-semibold">P1..P15</span> son recetas guardadas.
        Las casillas en gris están libres para guardar más recetas.
      </p>
    </div>
  );
}

function InstrCard({
  tag,
  name,
  color,
  children,
}: {
  tag: string;
  name: string;
  color: 'sky' | 'emerald' | 'amber' | 'rose' | 'fuchsia';
  children: React.ReactNode;
}) {
  const palette: Record<typeof color, string> = {
    sky: 'bg-sky-500/15 border-sky-400/40 text-sky-100',
    emerald: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-100',
    amber: 'bg-amber-500/15 border-amber-400/40 text-amber-100',
    rose: 'bg-rose-500/15 border-rose-400/40 text-rose-100',
    fuchsia: 'bg-fuchsia-500/15 border-fuchsia-400/40 text-fuchsia-100',
  };
  return (
    <div className={`rounded-xl border p-3 ${palette[color]}`}>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-mono font-bold text-base">{tag}</span>
        <span className="text-xs text-slate-300">{name}</span>
      </div>
      <p className="text-sm text-slate-100">{children}</p>
    </div>
  );
}
