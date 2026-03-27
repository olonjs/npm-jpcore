import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OlonMark } from '@/components/OlonWordmark';
import type { LoginData, LoginSettings } from './types';

interface LoginViewProps {
  data: LoginData;
  settings?: LoginSettings;
}

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export function Login({ data, settings }: LoginViewProps) {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const showOauth = settings?.showOauth ?? true;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <section id="login" className="py-24 px-6 border-t border-border section-anchor">
      <div className="max-w-4xl mx-auto flex justify-center">
        <div className="w-full max-w-[360px]">

          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <OlonMark size={32} className="mb-5" />
            <h2 className="text-[18px] font-display text-foreground tracking-[-0.02em] mb-1.5" data-jp-field="title">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="text-[13px] text-muted-foreground" data-jp-field="subtitle">{data.subtitle}</p>
            )}
          </div>

          {/* OAuth */}
          {showOauth && (
            <div className="space-y-2 mb-6">
              {[
                { label: 'Continue with Google', icon: <GoogleIcon />, id: 'google' },
                { label: 'Continue with GitHub', icon: <GitHubIcon />, id: 'github' },
              ].map(({ label, icon, id }) => (
                <button
                  key={id}
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 h-9 px-4 text-[13px] font-medium text-foreground border border-border rounded-md bg-transparent hover:bg-elevated transition-colors duration-150"
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground font-mono-olon tracking-wide">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" placeholder="ada@acme.com" autoComplete="email" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="login-password" className="mb-0">Password</Label>
                {data.forgotHref && (
                  <a href={data.forgotHref} data-jp-field="forgotHref" className="text-[11px] text-primary-400 hover:text-primary-light transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="accent" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : <><span>Sign in</span><ArrowRight size={14} /></>}
            </Button>
          </form>

          {data.signupHref && (
            <p className="text-center text-[12px] text-muted-foreground mt-6">
              No account?{' '}
              <a href={data.signupHref} data-jp-field="signupHref" className="text-primary-light hover:text-primary-200 transition-colors">
                Request access →
              </a>
            </p>
          )}

          {(data.termsHref || data.privacyHref) && (
            <p className="text-center text-[11px] text-muted-foreground/60 mt-4">
              By signing in you agree to our{' '}
              {data.termsHref && (
                <a href={data.termsHref} data-jp-field="termsHref" className="hover:text-muted-foreground transition-colors underline underline-offset-2">Terms</a>
              )}
              {data.termsHref && data.privacyHref && ' and '}
              {data.privacyHref && (
                <a href={data.privacyHref} data-jp-field="privacyHref" className="hover:text-muted-foreground transition-colors underline underline-offset-2">Privacy Policy</a>
              )}.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
