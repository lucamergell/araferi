export const formatDisplayName = (fullName: string | undefined | null): string => {
  if (!fullName || !fullName.trim()) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0];
  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  const initial = lastName.replace(/[^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\u0400-\u04FF\u10A0-\u10FF]/g, '').charAt(0).toUpperCase();
  if (!initial) return firstName;
  return `${firstName} ${initial}.`;
};
