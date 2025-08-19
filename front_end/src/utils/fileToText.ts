export async function fileToText(file: File): Promise<string> {
  // Prefer native text for text/* mimetypes
  if (file.type.startsWith('text/')) {
    return await file.text()
  }
  // Try to decode as UTF-8 by default
  const buffer = await file.arrayBuffer()
  try {
    const decoder = new TextDecoder('utf-8', { fatal: false })
    return decoder.decode(buffer)
  } catch {
    // Fallback: best-effort; may yield unreadable content for binary formats
    return ''
  }
}


