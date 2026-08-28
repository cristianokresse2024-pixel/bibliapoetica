import React from 'react';

function parseInline(text) {
  if (!text) return null;
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
    const italicMatch = remaining.match(/^(.*?)\*(.+?)\*(.*)/s);
    const codeMatch = remaining.match(/^(.*?)`(.+?)`(.*)/s);

    let firstMatch = null;
    let type = null;

    if (boldMatch) {
      firstMatch = boldMatch;
      type = 'bold';
    }
    if (italicMatch && (!firstMatch || italicMatch[1].length < firstMatch[1].length)) {
      firstMatch = italicMatch;
      type = 'italic';
    }
    if (codeMatch && (!firstMatch || codeMatch[1].length < firstMatch[1].length)) {
      firstMatch = codeMatch;
      type = 'code';
    }

    if (!firstMatch) {
      parts.push(remaining);
      break;
    }

    if (firstMatch[1]) {
      parts.push(firstMatch[1]);
    }

    if (type === 'bold') {
      parts.push(
        <strong key={key++} className="md-bold">
          {parseInline(firstMatch[2])}
        </strong>
      );
    } else if (type === 'italic') {
      parts.push(
        <em key={key++} className="md-italic">
          {firstMatch[2]}
        </em>
      );
    } else if (type === 'code') {
      parts.push(
        <code key={key++} className="md-code">
          {firstMatch[2]}
        </code>
      );
    }

    remaining = firstMatch[3];
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
}

export default function MarkdownView({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let index = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    // Dividers: --- or ***
    if (/^(\-{3,}|\*{3,})$/.test(trimmed)) {
      elements.push(<hr key={index++} className="md-hr" />);
      continue;
    }

    // Headings
    if (/^####\s+(.*)/.test(trimmed)) {
      const match = trimmed.match(/^####\s+(.*)/);
      elements.push(
        <h5 key={index++} className="md-h4">
          {parseInline(match[1])}
        </h5>
      );
      continue;
    }
    if (/^###\s+(.*)/.test(trimmed)) {
      const match = trimmed.match(/^###\s+(.*)/);
      elements.push(
        <h4 key={index++} className="md-h3">
          {parseInline(match[1])}
        </h4>
      );
      continue;
    }
    if (/^##\s+(.*)/.test(trimmed)) {
      const match = trimmed.match(/^##\s+(.*)/);
      elements.push(
        <h3 key={index++} className="md-h2">
          {parseInline(match[1])}
        </h3>
      );
      continue;
    }
    if (/^#\s+(.*)/.test(trimmed)) {
      const match = trimmed.match(/^#\s+(.*)/);
      elements.push(
        <h2 key={index++} className="md-h1">
          {parseInline(match[1])}
        </h2>
      );
      continue;
    }

    // Blockquote (Oração / Citação): > text
    if (trimmed.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      i--;
      elements.push(
        <blockquote key={index++} className="md-quote">
          <div className="md-quote-badge">🕊️ Oração / Citação</div>
          <div className="md-quote-content">
            {quoteLines.map((ql, qidx) => (
              <p key={qidx}>{parseInline(ql)}</p>
            ))}
          </div>
        </blockquote>
      );
      continue;
    }

    // Tables: lines with |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      i--;

      if (tableLines.length >= 2) {
        const headerCols = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        const startRow = tableLines[1].includes('---') ? 2 : 1;
        const bodyRows = tableLines
          .slice(startRow)
          .map((row) =>
            row
              .split('|')
              .slice(1, -1)
              .map((c) => c.trim())
          );

        elements.push(
          <div key={index++} className="md-table-wrap">
            <table className="md-table">
              <thead>
                <tr>
                  {headerCols.map((h, hidx) => (
                    <th key={hidx}>{parseInline(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, ridx) => (
                  <tr key={ridx}>
                    {row.map((cell, cidx) => (
                      <td key={cidx}>{parseInline(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Lists: - item or * item or 1. item
    if (/^(\-|\*|\d+\.)\s+(.*)/.test(trimmed)) {
      const isOrdered = /^\d+\.\s+/.test(trimmed);
      const listItems = [];

      while (i < lines.length && /^(\-|\*|\d+\.)\s+(.*)/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^(\-|\*|\d+\.)\s+/, '');
        listItems.push(itemText);
        i++;
      }
      i--;

      if (isOrdered) {
        elements.push(
          <ol key={index++} className="md-ol">
            {listItems.map((item, lidx) => (
              <li key={lidx}>{parseInline(item)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={index++} className="md-ul">
            {listItems.map((item, lidx) => (
              <li key={lidx}>{parseInline(item)}</li>
            ))}
          </ul>
        );
      }
      continue;
    }

    // Normal Paragraph
    elements.push(
      <p key={index++} className="md-p">
        {parseInline(trimmed)}
      </p>
    );
  }

  return <div className="md-rendered">{elements}</div>;
}
