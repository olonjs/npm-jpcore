import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import type { Components, ExtraProps } from 'react-markdown';
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
import { STUDIO_EVENTS, useConfig, useStudio } from '@olonjs/core';
import type { TiptapData, TiptapSettings } from './types';

// ── TOC helpers ───────────────────────────────────────────────────────────────

type TocEntry = { id: string; text: string; level: 2 | 3 };

function slugify(raw: string): string {
  return raw
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
    .replace(/[*_`#[\]()]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s.-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const line of markdown.split('\n')) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h2) {
      const text = h2[1].replace(/[*_`#[\]]/g, '').replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim();
      entries.push({ id: slugify(h2[1]), text, level: 2 });
    } else if (h3) {
      const text = h3[1].replace(/[*_`#[\]]/g, '').trim();
      entries.push({ id: slugify(h3[1]), text, level: 3 });
    }
  }
  return entries;
}

/** Plain text from react-markdown heading children — must match extractToc slugify input semantics. */
function mdChildrenToPlainText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(mdChildrenToPlainText).join('');
  if (React.isValidElement(node)) {
    const ch = (node.props as { children?: React.ReactNode }).children;
    if (ch != null) return mdChildrenToPlainText(ch);
  }
  return '';
}

function readScrollSpyOffsetPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--theme-header-h').trim();
  const n = parseFloat(raw);
  const header = Number.isFinite(n) ? n : 56;
  return header + 24;
}

/** Last TOC id whose heading is at or above the activation line (viewport top + offset). */
function computeActiveTocId(ids: readonly string[], offsetPx: number): string {
  let active = '';
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= offsetPx) active = id;
  }
  return active;
}

/** Studio: ProseMirror headings usually have no `id`; match slug(text) to TOC ids in DOM order. */
function computeActiveTocIdFromHeadings(
  container: HTMLElement,
  toc: readonly TocEntry[],
  offsetPx: number
): string {
  const allowed = new Set(toc.map((e) => e.id));
  let active = '';
  container.querySelectorAll<HTMLElement>('h2, h3').forEach((h) => {
    const id = slugify(h.textContent ?? '');
    if (!allowed.has(id)) return;
    if (h.getBoundingClientRect().top <= offsetPx) active = id;
  });
  return active;
}

// ── Sidebar (always rendered, both in Studio and Public) ──────────────────────

const DocsSidebar: React.FC<{
  toc: TocEntry[];
  activeId: string;
  onNav: (id: string) => void;
}> = ({ toc, activeId, onNav }) => {
  const navScrollRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!activeId || !navScrollRef.current) return;
    const btn = navScrollRef.current.querySelector<HTMLButtonElement>(
      `button[data-toc-id="${CSS.escape(activeId)}"]`
    );
    btn?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeId, toc]);

  return (
    <aside
      className="hidden w-[min(240px,28vw)] flex-shrink-0 flex-col lg:flex lg:sticky lg:self-start"
      style={{
        top: 'calc(var(--theme-header-h, 56px) + 1rem)',
        maxHeight: 'calc(100vh - var(--theme-header-h, 56px) - 4rem)',
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--local-radius-md)] border border-[var(--local-border)] bg-[color-mix(in_srgb,var(--local-toolbar-bg)_40%,transparent)]">
        <div className="shrink-0 border-b border-[var(--local-border)] px-3 py-2.5">
          <div className="text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-[var(--local-toolbar-text)]">
            On this page
          </div>
        </div>
        <nav
          ref={navScrollRef}
          className="jp-docs-toc-scroll flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-y-contain px-1.5 py-2"
          aria-label="Table of contents"
        >
          {toc.map((entry) => (
            <button
              key={entry.id}
              type="button"
              data-toc-id={entry.id}
              onClick={() => onNav(entry.id)}
              className={[
                'text-left rounded-[var(--local-radius-sm)] transition-colors duration-150 no-underline',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--local-bg)]',
                entry.level === 3
                  ? 'pl-[22px] pr-2 py-1.5 text-[0.72rem] ml-0.5'
                  : 'px-2.5 py-2 font-bold text-[0.76rem]',
                activeId === entry.id
                  ? entry.level === 2
                    ? 'text-[var(--local-primary)] bg-[var(--local-toolbar-hover-bg)] border-l-2 border-[var(--local-primary)] pl-[8px]'
                    : 'text-[var(--local-primary)] font-semibold bg-[var(--local-toolbar-active-bg)]'
                  : 'text-[var(--local-text-muted)] hover:text-[var(--local-text)] hover:bg-[var(--local-toolbar-hover-bg)]',
              ].join(' ')}
            >
              {entry.level === 3 && (
                <span
                  className={`mr-2 inline-block h-[5px] w-[5px] flex-shrink-0 rounded-full align-middle mb-px ${
                    activeId === entry.id ? 'bg-[var(--local-primary)]' : 'bg-[var(--local-border)]'
                  }`}
                />
              )}
              <span className="line-clamp-3">{entry.text}</span>
            </button>
          ))}
        </nav>
        <div className="shrink-0 border-t border-[var(--local-border)] px-2 py-2.5">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex w-full items-center gap-2 px-2 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--local-text-muted)] transition-colors hover:text-[var(--local-primary)]"
          >
            ↑ Back to top
          </button>
        </div>
      </div>
    </aside>
  );
};

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
      'inline-flex h-7 min-w-7 items-center justify-center rounded-[var(--local-radius-sm)] px-2 text-xs transition-colors',
      active
        ? 'bg-[var(--local-toolbar-active-bg)] text-[var(--local-text)]'
        : 'text-[var(--local-toolbar-text)] hover:bg-[var(--local-toolbar-hover-bg)] hover:text-[var(--local-text)]',
    ].join(' ')}
  >
    {children}
  </button>
);

const Sep: React.FC = () => (
  <span className="mx-0.5 h-5 w-px shrink-0 bg-[var(--local-toolbar-border)]" aria-hidden />
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
          className="sticky top-0 z-[65] border-b border-[var(--local-toolbar-border)] bg-[var(--local-toolbar-bg)]"
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
            <div className="flex items-center gap-2 border-t border-[var(--local-toolbar-border)] px-2 py-1.5">
              <Link2 size={12} className="shrink-0 text-[var(--local-toolbar-text)]" />
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
                className="min-w-0 flex-1 bg-transparent text-xs text-[var(--local-text)] placeholder:text-[var(--local-toolbar-text)] outline-none"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={applyLink}
                className="shrink-0 rounded-[var(--local-radius-sm)] px-2 py-0.5 text-xs bg-[var(--local-primary)] hover:brightness-110 text-foreground transition-colors"
              >
                Set
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setLinkOpen(false)}
                className="shrink-0 rounded-[var(--local-radius-sm)] px-2 py-0.5 text-xs bg-[var(--local-toolbar-active-bg)] hover:bg-[var(--local-toolbar-hover-bg)] text-[var(--local-text)] transition-colors"
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

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & ExtraProps;

const mdHeading =
  (level: 2 | 3) =>
  ({ children, node: _node, ...rest }: HeadingProps) => {
    const plain = mdChildrenToPlainText(children);
    const id = slugify(plain);
    const Tag = `h${level}` as 'h2' | 'h3';
    return (
      <Tag id={id} {...rest}>
        {children}
      </Tag>
    );
  };

const MD_COMPONENTS: Components = {
  h2: mdHeading(2),
  h3: mdHeading(3),
};

const PublicTiptapContent: React.FC<{ content: string }> = ({ content }) => (
  <article className="jp-tiptap-content max-w-none" data-jp-field="content">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={MD_COMPONENTS}
    >
      {content}
    </ReactMarkdown>
  </article>
);

// ── Export ────────────────────────────────────────────────────────────────────

export const Tiptap: React.FC<{ data: TiptapData; settings?: TiptapSettings }> = ({ data, settings: _settings }) => {
  const { mode } = useStudio();
  const isStudio = mode === 'studio';

  const toc = React.useMemo(() => extractToc(data.content ?? ''), [data.content]);
  const [activeId, setActiveId] = React.useState<string>('');
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  // Scroll-spy: last TOC heading at/above viewport line (public: id on headings; Studio: slug from text).
  React.useEffect(() => {
    if (toc.length === 0) return;
    const ids = toc.map((e) => e.id);
    let raf = 0;
    const tick = () => {
      const offset = readScrollSpyOffsetPx();
      const next = isStudio
        ? contentRef.current
          ? computeActiveTocIdFromHeadings(contentRef.current, toc, offset)
          : ''
        : computeActiveTocId(ids, offset);
      if (next) setActiveId((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const t = setTimeout(() => {
      tick();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }, 100);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [toc, isStudio]);

  const handleNav = React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      return;
    }
    // Studio mode: headings are in ProseMirror, no IDs — find by text in editor DOM
    if (contentRef.current) {
      const headings = Array.from(
        contentRef.current.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
      );
      const target = headings.find((h) => slugify(h.textContent ?? '') === id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveId(id);
      }
    }
  }, []);

  return (
    <section
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-accent': 'var(--accent)',
        '--local-border': 'var(--border)',
        '--local-radius-sm': 'var(--theme-radius-sm)',
        '--local-radius-md': 'var(--theme-radius-md)',
        '--local-radius-lg': 'var(--theme-radius-lg)',
        '--local-toolbar-bg': 'var(--demo-surface-strong)',
        '--local-toolbar-hover-bg': 'var(--demo-surface)',
        '--local-toolbar-active-bg': 'var(--demo-accent-soft)',
        '--local-toolbar-border': 'var(--demo-border-soft)',
        '--local-toolbar-text': 'var(--demo-text-faint)',
      } as React.CSSProperties}
      className="w-full py-12 bg-[var(--local-bg)]"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex gap-8 py-12">
          {toc.length > 0 && (
            <DocsSidebar toc={toc} activeId={activeId} onNav={handleNav} />
          )}
          <div ref={contentRef} className="flex-1 min-w-0">
            {isStudio ? (
              <StudioTiptapEditor data={data} />
            ) : (
              <PublicTiptapContent content={data.content ?? ''} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
