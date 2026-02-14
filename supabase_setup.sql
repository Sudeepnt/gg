-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Team Members
create table if not exists team_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  bio text,
  bio2 text,
  bio3 text,
  bio4 text,
  image_url text,
  sort_order integer generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Services
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  full_title text,
  sort_order integer generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Principles (Core Principles List)
create table if not exists principles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  sort_order integer generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Site Content (for static sections like Home Hero, Contact info, etc.)
-- This stores unstructured/nested data for pages or sections that don't need their own tables.
create table if not exists content_sections (
  section_key text primary key, -- e.g., 'home', 'contact', 'business', 'principles_static'
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
-- This ensures that by default, data is protected. We will add public read access.
alter table team_members enable row level security;
alter table services enable row level security;
alter table principles enable row level security;
alter table content_sections enable row level security;

-- Create policies for Public Read Access
create policy "Allow public read access" on team_members for select using (true);
create policy "Allow public read access" on services for select using (true);
create policy "Allow public read access" on principles for select using (true);
create policy "Allow public read access" on content_sections for select using (true);

-- ==========================================
-- SEED DATA (Based on current content.json)
-- ==========================================

-- 1. Seed Content Sections (Home, Contact, Business Intro, Principles Headings)
insert into content_sections (section_key, content) values
(
  'home', 
  '{
    "hero": {
      "title": "Invested in Land. Invested in You.",
      "subtitle": "ATit Capital operates at the intersection of people, capital, and land in India. We bring mission-aligned partners together to acquire, develop, and operate real estate assets that unlock neighborhoods, shape cities, and compound value over time.",
      "cta": "Start a conversation"
    }
  }'::jsonb
),
(
  'contact',
  '{
    "companyName": "ATit Capital Management LLP",
    "email": "info@ATitCapital.com",
    "phone": "+91 9900114038",
    "address1": "No. 55, 1st Floor, 10th Cross, 2nd Stage, Mahalakshmipuram,",
    "address2": "WOC Road, Bengaluru, Karnataka,",
    "address3": "India - 560086",
    "consentText": "Hereby I authorise ATit Capital, to process the given personal information in connection with my the inquiry. I am aware that submitting personal data is voluntary and that I have a right to view, edit and delete all the data concerning myself.",
    "buttonText": "Send"
  }'::jsonb
),
(
  'business',
  '{
    "intro": "ATit Capital is organized into complementary, senior-led real estate business lines supported by an integrated platform spanning acquisition, execution, and capital management. This structure produces proprietary, bottom-up insights that inform strategy and risk discipline."
  }'::jsonb
),
(
  'principles_static',
  '{
    "mainHeading": "Principles & Culture",
    "section1": {
      "heading": "Values we believe in",
      "description": "ATit Capital is committed to partnering with the next generation of real estate platforms emerging from India that set new standards for long-term value creation, institutional execution, and responsible growth rooted in land and communities.\n\nDelivering durable outcomes in real assets requires more than capital. It requires aligned partners, specialized expertise, and a culture that values accountability, judgment, and ownership. Our principles guide how we think, how we work, and how we build—across investments, operations, and long-term platform development."
    },
    "section3": {
      "heading": "Culture & Institutional Intent",
      "description": "ATit Capital operates with high standards, continuous learning, and an ownership mindset. We believe capital in Indian real estate must move beyond financing to true partnership in long-term value creation.\n\nThrough disciplined governance, regulatory alignment, transparent reporting, and responsible development, we aim to strengthen the asset class and build resilient platforms that earn trust and perform across cycles."
    },
    "section4": {
      "heading": "People, Merit & Inclusion",
      "description": "ATit Capital is built on merit, competence, and integrity. We value diversity of experience and perspective because stronger judgment and long-term performance depend on it.\n\nOur approach to teams and partnerships prioritizes capability, accountability, and values alignment. Inclusion is a natural outcome of disciplined standards and intentional institutional design."
    },
    "section5": {
      "heading": "Invested in Land. Invested in You.",
      "description": "This is not just a line, it reflects how we think about capital, people, and responsibility. We aim to build an institution that performs at the highest level while remaining grounded in stewardship, trust, and long-term impact."
    }
  }'::jsonb
);

