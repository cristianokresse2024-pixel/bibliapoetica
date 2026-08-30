-- =============================================================================
-- VIVA INTELIGENTE — SINCRONIZAÇÃO EM NUVEM DE USUÁRIOS E PROGRESSO (SUPABASE)
-- Migration: 20260830_cloud_sync_and_users.sql
-- =============================================================================

-- 1. Tabela Central de Perfis de Usuários
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'subscriber', 'premium', 'vip_lifetime', 'ambassador_free')),
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON public.user_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_user_profiles_plan ON public.user_profiles(plan);

-- 2. Tabela de Sincronização de Progresso Espiritual & Leitura
CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id TEXT PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    read_chapters JSONB NOT NULL DEFAULT '{}'::jsonb,
    read_count INTEGER NOT NULL DEFAULT 0,
    streak JSONB NOT NULL DEFAULT '{"count": 0, "last": null}'::jsonb,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    favorites JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes JSONB NOT NULL DEFAULT '{}'::jsonb,
    achievements JSONB NOT NULL DEFAULT '{}'::jsonb,
    prayer_data JSONB NOT NULL DEFAULT '{"totalSeconds": 0, "sessions": 0, "longest": 0, "lastGoalMin": 15, "log": {}, "history": []}'::jsonb,
    fast_data JSONB NOT NULL DEFAULT '{"completed": 0, "totalHours": 0, "longestHours": 0, "history": []}'::jsonb,
    gratitude_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    prayer_reminder JSONB NOT NULL DEFAULT '{"enabled": false, "time": "07:00", "lastNotified": null}'::jsonb,
    last_read JSONB NULL,
    daily_goal INTEGER NOT NULL DEFAULT 3,
    font_scale NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    bible_version TEXT NOT NULL DEFAULT 'nvi',
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_progress_read_count ON public.user_progress(read_count);
CREATE INDEX IF NOT EXISTS idx_user_progress_xp ON public.user_progress(xp);

-- 3. Habilita RLS (Row Level Security) permissivo para REST Serverless
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para acesso anônimo/service_role
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Public read/write for user_profiles'
    ) THEN
        CREATE POLICY "Public read/write for user_profiles" ON public.user_profiles
            FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_progress' AND policyname = 'Public read/write for user_progress'
    ) THEN
        CREATE POLICY "Public read/write for user_progress" ON public.user_progress
            FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;
