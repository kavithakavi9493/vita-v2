// ─────────────────────────────────────────────────────────
// VI RECOMMENDATION ENGINE
// Quiz Answers → Weighted Scores → Body Type → Product Stack → Plan
// ─────────────────────────────────────────────────────────

// ── 5 Body Types ─────────────────────────────────────────
export const BODY_TYPES = {

  HIGH_STRESS_LOW_VITALITY: {
    id:          'HIGH_STRESS_LOW_VITALITY',
    label:       'High Stress / Low Vitality',
    icon:        '🧠',
    emoji:       '🔴',
    color:       '#DC2626',
    bgColor:     '#FEF2F2',
    borderColor: '#FECACA',
    shortDesc:   'Chronic stress is draining your life force',
    description: 'Your nervous system is in overdrive. Elevated cortisol is directly suppressing testosterone and depleting your body\'s vital Ojas (life force). This is the most urgent pattern to address.',
    coreIssues:  ['Cortisol overload', 'Testosterone suppression', 'Chronic fatigue', 'Sleep disruption'],
    solutions:   ['Adaptogenic herbs to calm HPA axis', 'Night recovery formula to rebuild Ojas', 'Testosterone-restoring stack'],
    productIds:  [4, 6, 1, 5, 7, 9],
    plan:        'advanced',
    planLabel:   'Advanced Plan (3 months)',
    urgency:     'HIGH',
  },

  HORMONAL_DECLINE: {
    id:          'HORMONAL_DECLINE',
    label:       'Hormonal Decline',
    icon:        '⚗️',
    emoji:       '🟠',
    color:       '#7C3AED',
    bgColor:     '#F5F3FF',
    borderColor: '#DDD6FE',
    shortDesc:   'Your hormonal system needs targeted support',
    description: 'Your body\'s hormonal production is running below optimal. This creates a cascade — low libido, reduced performance, and depleted energy. The root cause is correctable with precision Ayurvedic formulation.',
    coreIssues:  ['Low testosterone', 'Reduced libido', 'Hormonal imbalance', 'Performance decline'],
    solutions:   ['Testosterone-building botanicals', 'Reproductive vitality stack', 'Libido-restoring herbs'],
    productIds:  [1, 9, 10, 5, 6, 7],
    plan:        'advanced',
    planLabel:   'Advanced Plan (3 months)',
    urgency:     'HIGH',
  },

  PERFORMANCE_DEFICIT: {
    id:          'PERFORMANCE_DEFICIT',
    label:       'Performance Deficit',
    icon:        '⚡',
    emoji:       '🟡',
    color:       '#D97706',
    bgColor:     '#FFFBEB',
    borderColor: '#FDE68A',
    shortDesc:   'Performance issues affecting confidence & relationship',
    description: 'Your vascular function and neuromuscular coordination need targeted support. This is the most directly treatable type — the ancient Siddha masters had precise formulas for exactly this.',
    coreIssues:  ['Timing control', 'Erection strength', 'Stamina', 'Low confidence'],
    solutions:   ['Sthambhan (control) herbs', 'Vascular & blood flow support', 'Performance oils'],
    productIds:  [2, 3, 7, 1, 5, 4],
    plan:        'advanced',
    planLabel:   'Advanced Plan (3 months)',
    urgency:     'HIGH',
  },

  AGE_RELATED_DROP: {
    id:          'AGE_RELATED_DROP',
    label:       'Age-Related Decline',
    icon:        '🕐',
    emoji:       '🔵',
    color:       '#1E3A5F',
    bgColor:     '#EEF2F8',
    borderColor: '#BFDBFE',
    shortDesc:   'Natural testosterone decline accelerating after 35',
    description: 'After 35, testosterone drops 3–5% every year. Without targeted support this compounds into fatigue, performance decline, and reduced vitality. The ancient masters developed specific Rasayana (rejuvenation) protocols for this exact stage.',
    coreIssues:  ['3-5% annual testosterone drop', 'Slower recovery', 'Reduced drive', 'Compound decline'],
    solutions:   ['Age-specific Rasayana formulas', 'Testosterone restoration stack', 'Reproductive vitality support'],
    productIds:  [8, 1, 10, 6, 11, 9],
    plan:        'premium',
    planLabel:   'Premium Plan (3 months)',
    urgency:     'CRITICAL',
  },

  PEAK_PERFORMANCE: {
    id:          'PEAK_PERFORMANCE',
    label:       'Optimisation Mode',
    icon:        '🏆',
    emoji:       '🟢',
    color:       '#15803D',
    bgColor:     '#F0FDF4',
    borderColor: '#BBF7D0',
    shortDesc:   'Strong foundation — push to peak performance',
    description: 'Your vitality foundation is solid. A precision VI stack will push you from good to extraordinary — maximising energy, performance, and drive to levels most men never experience.',
    coreIssues:  ['Performance plateau', 'Untapped potential', 'Optimisation', 'Peak maintenance'],
    solutions:   ['Precision performance stack', 'Pre-intimacy formula', 'Recovery optimisation'],
    productIds:  [1, 5, 7, 4, 6, 10],
    plan:        'basic',
    planLabel:   'Basic Plan (1 month)',
    urgency:     'MODERATE',
  },
}

