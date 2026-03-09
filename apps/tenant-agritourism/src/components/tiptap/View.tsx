import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import {
  Undo2, Redo2,
  List, ListOrdered,
  Bold, Italic, Strikethrough,
  Code2, Quote, SquareCode,
  Link2, Unlink2, ImagePlus, Eraser,
} from 'lucide-react';
import { STUDIO_EVENTS, useConfig, useStudio } from '@jsonpages/core';
import type { TiptapData, TiptapSettings } from './types';

// ── UI primitives ─────────────────────────────────────────────────────────────

const Btn: React.FC<{
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
      'inline-flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs transition-colors',
      active
        ? 'bg-zinc-700/70 text-zinc-100'
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
    ].join(' ')}
  >
    {children}
  </button>
);

const Sep: React.FC = () => (
  <span className="mx-0.5 h-5 w-px shrink-0 bg-zinc-800" aria-hidden />
);

// ── Image extension with upload metadata ──────────────────────────────────────

const UploadableImage = Image.extend({
  addAttributes() {
    const bool = (attr: string) => ({
      default: false,
      parseHTML: (el: HTMLElement) => el.getAttribute(attr) === 'true',
      renderHTML: (attrs: Record<string, unknown>) =>
        attrs[attr.replace('data-', '').replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())]
          ? { [attr]: 'true' }
          : {},
    });
    return {
      ...this.parent?.(),
      uploadId: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute('data-upload-id'),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.uploadId ? { 'data-upload-id': String(attrs.uploadId) } : {},
      },
      uploading: bool('data-uploading'),
      uploadError: bool('data-upload-error'),
      awaitingUpload: bool('data-awaiting-upload'),
    };
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const getMarkdown = (ed: Editor | null | undefined): string =>
  (ed?.storage as { markdown?: { getMarkdown?: () => string } } | undefined)
    ?.markdown?.getMarkdown?.() ?? '';

const svg = (body: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='420' viewBox='0 0 1200 420'>${body}</svg>`
  );

const RECT = `<rect width='1200' height='420' fill='#090B14' stroke='#3F3F46' stroke-width='3' stroke-dasharray='10 10' rx='12'/>`;

const UPLOADING_SRC = svg(
  RECT +
  `<text x='600' y='215' font-family='Inter,Arial,sans-serif' font-size='28' font-weight='700' fill='#A1A1AA' text-anchor='middle'>Uploading image…</text>`
);

const PICKER_SRC = svg(
  RECT +
  `<text x='600' y='200' font-family='Inter,Arial,sans-serif' font-size='32' font-weight='700' fill='#E4E4E7' text-anchor='middle'>Click to upload or drag &amp; drop</text>` +
  `<text x='600' y='248' font-family='Inter,Arial,sans-serif' font-size='22' fill='#A1A1AA' text-anchor='middle'>Max 5 MB per file</text>`
);

const patchImage = (
  ed: Editor,
  uploadId: string,
  patch: Record<string, unknown>
): boolean => {
  let pos: number | null = null;
  ed.state.doc.descendants(
    (node: { type: { name: string }; attrs?: Record<string, unknown> }, p: number) => {
      if (node.type.name === 'image' && node.attrs?.uploadId === uploadId) {
        pos = p;
        return false;
      }
      return true;
    }
  );
  if (pos == null) return false;
  const cur = ed.state.doc.nodeAt(pos);
  if (!cur) return false;
  ed.view.dispatch(ed.state.tr.setNodeMarkup(pos, undefined, { ...cur.attrs, ...patch }));
  return true;
};

// Extensions defined outside component — stable reference, no re-creation on render
const EXTENSIONS = [
  StarterKit,
  Link.configure({ openOnClick: false, autolink: true }),
  UploadableImage,
  // NOTE: Underline is intentionally excluded.
  // tiptap-markdown with html:false cannot round-trip <u> tags, so underline
  // would be silently dropped on save. Use bold/italic instead.
  Markdown.configure({ html: false }),
];

const EDITOR_CLASSES =
  'min-h-[220px] p-4 outline-none';

// ── Studio editor component ───────────────────────────────────────────────────

const StudioTiptapEditor: React.FC<{ data: TiptapData }> = ({ data }) => {
  const { assets } = useConfig();

  // DOM refs
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Editor & upload state
  const editorRef = React.useRef<Editor | null>(null);
  const pendingUploads = React.useRef<Map<string, Promise<void>>>(new Map());
  const pendingPickerId = React.useRef<string | null>(null);

  // Markdown sync refs
  const latestMd = React.useRef<string>(data.content ?? '');
  const emittedMd = React.useRef<string>(data.content ?? '');

  // Link popover state
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const linkInputRef = React.useRef<HTMLInputElement | null>(null);

  // ── Core helpers ────────────────────────────────────────────────────────

  const getSectionId = React.useCallback((): string | null => {
    const el =
      sectionRef.current ??
      (hostRef.current?.closest('[data-section-id]') as HTMLElement | null);
    sectionRef.current = el;
    return el?.getAttribute('data-section-id') ?? null;
  }, []);

  const emit = React.useCallback(
    (markdown: string) => {
      latestMd.current = markdown;
      const sectionId = getSectionId();
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
      emittedMd.current = markdown;
    },
    [getSectionId]
  );

  const setFocusLock = React.useCallback((on: boolean) => {
    sectionRef.current?.classList.toggle('jp-editorial-focus', on);
  }, []);

  // ── Image upload ─────────────────────────────────────────────────────────

  const insertPlaceholder = React.useCallback(
    (uploadId: string, src: string, awaitingUpload: boolean) => {
      const ed = editorRef.current;
      if (!ed) return;
      ed.chain()
        .focus()
        .setImage({
          src,
          alt: 'upload-placeholder',
          title: awaitingUpload ? 'Click to upload' : 'Uploading…',
          uploadId,
          uploading: !awaitingUpload,
          awaitingUpload,
          uploadError: false,
        } as any)
        .run();
      emit(getMarkdown(ed));
    },
    [emit]
  );

  const doUpload = React.useCallback(
    async (uploadId: string, file: File) => {
      const uploadFn = assets?.onAssetUpload;
      if (!uploadFn) return;
      const ed = editorRef.current;
      if (!ed) return;
      patchImage(ed, uploadId, {
        src: UPLOADING_SRC,
        alt: file.name,
        title: file.name,
        uploading: true,
        awaitingUpload: false,
        uploadError: false,
      });
      const task = (async () => {
        try {
          const url = await uploadFn(file);
          const cur = editorRef.current;
          if (cur) {
            patchImage(cur, uploadId, {
              src: url,
              alt: file.name,
              title: file.name,
              uploadId: null,
              uploading: false,
              awaitingUpload: false,
              uploadError: false,
            });
            emit(getMarkdown(cur));
          }
        } catch (err) {
          console.error('[tiptap] upload failed', err);
          const cur = editorRef.current;
          if (cur)
            patchImage(cur, uploadId, {
              uploading: false,
              awaitingUpload: false,
              uploadError: true,
            });
        } finally {
          pendingUploads.current.delete(uploadId);
        }
      })();
      pendingUploads.current.set(uploadId, task);
      await task;
    },
    [assets, emit]
  );

  const uploadFile = React.useCallback(
    async (file: File) => {
      const id = crypto.randomUUID();
      insertPlaceholder(id, UPLOADING_SRC, false);
      await doUpload(id, file);
    },
    [insertPlaceholder, doUpload]
  );

  // ── Stable editorProps via refs (avoids stale closures in useEditor) ─────
  // Reads refs at call-time so useEditor never needs to rebuild the editor.

  const uploadFileRef = React.useRef(uploadFile);
  uploadFileRef.current = uploadFile;
  const assetsRef = React.useRef(assets);
  assetsRef.current = assets;

  const editorProps = React.useMemo(
    () => ({
      attributes: { class: EDITOR_CLASSES },
      handleDrop: (_v: unknown, event: DragEvent) => {
        const file = event.dataTransfer?.files?.[0];
        if (!file?.type.startsWith('image/') || !assetsRef.current?.onAssetUpload) return false;
        event.preventDefault();
        void uploadFileRef.current(file).catch((e) =>
          console.error('[tiptap] drop upload failed', e)
        );
        return true;
      },
      handlePaste: (_v: unknown, event: ClipboardEvent) => {
        const file = Array.from(event.clipboardData?.files ?? []).find((f: File) =>
          f.type.startsWith('image/')
        );
        if (!file || !assetsRef.current?.onAssetUpload) return false;
        event.preventDefault();
        void uploadFileRef.current(file).catch((e) =>
          console.error('[tiptap] paste upload failed', e)
        );
        return true;
      },
      handleClickOn: (
        _v: unknown,
        _p: number,
        node: { type: { name: string }; attrs?: Record<string, unknown> }
      ) => {
        if (node.type.name !== 'image' || node.attrs?.awaitingUpload !== true) return false;
        const uploadId =
          typeof node.attrs?.uploadId === 'string' ? node.attrs.uploadId : null;
        if (!uploadId) return false;
        pendingPickerId.current = uploadId;
        fileInputRef.current?.click();
        return true;
      },
    }),
    [] // intentionally empty — reads refs at call-time
  );

  // ── useEditor ─────────────────────────────────────────────────────────────

  const emitRef = React.useRef(emit);
  emitRef.current = emit;

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: data.content ?? '',
    autofocus: false,
    editorProps,
    onUpdate: ({ editor: e }: { editor: Editor }) => emitRef.current(getMarkdown(e)),
    onFocus: () => setFocusLock(true),
    onBlur: ({ editor: e }: { editor: Editor }) => {
      const md = getMarkdown(e);
      if (md !== emittedMd.current) emitRef.current(md);
      setFocusLock(false);
    },
  });

  // ── Effects ───────────────────────────────────────────────────────────────

  React.useEffect(() => {
    sectionRef.current =
      hostRef.current?.closest('[data-section-id]') as HTMLElement | null;
  }, []);

  React.useEffect(() => {
    editorRef.current = editor ?? null;
  }, [editor]);

  // Sync external content changes into editor (e.g. engine-level undo)
  React.useEffect(() => {
    if (!editor) return;
    const next = data.content ?? '';
    if (next === latestMd.current) return;
    editor.commands.setContent(next);
    latestMd.current = next;
  }, [data.content, editor]);

  // PreviewEntry receives REQUEST_INLINE_FLUSH via postMessage and re-dispatches
  // it as a DOM CustomEvent. Listen to the DOM event — do NOT send INLINE_FLUSHED
  // back (PreviewEntry already handles that acknowledgement).
  React.useEffect(() => {
    const handler = () => {
      void (async () => {
        if (pendingUploads.current.size > 0) {
          await Promise.allSettled(Array.from(pendingUploads.current.values()));
        }
        emitRef.current(getMarkdown(editorRef.current));
      })();
    };
    window.addEventListener(STUDIO_EVENTS.REQUEST_INLINE_FLUSH, handler);
    return () => window.removeEventListener(STUDIO_EVENTS.REQUEST_INLINE_FLUSH, handler);
  }, []);

  // File input cancel: modern browsers fire a 'cancel' event when user
  // closes the picker without selecting a file.
  React.useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;
    const onCancel = () => {
      const pickId = pendingPickerId.current;
      if (pickId && editorRef.current) {
        patchImage(editorRef.current, pickId, {
          uploading: false,
          awaitingUpload: false,
          uploadError: true,
        });
      }
      pendingPickerId.current = null;
    };
    input.addEventListener('cancel', onCancel);
    return () => input.removeEventListener('cancel', onCancel);
  }, []);

  // Emit on unmount (safety flush)
  React.useEffect(
    () => () => {
      const md = getMarkdown(editorRef.current);
      if (md !== emittedMd.current) emitRef.current(md);
      setFocusLock(false);
    },
    [setFocusLock]
  );

  // Focus link input when popover opens
  React.useEffect(() => {
    if (linkOpen) {
      const t = setTimeout(() => linkInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [linkOpen]);

  // ── Toolbar actions ───────────────────────────────────────────────────────

  const openLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    setLinkUrl(prev ?? 'https://');
    setLinkOpen(true);
  };

  const applyLink = () => {
    if (!editor) return;
    const href = linkUrl.trim();
    if (href === '' || href === 'https://') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    }
    setLinkOpen(false);
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const pickId = pendingPickerId.current;
    e.target.value = '';

    if (!file?.type.startsWith('image/') || !assets?.onAssetUpload) {
      // File picker opened but no valid file selected — clean up placeholder
      if (pickId && editorRef.current) {
        patchImage(editorRef.current, pickId, {
          uploading: false,
          awaitingUpload: false,
          uploadError: true,
        });
      }
      pendingPickerId.current = null;
      return;
    }

    void (async () => {
      try {
        if (pickId) {
          await doUpload(pickId, file);
          pendingPickerId.current = null;
        } else {
          await uploadFile(file);
        }
      } catch (err) {
        console.error('[tiptap] picker upload failed', err);
        pendingPickerId.current = null;
      }
    })();
  };

  const onPickImage = () => {
    if (pendingPickerId.current) return;
    const id = crypto.randomUUID();
    pendingPickerId.current = id;
    insertPlaceholder(id, PICKER_SRC, true);
  };

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor?.isActive(name, attrs) ?? false;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={hostRef} data-jp-field="content" className="space-y-2">
      {editor && (
        <div
          data-jp-ignore-select="true"
          className="sticky top-0 z-[65] border-b border-zinc-800 bg-zinc-950"
        >
          {/* ── Main toolbar ── */}
          <div className="flex flex-wrap items-center justify-center gap-1 p-2">
            {/* History */}
            <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
              <Undo2 size={13} />
            </Btn>
            <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
              <Redo2 size={13} />
            </Btn>
            <Sep />

            {/* Block type */}
            <Btn
              active={isActive('paragraph')}
              title="Paragraph"
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              P
            </Btn>
            <Btn
              active={isActive('heading', { level: 1 })}
              title="Heading 1"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              H1
            </Btn>
            <Btn
              active={isActive('heading', { level: 2 })}
              title="Heading 2"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              H2
            </Btn>
            <Btn
              active={isActive('heading', { level: 3 })}
              title="Heading 3"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              H3
            </Btn>
            <Sep />

            {/* Inline marks */}
            <Btn
              active={isActive('bold')}
              title="Bold (Ctrl+B)"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={13} />
            </Btn>
            <Btn
              active={isActive('italic')}
              title="Italic (Ctrl+I)"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={13} />
            </Btn>
            <Btn
              active={isActive('strike')}
              title="Strikethrough"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough size={13} />
            </Btn>
            <Btn
              active={isActive('code')}
              title="Inline code"
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Code2 size={13} />
            </Btn>
            <Sep />

            {/* Lists & block nodes */}
            <Btn
              active={isActive('bulletList')}
              title="Bullet list"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List size={13} />
            </Btn>
            <Btn
              active={isActive('orderedList')}
              title="Ordered list"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={13} />
            </Btn>
            <Btn
              active={isActive('blockquote')}
              title="Blockquote"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote size={13} />
            </Btn>
            <Btn
              active={isActive('codeBlock')}
              title="Code block"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <SquareCode size={13} />
            </Btn>
            <Sep />

            {/* Link / image / clear */}
            <Btn
              active={isActive('link') || linkOpen}
              title="Set link"
              onClick={openLink}
            >
              <Link2 size={13} />
            </Btn>
            <Btn
              title="Remove link"
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <Unlink2 size={13} />
            </Btn>
            <Btn title="Insert image" onClick={onPickImage}>
              <ImagePlus size={13} />
            </Btn>
            <Btn
              title="Clear formatting"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            >
              <Eraser size={13} />
            </Btn>
          </div>

          {/* ── Link popover row (replaces window.prompt) ── */}
          {linkOpen && (
            <div className="flex items-center gap-2 border-t border-zinc-700 px-2 py-1.5">
              <Link2 size={12} className="shrink-0 text-zinc-500" />
              <input
                ref={linkInputRef}
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyLink();
                  }
                  if (e.key === 'Escape') setLinkOpen(false);
                }}
                placeholder="https://example.com"
                className="min-w-0 flex-1 bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 outline-none"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={applyLink}
                className="shrink-0 rounded px-2 py-0.5 text-xs bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Set
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setLinkOpen(false)}
                className="shrink-0 rounded px-2 py-0.5 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      <EditorContent editor={editor} className="jp-simple-editor" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileSelected}
      />
    </div>
  );
};

// ── Public view ───────────────────────────────────────────────────────────────

const PublicTiptapContent: React.FC<{ content: string }> = ({ content }) => (
  <article className="jp-tiptap-content" data-jp-field="content">
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
      {content}
    </ReactMarkdown>
  </article>
);

// ── Export ────────────────────────────────────────────────────────────────────

export const Tiptap: React.FC<{ data: TiptapData; settings?: TiptapSettings }> = ({ data }) => {
  const { mode } = useStudio();
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-6 max-w-3xl">
        {mode === 'studio' ? (
          <StudioTiptapEditor data={data} />
        ) : (
          <PublicTiptapContent content={data.content ?? ''} />
        )}
      </div>
    </section>
  );
};
