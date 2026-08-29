-- =============================================================================
-- PROGRAMA DE EMBAIXADORES & INDICAÇÕES — SCHEMA OFICIAL SUPABASE / POSTGRESQL
-- =============================================================================

-- 1. Tabela de Perfis de Embaixadores
CREATE TABLE IF NOT EXISTS public.ambassador_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    referral_code TEXT NOT NULL UNIQUE,
    level TEXT NOT NULL DEFAULT 'PARTICIPANTE' CHECK (level IN ('PARTICIPANTE', 'EMBAIXADOR')),
    active_referrals_count INTEGER NOT NULL DEFAULT 0,
    total_referrals_count INTEGER NOT NULL DEFAULT 0,
    commissionable_count INTEGER NOT NULL DEFAULT 0,
    current_benefit_type TEXT NOT NULL DEFAULT 'none' CHECK (current_benefit_type IN ('none', '1_month', '2_months', '3_months', '6_months', 'free_subscription')),
    benefit_status TEXT NOT NULL DEFAULT 'active' CHECK (benefit_status IN ('active', 'in_grace_period', 'suspended')),
    grace_period_ends_at TIMESTAMPTZ NULL,
    total_commission_earned NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    pending_commission NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    paid_commission NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ambassador_referral_code ON public.ambassador_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_ambassador_user_id ON public.ambassador_profiles(user_id);

-- 2. Tabela de Indicações (Referrals)
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_user_id TEXT NOT NULL,
    referred_user_id TEXT NOT NULL UNIQUE,
    referred_user_name TEXT,
    referred_user_email TEXT,
    referral_code_used TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'free_user' CHECK (status IN ('pending_signup', 'free_user', 'active_subscriber', 'cancelled', 'refunded')),
    subscription_id TEXT,
    subscription_started_at TIMESTAMPTZ,
    subscription_cancelled_at TIMESTAMPTZ,
    is_commissionable BOOLEAN NOT NULL DEFAULT FALSE,
    commission_rate NUMERIC(4, 2) NOT NULL DEFAULT 0.30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_referrer FOREIGN KEY (referrer_user_id) REFERENCES public.ambassador_profiles(user_id) ON DELETE CASCADE,
    CONSTRAINT chk_no_self_referral CHECK (referrer_user_id <> referred_user_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);

-- 3. Tabela do Livro Razão de Comissões (Commission Ledger)
CREATE TABLE IF NOT EXISTS public.commission_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_user_id TEXT NOT NULL,
    referred_user_id TEXT NOT NULL,
    subscription_id TEXT,
    billing_cycle TEXT NOT NULL, -- Ex: '2026-08'
    gross_amount NUMERIC(10, 2) NOT NULL DEFAULT 29.90,
    commission_amount NUMERIC(10, 2) NOT NULL DEFAULT 8.97,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled', 'refunded')),
    external_transaction_id TEXT UNIQUE, -- Idempotência: impede duplicidade de pagamento no mesmo ciclo
    competence_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unq_referral_cycle UNIQUE (referrer_user_id, referred_user_id, billing_cycle)
);

CREATE INDEX IF NOT EXISTS idx_commission_referrer ON public.commission_ledger(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_commission_cycle ON public.commission_ledger(billing_cycle);

-- 4. Tabela de Logs de Auditoria do Sistema de Embaixadores
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    event_type TEXT NOT NULL, -- Ex: 'MILESTONE_REACHED', 'BENEFIT_UNLOCKED', 'GRACE_PERIOD_STARTED', 'COMMISSION_GENERATED'
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_event ON public.audit_logs(event_type);
