create policy "public read rv photos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'rv-photos');