-- 2. Seed Team Members
insert into team_members (name, role, bio, bio2, bio3, bio4, image_url) values
(
  'Guru Veera Datha',
  'Founding Partner',
  'Guru leads acquisition, platform and partnership strategies, and on-ground operations and development execution. His command of construction delivery and project economics enables the firm to navigate operationally dense projects. By bridging the gap between site sourcing and physical delivery, he provides the firm with a distinct competitive advantage in asset speed-to-market and cost-efficiency.',
  'With a background in Real Estate and deep-market experience in land assemblage, warehousing, hospitality development and construction. He specializes in identifying undervalued, off-market opportunities and executing complex acquisitions with speed and precision while ensuring that the real assets are positioned to make neighbourhoods and communities great again.',
  'Guru completed his BBM from Jain Centre for Management Studies Bengaluru, with certifications in Smart Sustainable City Development from Utrecht University and Economics of Urbanisation from Vrije Universiteit Amsterdam.',
  '',
  '/guru.jpeg'
),
(
  'Utsav Shetty',
  'Founding Partner',
  'Utsav Shetty leads ATit Capital''s investment strategy and financial architecture, driving value creation through adaptive reuse, mixed-use frameworks, climate-forward infrastructure, and differentiated land-use models. He embeds architectural and spatial strategy directly into underwriting to enhance asset resilience, yield stability, and governance rigor.',
  'Utsav operates at the intersection of financial discipline, governance, and design-led land use, repositioning underutilized land in India into institutionally relevant platforms across market cycles.',
  'With a background spanning finance, taxation, outbound investment structuring, deal execution, and multi-sector entrepreneurship, he brings a distinct operator''s lens to capital deployment. His advisory expertise spans tax-efficient real estate vehicles and de-risking commercial asset entry and hold phases.',
  'Utsav completed his MS from Dublin City University and is a qualified Chartered Accountant.',
  '/utsav.jpeg'
);

-- 3. Seed Services
insert into services (title, description, full_title) values
(
  'Hotel Brand Management',
  'We build proprietary hospitality platforms anchored in real estate. Theme-led concepts, operator-grade systems, and owner-aligned structures enable scalable portfolios across urban and tourism markets.',
  null
),
(
  'Capital Solutions & Investment Vehicles',
  'We structure capital in fragmented markets. Pooled vehicles, JV and SPV architectures, and disciplined underwriting translate into scalable execution and institutional-quality reporting.',
  ''
),
(
  'Development & Execution Services',
  'We execute development with a focus on design quality, commercial viability, and long-term operational performance. From land acquisition and diligence to planning, approvals, construction management, leasing, and eventual stabilization or exit, we manage the full asset lifecycle.',
  null
);

-- 4. Seed Principles
insert into principles (title, description) values
(
  'Client & Capital Stewardship',
  'We prioritize the interests of our capital partners through clarity, transparency, and disciplined decision-making—treating every investment as a long-term responsibility, not a transaction.'
),
(
  'Elevation of Performance',
  'We hold ourselves to institutional standards of execution, governance, reporting, and asset management—continually raising the bar across every project and platform.'
),
(
  'Deliberate Specialization',
  'We believe real estate excellence is built through depth. Clear roles, domain expertise, and accountability across investment, development, and operations enable consistent outcomes.'
),
(
  'Entrepreneurial Ownership',
  'We think like builders and operators, not intermediaries—bringing initiative, urgency, and long-term conviction to how assets are conceived, executed, and stewarded.'
),
(
  'Creative Intelligence',
  'We apply cross-disciplinary thinking across finance, design, policy, and operations—challenging convention to unlock differentiated value in land and built environments.'
),
(
  'Agility & Adaptation',
  'We anticipate shifts in markets, regulation, and demand—adapting strategy early to preserve resilience and capture emerging opportunity.'
),
(
  'Collective Alignment',
  'We collaborate across partners, capabilities, and geographies—aligning incentives and execution to build platforms larger than any single asset or stakeholder.'
),
(
  'Responsible Growth & Stewardship',
  'We integrate sustainability, environmental responsibility, and sound governance into how assets are underwritten, developed, and operated—enhancing resilience, accountability, and long-term value for all stakeholders.'
);
