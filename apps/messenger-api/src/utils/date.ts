export const convertDateToString = <T extends { createdAt: Date | string }>(
  item: T,
): T & { createdAt: string } => ({
  ...item,
  createdAt:
    item.createdAt instanceof Date
      ? item.createdAt.toISOString()
      : item.createdAt,
});
