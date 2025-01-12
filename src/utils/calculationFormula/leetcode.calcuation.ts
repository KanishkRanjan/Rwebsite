const calculation: (aggregatedSolveCounts: any) => number = (aggregatedSolveCounts) => {
  const safeGet = (key: string): number => aggregatedSolveCounts?.[key] || 0;
  const easyCount = safeGet('easy');
  const mediumCount = safeGet('medium');
  const hardCount = safeGet('hard');
  return easyCount + mediumCount * 2 + hardCount * 3;
};

export default calculation;