// ── Body Type Detection Engine ────────────────────────────
export function detectBodyType(state) {
  const {
    mentalScore, lifestyleScore, physicalScore, performanceScore,
    ageGroup, vitaScore,
    stressLevel, anxietyLevel, fatigueLevel,
    libidoLevel, timingControl, erectionQuality,
  } = state

  // Rule 1: Age 36+ takes priority — biology is the driver
  if (ageGroup === '36-45' || ageGroup === '45+') {
    return BODY_TYPES.AGE_RELATED_DROP
  }

  // Rule 2: High stress pattern (mental + lifestyle both low)
  const stressIndicators = [
    mentalScore < 10,
    lifestyleScore < 10,
    stressLevel === 'High',
    anxietyLevel === 'Often',
    fatigueLevel === 'Frequently',
  ].filter(Boolean).length

  if (stressIndicators >= 3) {
    return BODY_TYPES.HIGH_STRESS_LOW_VITALITY
  }

  // Rule 3: Performance deficit (erection / timing primary complaint)
  const performanceIndicators = [
    performanceScore < 10,
    timingControl === 'Often' || timingControl === 'Sometimes',
    erectionQuality === 'Weak' || erectionQuality === 'Moderate',
  ].filter(Boolean).length

  if (performanceIndicators >= 2) {
    return BODY_TYPES.PERFORMANCE_DEFICIT
  }

  // Rule 4: Hormonal decline (libido + physical low)
  const hormonalIndicators = [
    physicalScore < 10,
    libidoLevel === 'Low',
    vitaScore < 55,
    mentalScore < 12 && performanceScore < 12,
  ].filter(Boolean).length

  if (hormonalIndicators >= 2) {
    return BODY_TYPES.HORMONAL_DECLINE
  }

  // Rule 5: Peak performance (default for higher scores)
  return BODY_TYPES.PEAK_PERFORMANCE
}

// ── Get Product Stack for Body Type ──────────────────────
export function getProductStack(bodyType, allProducts, planType) {
  const limit = planType === 'premium' ? 6 : planType === 'advanced' ? 5 : 3
  const ids   = bodyType.productIds.slice(0, limit)
  return ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean)
}

// ── Get Plan Recommendation ───────────────────────────────
export function getRecommendedPlan(bodyType, vitaScore) {
  // Override plan if vitaScore is very low — needs premium
  if (vitaScore < 45 && bodyType.plan !== 'premium') return 'advanced'
  return bodyType.plan
}

// ── Full Recommendation Object ────────────────────────────
export function buildRecommendation(state, allProducts) {
  const bodyType    = detectBodyType(state)
  const plan        = getRecommendedPlan(bodyType, state.vitaScore)
  const stack       = getProductStack(bodyType, allProducts, plan)

  return {
    bodyType,
    recommendedPlan: plan,
    productStack:    stack,
    stackSummary:    stack.map(p => p.brand).join(' + '),
  }
}
