import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (htmlContent: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Checks if a string contains HTML markup.
 */
const hasHtmlTags = (str: string): boolean => {
  return /<[a-z][\s\S]*>/i.test(str);
};

const ALLOWED_TAGS = new Set(['P', 'BR', 'DIV', 'SPAN', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI']);
const DROPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'SVG', 'MATH']);

/**
 * Keeps only the tags the toolbar can produce and strips every attribute.
 * Stored HTML can come from an imported backup file, and it goes into
 * innerHTML on the same origin as the other apps on the site.
 */
const sanitizeHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const clean = (node: Element) => {
    for (const child of Array.from(node.children)) {
      if (DROPPED_TAGS.has(child.tagName.toUpperCase())) {
        child.remove();
        continue;
      }
      clean(child);
      if (ALLOWED_TAGS.has(child.tagName)) {
        for (const attr of Array.from(child.attributes)) child.removeAttribute(attr.name);
      } else {
        child.replaceWith(...Array.from(child.childNodes));
      }
    }
  };
  clean(doc.body);
  return doc.body.innerHTML;
};

/**
 * Converts legacy plain text with newlines to clean HTML paragraphs.
 */
const plainTextToHtml = (text: string): string => {
  if (!text) return '';
  if (hasHtmlTags(text)) return sanitizeHtml(text);

  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const lines = text.split('\n');
  return lines
    .map((line) => (line.trim() ? `<p>${escapeHtml(line)}</p>` : '<p><br></p>'))
    .join('');
};

/**
 * Strips HTML tags and collapses whitespace to get clean plain text for word counts & searching.
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Type script or teleprompter lines here...',
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChangeRef = useRef(false);

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    bulletList: false,
    numberedList: false,
  });

  const [isEmpty, setIsEmpty] = useState(true);
  const [editorHeight, setEditorHeight] = useState<number | undefined>(undefined);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editorRef.current) return;

    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = editorRef.current.offsetHeight;

    const prevCursor = document.body.style.cursor;
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = moveEvent.clientY - startYRef.current;
      const newHeight = Math.max(88, startHeightRef.current + deltaY);
      setEditorHeight(newHeight);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevUserSelect;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || !editorRef.current) return;
    const touch = e.touches[0];
    isDraggingRef.current = true;
    startYRef.current = touch.clientY;
    startHeightRef.current = editorRef.current.offsetHeight;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!isDraggingRef.current || moveEvent.touches.length !== 1) return;
      const moveTouch = moveEvent.touches[0];
      const deltaY = moveTouch.clientY - startYRef.current;
      const newHeight = Math.max(88, startHeightRef.current + deltaY);
      setEditorHeight(newHeight);
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleResizeDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editorRef.current) return;

    const scrollH = editorRef.current.scrollHeight;
    const clientH = editorRef.current.clientHeight;

    // If there is hidden overflowing text, expand to fit all content
    if (scrollH > clientH + 4) {
      setEditorHeight(scrollH + 12);
    } else if (editorHeight && editorHeight > 96) {
      // If already expanded taller than default, reset back to compact default
      setEditorHeight(undefined);
    }
  };

  // Sync internal content from props when changed externally
  useEffect(() => {
    if (!editorRef.current) return;

    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }

    const formattedHtml = plainTextToHtml(content);
    if (editorRef.current.innerHTML !== formattedHtml) {
      editorRef.current.innerHTML = formattedHtml;
    }

    const plain = stripHtml(formattedHtml);
    setIsEmpty(plain.length === 0);
  }, [content]);

  // Update active formatting states based on cursor/selection
  const updateActiveFormats = useCallback(() => {
    if (!editorRef.current) return;

    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        bulletList: document.queryCommandState('insertUnorderedList'),
        numberedList: document.queryCommandState('insertOrderedList'),
      });
    } catch {
      // queryCommandState can throw in edge cases
    }

    const currentHtml = editorRef.current.innerHTML;
    const plain = stripHtml(currentHtml);
    setIsEmpty(plain.length === 0);
  }, []);

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const plain = stripHtml(html);
    setIsEmpty(plain.length === 0);

    isInternalChangeRef.current = true;
    onChange(html);
    updateActiveFormats();
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    if (modifier) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        executeCommand('bold');
        return;
      }
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        executeCommand('italic');
        return;
      }
      if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        executeCommand('underline');
        return;
      }
    }
  };

  return (
    <div className={`flex flex-col rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 focus-within:border-sky-500/50 dark:focus-within:border-sky-500/40 focus-within:ring-1 focus-within:ring-sky-500/20 transition duration-150 ${className}`}>
      {/* Formatting Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/50 rounded-t-lg select-none">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('bold');
          }}
          className={`p-1 rounded text-xs transition flex items-center justify-center ${
            activeFormats.bold
              ? 'bg-sky-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('italic');
          }}
          className={`p-1 rounded text-xs transition flex items-center justify-center ${
            activeFormats.italic
              ? 'bg-sky-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Italics (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('underline');
          }}
          className={`p-1 rounded text-xs transition flex items-center justify-center ${
            activeFormats.underline
              ? 'bg-sky-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-800 mx-1" />

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('insertUnorderedList');
          }}
          className={`p-1 rounded text-xs transition flex items-center justify-center ${
            activeFormats.bulletList
              ? 'bg-sky-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Bullet Points"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand('insertOrderedList');
          }}
          className={`p-1 rounded text-xs transition flex items-center justify-center ${
            activeFormats.numberedList
              ? 'bg-sky-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <div className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-tight hidden sm:block">
          Rich Format
        </div>
      </div>

      {/* Editable Canvas & Bottom-Right Resize Handle */}
      <div className="relative flex-1">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onKeyDown={handleKeyDown}
          onFocus={updateActiveFormats}
          data-placeholder={placeholder}
          data-empty={isEmpty}
          style={editorHeight ? { height: `${editorHeight}px` } : undefined}
          className={`rich-script-editor w-full p-2.5 pr-6 text-xs text-slate-800 dark:text-slate-200 focus:outline-none transition leading-relaxed min-h-[5.5rem] overflow-y-auto ${
            editorHeight ? '' : 'max-h-72'
          }`}
        />

        {/* Corner Resize Grip */}
        <div
          onMouseDown={handleResizeMouseDown}
          onTouchStart={handleResizeTouchStart}
          onDoubleClick={handleResizeDoubleClick}
          title="Drag to make text box taller or shorter (Double-click to fit content)"
          className="group absolute bottom-1 right-1 w-4 h-4 cursor-se-resize flex items-center justify-center rounded transition select-none hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
        >
          <svg
            className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors pointer-events-none"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M8 2 L2 8 M9 5 L5 9 M9 8 L8 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
