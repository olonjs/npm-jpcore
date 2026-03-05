import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { Markdown } from 'tiptap-markdown';
import {
  Undo2,
  Redo2,
  Heading,
  List,
  ListOrdered,
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Code2,
  Quote,
  SquareCode,
  Link2,
  Unlink2,
  ImagePlus,
  Eraser,
} from 'lucide-react';
import { STUDIO_EVENTS, useConfig, useStudio } from '@jsonpages/core';
import type { TiptapData, TiptapSettings } from './types';

const ToolbarButton: React.FC<{
  active?: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active = false, title, onClick, children }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={[
      'inline-flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-xs transition-colors',
      active
        ? 'bg-blue-600/25 border-blue-400/60 text-blue-100'
        : 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800',
    ].join(' ')}
  >
    {children}
  </button>
);

const ToolbarSeparator: React.FC = () => <span className="mx-1 h-5 w-px bg-zinc-700" aria-hidden />;

const UploadableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      uploadId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-upload-id'),
        renderHTML: (attributes) =>
          attributes.uploadId ? { 'data-upload-id': String(attributes.uploadId) } : {},
      },
      uploading: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-uploading') === 'true',
        renderHTML: (attributes) =>
          attributes.uploading ? { 'data-uploading': 'true' } : {},
      },
      uploadError: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-upload-error') === 'true',
        renderHTML: (attributes) =>
          attributes.uploadError ? { 'data-upload-error': 'true' } : {},
      },
      awaitingUpload: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-awaiting-upload') === 'true',
        renderHTML: (attributes) =>
          attributes.awaitingUpload ? { 'data-awaiting-upload': 'true' } : {},
      },
    };
  },
});

const getEditorMarkdown = (editor: Editor | null | undefined): string => {
  const storage = editor?.storage as
    | {
        markdown?: {
          getMarkdown?: () => string;
        };
      }
    | undefined;
  return storage?.markdown?.getMarkdown?.() ?? '';
};

const UPLOAD_PLACEHOLDER_SRC =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='420' viewBox='0 0 1200 420'>
      <rect width='1200' height='420' fill='#090B14' stroke='#3F3F46' stroke-width='3' stroke-dasharray='10 10' rx='12' />
      <g font-family='Inter,Arial,sans-serif' text-anchor='middle' fill='#A1A1AA'>
        <text x='600' y='190' font-size='30' font-weight='700'>Uploading image...</text>
        <text x='600' y='235' font-size='22'>Please wait while we process your file</text>
      </g>
    </svg>`
  );

const UPLOAD_PICKER_PLACEHOLDER_SRC =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='420' viewBox='0 0 1200 420'>
      <rect width='1200' height='420' fill='#090B14' stroke='#3F3F46' stroke-width='3' stroke-dasharray='10 10' rx='12' />
      <g font-family='Inter,Arial,sans-serif' text-anchor='middle'>
        <text x='600' y='210' font-size='34' font-weight='700' fill='#E4E4E7'>Click to upload or drag and drop</text>
        <text x='600' y='255' font-size='24' font-weight='500' fill='#A1A1AA'>Maximum 3 files, 5MB each.</text>
      </g>
    </svg>`
  );

const updateImageByUploadId = (
  editor: Editor,
  uploadId: string,
  patch: Record<string, unknown>
): boolean => {
  let targetPos: number | null = null;
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'image' && node.attrs?.uploadId === uploadId) {
      targetPos = pos;
      return false;
    }
    return true;
  });
  if (targetPos == null) return false;
  const current = editor.state.doc.nodeAt(targetPos);
  if (!current) return false;
  const attrs = { ...current.attrs, ...patch };
  editor.view.dispatch(editor.state.tr.setNodeMarkup(targetPos, undefined, attrs));
  return true;
};

