import { saveAs } from 'file-saver';

export function exportToMarkdown(title, content) {
  const sanitizedTitle = sanitizeFileName(title || 'untitled');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const fileName = `${sanitizedTitle}_${timestamp}.md`;
  
  const markdownContent = formatMarkdownContent(title, content);
  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
  
  saveAs(blob, fileName);
}

function sanitizeFileName(fileName) {
  // Remove or replace characters that are invalid in file names
  return fileName
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 100); // Limit filename length
}

function formatMarkdownContent(title, content) {
  const timestamp = new Date().toLocaleString();
  
  return `# ${title || 'Untitled Prompt'}

**Created:** ${timestamp}

---

${content}

---

*Exported from AI Prompt Editor*
`;
}