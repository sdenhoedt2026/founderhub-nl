import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Building2, Calendar, ExternalLink, Filter, X, ChevronDown, Users, Coffee, Mic, Rocket, Heart, Globe, ArrowRight, Tag, Briefcase, Landmark, TrendingUp, Lightbulb, Link2 } from "lucide-react";

// ─── DATA ───────────────────────────────────────────────────────────────────
const INITIATIVES = [
  { id: 1, name: "Rockstart", type: "Accelerator", description: "Early-stage venture capital accelerator empowering purpose-driven founders in energy, agrifood, and emerging technologies through mentor-driven programs and investment from pre-seed to Series B.", province: "Noord-Holland", city: "Amsterdam", industries: ["Energy", "AgriFood", "Emerging Tech"], frequency: "Ongoing cohorts", url: "https://www.rockstart.com", cost: "Equity-based", format: "In-person" },
  { id: 2, name: "B.Amsterdam", type: "Workspace", description: "Europe's largest startup ecosystem hub with 33,500 m² of office space across four buildings, offering co-working, flex desks, and community support for entrepreneurs.", province: "Noord-Holland", city: "Amsterdam", industries: ["Tech", "Sustainability", "Social Impact"], frequency: "Permanent", url: "https://www.b-amsterdam.com", cost: "Membership", format: "In-person" },
  { id: 3, name: "Startupbootcamp", type: "Accelerator", description: "Global network of industry-focused accelerators offering three-month intensive mentor-driven programs with mentorship, office space, and funding across Smart City & IoT, Commerce, and FinTech.", province: "Noord-Holland", city: "Amsterdam", industries: ["Smart City", "IoT", "Fintech", "Cybersecurity"], frequency: "3-month cohorts", url: "https://startupbootcamp.org", cost: "Equity-based", format: "In-person" },
  { id: 4, name: "Antler Netherlands", type: "Accelerator", description: "Global startup generator and early-stage VC firm bringing together hand-picked European founders for in-person residency programs with scaling opportunities across European hubs.", province: "Noord-Holland", city: "Amsterdam", industries: ["Tech", "General"], frequency: "Cohort-based", url: "https://www.antler.co/location/netherlands", cost: "Equity-based", format: "In-person" },
  { id: 5, name: "Impact Hub Amsterdam", type: "Accelerator", description: "Part of a global network spanning 100+ locations, providing accelerator programs for startups creating sustainable solutions including Food Chain and Circular Textile accelerators.", province: "Noord-Holland", city: "Amsterdam", industries: ["Sustainability", "Food", "Circular Economy", "Fashion"], frequency: "Ongoing programs", url: "https://amsterdam.impacthub.net", cost: "Varies", format: "In-person" },
  { id: 6, name: "Startup Village / ACE Incubator", type: "Incubator", description: "Campus-style workspace at Amsterdam Science Park hosting 55+ startups and scaleups, including The Nursery launchpad for early-stage AI and Quantum startups. Powered by UvA, VU, HvA.", province: "Noord-Holland", city: "Amsterdam", industries: ["AI", "Quantum", "Digital Tech", "Life Sciences"], frequency: "Ongoing", url: "https://www.startupvillage.nl", cost: "Varies", format: "In-person" },
  { id: 7, name: "TNW Conference", type: "Conference", description: "Europe's leading tech festival bringing together 4,500+ attendees including 2,000+ startups, 675 investors, and 900 corporate innovators for talks, workshops, and networking at NDSM Amsterdam.", province: "Noord-Holland", city: "Amsterdam", industries: ["Tech", "AI", "Fintech", "General"], frequency: "Annual (June)", url: "https://thenextweb.com/conference", cost: "€299+", format: "In-person" },
  { id: 8, name: "Amsterdam Capital Week", type: "Conference", description: "Annual week-long event featuring 20+ events connecting 2,500+ startup founders with 500+ investors, VCs, and angel investors across all funding stages.", province: "Noord-Holland", city: "Amsterdam", industries: ["General", "Tech", "Fintech"], frequency: "Annual (September)", url: "https://www.amsterdamcapitalweek.com", cost: "Varies", format: "In-person" },
  { id: 9, name: "World Summit AI", type: "Conference", description: "Specialized AI conference bringing together AI leaders, researchers, entrepreneurs, and innovators to discuss advances in artificial intelligence and machine learning.", province: "Noord-Holland", city: "Amsterdam", industries: ["AI", "Machine Learning", "Data Science"], frequency: "Annual", url: "https://worldsummit.ai", cost: "€499+", format: "In-person" },
  { id: 10, name: "Hackers & Founders Amsterdam", type: "Community", description: "Amsterdam's largest, longest-running meetup of tech entrepreneurs and founders (7,400+ members) with monthly talks, a Slack workspace, and The Hacker Building co-working space.", province: "Noord-Holland", city: "Amsterdam", industries: ["Tech", "Startups"], frequency: "Monthly", url: "https://hackersandfounders.nl", cost: "Free", format: "In-person" },
  { id: 11, name: "Amsterdam AI", type: "Network", description: "Coalition developing responsible, people-centered AI solutions through collaboration between business innovation, healthcare, and public services with quarterly community meetings.", province: "Noord-Holland", city: "Amsterdam", industries: ["AI", "Machine Learning"], frequency: "Quarterly", url: "https://amsterdamai.com", cost: "Free", format: "Hybrid" },
  { id: 12, name: "Amsterdam Science Park", type: "Campus", description: "Home to 176 companies from startups to multinationals, a thriving hub for research, education, and entrepreneurship in digital innovation, AI, sustainability, and life sciences.", province: "Noord-Holland", city: "Amsterdam", industries: ["Research", "Tech", "Life Sciences", "Sustainability"], frequency: "Permanent", url: "https://www.amsterdamsciencepark.nl", cost: "Varies", format: "In-person" },
  { id: 13, name: "Startup in Residence Amsterdam", type: "Program", description: "Six-month in-house incubation program connecting startups with pre-defined urban and societal challenges, providing workspace, mentorship, and potential investment from the City of Amsterdam.", province: "Noord-Holland", city: "Amsterdam", industries: ["Urban Solutions", "Smart City", "Sustainability"], frequency: "Ongoing", url: "https://startupinresidence.com/amsterdam", cost: "Free", format: "In-person" },
  { id: 14, name: "Women in Tech NL", type: "Community", description: "Nationwide community empowering women founders and tech professionals through mentorship, events, and a supportive network of female entrepreneurs and allies.", province: "Noord-Holland", city: "Amsterdam", industries: ["Tech", "General"], frequency: "Monthly", url: "https://www.womenintech.nl", cost: "Free", format: "Hybrid" },
  { id: 15, name: "Founder Institute Amsterdam", type: "Accelerator", description: "Part of the global Founder Institute network (120 countries), providing structured programs for founders at idea and pre-seed stages with expert training and investor access.", province: "Noord-Holland", city: "Amsterdam", industries: ["Tech", "General"], frequency: "Cohort-based", url: "https://fi.co/apply/amsterdam", cost: "€499", format: "Hybrid" },

  { id: 100, name: "Yes!Delft", type: "Incubator", description: "Leading tech incubator offering accelerator, validation, and startup programs for deep tech entrepreneurs. Programs span AI, cybersecurity, maritime, medtech, and clean energy.", province: "Zuid-Holland", city: "Delft", industries: ["Deep Tech", "AI", "Cybersecurity", "Maritime", "MedTech", "Clean Energy"], frequency: "Ongoing programs", url: "https://www.yesdelft.com", cost: "Varies", format: "In-person" },
  { id: 101, name: "BlueCity", type: "Incubator", description: "Circular economy incubator in a former tropical swimming pool, hosting 30+ circular entrepreneurs and running programs like CIRCO tracks, Circular Challenge, and Circular Ideation Lab.", province: "Zuid-Holland", city: "Rotterdam", industries: ["Circular Economy", "Sustainability", "Cleantech"], frequency: "Ongoing programs", url: "https://www.bluecity.nl", cost: "Varies", format: "In-person" },
  { id: 102, name: "Erasmus Centre for Entrepreneurship (ECE)", type: "Incubator", description: "University-linked center offering student founder programs, scale-up programs (ELITTE, Het Groeicollege), and initiatives like the Dutch New Narrative Lab and SHE LEADS+.", province: "Zuid-Holland", city: "Rotterdam", industries: ["General", "Tech", "Social Impact"], frequency: "Ongoing programs", url: "https://ece.nl", cost: "Varies", format: "In-person" },
  { id: 103, name: "Up!Rotterdam", type: "Accelerator", description: "Startup and scale-up accelerator organizing CEO Dinners, CXO Deepdives, investor matching, campus recruitment (Hackyourcareer), and the annual Upstream Festival.", province: "Zuid-Holland", city: "Rotterdam", industries: ["Tech", "General"], frequency: "Ongoing", url: "http://www.uprotterdam.com", cost: "Varies", format: "In-person" },
  { id: 104, name: "Innovation Quarter", type: "Support Organization", description: "Regional economic development agency for Zuid-Holland providing market readiness programs, health tech and green chemistry accelerators, and the EnergiIQ fund for clean energy startups.", province: "Zuid-Holland", city: "Den Haag", industries: ["Health Tech", "Green Chemistry", "Clean Energy", "General"], frequency: "Ongoing", url: "https://www.innovationquarter.nl", cost: "Free", format: "In-person" },
  { id: 105, name: "ImpactCity The Hague", type: "Community", description: "The Hague's startup ecosystem hub connecting impact-driven founders with support organizations, hosting Impact Fest and fostering innovation in peace, justice, and cybersecurity.", province: "Zuid-Holland", city: "Den Haag", industries: ["Social Impact", "GovTech", "Cybersecurity", "Legal Tech"], frequency: "Ongoing", url: "https://www.impactcity.nl", cost: "Free", format: "In-person" },
  { id: 106, name: "CIC Rotterdam", type: "Workspace", description: "Part of the global Cambridge Innovation Center network, offering coworking, private offices, and monthly community meetups for startups and innovators in central Rotterdam.", province: "Zuid-Holland", city: "Rotterdam", industries: ["Tech", "General"], frequency: "Monthly meetups", url: "https://cic.com/rotterdam", cost: "Membership", format: "In-person" },
  { id: 107, name: "Startup Grind Rotterdam", type: "Community", description: "Rotterdam chapter of the global Startup Grind community hosting monthly educational events with fireside chats, networking, and mentorship connecting founders with investors.", province: "Zuid-Holland", city: "Rotterdam", industries: ["Tech", "General"], frequency: "Monthly", url: "https://www.startupgrind.com/rotterdam", cost: "Free", format: "In-person" },
  { id: 108, name: "PLNT Leiden", type: "Incubator", description: "Leiden's startup incubator offering unlock_incubation and Ready to Start programs for early-stage entrepreneurs, plus the annual PLNT Festival connecting the regional startup ecosystem.", province: "Zuid-Holland", city: "Leiden", industries: ["Health", "Tech", "Social Impact"], frequency: "Ongoing programs", url: "https://www.plnt.nl", cost: "Varies", format: "In-person" },
  { id: 109, name: "The Hague Tech", type: "Workspace", description: "Community-driven co-working space and tech hub in The Hague bringing together startups, corporates, and government organizations focused on innovation in security, peace, and justice.", province: "Zuid-Holland", city: "Den Haag", industries: ["Cybersecurity", "GovTech", "Peace & Justice", "Tech"], frequency: "Permanent", url: "https://www.thehaguetech.com", cost: "Membership", format: "In-person" },
  { id: 110, name: "Leiden Bio Science Park", type: "Campus", description: "One of Europe's leading life sciences clusters with 200+ organizations, offering biotech training facilities, networking events, and a thriving ecosystem for biotech and life science entrepreneurs.", province: "Zuid-Holland", city: "Leiden", industries: ["Biotech", "Life Sciences", "Health", "Pharma"], frequency: "Permanent", url: "https://leidenbiosciencepark.nl", cost: "Varies", format: "In-person" },
  { id: 111, name: "TU Delft Campus", type: "Campus", description: "Innovation campus connected to TU Delft offering entrepreneurship programs, the Impact Studio for ideation, startup vouchers, and the annual TU Delft Impact Contest for aspiring founders.", province: "Zuid-Holland", city: "Delft", industries: ["Deep Tech", "Engineering", "Cleantech", "Robotics"], frequency: "Permanent", url: "https://www.tudelftcampus.nl", cost: "Varies", format: "In-person" },
  { id: 112, name: "Upstream Festival", type: "Conference", description: "Rotterdam's annual startup festival organized by Up!Rotterdam, bringing together founders, investors, and ecosystem players for talks, pitches, and networking.", province: "Zuid-Holland", city: "Rotterdam", industries: ["Tech", "General"], frequency: "Annual", url: "https://www.upstreamfestival.com", cost: "Varies", format: "In-person" },
  { id: 113, name: "Impact Fest", type: "Conference", description: "Annual conference in The Hague connecting impact-driven entrepreneurs with investors, policymakers, and corporates focused on peace, justice, and sustainable development.", province: "Zuid-Holland", city: "Den Haag", industries: ["Social Impact", "Sustainability", "GovTech"], frequency: "Annual", url: "https://www.impactfest.nl", cost: "Varies", format: "In-person" },
  { id: 114, name: "Hague Security Delta (HSD)", type: "Network", description: "The largest security cluster in Europe, connecting startups, corporates, governments, and knowledge institutions working on cybersecurity and national security innovations.", province: "Zuid-Holland", city: "Den Haag", industries: ["Cybersecurity", "Security", "Defense"], frequency: "Ongoing", url: "https://www.securitydelta.nl", cost: "Membership", format: "In-person" },
  { id: 115, name: "42workspace", type: "Workspace", description: "Vibrant co-working and events space in Rotterdam where startups, freelancers, and scaleups work alongside each other, hosting regular TechSocial events in collaboration with ECE and Yes!Delft.", province: "Zuid-Holland", city: "Rotterdam", industries: ["Tech", "Creative", "General"], frequency: "Permanent", url: "https://42workspace.com", cost: "Membership", format: "In-person" },
  { id: 116, name: "Platform Zero", type: "Community", description: "Climate tech community and maritime investment hub in Rotterdam hosting monthly community sessions, supporting WEC 500 startups, and connecting climate entrepreneurs with funding.", province: "Zuid-Holland", city: "Rotterdam", industries: ["Climate Tech", "Maritime", "Energy"], frequency: "Monthly", url: "https://www.platformzero.co", cost: "Free", format: "In-person" },
  { id: 117, name: "NL Space Campus", type: "Campus", description: "The Netherlands' space innovation campus in Noordwijk with ESA BIC incubation, Ignition Programme, Soft Landing for international startups, and NL Space Week events.", province: "Zuid-Holland", city: "Noordwijk", industries: ["Space Tech", "Aerospace", "Satellite"], frequency: "Ongoing programs", url: "https://www.nlspacecampus.eu", cost: "Varies", format: "In-person" },
  { id: 118, name: "Erasmus Enterprise", type: "Incubator", description: "Erasmus University's entrepreneurship center running the NL Startup Competition, Erasmus University Challenge, and providing startup support from ideation to scale-up.", province: "Zuid-Holland", city: "Rotterdam", industries: ["General", "Health", "Tech"], frequency: "Ongoing", url: "https://www.erasmusenterprise.com", cost: "Free", format: "In-person" },
  { id: 119, name: "PortXL", type: "Accelerator", description: "World's first port and maritime accelerator, connecting startups with the Port of Rotterdam ecosystem for pilot projects, investment, and scaling in maritime and energy transition.", province: "Zuid-Holland", city: "Rotterdam", industries: ["Maritime", "Logistics", "Energy"], frequency: "Annual cohorts", url: "https://www.portxl.org", cost: "Free", format: "In-person" },
  { id: 120, name: "Incubators United", type: "Network", description: "Collaboration between leading Zuid-Holland incubators (Yes!Delft, BlueCity, ECE, and more) organizing joint Meet your Co-founder XL events and cross-pollinating startup ecosystems.", province: "Zuid-Holland", city: "Delft", industries: ["General", "Tech"], frequency: "Quarterly events", url: "https://www.incubatorsunited.com", cost: "Free", format: "In-person" },

  { id: 200, name: "UtrechtInc", type: "Incubator", description: "Leading startup incubator at Utrecht Science Park supporting researchers, students, and entrepreneurs in health, climate, and education. Over 250+ startups have completed its programs.", province: "Utrecht", city: "Utrecht", industries: ["Health", "Climate", "Education", "Digital Tech"], frequency: "Ongoing programs", url: "https://utrechtinc.nl", cost: "Free / Varies", format: "In-person" },
  { id: 201, name: "Dotslash Utrecht", type: "Workspace", description: "The largest physical startup and scale-up hub in the Netherlands, hosting over 200 companies across two towers on Europalaan. Community-driven space for startups, scale-ups, corporates, and investors.", province: "Utrecht", city: "Utrecht", industries: ["Tech", "General"], frequency: "Permanent", url: "https://www.dotslash.nl", cost: "Membership", format: "In-person" },
  { id: 202, name: "JIM - Jaarbeurs Innovation Mile", type: "Workspace", description: "Open workspace 2 minutes from Utrecht Central Station focusing on Healthy Urban Living themes, with branded spaces for scale-ups and flex zones for freelancers and startups.", province: "Utrecht", city: "Utrecht", industries: ["Health", "Sustainable Urban Living", "HealthTech"], frequency: "Permanent", url: "https://www.jim-utrecht.nl", cost: "Membership", format: "In-person" },
  { id: 203, name: "Startup Utrecht Region", type: "Network", description: "Ecosystem platform bringing together startups, scale-ups, corporates, investors, universities, and government to build the Utrecht startup ecosystem. Organizes meetups and networking events.", province: "Utrecht", city: "Utrecht", industries: ["General", "Tech"], frequency: "Regular events", url: "https://www.startuputrechtregion.com", cost: "Free", format: "Hybrid" },
  { id: 204, name: "Utrecht Science Park", type: "Campus", description: "The country's largest science park with 80+ organizations and 22,000 employees, hosting UtrechtInc, ICAT, and Plus Ultra Utrecht with research-to-startup programs and seed funding.", province: "Utrecht", city: "Utrecht", industries: ["Life Sciences", "Health", "Sustainability", "Tech"], frequency: "Permanent", url: "https://www.utrechtsciencepark.nl", cost: "Varies", format: "In-person" },
  { id: 205, name: "Holland Startup", type: "Venture Builder", description: "Utrecht-based venture builder specializing in design, incubation, acceleration, and active operational support of digital companies, providing coaching and back-office services.", province: "Utrecht", city: "Utrecht", industries: ["Digital", "Tech"], frequency: "Ongoing", url: "https://hollandstartup.com", cost: "Equity-based", format: "In-person" },

  { id: 300, name: "HighTechXL", type: "Venture Builder", description: "The Netherlands' premier deep-tech venture builder supporting founders through a 1-year program, combining groundbreaking technologies with entrepreneurship and connecting startups with investors.", province: "Noord-Brabant", city: "Eindhoven", industries: ["Deep Tech", "Robotics", "MedTech", "Hardware"], frequency: "Annual cohorts", url: "https://www.hightechxl.com", cost: "Equity-based", format: "In-person" },
  { id: 301, name: "The Gate (Brainport Eindhoven)", type: "Support Organization", description: "Single entry-point platform for deep-tech startups in Brainport Eindhoven, providing guidance on workspaces, funding, training, coaching, IP, and the Startup Readiness Program.", province: "Noord-Brabant", city: "Eindhoven", industries: ["Deep Tech", "Hardware", "Software", "Cleantech"], frequency: "Ongoing", url: "https://brainporteindhoven.com/the-gate", cost: "Free", format: "In-person" },
  { id: 302, name: "High Tech Campus Eindhoven", type: "Campus", description: "Europe's 'smartest square kilometer' housing 300+ high-tech companies and 12,500+ innovators. A collaborative hub for advanced technology development with world-class facilities.", province: "Noord-Brabant", city: "Eindhoven", industries: ["Semiconductors", "Photonics", "AI", "Hardware"], frequency: "Permanent", url: "https://www.hightechcampus.com", cost: "Varies", format: "In-person" },
  { id: 303, name: "AI Innovation Center Eindhoven", type: "Workspace", description: "Open innovation hub for AI startups founded by HTCE, Philips, Signify, ASML, and NXP, providing co-working space, soft landing support, and events on industrializing AI.", province: "Noord-Brabant", city: "Eindhoven", industries: ["AI", "Machine Learning", "Smart Technology"], frequency: "Permanent", url: "https://aiinnovationcenter.nl", cost: "Varies", format: "In-person" },
  { id: 304, name: "Eindhoven Startup Alliance", type: "Network", description: "Joint initiative by ASML and Philips aiming to accelerate 100+ high-tech hardware companies within four years, providing strategic support and connecting founders with the tech ecosystem.", province: "Noord-Brabant", city: "Eindhoven", industries: ["High-Tech Hardware", "Semiconductors", "Advanced Manufacturing"], frequency: "Ongoing", url: "https://www.eindhovenstartupalliance.com", cost: "Free", format: "In-person" },
  { id: 305, name: "BOM Brabant Ventures", type: "Investor", description: "Regional development agency providing capital, expertise, and networks to Brabant startups and scale-ups, expanding fund capital to €1 billion between 2025-2028.", province: "Noord-Brabant", city: "Eindhoven", industries: ["Sustainable Food", "Health", "Life Sciences", "Clean Energy", "Key Technologies"], frequency: "Ongoing", url: "https://www.bom.nl", cost: "Investment-based", format: "In-person" },
  { id: 306, name: "Startups for Society", type: "Program", description: "Collaboration between Tilburg University, Fontys, Avans, and Municipality of Tilburg focused on impact startups addressing climate change, labor shortages, and healthcare.", province: "Noord-Brabant", city: "Tilburg", industries: ["Climate Tech", "Social Innovation", "Healthcare"], frequency: "Ongoing programs", url: "https://www.startupsforsociety.nl", cost: "Free", format: "In-person" },
  { id: 307, name: "Brabant Innovation Days", type: "Conference", description: "Annual platform connecting Brabant's innovation ecosystems with leading global high-tech hubs, bringing together startups, researchers, corporates, and policymakers.", province: "Noord-Brabant", city: "Eindhoven", industries: ["High Tech", "International Partnerships"], frequency: "Annual", url: "https://brabantinnovationdays.com", cost: "Varies", format: "In-person" },

  { id: 400, name: "Orion Gelderland", type: "Network", description: "Collaborative network of ten partners helping innovative Gelderland startups seeking growth through substantive programming and extensive business networks.", province: "Gelderland", city: "Arnhem", industries: ["Energy", "Creative", "ICT", "AI", "Food", "Health"], frequency: "Ongoing", url: "https://www.orion-gelderland.nl", cost: "Free", format: "In-person" },
  { id: 401, name: "StartUp Nijmegen", type: "Incubator", description: "Providing workplaces, networking, and mentorship for starting entrepreneurs with over 120 office hours monthly from experienced entrepreneurs, plus mindset and business development.", province: "Gelderland", city: "Nijmegen", industries: ["General", "Tech", "Health"], frequency: "Ongoing", url: "https://startupnijmegen.nl", cost: "Varies", format: "In-person" },
  { id: 402, name: "Novel-T Gelderland", type: "Accelerator", description: "Supports startups through growth programs, spin-offs, and SME advancement with free workshops, mentoring, and connections to investors and top entrepreneurs.", province: "Gelderland", city: "Nijmegen", industries: ["Healthcare", "High Tech", "Innovation"], frequency: "Ongoing", url: "https://novelt.com", cost: "Free", format: "In-person" },

  { id: 500, name: "Kennispark Twente", type: "Campus", description: "One of Europe's most entrepreneurial innovation campuses with 450+ companies and 5,000+ innovation workers, ranking among top three innovation campuses in the Netherlands.", province: "Overijssel", city: "Enschede", industries: ["MedTech", "Advanced Manufacturing", "Chip Design", "Robotics", "Smart IT"], frequency: "Permanent", url: "https://kennispark.nl", cost: "Varies", format: "In-person" },
  { id: 501, name: "Novel-T Enschede", type: "Accelerator", description: "Startup accelerator offering the START program (6-week validation), ADVANCED program, imec.istart partnership (€100K-€250K funding), and BeStart climate tech accelerator.", province: "Overijssel", city: "Enschede", industries: ["Healthcare", "High Tech", "Climate Tech"], frequency: "Ongoing programs", url: "https://novelt.com", cost: "Free", format: "In-person" },
  { id: 502, name: "Incubase", type: "Incubator", description: "Student incubator founded by Student Union, University of Twente, and Novel-T, supporting entrepreneurial students with free startup programs, coworking space, and partner support.", province: "Overijssel", city: "Enschede", industries: ["Student Startups", "Tech", "General"], frequency: "Ongoing", url: "https://incubase.nl", cost: "Free", format: "In-person" },
  { id: 503, name: "LaunchLab Zwolle", type: "Accelerator", description: "Tech startup community providing accelerator programs, coworking spaces, mentorship, and knowledge sharing for entrepreneurs developing ideas to transform traditional industries.", province: "Overijssel", city: "Zwolle", industries: ["Tech", "Innovation"], frequency: "Ongoing", url: "https://www.launchlab.nl", cost: "Varies", format: "In-person" },
  { id: 504, name: "ZWINC Incubator", type: "Incubator", description: "Non-profit incubator for ambitious startups in manufacturing and IT focused on sustainability, providing workplaces, machine park access, 3D lab, coaching, and €2,750 innovation budget.", province: "Overijssel", city: "Zwolle", industries: ["Manufacturing", "IT", "Sustainability", "Circular Economy"], frequency: "Ongoing", url: "https://zwinc.nl", cost: "Varies", format: "In-person" },

  { id: 600, name: "Founded in Groningen", type: "Community", description: "Regional initiative providing inspiration, education, and support to ambitious entrepreneurial talent, startups, and scale-ups in Groningen, hosting Innovation Day events.", province: "Groningen", city: "Groningen", industries: ["General", "Tech"], frequency: "Regular events", url: "https://foundedingroningen.com", cost: "Free", format: "In-person" },
  { id: 601, name: "RUG Ventures", type: "Investor", description: "Early-stage investment company translating high-risk research-driven concepts into businesses. Founded in 1996, has helped 80+ researchers turn ideas into successful ventures.", province: "Groningen", city: "Groningen", industries: ["Life Science", "Health", "AgriFood", "IT", "Energy", "Chemistry"], frequency: "Ongoing", url: "https://rugventures.com", cost: "Investment-based", format: "In-person" },
  { id: 602, name: "Business Generator Groningen", type: "Support Organization", description: "Supports researchers from University of Groningen and UMCG translating research into innovations, providing business case development, IP protection, and loans (€10K-€35K).", province: "Groningen", city: "Groningen", industries: ["Healthcare", "Energy", "Life Sciences"], frequency: "Ongoing", url: "https://www.businessgeneratorgroningen.com", cost: "Free / Loans", format: "In-person" },

  { id: 700, name: "Founded in Friesland", type: "Community", description: "Non-profit providing inspiration, education, and support to entrepreneurial talent and startups. Hosts Friese Startup van het Jaar and Innovate Friesland conferences.", province: "Friesland", city: "Leeuwarden", industries: ["Digital", "Water Technology", "AgriTech", "Circular Economy"], frequency: "Regular events", url: "https://foundedinfriesland.com", cost: "Free", format: "In-person" },
  { id: 701, name: "WaterCampus Leeuwarden", type: "Campus", description: "Meeting point of the Dutch water technology sector and European hub for circular water technology, with 449+ collaborating companies and 124+ research projects.", province: "Friesland", city: "Leeuwarden", industries: ["Water Technology", "Circular Economy", "Sustainability"], frequency: "Permanent", url: "https://www.watercampus.nl", cost: "Varies", format: "In-person" },

  { id: 800, name: "Ik Ben Drents Ondernemer", type: "Program", description: "Multi-stakeholder program offering tools and inspiration to entrepreneurs in all phases with workshops, meetings, voucher schemes, and support from entrepreneurial advisors.", province: "Drenthe", city: "Assen", industries: ["Green Economy", "Impact", "Digital", "Circular Economy"], frequency: "Regular events", url: "https://ikbendrentsondernemer.nl", cost: "Free", format: "In-person" },

  { id: 900, name: "Startup Flevoland", type: "Community", description: "Central platform for ambitious entrepreneurs in Flevoland, connecting startups, coaches, investors, and partners with coaching, practical support, and inspiring events.", province: "Flevoland", city: "Almere", industries: ["Sustainability", "Food", "Energy", "Tech"], frequency: "Regular events", url: "https://www.startupflevoland.nl", cost: "Free", format: "In-person" },
  { id: 901, name: "Startup Lelystad", type: "Community", description: "City initiative providing coworking spaces, circular workshops, and hubs for tech and sustainability entrepreneurs, supported by the €18.2M Nieuw Land Regional Deal.", province: "Flevoland", city: "Lelystad", industries: ["Sustainability", "Tech", "Healthcare", "Food"], frequency: "Ongoing", url: "https://startuplelystad.nl", cost: "Varies", format: "In-person" },

  { id: 1000, name: "Dockwize", type: "Incubator", description: "Zeeland's innovation hub housing 40+ startups with validation, acceleration, and growth programs. The 'Get Unlocked' challenge scouts startups globally for water, food, and energy collaboration.", province: "Zeeland", city: "Vlissingen", industries: ["Water", "Food", "Energy", "Innovation"], frequency: "Ongoing programs", url: "https://www.dockwize.nl", cost: "Varies", format: "In-person" },
  { id: 1001, name: "Impuls Zeeland", type: "Support Organization", description: "Regional development organization supporting entrepreneurs in innovation, investment, and internationalization. InnoGo! fund has invested over €500M in Zeeland's economy since 2009.", province: "Zeeland", city: "Middelburg", industries: ["Energy", "Food", "Digital", "Climate", "Circular Economy"], frequency: "Ongoing", url: "https://www.impulszeeland.com", cost: "Free / Fund-based", format: "In-person" },

  { id: 1100, name: "Brightlands Startup League", type: "Accelerator", description: "Joint initiative of four Brightlands Campuses, LIOF, Maastricht University, and Province of Limburg offering free comprehensive support from idea to scale-up with masterclasses.", province: "Limburg", city: "Maastricht", industries: ["Health", "Sustainability", "Digital"], frequency: "Ongoing", url: "https://www.brightlandsstartupleague.com", cost: "Free", format: "In-person" },
  { id: 1101, name: "MedLim", type: "Accelerator", description: "4-week intensive accelerator for MedTech startups developing breakthrough medical devices. Collaboration between Medtronic, LIOF, Brightlands Maastricht Health Campus, and Medace.", province: "Limburg", city: "Maastricht", industries: ["MedTech", "Cardiovascular", "Surgical", "Neurological"], frequency: "Cohort-based", url: "https://medlim.net", cost: "Free", format: "In-person" },
  { id: 1102, name: "BLINC Venlo", type: "Accelerator", description: "3-month intensive program supporting startups in healthy nutrition, future farming, and bio-circular economy at Brightlands Campus Greenport Venlo with weekly sessions and mentoring.", province: "Limburg", city: "Venlo", industries: ["AgriFood", "Future Farming", "Circular Economy"], frequency: "Cohort-based", url: "https://www.brightlands.com/en/campus-greenport-venlo/blinc-program-startups-and-spin-offs", cost: "Free", format: "In-person" },
  { id: 1103, name: "Brightlands Campuses", type: "Campus", description: "Four specialized innovation campuses across Limburg: Chemistry (Sittard-Geleen), Health (Maastricht), Agriculture (Venlo), and Digital (Heerlen). Business development support and expert networks.", province: "Limburg", city: "Maastricht", industries: ["Chemistry", "Health", "Agriculture", "Digital Services"], frequency: "Permanent", url: "https://www.brightlands.com", cost: "Varies", format: "In-person" },

  { id: 1200, name: "Techleap.nl", type: "Network", description: "Government-backed non-profit (formerly StartupDelta) assisting Dutch startups in scaling globally, funded with €65M over four years. Runs Pole Position, Rise, and Shine programs.", province: "Nationwide", city: "Nationwide", industries: ["Tech", "AI", "Deeptech", "Fintech", "Sustainability"], frequency: "Ongoing programs", url: "https://techleap.nl", cost: "Free", format: "Hybrid" },
  { id: 1201, name: "Dutch Startup Association", type: "Network", description: "The largest independent representative for startups, scaleups, and innovation in the Netherlands, advocating for startup-friendly policies and cultivating a nationwide founder network.", province: "Nationwide", city: "Nationwide", industries: ["General", "Tech", "AI", "Health Tech"], frequency: "Ongoing", url: "https://www.dutchstartupassociation.nl", cost: "Membership", format: "Hybrid" },
  { id: 1202, name: "NL AI Coalition", type: "Network", description: "Public-private partnership accelerating AI development through the Breaking Barriers program for AI startups, AiNed (€189M investment), Innovation Labs, and Fellowship Grants.", province: "Nationwide", city: "Nationwide", industries: ["AI", "Data Science"], frequency: "Ongoing", url: "https://aic4nl.nl", cost: "Free", format: "Hybrid" },
  { id: 1203, name: "DutchBasecamp", type: "Accelerator", description: "Globaliser program helping Dutch scale-ups expand internationally with strategic support, market entry guidance, and connections to global ecosystems.", province: "Nationwide", city: "Nationwide", industries: ["Tech", "General"], frequency: "Program-based", url: "https://dutchbasecamp.org", cost: "Free", format: "Hybrid" },
  { id: 1204, name: "ScaleNL", type: "Accelerator", description: "US Fasttrack program helping Dutch scale-ups enter the American market with strategic guidance, network access, and operational support for international expansion.", province: "Nationwide", city: "Nationwide", industries: ["Tech", "General"], frequency: "Program-based", url: "https://scalenl.com", cost: "Varies", format: "Hybrid" },
];

