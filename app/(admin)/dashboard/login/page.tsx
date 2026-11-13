'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { logoSVG } from '@/lib/art';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    const { error } = await createClient().auth.signInWithPassword({
      email: String(fd.get('email') || '').trim(),
      password: String(fd.get('password') || '')
    });
    if (error) {
      setError('البريد أو كلمة المرور غير صحيحة.');
      setBusy(false);
      return;
    }
    router.replace('/dashboard');
    router.refresh();
  };

  return (
    <main className="login">
      <form className="card" onSubmit={onSubmit}>
        <div className="logo">
          <span className="svgw" dangerouslySetInnerHTML={{ __html: logoSVG({ bg: 'none' }) }} />
          <div><b style={{ fontFamily: 'var(--serif)', fontSize: 26, lineHeight: 1 }}>هرم</b><br /><small className="muted" style={{ letterSpacing: 3, fontSize: 10 }}>DASHBOARD</small></div>
        </div>
        <h1>تسجيل الدخول</h1>
        <p className="muted" style={{ marginTop: -8 }}>ادخل لحساب لوحة التحكم حتى تعدّل محتوى الموقع.</p>
        <div className="field"><label htmlFor="email">البريد الإلكتروني</label><input className="input" id="email" name="email" type="email" dir="ltr" autoComplete="username" required /></div>
        <div className="field"><label htmlFor="password">كلمة المرور</label><input className="input" id="password" name="password" type="password" dir="ltr" autoComplete="current-password" required /></div>
        {error && <p className="err">{error}</p>}
        <button className="btn btn-ink" type="submit" disabled={busy}>{busy ? '…' : 'دخول'}</button>
        <a className="link" href="/" style={{ alignSelf: 'center' }}>رجوع للموقع</a>
      </form>
    </main>
  );
}
