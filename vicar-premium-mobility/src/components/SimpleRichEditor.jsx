import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import './SimpleRichEditor.css';

const SimpleRichEditor = forwardRef(({ value, onChange, placeholder, className = '' }, ref) => {
  const [content, setContent] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [formats, setFormats] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [highlightColor, setHighlightColor] = useState('#ffff00'); // Default yellow
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Initialize editor with existing content
  useEffect(() => {
    if (value) {
      // Check if it's HTML content (contains HTML tags)
      if (value.includes('<') && value.includes('>')) {
        // Parse HTML and extract formatting
        const { text: plainText, formats: extractedFormats } = parseHTML(value);
        setContent(plainText);
        setFormats(extractedFormats);
      } else {
        // Try to parse as JSON (backward compatibility)
        try {
          const parsed = JSON.parse(value);
          if (parsed.text && Array.isArray(parsed.formats)) {
            setContent(parsed.text);
            setFormats(parsed.formats);
          } else {
            setContent(value);
            setFormats([]);
          }
        } catch (e) {
          setContent(value);
          setFormats([]);
        }
      }
    } else {
      setContent('');
      setFormats([]);
    }
    
    // Initialize history with current state
    if (value) {
      let initialText, initialFormats, htmlContent;
      
      if (value.includes('<') && value.includes('>')) {
        // For HTML content, parse it to get text and formats
        const parsed = parseHTML(value);
        initialText = parsed.text;
        initialFormats = parsed.formats;
        htmlContent = value;
      } else {
        // For plain text or JSON, use the value as is
        initialText = value;
        initialFormats = [];
        htmlContent = convertToHTML(value, []);
      }
      
      setHistory([{ text: initialText, formats: initialFormats, html: htmlContent }]);
      setHistoryIndex(0);
    } else {
      setHistory([]);
      setHistoryIndex(-1);
    }
    
    setIsInitialized(true);
  }, [value]);

  // Save content with formatting
  const saveContent = (newContent, newFormats) => {
    // Convert to HTML
    const htmlContent = convertToHTML(newContent, newFormats);
    
    // Add to history only if not initializing
    if (isInitialized) {
      addToHistory({ text: newContent, formats: newFormats, html: htmlContent });
    }
    
    if (onChange && isInitialized) {
      onChange(htmlContent);
    }
  };

  // Add to history for undo functionality
  const addToHistory = (data) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(data);
    
    // Keep only last 50 entries to prevent memory issues
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo functionality
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      
      setContent(previousState.text);
      setFormats(previousState.formats);
      setHistoryIndex(newIndex);
      
      if (onChange) {
        onChange(previousState.html);
      }
    }
  };

  // Redo functionality
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      
      setContent(nextState.text);
      setFormats(nextState.formats);
      setHistoryIndex(newIndex);
      
      if (onChange) {
        onChange(nextState.html);
      }
    }
  };

  // Handle text changes
  const handleTextChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Don't save automatically - only update preview
    // Content will be saved when form is submitted
  };

  // Handle selection changes
  const handleSelectionChange = (e) => {
    const { selectionStart, selectionEnd } = e.target;
    setSelection({ start: selectionStart, end: selectionEnd });
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
        case 'b':
          e.preventDefault();
          if (selection.start !== selection.end) {
            applyFormat('bold');
          }
          break;
        case 'i':
          e.preventDefault();
          if (selection.start !== selection.end) {
            applyFormat('italic');
          }
          break;
        case 'u':
          e.preventDefault();
          if (selection.start !== selection.end) {
            applyFormat('underline');
          }
          break;
      }
    }
  };

  // Apply formatting to selected text
  const applyFormat = (formatType) => {
    if (selection.start === selection.end) return; // No text selected

    const newFormats = [...formats];
    
    // Check if the same format already exists in the selection range
    const existingFormat = newFormats.find(format => 
      format.type === formatType && 
      format.start === selection.start && 
      format.end === selection.end
    );

    if (existingFormat) {
      // Remove the existing format (toggle off)
      const filteredFormats = newFormats.filter(format => format !== existingFormat);
      setFormats(filteredFormats);
    } else {
      // Remove overlapping formats in the selection range
      const filteredFormats = newFormats.filter(format => 
        !(format.start < selection.end && format.end > selection.start)
      );

      // Add new format
      filteredFormats.push({
        type: formatType,
        start: selection.start,
        end: selection.end,
        ...(formatType === 'highlight' && { color: highlightColor })
      });

      // Sort formats by start position
      filteredFormats.sort((a, b) => a.start - b.start);
      setFormats(filteredFormats);
    }
    // Don't save automatically - only update preview
  };

  // Add line break at cursor position
  const addLineBreak = () => {
    const newContent = content.slice(0, selection.start) + '\n' + content.slice(selection.start);
    setContent(newContent);
    
    // Adjust formats after the line break
    const adjustedFormats = formats.map(format => {
      if (format.start > selection.start) {
        return { ...format, start: format.start + 1, end: format.end + 1 };
      }
      return format;
    });
    
    setFormats(adjustedFormats);
    
    // Set cursor position after line break
    setTimeout(() => {
      const textarea = document.querySelector('.editor-textarea');
      if (textarea) {
        textarea.setSelectionRange(selection.start + 1, selection.start + 1);
      }
    }, 0);
  };

  // Add bullet point at cursor position
  const addBulletPoint = () => {
    const bulletText = '• ';
    const newContent = content.slice(0, selection.start) + bulletText + content.slice(selection.start);
    setContent(newContent);
    
    // Adjust formats after the bullet point
    const bulletLength = bulletText.length;
    const adjustedFormats = formats.map(format => {
      if (format.start > selection.start) {
        return { ...format, start: format.start + bulletLength, end: format.end + bulletLength };
      }
      return format;
    });
    
    setFormats(adjustedFormats);
    
    // Set cursor position after bullet point
    setTimeout(() => {
      const textarea = document.querySelector('.editor-textarea');
      if (textarea) {
        textarea.setSelectionRange(selection.start + bulletLength, selection.start + bulletLength);
      }
    }, 0);
  };

  // Handle highlight button interactions
  const handleHighlightClick = () => {
    if (selection.start === selection.end) return;
    applyFormat('highlight');
  };

  const handleHighlightLongPress = () => {
    setShowColorPicker(true);
  };

  const handleColorChange = (color) => {
    setHighlightColor(color);
    setShowColorPicker(false);
  };

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
  };

  // Parse HTML and extract formatting information
  const parseHTML = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    let plainText = '';
    const formats = [];
    let currentIndex = 0;
    
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        plainText += text;
        currentIndex += text.length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const startIndex = currentIndex;
        
        // Process child nodes
        for (const child of node.childNodes) {
          processNode(child);
        }
        
        const endIndex = currentIndex;
        
        // Add formatting based on tag name
        if (endIndex > startIndex) {
          switch (node.tagName.toLowerCase()) {
            case 'strong':
            case 'b':
              formats.push({ type: 'bold', start: startIndex, end: endIndex });
              break;
            case 'em':
            case 'i':
              formats.push({ type: 'italic', start: startIndex, end: endIndex });
              break;
            case 'u':
              formats.push({ type: 'underline', start: startIndex, end: endIndex });
              break;
            case 'mark':
              const backgroundColor = node.style?.backgroundColor || '#ffff00';
              formats.push({ type: 'highlight', start: startIndex, end: endIndex, color: backgroundColor });
              break;
            case 'br':
              // Handle line breaks
              plainText += '\n';
              currentIndex += 1;
              break;
          }
        }
      }
    };
    
    // Process all child nodes
    for (const child of tempDiv.childNodes) {
      processNode(child);
    }
    
    // Handle bullet points (• )
    const bulletRegex = /• /g;
    let match;
    while ((match = bulletRegex.exec(plainText)) !== null) {
      // Keep bullet points as they are
    }
    
    return { text: plainText, formats: formats.sort((a, b) => a.start - b.start) };
  };

  // Convert content to HTML
  const convertToHTML = (text, formats) => {
    if (formats.length === 0) {
      // Handle line breaks and bullet points for plain text
      return text.replace(/\n/g, '<br>').replace(/• /g, '• ');
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
          const color = format.color || '#ffff00';
          result += `<mark style="background-color: ${color}">${textSlice}</mark>`;
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
    
    return result;
  };

  // Get formatted text for display
  const getFormattedText = () => {
    return convertToHTML(content, formats);
  };

  // Get current HTML content for form submission
  const getCurrentHTML = () => {
    return convertToHTML(content, formats);
  };

  // Expose getCurrentHTML method to parent component via ref
  useImperativeHandle(ref, () => ({
    getCurrentHTML
  }));

  // Only save content when explicitly requested (form submission)
  // No automatic saving during editing to prevent blinking

  return (
    <div className={`simple-rich-editor ${className}`}>
      {/* Toolbar */}
      <div className="editor-toolbar">
        {/* First Row - Undo/Redo */}
        <div className="toolbar-row">
          <button
            type="button"
            className="toolbar-btn"
            onClick={undo}
            title="Undo (Ctrl+Z)"
            disabled={historyIndex <= 0}
          >
            ↶
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={redo}
            title="Redo (Ctrl+Y)"
            disabled={historyIndex >= history.length - 1}
          >
            ↷
          </button>
        </div>

        {/* Second Row - Formatting Tools */}
        <div className="toolbar-row">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => applyFormat('bold')}
            title="Bold (Ctrl+B)"
            disabled={selection.start === selection.end}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => applyFormat('italic')}
            title="Italic (Ctrl+I)"
            disabled={selection.start === selection.end}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => applyFormat('underline')}
            title="Underline (Ctrl+U)"
            disabled={selection.start === selection.end}
          >
            <u>U</u>
          </button>
                     <button
             type="button"
             className="toolbar-btn"
             onClick={handleHighlightClick}
             onMouseDown={(e) => {
               const timer = setTimeout(() => {
                 handleHighlightLongPress();
               }, 500); // 500ms for long press
               
               const handleMouseUp = () => {
                 clearTimeout(timer);
                 document.removeEventListener('mouseup', handleMouseUp);
               };
               
               document.addEventListener('mouseup', handleMouseUp);
             }}
             title="Highlight (Click to toggle, Long press for color)"
             disabled={selection.start === selection.end}
           >
             <span style={{ backgroundColor: highlightColor }}>H</span>
           </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={addLineBreak}
            title="Line Break (Enter)"
          >
            ↵
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={addBulletPoint}
            title="Bullet Point"
          >
            •
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="editor-container">
        <textarea
          value={content}
          onChange={handleTextChange}
          onSelect={handleSelectionChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="editor-textarea"
          rows={8}
        />
      </div>

             {/* Preview */}
       <div className="editor-preview">
         <h4>Preview:</h4>
         <div 
           className="preview-content"
           dangerouslySetInnerHTML={{ __html: getFormattedText() }}
         />
       </div>

       {/* Color Picker Modal */}
       {showColorPicker && (
         <div className="color-picker-overlay" onClick={handleColorPickerClose}>
           <div className="color-picker-modal" onClick={(e) => e.stopPropagation()}>
             <h4>Choose Highlight Color</h4>
             <div className="color-picker-grid">
               {['#ffff00', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b'].map((color) => (
                 <button
                   key={color}
                   className="color-option"
                   style={{ backgroundColor: color }}
                   onClick={() => handleColorChange(color)}
                   title={color}
                 />
               ))}
             </div>
             <button className="color-picker-close" onClick={handleColorPickerClose}>
               Cancel
             </button>
           </div>
         </div>
       )}
     </div>
   );
 });

export default SimpleRichEditor;
