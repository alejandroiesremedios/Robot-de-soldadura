export type Parameter = {
  id: string;
  material: 'Acero al carbono' | 'Acero inox' | 'Aluminio';
  process: 'MIG/MAG' | 'MIG pulsado' | 'MIG';
  wireDiameter: 0.8 | 1.0 | 1.2;
  thicknessMm: string;
  position: '1G/PA' | '2G/PC' | '3G/PF' | '4G/PE' | 'Filete PB';
  shieldingGas: string;
  currentA: string;
  voltageV: string;
  wireFeedMmin: string;
  travelSpeedCmMin: string;
  ewmJob?: string;
  notes?: string;
};

// NOTA: valores orientativos de referencia para MIG/MAG con EWM Titan XQ 350 Plus.
// Ajustar según ensayos en la propia célula. Editar libremente.
export const PARAMETERS: Parameter[] = [
  {
    id: 'fe-1.0-pa-08',
    material: 'Acero al carbono',
    process: 'MIG/MAG',
    wireDiameter: 1.0,
    thicknessMm: '3-5',
    position: '1G/PA',
    shieldingGas: 'M21 (Ar 82% / CO2 18%)',
    currentA: '180-220',
    voltageV: '20-23',
    wireFeedMmin: '6.5-8.0',
    travelSpeedCmMin: '35-45',
    ewmJob: '—',
    notes: 'Cordón en plano. Stick-out 12-15 mm.',
  },
  {
    id: 'fe-1.0-pb-08',
    material: 'Acero al carbono',
    process: 'MIG/MAG',
    wireDiameter: 1.0,
    thicknessMm: '3-6',
    position: 'Filete PB',
    shieldingGas: 'M21 (Ar 82% / CO2 18%)',
    currentA: '180-230',
    voltageV: '21-24',
    wireFeedMmin: '7.0-8.5',
    travelSpeedCmMin: '30-40',
    ewmJob: '—',
    notes: 'Ángulo de antorcha 45°. Mantener arco corto sobre el vértice.',
  },
  {
    id: 'fe-1.2-pa-pulsed',
    material: 'Acero al carbono',
    process: 'MIG pulsado',
    wireDiameter: 1.2,
    thicknessMm: '5-10',
    position: '1G/PA',
    shieldingGas: 'M21 (Ar 82% / CO2 18%)',
    currentA: '220-280',
    voltageV: '24-28',
    wireFeedMmin: '8.0-10.0',
    travelSpeedCmMin: '35-50',
    ewmJob: '—',
    notes: 'Modo pulsado para reducir proyecciones en chapa media.',
  },
  {
    id: 'inox-1.0-pa',
    material: 'Acero inox',
    process: 'MIG/MAG',
    wireDiameter: 1.0,
    thicknessMm: '2-4',
    position: '1G/PA',
    shieldingGas: 'Ar 97.5% / CO2 2.5% (M12)',
    currentA: '140-180',
    voltageV: '18-21',
    wireFeedMmin: '5.5-7.5',
    travelSpeedCmMin: '30-45',
    ewmJob: '—',
    notes: 'Inox 304/316. Stick-out 10-12 mm. Cepillar con cepillo de inox.',
  },
  {
    id: 'al-1.2-pa-pulsed',
    material: 'Aluminio',
    process: 'MIG pulsado',
    wireDiameter: 1.2,
    thicknessMm: '3-6',
    position: '1G/PA',
    shieldingGas: 'Ar 100%',
    currentA: '160-210',
    voltageV: '19-22',
    wireFeedMmin: '8.0-10.0',
    travelSpeedCmMin: '40-60',
    ewmJob: '—',
    notes: 'AlMg5 (5356) o AlSi5 (4043). Antorcha empujando. Limpiar óxido previo.',
  },
  {
    id: 'al-1.2-pb-pulsed',
    material: 'Aluminio',
    process: 'MIG pulsado',
    wireDiameter: 1.2,
    thicknessMm: '3-6',
    position: 'Filete PB',
    shieldingGas: 'Ar 100%',
    currentA: '170-220',
    voltageV: '20-23',
    wireFeedMmin: '8.5-10.5',
    travelSpeedCmMin: '35-50',
    ewmJob: '—',
    notes: 'Vigilar la penetración en el vértice. Precalentar si t > 5 mm.',
  },
];
