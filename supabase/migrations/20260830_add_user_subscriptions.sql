-- Migration: 20260830_add_user_subscriptions.sql
-- Adiciona suporte a assinaturas do Mercado Pago + colunas necessárias para o Programa de Embaixadores

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mp_preapproval_id TEXT UNIQUE,
    mp_external_reference TEXT,
    referrer_code TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'canceled', 'paused', 'suspended')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    grace_period_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_mp_preapproval_id ON user_subscriptions(mp_preapproval_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_referrer_code ON user_subscriptions(referrer_code);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

ALTER TABLE ambassador_profiles 
ADD COLUMN IF NOT EXISTS pending_balance DECIMAL(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_earned DECIMAL(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS grace_period_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS mp_account_id TEXT,
ADD COLUMN IF NOT EXISTS last_commission_processed_at TIMESTAMPTZ;