const PROVINCES = [...new Set(INITIATIVES.map(i => i.province))].sort((a, b) => {
  if (a === "Nationwide") return 1;
  if (b === "Nationwide") return -1;
  return a.localeCompare(b);
});
const CITIES = [...new Set(INITIATIVES.map(i => i.city))].sort((a, b) => {
  if (a === "Nationwide") return 1;
  if (b === "Nationwide") return -1;
  return a.localeCompare(b);
});
const ALL_INDUSTRIES = [...new Set(INITIATIVES.flatMap(i => i.industries))].sort();
const TYPES = [...new Set(INITIATIVES.map(i => i.type))].sort();
const FORMATS = [...new Set(INITIATIVES.map(i => i.format))].sort();

// ─── TYPE ICONS & COLORS ────────────────────────────────────────────────────
const TYPE_CONFIG = {
  "Accelerator":          { icon: Rocket,     color: "#f97316", bg: "#ffedd5" },
  "Incubator":            { icon: Lightbulb,  color: "#8b5cf6", bg: "#ede9fe" },
  "Conference":           { icon: Mic,        color: "#ef4444", bg: "#fee2e2" },
  "Community":            { icon: Heart,      color: "#ec4899", bg: "#fce7f3" },
  "Network":              { icon: Link2,      color: "#3b82f6", bg: "#dbeafe" },
  "Workspace":            { icon: Building2,  color: "#06b6d4", bg: "#cffafe" },
  "Campus":               { icon: Landmark,   color: "#14b8a6", bg: "#ccfbf1" },
  "Program":              { icon: Briefcase,  color: "#f59e0b", bg: "#fef3c7" },
  "Venture Builder":      { icon: TrendingUp, color: "#6366f1", bg: "#e0e7ff" },
  "Support Organization": { icon: Users,      color: "#10b981", bg: "#d1fae5" },
  "Investor":             { icon: TrendingUp, color: "#059669", bg: "#d1fae5" },
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function FilterDropdown({ icon: Icon, options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
          background: value ? "#f0f4ff" : "white", border: value ? "2px solid #4f6df5" : "2px solid #e2e8f0",
          borderRadius: 12, cursor: "pointer", fontSize: 14, color: "#1e293b",
          fontWeight: value ? 600 : 400, minWidth: 150, justifyContent: "space-between",
          transition: "all 0.15s ease",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <Icon size={16} style={{ color: "#64748b", flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{value || placeholder}</span>
        </span>
        <ChevronDown size={14} style={{ color: "#94a3b8", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
            background: "white", border: "1px solid #e2e8f0", borderRadius: 12,
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)", minWidth: 220, maxHeight: 320,
            overflowY: "auto", padding: 4,
          }}>
            {value && (
              <button onClick={() => { onChange(""); setOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "8px 12px",
                background: "none", border: "none", cursor: "pointer", fontSize: 13,
                color: "#ef4444", borderRadius: 8, fontWeight: 500,
              }}>
                <X size={14} /> Clear filter
              </button>
            )}
            {options.map(opt => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); }} style={{
                display: "block", width: "100%", padding: "8px 12px", background: opt === value ? "#f0f4ff" : "none",
                border: "none", cursor: "pointer", fontSize: 13, color: "#1e293b", textAlign: "left",
                borderRadius: 8, fontWeight: opt === value ? 600 : 400,
              }}
                onMouseEnter={e => { if (opt !== value) e.target.style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (opt !== value) e.target.style.background = "none"; }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function InitiativeCard({ initiative }) {
  const config = TYPE_CONFIG[initiative.type] || { icon: Globe, color: "#64748b", bg: "#f1f5f9" };
  const TypeIcon = config.icon;
  return (
    <a href={initiative.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{
        background: "white", borderRadius: 16, padding: 0, overflow: "hidden",
        border: "1px solid #e8ecf2", height: "100%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease", cursor: "pointer",
        display: "flex", flexDirection: "column",
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}
      >
        <div style={{ padding: "20px 24px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px",
              background: config.bg, color: config.color, borderRadius: 20,
              fontSize: 12, fontWeight: 600, letterSpacing: "0.01em",
            }}>
              <TypeIcon size={13} /> {initiative.type}
            </span>
            <span style={{
              fontSize: 11, color: "#64748b", background: "#f8fafc", padding: "3px 8px",
              borderRadius: 6, fontWeight: 500,
            }}>
              {initiative.format}
            </span>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 8px", lineHeight: 1.3 }}>
            {initiative.name}
          </h3>
          <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {initiative.description}
          </p>
        </div>
        <div style={{ padding: "0 24px 16px", marginTop: "auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
            {initiative.industries.slice(0, 4).map(ind => (
              <span key={ind} style={{
                fontSize: 11, padding: "2px 8px", background: "#f1f5f9", color: "#475569",
                borderRadius: 6, fontWeight: 500,
              }}>
                {ind}
              </span>
            ))}
            {initiative.industries.length > 4 && (
              <span style={{ fontSize: 11, padding: "2px 8px", background: "#f1f5f9", color: "#94a3b8", borderRadius: 6, fontWeight: 500 }}>
                +{initiative.industries.length - 4}
              </span>
            )}
          </div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: 12, borderTop: "1px solid #f1f5f9",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#64748b" }}>
                <MapPin size={13} /> {initiative.city}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#64748b" }}>
                <Calendar size={13} /> {initiative.frequency}
              </span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: initiative.cost === "Free" ? "#10b981" : "#1e293b" }}>
              {initiative.cost}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "20px 24px", border: "1px solid #e8ecf2",
      display: "flex", alignItems: "center", gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: "#f0f4ff",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={20} style={{ color: "#4f6df5" }} />
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>{value}</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>{label}</div>
      </div>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function HomePage({ onNavigate }) {
  return (
    <div>
      <div style={{
        background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e3a5f 100%)",
        padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(79,109,245,0.08)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(245,158,11,0.06)" }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
            background: "rgba(79,109,245,0.15)", borderRadius: 20, marginBottom: 20,
            fontSize: 13, color: "#93b4fd", fontWeight: 500,
          }}>
            <span style={{ fontSize: 10 }}>🇳🇱</span> The Netherlands Founder Ecosystem
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: "white",
            margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.02em",
          }}>
            Find your founder<br />community
          </h1>
          <p style={{
            fontSize: 18, color: "#94a3b8", margin: "0 0 32px", lineHeight: 1.6, maxWidth: 520, marginLeft: "auto", marginRight: "auto",
          }}>
            Discover {INITIATIVES.length} real accelerators, incubators, founder communities, conferences, and programs across all 12 provinces.
          </p>
          <button
            onClick={() => onNavigate("directory")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 32px", background: "#4f6df5", color: "white",
              border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600,
              cursor: "pointer", transition: "all 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#3b5de7"}
            onMouseLeave={e => e.currentTarget.style.background = "#4f6df5"}
          >
            Browse all initiatives <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "-30px auto 0", padding: "0 24px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <StatCard label="Initiatives" value={INITIATIVES.length} icon={Rocket} />
          <StatCard label="Cities" value={CITIES.filter(c => c !== "Nationwide").length} icon={MapPin} />
          <StatCard label="Provinces" value={PROVINCES.filter(p => p !== "Nationwide").length} icon={Building2} />
          <StatCard label="Industries" value={ALL_INDUSTRIES.length} icon={Tag} />
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "48px auto", padding: "0 24px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Browse by type</h2>
        <p style={{ fontSize: 15, color: "#64748b", marginBottom: 24 }}>Find the right format for how you like to connect.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
            const Icon = cfg.icon;
            const count = INITIATIVES.filter(i => i.type === type).length;
            if (count === 0) return null;
            return (
              <button
                key={type}
                onClick={() => onNavigate("directory", { type })}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  padding: "20px 12px", background: "white", border: "1px solid #e8ecf2",
                  borderRadius: 14, cursor: "pointer", transition: "all 0.15s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf2"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: cfg.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={18} style={{ color: cfg.color }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", textAlign: "center" }}>{type}</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "48px auto 64px", padding: "0 24px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>By province</h2>
        <p style={{ fontSize: 15, color: "#64748b", marginBottom: 24 }}>See what's happening near you.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PROVINCES.map(p => {
            const count = INITIATIVES.filter(i => i.province === p).length;
            return (
              <button
                key={p}
                onClick={() => onNavigate("directory", { province: p })}
                style={{
                  padding: "8px 16px", background: "white", border: "1px solid #e2e8f0",
                  borderRadius: 10, cursor: "pointer", fontSize: 13.5, color: "#334155",
                  fontWeight: 500, display: "flex", alignItems: "center", gap: 6,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f0f4ff"; e.currentTarget.style.borderColor = "#4f6df5"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                {p === "Nationwide" ? `🇳🇱 ${p}` : p}
                <span style={{
                  background: "#f1f5f9", padding: "1px 7px", borderRadius: 10,
                  fontSize: 11, fontWeight: 600, color: "#64748b",
                }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DirectoryPage({ initialFilters }) {
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState(initialFilters?.province || "");
  const [city, setCity] = useState(initialFilters?.city || "");
  const [industry, setIndustry] = useState(initialFilters?.industry || "");
  const [type, setType] = useState(initialFilters?.type || "");
  const [format, setFormat] = useState(initialFilters?.format || "");

  const filteredCities = useMemo(() => {
    if (!province) return CITIES;
    return [...new Set(INITIATIVES.filter(i => i.province === province).map(i => i.city))].sort();
  }, [province]);

  useEffect(() => {
    if (province && city) {
      const validCities = INITIATIVES.filter(i => i.province === province).map(i => i.city);
      if (!validCities.includes(city)) setCity("");
    }
  }, [province]);

  const filtered = useMemo(() => {
    return INITIATIVES.filter(i => {
      if (search) {
        const s = search.toLowerCase();
        if (!i.name.toLowerCase().includes(s) && !i.description.toLowerCase().includes(s) && !i.industries.some(ind => ind.toLowerCase().includes(s)) && !i.city.toLowerCase().includes(s)) return false;
      }
      if (province && i.province !== province) return false;
      if (city && i.city !== city) return false;
      if (industry && !i.industries.includes(industry)) return false;
      if (type && i.type !== type) return false;
      if (format && i.format !== format) return false;
      return true;
    });
  }, [search, province, city, industry, type, format]);

  const activeFilters = [province, city, industry, type, format].filter(Boolean).length;
  const clearAll = () => { setProvince(""); setCity(""); setIndustry(""); setType(""); setFormat(""); setSearch(""); };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px 64px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>Directory</h1>
        <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 20px" }}>
          {filtered.length} initiative{filtered.length !== 1 ? "s" : ""} found
          {activeFilters > 0 && <span> — <button onClick={clearAll} style={{ color: "#4f6df5", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Clear all filters</button></span>}
        </p>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
          background: "white", border: "2px solid #e2e8f0", borderRadius: 14,
          maxWidth: 500, transition: "border-color 0.15s",
        }}>
          <Search size={18} style={{ color: "#94a3b8" }} />
          <input
            type="text" placeholder="Search by name, city, or industry..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", width: "100%", fontSize: 14, color: "#1e293b", background: "transparent" }}
          />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={16} style={{ color: "#94a3b8" }} /></button>}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32, alignItems: "center" }}>
        <Filter size={16} style={{ color: "#94a3b8" }} />
        <FilterDropdown icon={MapPin} options={PROVINCES} value={province} onChange={setProvince} placeholder="Province" />
        <FilterDropdown icon={Building2} options={filteredCities} value={city} onChange={setCity} placeholder="City" />
        <FilterDropdown icon={Tag} options={ALL_INDUSTRIES} value={industry} onChange={setIndustry} placeholder="Industry" />
        <FilterDropdown icon={Users} options={TYPES} value={type} onChange={setType} placeholder="Type" />
        <FilterDropdown icon={Globe} options={FORMATS} value={format} onChange={setFormat} placeholder="Format" />
      </div>

      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {filtered.map(i => <InitiativeCard key={i.id} initiative={i} />)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: "#334155", margin: "0 0 8px" }}>No initiatives found</h3>
          <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 20px" }}>Try adjusting your filters or search terms.</p>
          <button onClick={clearAll} style={{
            padding: "10px 24px", background: "#4f6df5", color: "white",
            border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

function AboutPage({ onNavigate }) {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>About FounderHub NL</h1>
      <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, marginBottom: 24 }}>
        The Dutch startup ecosystem is thriving, but finding the right community, event, or program can be overwhelming. FounderHub NL brings together every founder initiative in the Netherlands into one searchable directory.
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>What we include</h2>
      <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 24 }}>
        We list accelerators, incubators, venture builders, conferences, communities, networks, campuses, programs, and more — from Groningen to Maastricht and everywhere in between. Whether you're a first-time founder or a serial entrepreneur, there's something here for you.
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>How the data works</h2>
      <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 24 }}>
        All initiatives are stored in a simple JSON file that can be easily updated. The South Holland data is sourced from the official regional startup ecosystem database. Other provinces are researched from public sources and verified against organization websites.
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>Submit an initiative</h2>
      <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 32 }}>
        Know of a founder initiative that should be on this list? We review every submission and add approved initiatives weekly.
      </p>
      <button
        onClick={() => onNavigate("submit")}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "14px 28px", background: "#4f6df5", color: "white",
          border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer",
        }}
      >
        Submit an initiative <ArrowRight size={16} />
      </button>
    </div>
  );
}

