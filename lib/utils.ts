export function formatImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Extract Google Drive File ID from any link variant
  const driveMatch = trimmed.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  return trimmed;
}
