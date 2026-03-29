/**
 * 📡 STUDIO EVENT PROTOCOL
 * Single Source of Truth for cross-frame communication.
 */
export const STUDIO_EVENTS = {
  // Parent -> Child (Data Injection)
  UPDATE_DRAFTS: 'jsonpages:update-drafts',
  
  // Parent -> Child (ICE Control)
  SYNC_SELECTION: 'jsonpages:sync-selection',
  
  // Child -> Parent (User Interaction)
  SECTION_SELECT: 'jsonpages:section-select',
  INLINE_FIELD_UPDATE: 'jsonpages:inline-field-update',
  INLINE_FLUSHED: 'jsonpages:inline-flushed',

  // Parent -> Child (Scroll Stage to section)
  REQUEST_SCROLL_TO_SECTION: 'jsonpages:request-scroll-to-section',
  REQUEST_INLINE_FLUSH: 'jsonpages:request-inline-flush',

  // Child -> Parent (Active section in viewport)
  ACTIVE_SECTION_CHANGED: 'jsonpages:active-section-changed',

  // Child -> Parent (Lifecycle)
  STAGE_READY: 'jsonpages:stage-ready',
} as const;

