import { useEffect, useState } from 'react';
import {
  Store, Phone, Mail,
  MessageSquare, Save, Shield, Smartphone, Check, ExternalLink
} from 'lucide-react';
import { useSettingsStore } from '../../state/settingsStore';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Spinner } from '../../components/ui/Spinner';

const inputClass = `
  w-full bg-[#0F172A] border border-navy-700 text-white rounded-xl
  px-4 py-2.5 text-sm placeholder:text-muted/60
  focus:outline-none focus:border-red/60 focus:ring-1 focus:ring-red/30
  transition-all duration-150
`;
const labelClass = "block text-sm font-medium text-muted mb-1.5";

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function SectionCard({ icon, title, subtitle, children }: SectionCardProps) {
  return (
    <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-red/10 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { settings, isLoading, isSubmitting, fetchSettings, saveSettings } = useSettingsStore();
  const { canInstall, installApp, isInstalled, isIOS } = usePWAInstall();

  const [shopForm, setShopForm] = useState({
    shop_name: '', address: '', phone: '', email: '',
  });
  const [waForm, setWaForm] = useState({
    wa_phone_number_id: '', wa_access_token: '',
  });
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setShopForm({
        shop_name: settings.shop_name || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
      });
      setWaForm({
        wa_phone_number_id: settings.wa_phone_number_id || '',
        wa_access_token: settings.wa_access_token === '***configured***' ? '' : (settings.wa_access_token || ''),
      });
    }
  }, [settings]);

  const setShop = (field: string, val: string) =>
    setShopForm((prev) => ({ ...prev, [field]: val }));

  const setWa = (field: string, val: string) =>
    setWaForm((prev) => ({ ...prev, [field]: val }));

  const handleSaveShop = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(shopForm);
  };

  const handleSaveWa = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { wa_phone_number_id: waForm.wa_phone_number_id };
    if (waForm.wa_access_token) payload.wa_access_token = waForm.wa_access_token;
    await saveSettings(payload);
  };

  const isWaConfigured = settings?.wa_access_token === '***configured***' || !!settings?.wa_phone_number_id;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn">

      {/* Page header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-red mb-1">Configuration</p>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-muted text-sm mt-0.5">Manage shop info, WhatsApp integration and app preferences</p>
      </div>

      {/* ── Shop Info ── */}
      <SectionCard
        icon={<Store className="w-4 h-4 text-red" />}
        title="Shop Information"
        subtitle="Displayed on invoices and WhatsApp messages"
      >
        <form onSubmit={handleSaveShop} className="space-y-4">
          <div>
            <label className={labelClass}>Shop / Business Name</label>
            <input type="text" value={shopForm.shop_name}
              onChange={(e) => setShop('shop_name', e.target.value)}
              placeholder="e.g. CAR ADDA" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Address</label>
            <textarea value={shopForm.address}
              onChange={(e) => setShop('address', e.target.value)}
              placeholder="Full shop address" rows={2}
              className={`${inputClass} resize-y min-h-[56px]`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                <Phone className="w-3 h-3 inline mr-1" />Phone
              </label>
              <input type="tel" maxLength={10} value={shopForm.phone}
                onChange={(e) => setShop('phone', e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit number" className={`${inputClass} font-mono`} />
            </div>
            <div>
              <label className={labelClass}>
                <Mail className="w-3 h-3 inline mr-1" />Email
              </label>
              <input type="email" value={shopForm.email}
                onChange={(e) => setShop('email', e.target.value)}
                placeholder="shop@example.com" className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-red text-white rounded-xl font-semibold text-sm hover:bg-red-600 active:scale-95 disabled:opacity-40 transition-all shadow-lg shadow-red/20">
              {isSubmitting ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
              Save Shop Info
            </button>
          </div>
        </form>
      </SectionCard>

      {/* ── WhatsApp Config ── */}
      <SectionCard
        icon={<MessageSquare className="w-4 h-4 text-green-400" />}
        title="WhatsApp Integration"
        subtitle="Configure WhatsApp Cloud API to send bills automatically"
      >
        {/* Status badge */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-4 text-sm
          ${isWaConfigured
            ? 'bg-success/10 border border-success/20 text-success'
            : 'bg-warning/10 border border-warning/20 text-warning'
          }`}>
          {isWaConfigured
            ? <><Check className="w-4 h-4" /> WhatsApp Cloud API is configured</>
            : <><Shield className="w-4 h-4" /> Not configured — using web link fallback</>
          }
        </div>

        <div className="text-xs text-muted/70 bg-navy-700/40 rounded-xl px-4 py-3 mb-4">
          Get your credentials from{' '}
          <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer"
            className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-0.5">
            Meta Developer Portal <ExternalLink className="w-3 h-3" />
          </a>
          {' '}→ WhatsApp → API Setup
        </div>

        <form onSubmit={handleSaveWa} className="space-y-4">
          <div>
            <label className={labelClass}>Phone Number ID</label>
            <input type="text" value={waForm.wa_phone_number_id}
              onChange={(e) => setWa('wa_phone_number_id', e.target.value)}
              placeholder="12-digit Phone Number ID from Meta" className={`${inputClass} font-mono`} />
          </div>
          <div>
            <label className={labelClass}>
              Access Token
              {isWaConfigured && (
                <span className="ml-2 text-xs text-success font-normal">✓ token saved</span>
              )}
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={waForm.wa_access_token}
                onChange={(e) => setWa('wa_access_token', e.target.value)}
                placeholder={isWaConfigured ? 'Leave blank to keep existing token' : 'Paste your permanent access token'}
                className={`${inputClass} pr-16 font-mono`}
              />
              <button type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-white transition-colors">
                {showToken ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 active:scale-95 disabled:opacity-40 transition-all shadow-lg shadow-green-600/20">
              {isSubmitting ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
              Save WhatsApp Config
            </button>
          </div>
        </form>
      </SectionCard>

      {/* ── PWA / App Install ── */}
      <SectionCard
        icon={<Smartphone className="w-4 h-4 text-blue-400" />}
        title="App Installation"
        subtitle="Install CAR ADDA as a Progressive Web App"
      >
        {isInstalled ? (
          <div className="flex items-center gap-2 text-success text-sm font-semibold">
            <Check className="w-4 h-4" />
            CAR ADDA is already installed on this device
          </div>
        ) : isIOS ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">To install on iOS:</p>
            <ol className="text-sm text-white space-y-1.5 pl-4 list-decimal">
              <li>Tap the <strong>Share</strong> button (□↑) in Safari</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
              <li>Tap <strong>Add</strong> to confirm</li>
            </ol>
          </div>
        ) : canInstall ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Install CAR ADDA on your device for offline access and a native app experience.
            </p>
            <button
              onClick={installApp}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              Install App
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted">
            Open this page in a supported browser (Chrome or Edge) to install the app.
          </p>
        )}

        {/* PWA features */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { label: 'Offline Support', desc: 'Works without internet' },
            { label: 'Fast Loading', desc: 'Cached static assets' },
            { label: 'Home Screen', desc: 'Quick access icon' },
            { label: 'App Shortcuts', desc: 'New Bill & Reports' },
          ].map((f) => (
            <div key={f.label} className="bg-navy-700/40 rounded-xl px-3 py-2.5">
              <p className="text-xs font-semibold text-white">{f.label}</p>
              <p className="text-xs text-muted mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── App info ── */}
      <div className="text-center py-4">
        <p className="text-muted text-xs">CAR ADDA v1.0.0 · All phases complete ✅</p>
        <p className="text-muted/50 text-xs mt-1">Built with FastAPI + React + Supabase</p>
      </div>
    </div>
  );
}
