-- Enable Write Access for the Content Sections Table
-- We need to allow INSERT and UPDATE for the CMS to work

create policy "Allow public insert" on content_sections for insert with check (true);
create policy "Allow public update" on content_sections for update using (true);

-- Explicitly allowing the same for other tables just in case we use them later, 
-- though currently we are only using content_sections.
create policy "Allow public insert" on contact_submissions for insert with check (true);
