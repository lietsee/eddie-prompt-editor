export function cleanLogs(text) {
  if (!text) return '';

  let cleanedText = text;

  // Remove console.log, console.error, console.warn, console.info, console.debug lines
  cleanedText = cleanedText.replace(/console\.(log|error|warn|info|debug)\(.*?\);?\s*\n?/g, '');

  // Remove lines with log level indicators
  const logLevelPattern = /^.*(\[INFO\]|\[DEBUG\]|\[ERROR\]|\[WARN\]|\[FATAL\]|LOG:|INFO:|DEBUG:|ERROR:|WARN:|FATAL:).*$/gm;
  cleanedText = cleanedText.replace(logLevelPattern, '');

  // Remove timestamp-prefixed log lines (YYYY-MM-DD HH:MM:SS or YYYY/MM/DD HH:MM:SS)
  const timestampPattern = /^\d{4}[-/]\d{2}[-/]\d{2}\s+\d{2}:\d{2}:\d{2}.*$/gm;
  cleanedText = cleanedText.replace(timestampPattern, '');

  // Remove stack trace lines
  const stackTracePattern = /^\s*at\s+.*\(.*:\d+:\d+\).*$/gm;
  cleanedText = cleanedText.replace(stackTracePattern, '');
  
  // Remove "Caused by:" lines
  cleanedText = cleanedText.replace(/^\s*Caused by:.*$/gm, '');
  
  // Remove Java exception lines
  cleanedText = cleanedText.replace(/^.*\.(Exception|Error):.*$/gm, '');

  // Remove log block delimiters and their content
  const logBlockPattern = /---\s*(START|END)\s*LOG\s*---|===\s*LOG\s*===/g;
  cleanedText = cleanedText.replace(logBlockPattern, '');

  // Remove specific log block sections (between START LOG and END LOG)
  cleanedText = cleanedText.replace(/---\s*START\s*LOG\s*---[\s\S]*?---\s*END\s*LOG\s*---/g, '');

  // Clean up multiple consecutive empty lines
  cleanedText = cleanedText.replace(/\n\s*\n\s*\n/g, '\n\n');

  // Trim leading and trailing whitespace
  cleanedText = cleanedText.trim();

  return cleanedText;
}