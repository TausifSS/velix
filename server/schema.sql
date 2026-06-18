-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY, -- Firebase User UID
    phone TEXT NOT NULL,
    name TEXT DEFAULT '',
    email TEXT DEFAULT '',
    role TEXT DEFAULT 'user', -- 'user' | 'mechanic' | 'business' | 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Supabase realtime for profiles updates
ALTER publication supabase_realtime ADD TABLE public.profiles;

-- Create index on roles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
