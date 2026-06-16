INSERT INTO public.user_roles (user_id, role)
VALUES ('b8d44862-59a6-497d-8b43-00350ce82b9d', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;