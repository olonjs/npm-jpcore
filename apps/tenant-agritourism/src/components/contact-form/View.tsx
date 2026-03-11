import React, { useCallback, useState } from 'react';
import { useInView } from '@/lib/useInView';
import { useFormSubmit } from '@/lib/useFormSubmit';
import { useConfig } from '@jsonpages/core';
import type { ContactFormData, ContactFormSettings } from './types';

const inputCls = `
  w-full px-4 py-3 rounded-xl border border-[var(--local-border)] bg-[var(--local-surface)]
  text-[var(--local-text)] placeholder:text-[var(--local-text-muted)]
  text-[0.9rem] focus:outline-none focus:border-[var(--local-primary)]
  focus:ring-2 focus:ring-[rgba(45,80,22,0.12)] transition-all
`.replace(/\s+/g, ' ').trim();

export const ContactForm: React.FC<{ data: ContactFormData; settings?: ContactFormSettings }> = ({ data }) => {
  const sectionRef = useInView<HTMLElement>();
  const { tenantId = 'tenant-agritourism' } = useConfig();
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Inizializziamo il motore dei form tramite l'hook in lib
  const { submit, status, message, reset: resetFormStatus } = useFormSubmit({
    source: 'contact-form',
    tenantId
  });

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === 'submitting') return;

      const form = event.currentTarget;
      const formData = new FormData(form);

      // Validazione Email Match
      const email = String(formData.get('email') ?? '').trim();
      const emailConfirm = String(formData.get('email_confirm') ?? '').trim();
      
      if (email && emailConfirm && email.toLowerCase() !== emailConfirm.toLowerCase()) {
        alert('Le email non coincidono. Controlla i campi e riprova.');
        return;
      }

      // Esecuzione invio tramite Hook
      const success = await submit(
        formData,
        data.email ?? '',
        'contatti',
        data.anchorId ?? 'form'
      );

      if (success) {
        setShowSuccessOverlay(true);
        form.reset();
      }
    },
    [data.email, data.anchorId, status, submit]
  );

  return (
    <section
      ref={sectionRef}
      style={{
        '--local-bg':         'var(--muted)',
        '--local-surface':    'var(--card)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary':    'var(--primary)',
        '--local-border':     'var(--border)',
        '--local-accent':     '#8FAF3A',
      } as React.CSSProperties}
      className="sm-reveal relative z-0 py-24 md:py-32 bg-[var(--local-bg)]"
    >
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">

          {/* LEFT: INFO */}
          <div className="lg:col-span-2">
            {data.label && (
              <div className="jp-section-label flex items-center gap-3 text-[var(--local-primary)] mb-5" data-jp-field="label">
                <span className="w-6 h-px bg-[var(--local-primary)]" aria-hidden />
                {data.label}
              </div>
            )}
            <h2
              className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-bold text-[var(--local-text)] leading-[1.2] tracking-tight mb-4"
              data-jp-field="title"
            >
              {data.title}
            </h2>
            {data.description && (
              <p className="text-[0.95rem] text-[var(--local-text-muted)] leading-[1.8] mb-8" data-jp-field="description">
                {data.description}
              </p>
            )}

            <div className="flex flex-col gap-4 mt-2">
              {(data.addressLine1 || data.addressLine2) && (
                <div className="flex items-start gap-3">
                  <span className="text-[var(--local-primary)] mt-0.5 text-lg">📍</span>
                  <div className="text-[0.875rem] text-[var(--local-text-muted)]">
                    {data.addressLine1 && <p data-jp-field="addressLine1">{data.addressLine1}</p>}
                    {data.addressLine2 && <p data-jp-field="addressLine2">{data.addressLine2}</p>}
                  </div>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-3">
                  <span className="text-[var(--local-primary)] text-lg">📞</span>
                  <a href={`tel:${data.phone}`} className="text-[0.875rem] text-[var(--local-text-muted)] hover:text-[var(--local-primary)] transition-colors no-underline" data-jp-field="phone">
                    {data.phone}
                  </a>
                </div>
              )}
              {data.email && (
                <div className="flex items-center gap-3">
                  <span className="text-[var(--local-primary)] text-lg">✉️</span>
                  <a href={`mailto:${data.email}`} className="text-[0.875rem] text-[var(--local-text-muted)] hover:text-[var(--local-primary)] transition-colors no-underline" data-jp-field="email">
                    {data.email}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-[rgba(45,80,22,0.07)] border border-[rgba(45,80,22,0.12)]">
              <p className="text-[0.8rem] text-[var(--local-text-muted)] leading-relaxed">
                ⚠️ Abbiamo bisogno di sapere con <strong>almeno un giorno di anticipo</strong> quali pasti desiderate consumare il giorno di arrivo. Eventuali intolleranze vanno comunicate alla prenotazione.
              </p>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="lg:col-span-3">
            <div className="bg-[var(--local-surface)] rounded-[24px] border border-[var(--local-border)] p-8 md:p-10 shadow-[0_8px_40px_rgba(45,80,22,0.08)]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[var(--local-text-muted)] mb-1.5">Nome e Cognome *</label>
                    <input name="name" type="text" required placeholder="Mario Rossi" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[var(--local-text-muted)] mb-1.5">Telefono</label>
                    <input name="phone" type="tel" placeholder="+39 333 000 0000" className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[var(--local-text-muted)] mb-1.5">Email *</label>
                    <input name="email" type="email" required placeholder="mario@example.com" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[var(--local-text-muted)] mb-1.5">Conferma Email *</label>
                    <input name="email_confirm" type="email" required placeholder="mario@example.com" className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[var(--local-text-muted)] mb-1.5">Check-in</label>
                    <input 
                      name="checkin" 
                      type="date" 
                      className={inputCls} 
                      style={{ colorScheme: 'light' }} // FIX: Rende visibile l'icona del calendario
                    />
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[var(--local-text-muted)] mb-1.5">Check-out</label>
                    <input 
                      name="checkout" 
                      type="date" 
                      className={inputCls} 
                      style={{ colorScheme: 'light' }} // FIX: Rende visibile l'icona del calendario
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[var(--local-text-muted)] mb-1.5">N° Persone</label>
                    <input name="guests" type="number" min="1" max="20" placeholder="2" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[var(--local-text-muted)] mb-1.5">N° Stanze</label>
                    <input name="rooms" type="number" min="1" max="10" placeholder="1" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[var(--local-text-muted)] mb-1.5">Note ed esigenze alimentari</label>
                  <textarea name="notes" rows={4} placeholder="Intolleranze, allergie, richieste speciali..." className={`${inputCls} resize-y min-h-[100px]`} />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="mt-2 w-full py-4 rounded-full bg-[var(--local-primary)] text-white font-bold text-[1rem] hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_rgba(45,80,22,0.3)]"
                  data-jp-field="submitLabel"
                >
                  {status === 'submitting' ? 'Invio in corso...' : data.submitLabel ?? 'Invia richiesta'}
                </button>

                {status !== 'idle' && (
                  <p className={`text-[0.85rem] text-center ${status === 'error' ? 'text-red-600' : 'text-green-700'}`} role="status">
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS OVERLAY */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-[120] bg-black/55 backdrop-blur-[1px] flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-[var(--local-border)] bg-[var(--local-surface)] p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
            <h3 className="text-[1.4rem] font-bold text-[var(--local-text)]">Richiesta inviata</h3>
            <p className="mt-3 text-[0.95rem] text-[var(--local-text-muted)] leading-relaxed">
              Grazie, abbiamo ricevuto il tuo messaggio.<br/>Ti risponderemo entro 24 ore.
            </p>
            <button
              type="button"
              onClick={() => { setShowSuccessOverlay(false); resetFormStatus(); }}
              className="mt-8 w-full py-3 rounded-full bg-[var(--local-primary)] text-white font-semibold hover:brightness-110 transition"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </section>
  );
};