import React from 'react';
import './SimpleRichRenderer.css';

const SimpleRichRenderer = ({ content, className = '' }) => {
  const renderContent = () => {
    if (!content) return null;

    // Check if it's HTML content
    if (content.includes('<') && content.includes('>')) {
      return (
        <div 
          className={`simple-rich-renderer ${className}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // Try to parse as JSON (backward compatibility)
    try {
      const parsed = JSON.parse(content);
      if (parsed.text && Array.isArray(parsed.formats)) {
        // Render rich text with formatting
        return renderRichText(parsed.text, parsed.formats);
      } else {
        // Fallback to plain text
        return <div className={`simple-rich-renderer ${className}`}>{content}</div>;
      }
    } catch (e) {
      // If not valid JSON, treat as plain text
      return <div className={`simple-rich-renderer ${className}`}>{content}</div>;
    }
  };

  const renderRichText = (text, formats) => {
    if (formats.length === 0) {
      // Handle line breaks and bullet points for plain text
      const formattedText = text.replace(/\n/g, '<br>').replace(/• /g, '• ');
      return (
        <div 
          className={`simple-rich-renderer ${className}`}
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    }

    let result = '';
    let lastIndex = 0;

    formats.forEach(format => {
      // Add text before this format
      result += text.slice(lastIndex, format.start);
      
      // Add formatted text
      const textSlice = text.slice(format.start, format.end);
      switch (format.type) {
        case 'bold':
          result += `<strong>${textSlice}</strong>`;
          break;
        case 'italic':
          result += `<em>${textSlice}</em>`;
          break;
        case 'underline':
          result += `<u>${textSlice}</u>`;
          break;
        case 'highlight':
          result += `<mark>${textSlice}</mark>`;
          break;
        default:
          result += textSlice;
      }
      
      lastIndex = format.end;
    });

    // Add remaining text
    result += text.slice(lastIndex);
    
    // Handle line breaks and bullet points
    result = result.replace(/\n/g, '<br>').replace(/• /g, '• ');

    return (
      <div 
        className={`simple-rich-renderer ${className}`}
        dangerouslySetInnerHTML={{ __html: result }}
      />
    );
  };

  return renderContent();
};

export default SimpleRichRenderer;
