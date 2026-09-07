export interface AnalysisResult {
  completenessScore: number;
  extractedDomains: string[];
  detectedBottlenecks: string[];
  recommendations: string[];
}

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  'Hydrology & Water Treatment': ['arsenic', 'fluoride', 'aquifer', 'tubewell', 'purification', 'membrane', 'ph', 'turbidity'],
  'Renewable Energy & Microgrids': ['solar', 'battery', 'inverter', 'microgrid', 'photovoltaic', 'bms', 'lithium', 'charge controller'],
  'Agri-Tech & Cold Chain': ['storage', 'spoilage', 'desiccation', 'post-harvest', 'lac', 'sensors', 'cold-storage', 'moisture'],
  'Industrial & Environmental': ['slag', 'particulate', 'ash', 'emission', 'carbon', 'effluent', 'heavy metals'],
  'Embedded Systems & IoT': ['sensor', 'telemetry', 'esp32', 'arduino', 'lora', 'iot', 'edge', 'actuator']
};

export function analyzeEngineeringText(text: string): AnalysisResult {
  if (!text || text.trim().length < 10) {
    return {
      completenessScore: 10,
      extractedDomains: ['Unclassified'],
      detectedBottlenecks: ['Insufficient technical text'],
      recommendations: ['Provide specific failure modes, environmental triggers, or technical metrics.']
    };
  }

  const lower = text.toLowerCase();
  const domains: string[] = [];

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      domains.push(domain);
    }
  }

  const hasMetrics = /\d+(\.\d+)?\s*(mg\/l|ppm|kw|kwh|v|ah|%|months|days|liters|celsius|km)/i.test(text);
  const hasFailureMode = /(failure|degraded|contamination|loss|spoilage|leakage|rust|drop|clogged)/i.test(text);
  const hasLocationOrContext = /(village|panchayat|forest|district|river|groundwater|habitations|block)/i.test(text);

  let score = 30;
  const recommendations: string[] = [];
  const bottlenecks: string[] = [];

  if (hasMetrics) {
    score += 30;
    bottlenecks.push('Quantified metrics present');
  } else {
    recommendations.push('Include measurable parameters (e.g. ppm, kW, %, duration).');
  }

  if (hasFailureMode) {
    score += 25;
    bottlenecks.push('Explicit root failure detected');
  } else {
    recommendations.push('Specify concrete failure mechanisms.');
  }

  if (hasLocationOrContext) {
    score += 15;
  } else {
    recommendations.push('Clarify the operational or geographic field context.');
  }

  if (domains.length === 0) {
    domains.push('General Engineering');
  }

  return {
    completenessScore: Math.min(100, score),
    extractedDomains: domains,
    detectedBottlenecks: bottlenecks,
    recommendations
  };
}