function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", type: "", description: "", province: "", city: "",
    industries: "", frequency: "", url: "", cost: "", format: "", contact: "",
  });
  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const fieldStyle = {
    width: "100%", padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: 10,
    fontSize: 14, color: "#1e293b", outline: "none", transition: "border-color 0.15s",
    boxSizing: "border-box", fontFamily: "inherit",
  };
  if (submitted) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Thanks for your submission!</h2>
        <p style={{ fontSize: 16, color: "#64748b", marginBottom: 32 }}>We'll review your initiative and add it to the directory within a week.</p>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px 80px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Submit an initiative</h1>
      <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32 }}>Help us grow the directory. Fill in the details below and we'll review your submission.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {[
          { key: "name", label: "Initiative name", placeholder: "e.g. Amsterdam Founder Breakfast" },
          { key: "type", label: "Type", placeholder: "e.g. Accelerator, Incubator, Community" },
          { key: "description", label: "Description", placeholder: "What is this initiative about?", textarea: true },
          { key: "province", label: "Province", placeholder: "e.g. Noord-Holland" },
          { key: "city", label: "City", placeholder: "e.g. Amsterdam" },
          { key: "industries", label: "Industries (comma-separated)", placeholder: "e.g. Tech, AI, Fintech" },
          { key: "frequency", label: "Frequency", placeholder: "e.g. Weekly, Monthly, Annual" },
          { key: "url", label: "Website URL", placeholder: "https://..." },
          { key: "cost", label: "Cost", placeholder: "e.g. Free, €50/month, Equity-based" },
          { key: "format", label: "Format", placeholder: "In-person, Online, or Hybrid" },
          { key: "contact", label: "Your email", placeholder: "so we can reach you if needed" },
        ].map(f => (
          <div key={f.key}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>{f.label}</label>
            {f.textarea ? (
              <textarea value={form[f.key]} onChange={e => update(f.key, e.target.value)}
                placeholder={f.placeholder} rows={3} style={{ ...fieldStyle, resize: "vertical" }}
                onFocus={e => e.target.style.borderColor = "#4f6df5"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            ) : (
              <input value={form[f.key]} onChange={e => update(f.key, e.target.value)}
                placeholder={f.placeholder} style={fieldStyle}
                onFocus={e => e.target.style.borderColor = "#4f6df5"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            )}
          </div>
        ))}
        <button onClick={() => setSubmitted(true)} style={{
          padding: "14px 28px", background: "#4f6df5", color: "white", border: "none",
          borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 8,
        }}>
          Submit for review
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [directoryFilters, setDirectoryFilters] = useState({});

  const navigate = (p, filters) => {
    setPage(p);
    if (filters) setDirectoryFilters(filters);
    else setDirectoryFilters({});
    window.scrollTo(0, 0);
  };

  const navLinkStyle = (active) => ({
    background: "none", border: "none", cursor: "pointer",
    fontSize: 14, fontWeight: active ? 600 : 400,
    color: active ? "#4f6df5" : "#64748b",
    padding: "8px 4px",
    borderBottom: active ? "2px solid #4f6df5" : "2px solid transparent",
    transition: "all 0.15s",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <nav style={{
        background: "white", borderBottom: "1px solid #e8ecf2", padding: "0 24px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 56,
        }}>
          <button onClick={() => navigate("home")} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 17, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 13 }}>🇳🇱</span> FounderHub NL
          </button>
          <div style={{ display: "flex", gap: 24 }}>
            <button onClick={() => navigate("home")} style={navLinkStyle(page === "home")}>Home</button>
            <button onClick={() => navigate("directory")} style={navLinkStyle(page === "directory")}>Directory</button>
            <button onClick={() => navigate("about")} style={navLinkStyle(page === "about")}>About</button>
            <button onClick={() => navigate("submit")} style={navLinkStyle(page === "submit")}>Submit</button>
          </div>
        </div>
      </nav>

      {page === "home" && <HomePage onNavigate={navigate} />}
      {page === "directory" && <DirectoryPage key={JSON.stringify(directoryFilters)} initialFilters={directoryFilters} />}
      {page === "about" && <AboutPage onNavigate={navigate} />}
      {page === "submit" && <SubmitPage />}

      <footer style={{ background: "#1e293b", padding: "40px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 8px" }}>
          FounderHub NL — Connecting Dutch founders across all 12 provinces
        </p>
        <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
          {INITIATIVES.length} initiatives and counting. Data powered by community research and the Zuid-Holland ecosystem database.
        </p>
      </footer>
    </div>
  );
}
