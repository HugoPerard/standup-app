export const sortByIndex = <T extends { index: number }>(
  objects: T[],
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return objects?.sort((a, b) => {
    if (a?.index < b?.index) {
      return order === 'asc' ? -1 : 1;
    }
    if (a?.index > b?.index) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};
