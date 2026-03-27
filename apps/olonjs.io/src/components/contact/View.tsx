import { useState, type CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ContactData, ContactSettings } from './types';

interface ContactViewProps {
  data: ContactData;
  settings?: ContactSettings;
}

export function Contact({ data, settings }: ContactViewProps) {
  const [submitted, setSubmitted] = useState(false);
  const showTiers = settings?.showTiers ?? true;
  const tiers = data.tiers ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      className="py-24 px-6 border-t border-border section-anchor"
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-border': 'var(--border)',
      } as CSSProperties}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 items-start">

          {/* Left */}
          <div className="max-w-md">
            {data.label && (
              <p className="font-mono-olon text-xs font-medium tracking-label uppercase text-muted-foreground mb-5" data-jp-field="label">
                {data.label}
              </p>
            )}
            <h2 className="font-display font-normal text-foreground leading-tight tracking-tight mb-5" data-jp-field="title">
              {data.title}
              {data.titleHighlight && (
                <>
                  <br />
                  <em className="not-italic text-primary-light" data-jp-field="titleHighlight">{data.titleHighlight}</em>
                </>
              )}
            </h2>
            {data.description && (
              <p className="text-base text-muted-foreground leading-relaxed mb-10" data-jp-field="description">
                {data.description}
              </p>
            )}

            {/* Tiers */}
            {showTiers && tiers.length > 0 && (
              <div className="space-y-0 border border-border rounded-lg overflow-hidden">
                {tiers.map((tier, i) => (
                  <div
                    key={tier.id ?? tier.label}
                    data-jp-item-id={tier.id ?? tier.label}
                    data-jp-item-field="tiers"
                    className={`flex items-start gap-4 px-5 py-4 ${i < tiers.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-wide bg-primary-900 text-primary-light border border-primary-800 rounded-sm mt-0.5 shrink-0 min-w-[64px] justify-center" data-jp-field="label">
                      {tier.label}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-snug" data-jp-field="desc">{tier.desc}</p>
                      {tier.sub && (
                        <p className="text-[12px] text-muted-foreground mt-0.5" data-jp-field="sub">{tier.sub}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — form */}
          <div className="rounded-lg border border-border bg-card p-6">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-10 h-10 rounded-full bg-primary-900 border border-primary flex items-center justify-center mx-auto mb-4">
                  <ArrowRight size={15} className="text-primary-light" />
                </div>
                <p className="text-base font-medium text-foreground mb-1.5" data-jp-field="successTitle">
                  {data.successTitle ?? 'Message received'}
                </p>
                <p className="text-sm text-muted-foreground" data-jp-field="successBody">
                  {data.successBody ?? "We'll respond within one business day."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-4" data-jp-field="formTitle">
                    {data.formTitle ?? 'Get in touch'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="contact-first">First name</Label>
                    <Input id="contact-first" placeholder="Ada" required />
                  </div>
                  <div>
                    <Label htmlFor="contact-last">Last name</Label>
                    <Input id="contact-last" placeholder="Lovelace" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact-email">Work email</Label>
                  <Input id="contact-email" type="email" placeholder="ada@acme.com" required />
                </div>
                <div>
                  <Label htmlFor="contact-company">Company</Label>
                  <Input id="contact-company" placeholder="Acme Corp" />
                </div>
                <div>
                  <Label htmlFor="contact-usecase">Use case</Label>
                  <textarea
                    id="contact-usecase"
                    rows={3}
                    placeholder="Tell us about your deployment context..."
                    className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-150 resize-none font-primary"
                  />
                </div>
                <Button type="submit" variant="accent" className="w-full">
                  Send message <ArrowRight size={14} />
                </Button>
                {data.disclaimer && (
                  <p className="text-xs text-muted-foreground text-center" data-jp-field="disclaimer">
                    {data.disclaimer}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
