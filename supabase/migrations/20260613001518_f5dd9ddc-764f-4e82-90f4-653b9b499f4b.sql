
CREATE POLICY "auth read profile photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'profile-photos');
CREATE POLICY "owner upload profile photo" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "owner update own profile photo" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "admin delete profile photo" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'profile-photos' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(),'admin')));
