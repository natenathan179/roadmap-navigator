CREATE POLICY "Users can read own roles anon-safe" ON public.user_roles FOR SELECT TO anon USING (false);

DROP POLICY "Staff manage RVs" ON public.rvs;
CREATE POLICY "Staff manage RVs" ON public.rvs FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')));

DROP POLICY "Staff manage inquiries" ON public.inquiries;
CREATE POLICY "Staff manage inquiries" ON public.inquiries FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')));

DROP POLICY "Staff manage applications" ON public.financing_applications;
CREATE POLICY "Staff manage applications" ON public.financing_applications FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')));

DROP POLICY "Staff manage trade-ins" ON public.trade_in_requests;
CREATE POLICY "Staff manage trade-ins" ON public.trade_in_requests FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')));

DROP POLICY "Staff manage service requests" ON public.service_requests;
CREATE POLICY "Staff manage service requests" ON public.service_requests FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')));

DROP POLICY "Staff manage delivery quotes" ON public.delivery_quotes;
CREATE POLICY "Staff manage delivery quotes" ON public.delivery_quotes FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')));

DROP POLICY "Staff manage reviews" ON public.reviews;
CREATE POLICY "Staff manage reviews" ON public.reviews FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')));

DROP POLICY "Staff manage posts" ON public.blog_posts;
CREATE POLICY "Staff manage posts" ON public.blog_posts FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')));

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO service_role;