const StudioTiptapEditor: React.FC<{ data: TiptapData }> = ({ data }) => {
  const { assets } = useConfig();
  const rootRef = React.useRef<HTMLElement | null>(null);
  const editorHostRef = React.useRef<HTMLDivElement | null>(null);
  const editorInstanceRef = React.useRef<Editor | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const pendingUploadsRef = React.useRef<Map<string, Promise<void>>>(new Map());
  const pendingPickerUploadIdRef = React.useRef<string | null>(null);
  const latestMarkdownRef = React.useRef<string>(data.content ?? '');
  const latestEmittedMarkdownRef = React.useRef<string>(data.content ?? '');

  const resolveSectionId = React.useCallback(() => {
    const sectionEl =
      rootRef.current ??
      (editorHostRef.current?.closest('[data-section-id]') as HTMLElement | null);
    rootRef.current = sectionEl;
    return sectionEl?.getAttribute('data-section-id') ?? null;
  }, []);

  const emitInlineUpdate = React.useCallback((markdown: string) => {
    latestMarkdownRef.current = markdown;
    const sectionId = resolveSectionId();
    if (!sectionId) return;
    window.parent.postMessage(
      {
        type: STUDIO_EVENTS.INLINE_FIELD_UPDATE,
        sectionId,
        fieldKey: 'content',
        value: markdown,
      },
      window.location.origin
    );
    latestEmittedMarkdownRef.current = markdown;
  }, [resolveSectionId]);

  const insertUploadPlaceholder = React.useCallback(
    (uploadId: string, src: string, awaitingUpload: boolean) => {
      const editor = editorInstanceRef.current;
      if (!editor) return;
      editor
        .chain()
        .focus()
        .setImage({
          src,
          alt: 'upload-placeholder',
          title: awaitingUpload ? 'Click to upload' : 'Uploading...',
          uploadId,
          uploading: !awaitingUpload,
          awaitingUpload,
          uploadError: false,
        } as any)
        .run();
      emitInlineUpdate(getEditorMarkdown(editor));
    },
    [emitInlineUpdate]
  );

  const startUploadForId = React.useCallback(
    async (uploadId: string, file: File) => {
      const uploadAsset = assets?.onAssetUpload;
      if (!uploadAsset) return;
      const editor = editorInstanceRef.current;
      if (!editor) return;
      updateImageByUploadId(editor, uploadId, {
        src: UPLOAD_PLACEHOLDER_SRC,
        alt: file.name,
        title: file.name,
        uploading: true,
        awaitingUpload: false,
        uploadError: false,
      });
      const task = (async () => {
        try {
          const url = await uploadAsset(file);
          const currentEditor = editorInstanceRef.current;
          if (currentEditor) {
            updateImageByUploadId(currentEditor, uploadId, {
              src: url,
              alt: file.name,
              title: file.name,
              uploadId: null,
              uploading: false,
              awaitingUpload: false,
              uploadError: false,
            });
            emitInlineUpdate(getEditorMarkdown(currentEditor));
          }
        } catch (err) {
          console.error('[tiptap] upload failed', err);
          const currentEditor = editorInstanceRef.current;
          if (currentEditor) {
            updateImageByUploadId(currentEditor, uploadId, {
              uploading: false,
              awaitingUpload: false,
              uploadError: true,
            });
          }
        } finally {
          pendingUploadsRef.current.delete(uploadId);
        }
      })();
      pendingUploadsRef.current.set(uploadId, task);
      await task;
    },
    [assets, emitInlineUpdate]
  );

  const uploadImage = React.useCallback(
    async (file: File) => {
      const uploadId = crypto.randomUUID();
      insertUploadPlaceholder(uploadId, UPLOAD_PLACEHOLDER_SRC, false);
      await startUploadForId(uploadId, file);
    },
    [insertUploadPlaceholder, startUploadForId]
  );

  const setFocusLock = React.useCallback((enabled: boolean) => {
    const sectionEl = rootRef.current;
    if (!sectionEl) return;
    if (enabled) sectionEl.classList.add('jp-editorial-focus');
    else sectionEl.classList.remove('jp-editorial-focus');
  }, []);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Link.configure({ openOnClick: false, autolink: true }),
        Underline,
        UploadableImage,
        Markdown.configure({ html: false }),
      ],
      content: data.content ?? '',
      autofocus: false,
      editorProps: {
        attributes: {
          class:
            'prose prose-invert max-w-none min-h-[220px] rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 text-zinc-100 outline-none',
        },
        handleDrop: (_view, event) => {
          const file = event.dataTransfer?.files?.[0];
          if (!file || !file.type.startsWith('image/') || !assets?.onAssetUpload) return false;
          event.preventDefault();
          void (async () => {
            try {
              await uploadImage(file);
            } catch (err) {
              console.error('[tiptap] upload failed on drop', err);
            }
          })();
          return true;
        },
        handlePaste: (_view, event) => {
          const file = Array.from(event.clipboardData?.files ?? []).find((f) =>
            f.type.startsWith('image/')
          );
          if (!file || !assets?.onAssetUpload) return false;
          event.preventDefault();
          void (async () => {
            try {
              await uploadImage(file);
            } catch (err) {
              console.error('[tiptap] upload failed on paste', err);
            }
          })();
          return true;
        },
        handleClickOn: (_view, _pos, node) => {
          if (node.type.name !== 'image') return false;
          if (node.attrs?.awaitingUpload !== true) return false;
          const uploadId = typeof node.attrs?.uploadId === 'string' ? node.attrs.uploadId : null;
          if (!uploadId) return false;
          pendingPickerUploadIdRef.current = uploadId;
          fileInputRef.current?.click();
          return true;
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        const markdown = getEditorMarkdown(currentEditor);
        emitInlineUpdate(markdown);
      },
      onFocus: () => {
        setFocusLock(true);
      },
      onBlur: ({ editor: currentEditor }) => {
        const markdown = getEditorMarkdown(currentEditor);
        if (markdown !== latestEmittedMarkdownRef.current) {
          emitInlineUpdate(markdown);
        }
        setFocusLock(false);
      },
    }
  );

  React.useEffect(() => {
    const sectionEl = editorHostRef.current?.closest('[data-section-id]') as HTMLElement | null;
    rootRef.current = sectionEl;
  }, []);

  React.useEffect(() => {
    editorInstanceRef.current = editor ?? null;
  }, [editor]);

  React.useEffect(() => {
    const handleInlineFlushRequest = () => {
      void (async () => {
        const pending = Array.from(pendingUploadsRef.current.values());
        if (pending.length > 0) {
          await Promise.allSettled(pending);
        }
        const markdown = getEditorMarkdown(editorInstanceRef.current);
        emitInlineUpdate(markdown);
      })();
    };
    window.addEventListener(STUDIO_EVENTS.REQUEST_INLINE_FLUSH, handleInlineFlushRequest as EventListener);
    return () => {
      window.removeEventListener(STUDIO_EVENTS.REQUEST_INLINE_FLUSH, handleInlineFlushRequest as EventListener);
    };
  }, [emitInlineUpdate]);

  React.useEffect(() => {
    if (!editor) return;
    const nextMarkdown = data.content ?? '';
    if (nextMarkdown === latestMarkdownRef.current) return;
    editor.commands.setContent(nextMarkdown);
    latestMarkdownRef.current = nextMarkdown;
  }, [data.content, editor]);

  React.useEffect(
    () => () => {
      const editorInstance = editorInstanceRef.current;
      const markdown = getEditorMarkdown(editorInstance);
      if (markdown !== latestEmittedMarkdownRef.current) {
        emitInlineUpdate(markdown);
      }
      setFocusLock(false);
    },
    [emitInlineUpdate, setFocusLock]
  );

  const setParagraph = () => editor?.chain().focus().setParagraph().run();
  const setHeading = (level: 1 | 2 | 3) => editor?.chain().focus().toggleHeading({ level }).run();
  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const href = window.prompt('URL', prev ?? 'https://');
    if (href == null) return;
    if (href.trim() === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
  };
  const clearFormatting = () => {
    editor?.chain().focus().unsetAllMarks().clearNodes().run();
  };
  const onPickImageClick = () => {
    if (pendingPickerUploadIdRef.current) return;
    const uploadId = crypto.randomUUID();
    pendingPickerUploadIdRef.current = uploadId;
    insertUploadPlaceholder(uploadId, UPLOAD_PICKER_PLACEHOLDER_SRC, true);
  };
  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const pendingUploadId = pendingPickerUploadIdRef.current;
    if (!file || !file.type.startsWith('image/') || !assets?.onAssetUpload) {
      event.target.value = '';
      return;
    }
    void (async () => {
      try {
        if (pendingUploadId) {
          await startUploadForId(pendingUploadId, file);
          pendingPickerUploadIdRef.current = null;
        } else {
          await uploadImage(file);
        }
      } catch (err) {
        console.error('[tiptap] upload failed from picker', err);
      } finally {
        event.target.value = '';
      }
    })();
  };
  const isActive = (name: string, attrs?: Record<string, unknown>) => editor?.isActive(name, attrs) ?? false;

  return (
    <div
      ref={editorHostRef}
      data-jp-field="content"
      className="space-y-3"
    >
      {editor && (
        <div
          data-jp-ignore-select="true"
          className="sticky top-2 z-[65] rounded-md border border-zinc-700 bg-zinc-950/95 p-2 shadow-lg backdrop-blur"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
              <Undo2 size={14} />
            </ToolbarButton>
            <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
              <Redo2 size={14} />
            </ToolbarButton>
            <ToolbarSeparator />

            <ToolbarButton active={isActive('paragraph')} title="Paragraph" onClick={setParagraph}>
              P
            </ToolbarButton>
            <ToolbarButton active={isActive('heading', { level: 1 })} title="Heading 1" onClick={() => setHeading(1)}>
              H1
            </ToolbarButton>
            <ToolbarButton active={isActive('heading', { level: 2 })} title="Heading 2" onClick={() => setHeading(2)}>
              H2
            </ToolbarButton>
            <ToolbarButton active={isActive('heading', { level: 3 })} title="Heading 3" onClick={() => setHeading(3)}>
              H3
            </ToolbarButton>
            <ToolbarButton title="Headings" onClick={() => setHeading(2)}>
              <Heading size={14} />
            </ToolbarButton>
            <ToolbarSeparator />

            <ToolbarButton active={isActive('bold')} title="Bold" onClick={() => editor.chain().focus().toggleBold().run()}>
              <Bold size={14} />
            </ToolbarButton>
            <ToolbarButton active={isActive('italic')} title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}>
              <Italic size={14} />
            </ToolbarButton>
            <ToolbarButton active={isActive('underline')} title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <UnderlineIcon size={14} />
            </ToolbarButton>
            <ToolbarButton active={isActive('strike')} title="Strike" onClick={() => editor.chain().focus().toggleStrike().run()}>
              <Strikethrough size={14} />
            </ToolbarButton>
            <ToolbarButton active={isActive('code')} title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()}>
              <Code2 size={14} />
            </ToolbarButton>
            <ToolbarSeparator />

            <ToolbarButton active={isActive('bulletList')} title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}>
              <List size={14} />
            </ToolbarButton>
            <ToolbarButton active={isActive('orderedList')} title="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              <ListOrdered size={14} />
            </ToolbarButton>
            <ToolbarButton active={isActive('blockquote')} title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              <Quote size={14} />
            </ToolbarButton>
            <ToolbarButton active={isActive('codeBlock')} title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
              <SquareCode size={14} />
            </ToolbarButton>
            <ToolbarSeparator />

            <ToolbarButton active={isActive('link')} title="Set link" onClick={setLink}>
              <Link2 size={14} />
            </ToolbarButton>
            <ToolbarButton title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}>
              <Unlink2 size={14} />
            </ToolbarButton>
            <ToolbarButton title="Add image" onClick={onPickImageClick}>
              <ImagePlus size={14} />
            </ToolbarButton>
            <ToolbarButton title="Clear formatting" onClick={clearFormatting}>
              <Eraser size={14} />
            </ToolbarButton>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileSelected}
          />
        </div>
      )}
      <EditorContent editor={editor} className="jp-simple-editor" />
    </div>
  );
};

const PublicTiptapContent: React.FC<{ content: string }> = ({ content }) => (
  <article className="prose max-w-none prose-zinc" data-jp-field="content">
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
      {content}
    </ReactMarkdown>
  </article>
);

export const Tiptap: React.FC<{ data: TiptapData; settings?: TiptapSettings }> = ({ data }) => {
  const { mode } = useStudio();
  const isStudio = mode === 'studio';

  return (
    <section
      style={
        {
          '--local-bg': 'var(--background)',
          '--local-surface': 'var(--card)',
          '--local-text': 'var(--foreground)',
          '--local-border': 'var(--border)',
        } as React.CSSProperties
      }
      className="py-12 bg-[var(--local-bg)]"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        {isStudio ? <StudioTiptapEditor data={data} /> : <PublicTiptapContent content={data.content ?? ''} />}
      </div>
    </section>
  );
};
