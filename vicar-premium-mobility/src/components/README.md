# SlateEditor Component

A simple text editor component that provides a clean interface for blog content, articles, and other text-based content.

## Features

- **Simple Text Input**: Clean, straightforward text editing
- **Responsive Design**: Works on all device sizes
- **Customizable**: Easy to style and extend
- **Lightweight**: No external dependencies

## Usage

### Basic Import

```jsx
import SlateEditor from '../components/SlateEditor';
```

### Basic Implementation

```jsx
const [content, setContent] = useState('');

<SlateEditor
  value={content}
  onChange={setContent}
  placeholder="Enter your content here..."
/>
```

### With Form Integration

```jsx
const [formData, setFormData] = useState({
  title: '',
  body: '',
  // ... other fields
});

<SlateEditor
  value={formData.body}
  onChange={(html) => setFormData(prev => ({ ...prev, body: html }))}
  placeholder="Enter blog content..."
/>
```

### Displaying Text Content

```jsx
// In your display component
<div className="blog-content">
  {blog.body}
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | '' | The HTML content to display/edit |
| `onChange` | function | - | Callback function when content changes |
| `placeholder` | string | '' | Placeholder text when editor is empty |
| `className` | string | '' | Additional CSS classes |

## Styling

The component includes its own CSS file (`SlateEditor.css`) with:
- Clean textarea styling
- Focus states with color transitions
- Responsive design
- Customizable appearance

## Content Storage

The editor saves content as plain text, which can be:
- Stored in your database
- Displayed on other pages
- Easily processed and formatted
- Exported to other formats

## Example Use Cases

1. **Blog Posts**: Rich content editing with formatting
2. **Product Descriptions**: Formatted product information
3. **About Pages**: Company information with styling
4. **News Articles**: Formatted news content
5. **Documentation**: Technical documentation with formatting

## Security Note

When rendering HTML content, ensure you trust the source. Consider using a HTML sanitizer library if the content comes from user input.

## Responsive Design

The component automatically adapts to different screen sizes:
- Desktop: Full-width textarea
- Tablet: Responsive textarea sizing
- Mobile: Mobile-friendly input

