export function capitalizeString(input: string): string {
  if (input.length === 0) return input;
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
