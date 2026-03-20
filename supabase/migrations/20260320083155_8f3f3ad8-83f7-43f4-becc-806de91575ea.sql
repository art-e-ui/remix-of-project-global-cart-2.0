
-- Virtual customer profiles for SQC
CREATE TABLE public.virtual_customer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  shipping_address text NOT NULL,
  region text NOT NULL,
  status text NOT NULL DEFAULT 'Available',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.virtual_customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VCP publicly readable" ON public.virtual_customer_profiles FOR SELECT USING (true);
CREATE POLICY "VCP insertable" ON public.virtual_customer_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "VCP updatable" ON public.virtual_customer_profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "VCP deletable" ON public.virtual_customer_profiles FOR DELETE USING (true);

-- Seed 50 virtual customer profiles
INSERT INTO public.virtual_customer_profiles (name, email, shipping_address, region, status) VALUES
('Aisha Rahman', 'aisha.rahman92@gmail.com', '23 Jalan Bukit Merah, Singapore 150023', 'South East Asia', 'Available'),
('Nguyen Thanh Hai', 'thanh.hai.ng@gmail.com', '45 Pham Ngu Lao, Ho Chi Minh City, Vietnam', 'South East Asia', 'Available'),
('Putri Wulandari', 'putri.wulan88@gmail.com', 'Jl. Sudirman No. 12, Jakarta 10220, Indonesia', 'South East Asia', 'Available'),
('Somchai Prasert', 'somchai.p77@gmail.com', '88 Sukhumvit Soi 24, Bangkok 10110, Thailand', 'South East Asia', 'Available'),
('Maria Santos', 'maria.santos.mnl@gmail.com', '156 Rizal Ave, Makati, Metro Manila, Philippines', 'South East Asia', 'Available'),
('Lim Wei Jie', 'weijie.lim03@gmail.com', '8 Lorong Kuda, Penang 10400, Malaysia', 'South East Asia', 'Available'),
('Sok Pisey', 'sok.pisey.kh@gmail.com', '#34 Street 178, Phnom Penh, Cambodia', 'South East Asia', 'Available'),
('Daw Khin Myo', 'khin.myo.mm@gmail.com', '72 Anawrahta Rd, Yangon 11182, Myanmar', 'South East Asia', 'Available'),
('Tran Minh Duc', 'minh.duc.tran@gmail.com', '19 Hang Bai, Hanoi, Vietnam', 'South East Asia', 'Available'),
('Ratana Keo', 'ratana.keo99@gmail.com', '5 Sisavangvong Rd, Luang Prabang, Laos', 'South East Asia', 'Available'),
('Farhan Ahmed', 'farhan.ahmed.bd@gmail.com', '12/3 Dhanmondi R/A, Dhaka 1205, Bangladesh', 'Bangladesh', 'Available'),
('Nusrat Jahan', 'nusrat.jahan55@gmail.com', '78 Agrabad C/A, Chittagong 4100, Bangladesh', 'Bangladesh', 'Available'),
('Rafiq Uddin', 'rafiq.uddin.ctg@gmail.com', '34 Shahjalal Rd, Sylhet 3100, Bangladesh', 'Bangladesh', 'Available'),
('Taslima Begum', 'taslima.begum21@gmail.com', 'House 9, Sector 7, Uttara, Dhaka 1230, Bangladesh', 'Bangladesh', 'Available'),
('Kamal Hossain', 'kamal.hossain.raj@gmail.com', '56 Station Rd, Rajshahi 6000, Bangladesh', 'Bangladesh', 'Available'),
('Priya Sharma', 'priya.sharma.del@gmail.com', 'B-42 Hauz Khas, New Delhi 110016, India', 'India', 'Available'),
('Arjun Patel', 'arjun.patel.mum@gmail.com', '305 Linking Rd, Bandra West, Mumbai 400050, India', 'India', 'Available'),
('Deepika Reddy', 'deepika.reddy.hyd@gmail.com', '14-5-30 Begumpet, Hyderabad 500016, India', 'India', 'Available'),
('Vikram Singh', 'vikram.singh.jp@gmail.com', '23 MI Road, Jaipur 302001, India', 'India', 'Available'),
('Ananya Chatterjee', 'ananya.chat.kol@gmail.com', '7A Park Street, Kolkata 700016, India', 'India', 'Available'),
('Rahul Menon', 'rahul.menon.ker@gmail.com', '88 MG Road, Ernakulam, Kochi 682011, India', 'India', 'Available'),
('Sneha Iyer', 'sneha.iyer.blr@gmail.com', '45 Brigade Rd, Bengaluru 560025, India', 'India', 'Available'),
('Ravi Kumar', 'ravi.kumar.chn@gmail.com', '12 Anna Salai, Chennai 600002, India', 'India', 'Available'),
('Meena Agarwal', 'meena.agarwal.lko@gmail.com', '34 Hazratganj, Lucknow 226001, India', 'India', 'Available'),
('Sanjay Gupta', 'sanjay.gupta.pat@gmail.com', '56 Fraser Rd, Patna 800001, India', 'India', 'Available'),
('Omar Al-Rashid', 'omar.rashid.dxb@gmail.com', 'Apt 1204, Al Barsha 1, Dubai, UAE', 'Middle East', 'Available'),
('Fatima Al-Sayed', 'fatima.sayed.kw@gmail.com', 'Block 3, Salmiya, Kuwait City, Kuwait', 'Middle East', 'Available'),
('Hassan Mahmoud', 'hassan.mahmoud.qa@gmail.com', '22 Al Sadd St, Doha, Qatar', 'Middle East', 'Available'),
('Layla Ibrahim', 'layla.ibrahim.bh@gmail.com', 'Flat 56, Juffair, Manama, Bahrain', 'Middle East', 'Available'),
('Ahmed Al-Farsi', 'ahmed.farsi.om@gmail.com', 'Villa 89, Al Khuwair, Muscat, Oman', 'Middle East', 'Available'),
('Noor Khalid', 'noor.khalid.sa@gmail.com', '34 Tahlia St, Riyadh 12211, Saudi Arabia', 'Middle East', 'Available'),
('Yusuf Demir', 'yusuf.demir.ist@gmail.com', 'Beyoglu, Istiklal Caddesi 120, Istanbul 34430, Turkey', 'Middle East', 'Available'),
('Rania Haddad', 'rania.haddad.jo@gmail.com', '15 Rainbow St, Amman 11181, Jordan', 'Middle East', 'Available'),
('Khalil Nassar', 'khalil.nassar.lb@gmail.com', 'Hamra, Bliss St 44, Beirut, Lebanon', 'Middle East', 'Available'),
('Sara Hosseini', 'sara.hosseini.ir@gmail.com', '78 Valiasr Ave, Tehran 14155, Iran', 'Middle East', 'Available'),
('Aleksei Petrov', 'aleksei.petrov.msk@gmail.com', 'ul. Tverskaya 18, Moscow 125009, Russia', 'East Europe', 'Available'),
('Katarina Nowak', 'katarina.nowak.pl@gmail.com', 'ul. Nowy Swiat 42, Warsaw 00-363, Poland', 'East Europe', 'Available'),
('Miroslav Horvat', 'miroslav.horvat.hr@gmail.com', 'Ilica 78, 10000 Zagreb, Croatia', 'East Europe', 'Available'),
('Elena Vasilescu', 'elena.vasilescu.ro@gmail.com', 'Str. Victoriei 55, Bucharest 010065, Romania', 'East Europe', 'Available'),
('Dimitar Georgiev', 'dimitar.georgiev.bg@gmail.com', 'bul. Vitosha 34, Sofia 1000, Bulgaria', 'East Europe', 'Available'),
('Ivana Svobodova', 'ivana.svobodova.cz@gmail.com', 'Vinohradska 120, Prague 130 00, Czech Republic', 'East Europe', 'Available'),
('Andrei Kozlov', 'andrei.kozlov.ua@gmail.com', 'vul. Khreshchatyk 22, Kyiv 01001, Ukraine', 'East Europe', 'Available'),
('Maja Jovanovic', 'maja.jovanovic.rs@gmail.com', 'Knez Mihailova 15, Belgrade 11000, Serbia', 'East Europe', 'Available'),
('Tomas Nagy', 'tomas.nagy.hu@gmail.com', 'Andrassy ut 60, Budapest 1062, Hungary', 'East Europe', 'Available'),
('Lina Kazlauskiene', 'lina.kazlauskiene.lt@gmail.com', 'Gedimino pr. 9, Vilnius 01103, Lithuania', 'East Europe', 'Available'),
('Emilija Berzina', 'emilija.berzina.lv@gmail.com', 'Brivibas iela 33, Riga LV-1010, Latvia', 'East Europe', 'Available'),
('Marek Kowalski', 'marek.kowalski.kr@gmail.com', 'ul. Florianska 8, Krakow 31-021, Poland', 'East Europe', 'Available'),
('Olga Sokolova', 'olga.sokolova.spb@gmail.com', 'Nevsky Prospekt 56, St Petersburg 191025, Russia', 'East Europe', 'Available'),
('Viktor Nemeth', 'viktor.nemeth.sk@gmail.com', 'Obchodna 22, Bratislava 811 06, Slovakia', 'East Europe', 'Available'),
('Ana Petrescu', 'ana.petrescu.cl@gmail.com', 'Str. Napoca 12, Cluj-Napoca 400001, Romania', 'East Europe', 'Available');
