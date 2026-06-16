
DROP FUNCTION IF EXISTS public.admin_search_users(text);
DROP FUNCTION IF EXISTS public.admin_list_admins();

CREATE FUNCTION public.admin_search_users(_q text)
 RETURNS TABLE(id uuid, email text, first_name text, is_admin boolean, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT u.id, u.email, p.first_name,
    EXISTS(SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id AND r.role = 'admin') AS is_admin,
    u.created_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE public.has_role(auth.uid(), 'admin')
    AND (
      _q = '' OR _q IS NULL
      OR u.email ILIKE '%' || _q || '%'
      OR p.first_name ILIKE '%' || _q || '%'
    )
  ORDER BY is_admin DESC, u.created_at DESC
  LIMIT 50;
$function$;

CREATE FUNCTION public.admin_list_admins()
 RETURNS TABLE(id uuid, email text, first_name text, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT u.id, u.email, p.first_name, u.created_at
  FROM public.user_roles r
  JOIN auth.users u ON u.id = r.user_id
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE r.role = 'admin' AND public.has_role(auth.uid(), 'admin')
  ORDER BY u.created_at ASC;
$function$;
