/** Simple CSV line parser that supports quoted fields */
export function parseCsvLine(line: string): string[] {
  const re = /("(?:[^"]|"")*"|[^,]+)/g;
  const cells: string[] = [];
  let match;
  while ((match = re.exec(line)) !== null) {
    let cell = match[0];
    if (cell.startsWith('"') && cell.endsWith('"')) {
      cell = cell.slice(1, -1).replace(/""/g, '"');
    }
    cells.push(cell.trim());
  }
  return cells;
}

export function normalizeHeader(h: string) {
  return h
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

/** Normalize date: dd-mm-yyyy or dd/mm/yyyy or yyyy-mm-dd → yyyy-mm-dd */
export function normalizeDate(value: string) {
  if (!value) return "";
  const v = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const m = v.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
  if (m) {
    const dd = m[1].padStart(2, "0");
    const mm = m[2].padStart(2, "0");
    const yyyy = m[3];
    return `${yyyy}-${mm}-${dd}`;
  }
  return v;
}
