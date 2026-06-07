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
    id: 'modos-robot',
    title: 'Modos del robot y arranque/parada',
    blurb:
      'Selector TEACH/REPEAT/CHECK, override de velocidad, cómo encender, apagar y detener el robot.',
    to: '/fundamentos/modos-robot',
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
    id: 'estado-soldadura',
    title: 'Estado de soldadura (Weld condition N.º)',
    blurb:
      'Receta de soldadura completa que se llama desde el TP (Aux 0420): corriente, tensión, JOB, gas, weaving.',
    to: '/fundamentos/estado-soldadura',
  },
  {
    id: 'interpolaciones',
    title: 'Interpolaciones (JOINT / LINEAR)',
    blurb: 'Cómo se mueve el robot entre dos puntos: por eje a eje, en recta, en circular.',
    to: '/fundamentos/interpolaciones',
  },
  {
    id: 'posiciones-soldadura',
    title: 'Posiciones de soldadura (1F-4F · 1G-6G · PA-PG)',
    blurb:
      'Cómo se nombra cada posición de soldeo en AWS A3.0 e ISO 6947, y cómo influye en parámetros y weaving.',
    to: '/fundamentos/posiciones-soldadura',
  },
  {
    id: 'touch-sensing-wire-check',
    title: 'Touch sensing y wire check',
    blurb: 'Para qué sirven, en qué se diferencian y dónde se configuran en el TP.',
    to: '/fundamentos/touch-sensing-wire-check',
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
  'modos-robot': {
    title: 'Modos del robot y arranque/parada',
    body: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-slate-300">
          El selector de modo del armario controlador decide <strong>cómo se mueve el robot</strong>{' '}
          en cada momento. Los tres modos básicos son los mismos que aparecen en el teach pendant, pero
          aquí los miramos desde el punto de vista de <em>qué se puede hacer</em> en cada uno y de{' '}
          <em>cuánto corre</em> el robot.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Los tres modos</h3>
        <div className="space-y-2">
          <InstrCard tag="TEACH" name="Enseñanza" color="sky">
            Único modo en el que <strong>se puede mover el robot con el JOG</strong> del TP. Velocidad
            limitada por norma (≤ 250 mm/s en el TCP). Necesitas pulsar el <strong>gatillo de hombre
            muerto</strong> del TP para que los motores tengan corriente. Se usa para grabar puntos,
            modificar puntos ya grabados y comprobar trayectorias en pequeño.
          </InstrCard>
          <InstrCard tag="REPEAT" name="Ejecución automática" color="emerald">
            El robot ejecuta el programa <strong>a velocidad de producción</strong> sin gatillo de
            hombre muerto. Solo se arranca y se para con el botón de ciclo. Es el modo de soldar de
            verdad. Las puertas/vallas de seguridad deben estar cerradas.
          </InstrCard>
          <InstrCard tag="CHECK" name="Prueba paso a paso" color="amber">
            Ejecuta el programa <strong>una instrucción cada vez</strong>, normalmente con la
            soldadura desactivada, para comprobar trayectorias y puntos antes de soldar. Necesita
            gatillo de hombre muerto como en TEACH.
          </InstrCard>
        </div>

        <h3 className="font-semibold text-base text-slate-100">Override de velocidad</h3>
        <p className="text-slate-300">
          En cualquier modo el TP tiene un <strong>override</strong> (% sobre la velocidad programada).
          Buena práctica: empezar siempre las pruebas en <strong>10-25 %</strong>, subir hasta{' '}
          <strong>50 %</strong> cuando la trayectoria esté validada, y solo dejar el <strong>100 %</strong>{' '}
          para producción. Las teclas de override están en el bloque del TP y suelen ser{' '}
          <span className="font-mono">SPEED +</span> / <span className="font-mono">SPEED −</span>.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Encendido</h3>
        <ol className="list-decimal list-inside space-y-1 text-slate-200">
          <li>
            Comprobar que las setas de emergencia están desbloqueadas y la zona del robot
            despejada.
          </li>
          <li>Encender el interruptor principal del armario del controlador.</li>
          <li>
            Esperar al arranque completo y a que el TP muestre la pantalla de operación.
          </li>
          <li>
            Activar la alimentación a los motores: pulsar <strong>MOTOR ON / ENABLE</strong> en
            el armario o en el TP.
          </li>
          <li>
            Verificar que no hay errores activos. Si los hay, anotarlos en el diario y consultar
            Códigos de error.
          </li>
        </ol>
        <p className="text-xs text-slate-400">
          Si tras encender no se activan los motores, revisar el circuito de emergencia (setas,
          valla, puerta de seguridad).
        </p>
        <PdfFigure
          src={pdfImage('serie_e', 94)}
          caption="Procedimiento de encendido (Serie E §3.1): interruptor principal del armario → arranque del sistema → MOTOR ON."
        />

        <h3 className="font-semibold text-base text-slate-100">Apagado</h3>
        <ol className="list-decimal list-inside space-y-1 text-slate-200">
          <li>Llevar el robot a la posición de HOME desde el programa o en manual.</li>
          <li>Pasar el modo a <strong>TEACH</strong>.</li>
          <li>Desactivar la alimentación a los motores (<strong>MOTOR OFF</strong>).</li>
          <li>Apagar el interruptor principal del armario.</li>
          <li>
            Cerrar la llave de gas de protección y desconectar la alimentación del EWM si
            procede.
          </li>
        </ol>
        <PdfFigure
          src={pdfImage('serie_e', 95)}
          caption="Procedimiento de desconexión (Serie E §3.2): llevar a HOME → modo TEACH → MOTOR OFF → interruptor principal."
        />

        <h3 className="font-semibold text-base text-slate-100">Cómo detener el robot</h3>
        <p className="text-slate-300">
          El manual recoge varios métodos según la urgencia y la situación. Resumen:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>
            <strong>Paro de ciclo (HOLD)</strong>: detiene el programa al final del paso actual. Para
            pausar sin perder posición.
          </li>
          <li>
            <strong>Soltar el gatillo de hombre muerto</strong> (en TEACH/CHECK): corta motores
            inmediatamente. El robot queda donde está.
          </li>
          <li>
            <strong>Seta de emergencia</strong>: paro de categoría 1 (frenado controlado + corte de
            motores). Solo en peligro real, porque deja el ciclo abortado.
          </li>
        </ul>
        <PdfFigure
          src={pdfImage('serie_e', 96)}
          caption="Métodos para detener el robot (Serie E §3.3): HOLD, soltar enable, seta de emergencia y corte de potencia."
        />

        <p className="text-xs text-slate-400 italic">
          Fuente: 90203-1104DSB Operation Manual (Serie E), §3.1-§3.3.
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
  'estado-soldadura': {
    title: 'Estado de soldadura (Weld condition N.º)',
    body: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-slate-300">
          El <strong>estado de soldadura</strong> (en el manual, <em>welding condition</em> y en pantalla
          "Condition N.º") es una <strong>receta completa</strong> de soldadura guardada en el
          controlador del robot, llamada con un <strong>número</strong> desde las instrucciones{' '}
          <span className="chip bg-emerald-500/25 text-emerald-100 border border-emerald-400/40 mr-1">WS</span>
          ,{' '}
          <span className="chip bg-amber-500/25 text-amber-100 border border-amber-400/40 mr-1">WC</span>{' '}
          y{' '}
          <span className="chip bg-rose-500/25 text-rose-100 border border-rose-400/40 mr-1">WE</span>{' '}
          del programa.
        </p>

        <p className="text-slate-300">
          No confundir con el JOB de la fuente. El{' '}
          <Link to="/procedimientos/job-ewm" className="text-indigo-300 underline">
            JOB
          </Link>{' '}
          es la receta dentro del EWM; el <strong>estado/condición de soldadura</strong> es la receta
          que guarda el <em>robot</em> y que apunta a ese JOB (y al programa P1..P15) además de a otros
          parámetros del cordón.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Qué contiene un estado de soldadura</h3>
        <p className="text-slate-300">
          Cada estado lleva los datos típicos de un punto WS/WC/WE: tensión y/o corriente objetivo,
          velocidad de soldeo, JOB EWM al que llama, datos de gas y datos opcionales de weaving. La
          tabla del manual los clasifica por tipo de condición:
        </p>
        <PdfFigure
          src={pdfImage('arc_welding', 62)}
          caption="Tipos de condiciones de soldadura disponibles (Arc Welding §5.7.2.2): WS, WC, WE, condición común y condición de retake."
        />

        <h3 className="font-semibold text-base text-slate-100">Datos auxiliares vs datos de estado</h3>
        <p className="text-slate-300">
          El manual diferencia <strong>"datos auxiliares"</strong> (los que se introducen en la línea
          del punto: velocidad, precisión, pequeñas correcciones) de los <strong>"datos de estado"</strong>{' '}
          (los que viven en la base de datos de condiciones, llamados por número). Lo serio (tensión,
          corriente, JOB) está en los datos de estado: así un mismo número de condición se reutiliza
          en muchos cordones.
        </p>
        <PdfFigure
          src={pdfImage('arc_welding', 61)}
          caption="Estado de soldadura: distinción entre datos auxiliares (en el punto) y datos de estado (en base de datos) — Arc Welding §5.7.2."
        />

        <h3 className="font-semibold text-base text-slate-100">Dónde se da de alta / edita</h3>
        <p className="text-slate-300">
          La base de datos de condiciones está en{' '}
          <span className="font-mono text-slate-100">AUX 0420 — Base de datos de condiciones de soldadura</span>.
          Se entra desde la pantalla principal del TP con{' '}
          <span className="font-mono">AUX → 04 Arc Weld → 20 Welding Condition DB</span>. Allí se
          crean o se editan las recetas C1, C2, C3… que después se llaman por número desde el programa.
        </p>

        <h3 className="font-semibold text-base text-slate-100">Cómo se usan en el programa</h3>
        <p className="text-slate-300">
          En la línea de un punto WS/WC/WE se rellena el campo{' '}
          <span className="font-mono text-slate-100">Cond N.º</span> con el número de la condición.
          Ejemplo de programa con dos cordones (raíz con C1, relleno con C2):
        </p>
        <pre className="text-xs bg-slate-900/60 p-3 rounded-lg overflow-x-auto text-slate-200">
{`1 AC JOINT  2 1 0
2 AC LINEAR 2 1 0
3 WS LINEAR 2 1 0  Cond 1
4 WC LINEAR 2 1 0  Cond 1
5 WE LINEAR 2 1 0  Cond 1
6 AC LINEAR 2 1 0
7 WS LINEAR 2 1 0  Cond 2
8 WC LINEAR 2 1 0  Cond 2
9 WE LINEAR 2 1 0  Cond 2
10 AC JOINT 2 1 0`}
        </pre>

        <p className="text-xs text-slate-400 italic">
          Fuente: 90203-1036DSB Arc Welding Operation Manual (Serie E), §5.7.2 — Estado de soldadura;
          AUX 0420 — Base de datos de condiciones de soldadura.
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
  'posiciones-soldadura': {
    title: 'Posiciones de soldadura',
    body: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p className="text-slate-300">
          La <strong>posición de soldeo</strong> es la orientación de la junta y el sentido del cordón
          respecto a la gravedad. La nomenclatura es <strong>normativa</strong> — se usa en WPS, en
          calificaciones de soldador y al elegir parámetros en la fuente — y hay dos sistemas
          equivalentes:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>
            <strong>AWS A3.0 / ASME IX</strong>: número + letra. La letra dice si es ángulo
            (<strong>F</strong>illet) o tope (<strong>G</strong>roove); el número, la orientación
            (1 = plano, 4 = bajo techo).
          </li>
          <li>
            <strong>ISO 6947</strong>: dos letras (PA, PB…). Es la norma usada en Europa y en los
            certificados EN ISO 9606 / 15614.
          </li>
        </ul>
        <p className="text-slate-300">
          Las dos normas describen las <em>mismas</em> posiciones físicas, solo cambia el código. La
          fuente EWM y el robot Kawasaki se ajustan igual — lo que cambia con la posición son los{' '}
          <strong>parámetros</strong> (más fríos en vertical y bajo techo) y la necesidad de{' '}
          <strong>weaving</strong> (sí en 3F/3G PF, no en 1F/1G PA salvo ranura ancha).
        </p>

        <PositionsDiagram />

        <h3 className="font-semibold text-base text-slate-100">Tabla de equivalencias</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-700/60">
          <table className="w-full text-xs">
            <thead className="bg-slate-800/60 text-slate-200">
              <tr>
                <th className="text-left px-3 py-2">AWS (ángulo)</th>
                <th className="text-left px-3 py-2">AWS (tope)</th>
                <th className="text-left px-3 py-2">ISO 6947</th>
                <th className="text-left px-3 py-2">Descripción</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 font-mono">1F</td>
                <td className="px-3 py-2 font-mono">1G</td>
                <td className="px-3 py-2 font-mono">PA</td>
                <td className="px-3 py-2">
                  <strong>Plana</strong> (downhand). Cordón hacia abajo, pieza horizontal. La más fácil.
                </td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 font-mono">2F</td>
                <td className="px-3 py-2 font-mono">2G</td>
                <td className="px-3 py-2 font-mono">PB · PC</td>
                <td className="px-3 py-2">
                  <strong>Horizontal-vertical</strong>. PB = ángulo en garganta vertical (eje cordón
                  horizontal); PC = tope con la chapa vertical y cordón horizontal.
                </td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 font-mono">3F</td>
                <td className="px-3 py-2 font-mono">3G</td>
                <td className="px-3 py-2 font-mono">PF · PG</td>
                <td className="px-3 py-2">
                  <strong>Vertical</strong>. PF = ascendente (soldando hacia arriba); PG = descendente
                  (soldando hacia abajo).
                </td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 font-mono">4F</td>
                <td className="px-3 py-2 font-mono">4G</td>
                <td className="px-3 py-2 font-mono">PD · PE</td>
                <td className="px-3 py-2">
                  <strong>Bajo techo</strong>. PE = totalmente sobre cabeza; PD = cornisa con chapa
                  horizontal y cordón por debajo.
                </td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 font-mono">—</td>
                <td className="px-3 py-2 font-mono">5G</td>
                <td className="px-3 py-2 font-mono">PH · PJ</td>
                <td className="px-3 py-2">
                  <strong>Tubería con eje horizontal fijo</strong>: el soldador recorre las cuatro
                  posiciones a lo largo del cordón (plana, vertical, bajo techo). PH = ascendente,
                  PJ = descendente.
                </td>
              </tr>
              <tr className="border-t border-slate-700/40">
                <td className="px-3 py-2 font-mono">—</td>
                <td className="px-3 py-2 font-mono">6G</td>
                <td className="px-3 py-2 font-mono">H-L045</td>
                <td className="px-3 py-2">
                  <strong>Tubería inclinada 45°</strong>. La posición más exigente — calificación de
                  soldador "all-position".
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold text-base text-slate-100">Cómo afecta a parámetros y al programa</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>
            <strong>Plana (PA / 1F-1G)</strong>: baño líquido grande, parámetros altos, poco o nada de
            weaving. Receta más rápida.
          </li>
          <li>
            <strong>Horizontal-vertical (PB / 2F)</strong>: ligera tendencia a caer hacia abajo;
            ángulo de antorcha y velocidad bien controlados.
          </li>
          <li>
            <strong>Vertical ascendente (PF / 3F-3G)</strong>: baño contra gravedad. Parámetros bajos
            (5-8 m/min hilo Ø1,0), <strong>weaving triangular</strong> (PN=2) o trapezoidal para
            sujetar el baño. Es donde más se nota el patrón de oscilación.
          </li>
          <li>
            <strong>Vertical descendente (PG / 3G)</strong>: parámetros más altos y velocidad alta —
            pero solo con procesos optimizados (ColdArc, rootArc) porque el baño tiende a adelantar
            al arco.
          </li>
          <li>
            <strong>Bajo techo (PD-PE / 4F-4G)</strong>: parámetros bajos, arco muy controlado
            (pulsado o ColdArc). Riesgo alto de salpicaduras.
          </li>
        </ul>

        <h3 className="font-semibold text-base text-slate-100">Norma de referencia</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-200">
          <li>
            <strong>AWS A3.0M/A3.0 — Standard Welding Terms and Definitions</strong> (define 1F-4F,
            1G-6G).
          </li>
          <li>
            <strong>ISO 6947:2019 — Welding and allied processes — Welding positions</strong> (define
            PA, PB, PC, PD, PE, PF, PG, PH, PJ).
          </li>
        </ul>
        <p className="text-slate-400 text-xs italic">
          En la documentación interna de esta célula recomendamos indicar siempre <strong>las dos
          nomenclaturas</strong> (ej. "3F (PF, vertical ascendente)") para evitar confusión con quien
          trabaje en planta.
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

// Diagrama de posiciones de soldadura: 6 tarjetas (PA, PB/PC, PF, PG, PD/PE, 5G/6G)
// con su pictograma esquemático en SVG y la doble nomenclatura AWS / ISO.
function PositionsDiagram() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      <PositionCard codeAws="1F · 1G" codeIso="PA" name="Plana" color="emerald">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <rect x="10" y="35" width="80" height="10" fill="#475569" />
          <polygon points="50,18 46,30 54,30" fill="#10b981" />
          <line x1="50" y1="18" x2="50" y2="10" stroke="#10b981" strokeWidth="2" />
        </svg>
      </PositionCard>
      <PositionCard codeAws="2F · 2G" codeIso="PB · PC" name="Horizontal" color="sky">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <rect x="10" y="40" width="80" height="6" fill="#475569" />
          <rect x="10" y="14" width="6" height="26" fill="#475569" />
          <polygon points="30,30 22,38 30,46" fill="#0ea5e9" />
          <line x1="30" y1="30" x2="38" y2="22" stroke="#0ea5e9" strokeWidth="2" />
        </svg>
      </PositionCard>
      <PositionCard codeAws="3F · 3G ↑" codeIso="PF" name="Vertical asc." color="amber">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <rect x="40" y="8" width="20" height="48" fill="#475569" />
          <polygon points="62,40 74,36 74,44" fill="#f59e0b" />
          <line x1="74" y1="40" x2="82" y2="40" stroke="#f59e0b" strokeWidth="2" />
          <path d="M 64 28 L 64 18 M 60 22 L 64 18 L 68 22" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
        </svg>
      </PositionCard>
      <PositionCard codeAws="3G ↓" codeIso="PG" name="Vertical desc." color="rose">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <rect x="40" y="8" width="20" height="48" fill="#475569" />
          <polygon points="62,24 74,20 74,28" fill="#f43f5e" />
          <line x1="74" y1="24" x2="82" y2="24" stroke="#f43f5e" strokeWidth="2" />
          <path d="M 64 32 L 64 42 M 60 38 L 64 42 L 68 38" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
        </svg>
      </PositionCard>
      <PositionCard codeAws="4F · 4G" codeIso="PD · PE" name="Bajo techo" color="fuchsia">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <rect x="10" y="14" width="80" height="10" fill="#475569" />
          <polygon points="50,42 46,30 54,30" fill="#d946ef" />
          <line x1="50" y1="42" x2="50" y2="50" stroke="#d946ef" strokeWidth="2" />
        </svg>
      </PositionCard>
      <PositionCard codeAws="5G · 6G" codeIso="PH/PJ · H-L045" name="Tubería" color="indigo">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <ellipse cx="50" cy="30" rx="26" ry="18" fill="none" stroke="#475569" strokeWidth="4" />
          <polygon points="76,30 84,26 84,34" fill="#6366f1" />
          <line x1="84" y1="30" x2="92" y2="30" stroke="#6366f1" strokeWidth="2" />
        </svg>
      </PositionCard>
    </div>
  );
}

function PositionCard({
  codeAws,
  codeIso,
  name,
  color,
  children,
}: {
  codeAws: string;
  codeIso: string;
  name: string;
  color: 'sky' | 'emerald' | 'amber' | 'rose' | 'fuchsia' | 'indigo';
  children: React.ReactNode;
}) {
  const palette: Record<typeof color, string> = {
    sky: 'border-sky-400/40 bg-sky-500/10',
    emerald: 'border-emerald-400/40 bg-emerald-500/10',
    amber: 'border-amber-400/40 bg-amber-500/10',
    rose: 'border-rose-400/40 bg-rose-500/10',
    fuchsia: 'border-fuchsia-400/40 bg-fuchsia-500/10',
    indigo: 'border-indigo-400/40 bg-indigo-500/10',
  };
  return (
    <div className={`rounded-xl border p-2 ${palette[color]}`}>
      <div className="font-mono font-bold text-slate-100 text-xs leading-tight">{codeAws}</div>
      <div className="font-mono text-[10px] text-slate-300 leading-tight">{codeIso}</div>
      <div className="text-[11px] text-slate-200 mt-0.5">{name}</div>
      <div className="h-14 mt-1 rounded bg-slate-900/40 flex items-center justify-center">
        {children}
      </div>
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
