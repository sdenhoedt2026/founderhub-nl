import { useState, useMemo, useEffect, createContext, useContext } from "react";
import { Search, MapPin, Building2, ExternalLink, Filter, X, ChevronDown, Users, Mic, Rocket, Globe, ArrowRight, Tag, Briefcase, Lightbulb, Lock, DollarSign } from "lucide-react";
import { supabase } from "./lib/supabase.js";
import ClaimModal from "./components/ClaimModal.jsx";

export const InitiativesContext = createContext([]);

// ─── FALLBACK DATA (used before Supabase loads) ──────────────────────────────
const FALLBACK_INITIATIVES = [
  { id: 1, name: "Circular Factory", type: "Accelerator", secondaryType: "", url: "https://www.circular-factory.com", organization: "Circular Factory", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 2, name: "EIT Health", type: "Accelerator", secondaryType: "", url: "https://eithealth.eu", organization: "EIT Health", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 3, name: "PortXL", type: "Accelerator", secondaryType: "", url: "https://www.portxl.org", organization: "PortXL", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 4, name: "Mobility Lab", type: "Accelerator", secondaryType: "", url: "https://mobilitylab.nl/", organization: "Mobility Lab", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 5, name: "ScaleNL", type: "Accelerator", secondaryType: "", url: "https://scalenl.com/", organization: "ScaleNL", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 6, name: "Yes!Delft", type: "Accelerator", secondaryType: "Incubator", url: "https://www.yesdelft.com", organization: "Yes!Delft", access: "Application required", cost: "Paid", notes: "Offers both incubation and acceleration programs", province: "", city: "", industries: [], format: "" },
  { id: 7, name: "BlueCity", type: "Incubator", secondaryType: "Campus / Coworking", url: "https://www.bluecity.nl", organization: "BlueCity", access: "Application required", cost: "Paid", notes: "Physical workspace in former Tropicana swimming pool; also open as event/meeting venue", province: "", city: "", industries: [], format: "" },
  { id: 8, name: "Forward Incubator", type: "Incubator", secondaryType: "", url: "https://www.newcomersforward.com/", organization: "Forward·Inc", access: "Application required", cost: "Free", notes: "Focused on entrepreneurs with newcomer/refugee background; based at CIC Rotterdam", province: "", city: "", industries: [], format: "" },
  { id: 9, name: "Hortiheroes", type: "Incubator", secondaryType: "", url: "https://hortiheroes.com/", organization: "Hortiheroes", access: "Application required", cost: "Free", notes: "Based at World Horti Center, Naaldwijk", province: "", city: "", industries: [], format: "" },
  { id: 10, name: "PLNT", type: "Incubator", secondaryType: "Campus / Coworking", url: "https://www.plnt.nl", organization: "PLNT", access: "Application required", cost: "Paid", notes: "Also a campus with open coworking memberships", province: "", city: "", industries: [], format: "" },
  { id: 11, name: "Biotech Campus Delft", type: "Campus / Coworking", secondaryType: "", url: "https://www.biotechcampusdelft.com", organization: "Biotech Campus Delft", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 12, name: "Leiden Bio Science Park", type: "Campus / Coworking", secondaryType: "", url: "https://leidenbiosciencepark.nl/", organization: "Leiden Bio Science Park", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 13, name: "Rotterdam Square", type: "Campus / Coworking", secondaryType: "", url: "https://www.rotterdamsquare.nl", organization: "Rotterdam Square", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 14, name: "Space Campus", type: "Campus / Coworking", secondaryType: "", url: "https://www.nlspacecampus.eu/", organization: "Space Campus", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 15, name: "TU Delft Campus", type: "Campus / Coworking", secondaryType: "", url: "https://www.tudelftcampus.nl", organization: "TU Delft Campus", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 16, name: "Unmanned Valley", type: "Campus / Coworking", secondaryType: "", url: "https://unmannedvalley.nl/home/", organization: "Unmanned Valley", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 17, name: "The Green Village", type: "Campus / Coworking", secondaryType: "Support Program", url: "https://www.thegreenvillage.org", organization: "The Green Village", access: "Application required", cost: "Free", notes: "Innovation fieldlab at TU Delft for testing sustainable solutions", province: "", city: "", industries: [], format: "" },
  { id: 18, name: "42Workspace", type: "Campus / Coworking", secondaryType: "", url: "https://42workspace.com", organization: "42Workspace", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 19, name: "Aerospace Innovation Hub", type: "Campus / Coworking", secondaryType: "", url: "https://aerospaceinnovationhub.nl/", organization: "Aerospace Innovation Hub", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 20, name: "Apollo14", type: "Campus / Coworking", secondaryType: "", url: "https://www.apollo14.nl", organization: "Apollo14", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 21, name: "Biopartner", type: "Campus / Coworking", secondaryType: "", url: "https://www.biopartnerleiden.nl/", organization: "Biopartner", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 22, name: "Buccaneer Delft", type: "Campus / Coworking", secondaryType: "", url: "https://www.buccaneerdelft.com", organization: "Buccaneer Delft", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 23, name: "Caballerofabriek", type: "Campus / Coworking", secondaryType: "", url: "https://www.caballerofabriek.nl", organization: "Caballerofabriek", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 24, name: "Campus@Sea", type: "Campus / Coworking", secondaryType: "", url: "https://www.campusatsea.nl", organization: "Campus@Sea", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 25, name: "CIC Rotterdam", type: "Campus / Coworking", secondaryType: "", url: "https://cic.com/rotterdam", organization: "CIC Rotterdam", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 26, name: "Dutch Innovation Factory", type: "Campus / Coworking", secondaryType: "", url: "https://community.dutchinnovationpark.nl/nl/", organization: "Dutch Innovation Factory", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 27, name: "Duurzaamheidsfabriek", type: "Campus / Coworking", secondaryType: "", url: "https://www.duurzaamheidsfabriek.nl", organization: "Duurzaamheidsfabriek", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 28, name: "Groothandelsgebouw", type: "Campus / Coworking", secondaryType: "", url: "https://www.groothandelsgebouw.nl", organization: "Groothandelsgebouw", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 29, name: "House of Quantum", type: "Campus / Coworking", secondaryType: "", url: "https://www.houseofquantum.com/", organization: "House of Quantum", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 30, name: "Katoenhuis", type: "Campus / Coworking", secondaryType: "Community / Network", url: "https://www.katoenhuis.nl/", organization: "Katoenhuis", access: "Open to all", cost: "Paid", notes: "Also serves as physical hub for SHINE immersive tech network", province: "", city: "", industries: [], format: "" },
  { id: 31, name: "Keilewerf", type: "Campus / Coworking", secondaryType: "", url: "https://www.keilewerf.nl", organization: "Keilewerf", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 32, name: "LaatBloeien", type: "Campus / Coworking", secondaryType: "", url: "https://www.laatbloeien.nl", organization: "LaatBloeien", access: "Open to all", cost: "Paid", notes: "Impact-focused coworking at Hofplein Rotterdam", province: "", city: "", industries: [], format: "" },
  { id: 33, name: "Microlab", type: "Campus / Coworking", secondaryType: "", url: "https://www.microlab.nl", organization: "Microlab", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 34, name: "NEXT Delft", type: "Campus / Coworking", secondaryType: "", url: "https://www.nextdelft.nl", organization: "NEXT Delft", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 35, name: "ONS Schiedam", type: "Campus / Coworking", secondaryType: "", url: "https://www.onsschiedam.nl", organization: "ONS Schiedam", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 36, name: "Planet b.io", type: "Campus / Coworking", secondaryType: "", url: "https://www.planet-b.io", organization: "Planet b.io", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 37, name: "Plant One", type: "Campus / Coworking", secondaryType: "", url: "https://www.plantone.nl", organization: "Plant One", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 38, name: "Platform Zero", type: "Campus / Coworking", secondaryType: "", url: "https://www.platformzero.co", organization: "Platform Zero", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 39, name: "Progress Bar", type: "Campus / Coworking", secondaryType: "", url: "https://www.progressbar.nl", organization: "Progress Bar", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 40, name: "RDM Campus", type: "Campus / Coworking", secondaryType: "", url: "https://www.rdmrotterdam.nl", organization: "RDM Campus", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 41, name: "Robohouse (TU Delft)", type: "Campus / Coworking", secondaryType: "", url: "https://www.robohouse.nl", organization: "Robohouse", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 42, name: "Rotterdam Science Tower", type: "Campus / Coworking", secondaryType: "", url: "https://www.rotterdamsciencetower.nl", organization: "Rotterdam Science Tower", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 43, name: "Space Business Innovation Centre Noordwijk", type: "Campus / Coworking", secondaryType: "", url: "https://www.sbicnoordwijk.nl/startup-hub/", organization: "SBIC Noordwijk", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 44, name: "The Hague Tech", type: "Campus / Coworking", secondaryType: "", url: "https://www.thehaguetech.com/", organization: "The Hague Tech", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 45, name: "The Social Hub", type: "Campus / Coworking", secondaryType: "", url: "https://www.thesocialhub.co", organization: "The Social Hub", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 46, name: "Titaan / Unknown Spaces", type: "Campus / Coworking", secondaryType: "", url: "https://titaan.unknown-spaces.com/", organization: "Titaan", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 47, name: "Workspot", type: "Campus / Coworking", secondaryType: "", url: "https://workspot.nu/", organization: "Workspot", access: "Open to all", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 48, name: "Up!Rotterdam", type: "Community / Network", secondaryType: "", url: "http://www.uprotterdam.com/", organization: "Up!Rotterdam", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 49, name: "Greenport West Holland", type: "Community / Network", secondaryType: "", url: "https://greenportwestholland.nl/", organization: "Greenport West Holland", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 50, name: "Hague Security Delta", type: "Community / Network", secondaryType: "", url: "https://www.securitydelta.nl", organization: "Hague Security Delta", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 51, name: "Incubators United", type: "Community / Network", secondaryType: "", url: "https://www.incubatorsunited.com/", organization: "Incubators United", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 52, name: "iTanks", type: "Community / Network", secondaryType: "", url: "https://www.itanks.eu", organization: "iTanks", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 53, name: "Medical Delta", type: "Community / Network", secondaryType: "", url: "https://www.medicaldelta.nl/", organization: "Medical Delta", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 54, name: "North Sea Farmers", type: "Community / Network", secondaryType: "", url: "https://www.northseafarmers.org/", organization: "North Sea Farmers", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 55, name: "Noorderwind", type: "Community / Network", secondaryType: "", url: "https://www.noorderwind.co/", organization: "Noorderwind", access: "Application required", cost: "Free", notes: "Sustainable startup support collective", province: "", city: "", industries: [], format: "" },
  { id: 56, name: "Protein Port", type: "Community / Network", secondaryType: "", url: "https://www.proteinport.com/", organization: "Protein Port", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 57, name: "Quantum Delta", type: "Community / Network", secondaryType: "", url: "https://www.quantumdelta.nl", organization: "Quantum Delta", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 58, name: "Rotterdam Partners", type: "Community / Network", secondaryType: "", url: "https://www.rotterdampartners.nl", organization: "Rotterdam Partners", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 59, name: "SHINE", type: "Community / Network", secondaryType: "", url: "https://www.katoenhuis.nl/", organization: "SHINE / Katoenhuis", access: "Application required", cost: "Free", notes: "Network for immersive tech (VR/AR/MR); physical hub at Katoenhuis Rotterdam", province: "", city: "", industries: [], format: "" },
  { id: 60, name: "Startup Grind Rotterdam", type: "Community / Network", secondaryType: "Event", url: "https://www.startupgrind.com/rotterdam/", organization: "Startup Grind", access: "Open to all", cost: "Free", notes: "Also organises regular events and meetups", province: "", city: "", industries: [], format: "" },
  { id: 61, name: "Techleap", type: "Community / Network", secondaryType: "", url: "https://techleap.nl", organization: "Techleap", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 62, name: "Unify Energy", type: "Community / Network", secondaryType: "", url: "https://www.unify.energy/community-1", organization: "Unify Energy", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 63, name: "Voorgoed Agency", type: "Community / Network", secondaryType: "", url: "https://www.voorgoedagency.nl/", organization: "Voorgoed Agency", access: "Open to all", cost: "Free", notes: "Focus on social entrepreneurship in Rotterdam", province: "", city: "", industries: [], format: "" },
  { id: 64, name: "ImpactCity the Hague", type: "Community / Network", secondaryType: "", url: "https://www.impactcity.nl", organization: "ImpactCity", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 65, name: "ScaleBooster", type: "Support Program", secondaryType: "", url: "https://www.scalebooster.nl", organization: "ScaleBooster", access: "Application required", cost: "Free", notes: "Zoetermeer-based growth program; runs ELITE accelerator track from March 2025", province: "", city: "", industries: [], format: "" },
  { id: 66, name: "The Hague & Partners", type: "Support Program", secondaryType: "", url: "https://thehague.com/partners/nl", organization: "The Hague & Partners", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 67, name: "HortiTech", type: "Support Program", secondaryType: "", url: "https://horti-tech.com/", organization: "HortiTech", access: "Application required", cost: "Paid", notes: "R&D and education consultancy for greenhouse horticulture", province: "", city: "", industries: [], format: "" },
  { id: 68, name: "Accelerator Program", type: "Accelerator", secondaryType: "", url: "https://yesdelft.com/services/accelerator-program/", organization: "Yes!Delft", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 69, name: "AI Validation & Acceleration", type: "Accelerator", secondaryType: "", url: "https://mondai.tudelftcampus.nl/en/", organization: "Yes!Delft", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 70, name: "Cyber Security Validation & Acceleration", type: "Accelerator", secondaryType: "", url: "https://yesdelft.com/events/cybersecurity/", organization: "Yes!Delft", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 71, name: "ELITTE", type: "Accelerator", secondaryType: "", url: "https://www.ece.nl/scaleup-programmas/", organization: "ECE", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 72, name: "Globaliser Program", type: "Accelerator", secondaryType: "", url: "https://dutchbasecamp.org/", organization: "DutchBasecamp", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 73, name: "Green Chemistry Accelerator", type: "Accelerator", secondaryType: "", url: "https://groenechemie.nl/nl/green-chemistry-accelerator", organization: "Innovation Quarter", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 74, name: "Health Tech Accelerator", type: "Accelerator", secondaryType: "", url: "https://www.innovationquarter.nl/health-tech-accelerator-2024-afgetrapt/", organization: "Innovation Quarter", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 75, name: "Hortiscience Validation & Acceleration", type: "Accelerator", secondaryType: "", url: "https://hiceu.com/en/", organization: "Yes!Delft", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 76, name: "Ignition Programme", type: "Accelerator", secondaryType: "", url: "https://www.sbicnoordwijk.nl/ignition-programme/", organization: "SBIC Noordwijk", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 77, name: "Maritime Accelerator", type: "Accelerator", secondaryType: "", url: "https://portxl.org/about-us/why-join-portxl/", organization: "PortXL", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 78, name: "Maritime Validation & Acceleration", type: "Accelerator", secondaryType: "", url: "https://yesdelft.com/events/maritime-industry-innovation-challenge/", organization: "Yes!Delft", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 79, name: "MedTech Validation & Acceleration", type: "Accelerator", secondaryType: "", url: "https://yesdelft.com/events/validation-program-for-med-tech-startups/", organization: "Yes!Delft", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 80, name: "New Energy Validation & Acceleration", type: "Accelerator", secondaryType: "", url: "https://newenergychallenge.com/", organization: "Yes!Delft", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 81, name: "Pole Position Program", type: "Accelerator", secondaryType: "", url: "https://techleap.nl/programmes/pole-position/", organization: "Techleap", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 82, name: "Rise Program", type: "Accelerator", secondaryType: "", url: "https://scaleups.techleap.nl/offer/rise", organization: "Techleap", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 83, name: "Shine Program", type: "Accelerator", secondaryType: "", url: "https://scaleups.techleap.nl/offer/shine", organization: "Techleap", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 84, name: "Soft Landing", type: "Accelerator", secondaryType: "", url: "https://www.sbicnoordwijk.nl/soft-landing-programme/", organization: "SBIC Noordwijk", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 85, name: "Start Up & Lift Off", type: "Accelerator", secondaryType: "", url: "https://unmannedvalley.nl/su-lo/", organization: "Unmanned Valley", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 86, name: "Startup in Residence", type: "Accelerator", secondaryType: "", url: "https://intergov.startupinresidence.com/", organization: "Provincie Zuid Holland", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 87, name: "US Fasttrack", type: "Accelerator", secondaryType: "", url: "https://scalenl.com/programs/", organization: "ScaleNL", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 88, name: "Validation Program", type: "Accelerator", secondaryType: "", url: "https://yesdelft.com/services/validation-lab/", organization: "Yes!Delft", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 89, name: "Cyber Security Incubatieprogramma", type: "Incubator", secondaryType: "", url: "https://yesdelft.com/", organization: "Yes!Delft", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 90, name: "ESA BIC Noordwijk", type: "Incubator", secondaryType: "", url: "https://www.sbicnoordwijk.nl/esa-bic/", organization: "SBIC Noordwijk", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 91, name: "unlock_incubation", type: "Incubator", secondaryType: "", url: "https://plnt.nl/en/programs/unlock-incubation/", organization: "PLNT", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 92, name: "Infinity", type: "Community / Network", secondaryType: "", url: "https://www.infinityqd.nl/", organization: "Quantum Delta", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 93, name: "Planet B.io Community Program", type: "Community / Network", secondaryType: "", url: "https://www.planet-b.io/community/", organization: "Planet b.io", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 94, name: "Smart Hydrogen Hub", type: "Community / Network", secondaryType: "", url: "https://www.rotterdammaritimecapital.com/news/we-are-building-the-smart-hydrogen-hub-for-and-with-m4h", organization: "Provincie Zuid Holland", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 95, name: "WEC 500 Startup Community", type: "Community / Network", secondaryType: "", url: "https://platformzero.co/pz-events/", organization: "Platform Zero", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 96, name: "ACCEZ voor innovators en leiders in (glas)tuinbouw", type: "Support Program", secondaryType: "", url: "https://accez.nl", organization: "ECE / Provincie Zuid Holland", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 97, name: "Biotech Training Facility", type: "Support Program", secondaryType: "", url: "https://biotechtrainingfacility.com/en", organization: "Leiden Bio Science Park", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 98, name: "Business Innovation Program Food", type: "Support Program", secondaryType: "", url: "https://www.businessinnovationprogramfood.nl/151211", organization: "Innovation Quarter", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 99, name: "CIRCO - Circular Design Tracks", type: "Support Program", secondaryType: "", url: "https://www.bluecity.nl/zakelijke-programma-s/circo-tracks", organization: "BlueCity", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 100, name: "Circulair Loket", type: "Support Program", secondaryType: "", url: "https://www.bluecity.nl/zakelijke-programma-s/circulair-loket", organization: "BlueCity", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 101, name: "Circulaire Ketenprojecten", type: "Support Program", secondaryType: "", url: "https://www.bluecity.nl/zakelijke-programma-s/circulaire-ketenprojecten", organization: "BlueCity", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 102, name: "Circular Ideation Lab", type: "Support Program", secondaryType: "", url: "https://www.bluecity.nl/zakelijke-programma-s/circular-ideation-lab", organization: "BlueCity", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 103, name: "Climate Tech Scale-up Support", type: "Support Program", secondaryType: "", url: "", organization: "Provincie Zuid Holland", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 104, name: "Dutch New Narrative Lab", type: "Support Program", secondaryType: "", url: "https://www.dnnl.org", organization: "ECE", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 105, name: "Energie Financieringsdesk TKI", type: "Support Program", secondaryType: "", url: "https://topsectorenergie.nl/nl/subsidiemogelijkheden/financieringsloket/", organization: "Provincie Zuid Holland", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 106, name: "ESA Technology Broker NL", type: "Support Program", secondaryType: "", url: "https://www.esa-technology-broker.nl/", organization: "SBIC / Space Campus", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 107, name: "European Scaleup Institute", type: "Support Program", secondaryType: "", url: "https://scaleupinstitute.eu/", organization: "ECE", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 108, name: "Het Groeicollege", type: "Support Program", secondaryType: "", url: "https://www.ece.nl/scaleup-programmas/", organization: "ECE", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 109, name: "Impact Studio", type: "Support Program", secondaryType: "", url: "https://www.tudelft.nl/innovatie-impact/ondernemerschap/impact-studio", organization: "TU Delft", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 110, name: "Investor Matching", type: "Support Program", secondaryType: "", url: "https://www.rotterdaminnovationcity.com/get-access-to/capital/phx/", organization: "Up!Rotterdam", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 111, name: "Market Readiness Program", type: "Support Program", secondaryType: "", url: "https://www.innovationquarter.nl/item/market-readiness-program/", organization: "Innovation Quarter", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 112, name: "Nieuwe Nassen", type: "Support Program", secondaryType: "", url: "https://www.bluecity.nl/zakelijke-programma-s/het-nieuwe-nassen", organization: "BlueCity", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 113, name: "Orchestrating Innovation in Public & Private Ecosystems", type: "Support Program", secondaryType: "", url: "https://uploads.ece.nl/pdf/ECE_Brochure_OI_2024_ENG.pdf", organization: "ECE / TNO", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 114, name: "Programma Energie & Klimaat", type: "Support Program", secondaryType: "", url: "https://www.innovationquarter.nl/item/energie-en-klimaat/", organization: "Provincie Zuid Holland", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 115, name: "Programma Zorgtech", type: "Support Program", secondaryType: "", url: "https://www.innovationquarter.nl/item/zorgtech/", organization: "Provincie Zuid Holland", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 116, name: "Ready to Start", type: "Support Program", secondaryType: "", url: "https://plnt.nl/en/programs/ready-to-start/", organization: "PLNT", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 117, name: "Smart Energy Systems", type: "Support Program", secondaryType: "", url: "https://www.ondernemen010.nl/smart-energy-systems/", organization: "Gemeente Rotterdam", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 118, name: "Startup Missies", type: "Support Program", secondaryType: "", url: "https://english.rvo.nl/topics/starten-op-buitenlandse-markten/start-ups", organization: "RVO / Up!Rotterdam", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 119, name: "Startup Visa Softlanding", type: "Support Program", secondaryType: "", url: "https://www.startupvisa.nl/", organization: "CIC Rotterdam / 42Workspace / ECE", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 120, name: "Student Founder Programme", type: "Support Program", secondaryType: "", url: "https://ecestudents.nl/student-founders-programme/", organization: "ECE", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 121, name: "TNO Fasttrack", type: "Support Program", secondaryType: "", url: "https://fasttrack.tno.nl/", organization: "TNO", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 122, name: "TNO Tech Transfer", type: "Support Program", secondaryType: "", url: "https://www.tno.nl/en/collaboration/tech-transfer/", organization: "TNO", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 123, name: "TU Delft Startup Voucher Programme", type: "Support Program", secondaryType: "", url: "https://www.tudelftcampus.nl/entrepreneurship/tu-delft-startup-voucher-programme/", organization: "TU Delft", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 124, name: "Innovatieprogramma Zorgtech", type: "Support Program", secondaryType: "", url: "https://www.medicaldelta.nl/samenwerkingen/innovatieprogramma-zorgtech", organization: "Medical Delta", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 125, name: "Meet your Co-founder", type: "Support Program", secondaryType: "", url: "https://yesdelft.com/services/meet-your-co-founder/", organization: "Yes!Delft", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 126, name: "Meet your Co-founder XL", type: "Support Program", secondaryType: "", url: "https://www.incubatorsunited.com/", organization: "Incubators United", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 127, name: "Maritime Investment Program", type: "Support Program", secondaryType: "", url: "", organization: "Platform Zero", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 128, name: "Campus Regeling Zuid Holland", type: "Support Program", secondaryType: "", url: "https://www.zuid-holland.nl/online-regelen/subsidies/subsidies/campussen-subsidie/", organization: "Provincie Zuid Holland", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 129, name: "Bakkie Impact", type: "Event", secondaryType: "", url: "https://www.voorgoedagency.nl/bakkie-impact-opstroopsessie/", organization: "Voorgoed Agency", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 130, name: "CEO Dinners", type: "Event", secondaryType: "", url: "https://founderskeepers.io/", organization: "Up!Rotterdam", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 131, name: "Championing Innovation in Turbulent Times", type: "Event", secondaryType: "", url: "https://form.typeform.com/to/Yl59WbfA", organization: "ECE", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 132, name: "Circular Challenge", type: "Event", secondaryType: "", url: "https://www.bluecity.nl/zakelijke-programma-s/circular-challenge", organization: "BlueCity", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 133, name: "CXO Deepdives", type: "Event", secondaryType: "", url: "https://founderskeepers.io/", organization: "Up!Rotterdam", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 134, name: "Erasmus University Challenge", type: "Event", secondaryType: "", url: "https://erasmusuniversitychallenge.nl/", organization: "Erasmus Enterprise", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 135, name: "Expert Sessies", type: "Event", secondaryType: "", url: "https://buccaneerdelft.com/events/", organization: "Buccaneer Delft", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 136, name: "Festival van de Toekomst", type: "Event", secondaryType: "", url: "https://www.festivalvandetoekomst.nl/", organization: "Provincie Zuid Holland", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 137, name: "Founders Diner (BlueCity)", type: "Event", secondaryType: "", url: "", organization: "BlueCity", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 138, name: "Founders Dinners", type: "Event", secondaryType: "", url: "https://titaan.unknown-spaces.com/events/", organization: "Titaan / Unknown Campus", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 139, name: "Fuckup Nights", type: "Event", secondaryType: "", url: "https://www.bluecity.nl/fuckup-nights-rotterdam", organization: "BlueCity", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 140, name: "Hackathons", type: "Event", secondaryType: "", url: "https://www.bluecity.nl/zakelijke-programma-s/hackathons", organization: "BlueCity", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 141, name: "Hortiheroes Hackathon", type: "Event", secondaryType: "", url: "https://hortiheroes.com/career/hortiheroes-hackathon/", organization: "Hortiheroes", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 142, name: "Hydrogen Innovation Community Events", type: "Event", secondaryType: "", url: "", organization: "Provincie Zuid Holland", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 143, name: "Impact Fest", type: "Event", secondaryType: "", url: "https://www.impactfest.nl/", organization: "ImpactCity the Hague", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 144, name: "LSH Breakfast", type: "Event", secondaryType: "", url: "https://rotterdamsquare.nl/", organization: "Rotterdam Square", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 145, name: "Monthly Climate Tech Community Sessions", type: "Event", secondaryType: "", url: "https://platformzero.co/pz-events/", organization: "Platform Zero", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 146, name: "Monthly Meetup", type: "Event", secondaryType: "", url: "https://cic.com/attend-an-event/", organization: "CIC Rotterdam", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 147, name: "NL Space Campus Network & Drinks", type: "Event", secondaryType: "", url: "https://www.nlspacecampus.eu/nlspaceweek/nl-space-campus-network-drinks-xl/", organization: "Space Campus", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 148, name: "NL Space Week", type: "Event", secondaryType: "", url: "https://www.nlspacecampus.eu/nlspaceweek/", organization: "Space Campus", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 149, name: "NL Startup Competition", type: "Event", secondaryType: "", url: "https://nlstartupcompetition.com/", organization: "Erasmus Enterprise", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 150, name: "Philips Innovation Award", type: "Event", secondaryType: "", url: "https://www.phia.nl/", organization: "Philips Innovation Award", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 151, name: "PLNT Festival", type: "Event", secondaryType: "", url: "https://plnt.nl/events/", organization: "PLNT", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 152, name: "RoboCafé", type: "Event", secondaryType: "", url: "https://robohouse.nl/activities/events/robocafe-2024/", organization: "Robohouse (TU Delft)", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 153, name: "Scale-up UnConference", type: "Event", secondaryType: "", url: "https://www.tudelftcampus.nl/event/scale-up-unconference/", organization: "Yes!Delft", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 154, name: "SHE LEADS+ Annual Event", type: "Event", secondaryType: "", url: "https://www.ece.nl/she-leads/", organization: "ECE", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 155, name: "Startup Investor Dinner", type: "Event", secondaryType: "", url: "https://yesdelft.com/events/startup-investor-dinner-2025/", organization: "Yes!Delft", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 156, name: "Synergy Hackathon", type: "Event", secondaryType: "", url: "https://www.thegreenvillage.org/event/synergy-hackathon/", organization: "The Green Village", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 157, name: "TechSocial", type: "Event", secondaryType: "", url: "https://rotterdamtechsocial.com/", organization: "42Workspace / ECE / Yes!Delft", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 158, name: "Top 250 Masterclasses", type: "Event", secondaryType: "", url: "", organization: "ECE", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 159, name: "TU Delft Impact Contest", type: "Event", secondaryType: "", url: "https://tudelftcontest.nl/", organization: "TU Delft", access: "Application required", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 160, name: "Upstream Festival", type: "Event", secondaryType: "", url: "https://www.upstreamfestival.com/", organization: "Up!Rotterdam", access: "Open to all", cost: "Free", notes: "", province: "", city: "", industries: [], format: "" },
  { id: 161, name: "Photovoltaic Systems Summer School", type: "Event", secondaryType: "", url: "https://www.tudelft.nl/en/ewi/", organization: "TU Delft", access: "Application required", cost: "Paid", notes: "", province: "", city: "", industries: [], format: "" },
];

const PROVINCES = [...new Set(FALLBACK_INITIATIVES.map(i => i.province).filter(Boolean))].sort((a, b) => {
  if (a === "Nationwide") return 1;
  if (b === "Nationwide") return -1;
  return a.localeCompare(b);
});
const CITIES = [...new Set(FALLBACK_INITIATIVES.map(i => i.city).filter(Boolean))].sort((a, b) => {
  if (a === "Nationwide") return 1;
  if (b === "Nationwide") return -1;
  return a.localeCompare(b);
});
const ALL_INDUSTRIES = [...new Set(FALLBACK_INITIATIVES.flatMap(i => i.industries).filter(Boolean))].sort();
const TYPES = [...new Set(FALLBACK_INITIATIVES.map(i => i.type))].sort();
const FORMATS = [...new Set(FALLBACK_INITIATIVES.map(i => i.format).filter(Boolean))].sort();
const ACCESS_OPTIONS = ["Open to all", "Application required"];
const COST_OPTIONS = ["Free", "Paid"];

// ─── TYPE ICONS & COLORS ────────────────────────────────────────────────────
const TYPE_CONFIG = {
  "Accelerator":         { icon: Rocket,    color: "#f97316", bg: "#ffedd5" },
  "Incubator":           { icon: Lightbulb, color: "#8b5cf6", bg: "#ede9fe" },
  "Campus / Coworking":  { icon: Building2, color: "#06b6d4", bg: "#cffafe" },
  "Community / Network": { icon: Users,     color: "#3b82f6", bg: "#dbeafe" },
  "Support Program":     { icon: Briefcase, color: "#f59e0b", bg: "#fef3c7" },
  "Event":               { icon: Mic,       color: "#ef4444", bg: "#fee2e2" },
};

// ─── INDUSTRY TAGS (curated per initiative id) ───────────────────────────────
const INDUSTRY_TAGS = {
  1:   ["Circular Economy"],
  2:   ["HealthTech"],
  3:   ["Maritime"],
  4:   ["Mobility"],
  7:   ["Circular Economy"],
  8:   ["Social Impact"],
  9:   ["AgriTech"],
  11:  ["BioTech"],
  12:  ["BioTech", "HealthTech"],
  13:  ["Life Sciences"],
  14:  ["Space & Aerospace"],
  16:  ["Drones & UAV"],
  17:  ["Sustainability"],
  19:  ["Space & Aerospace"],
  21:  ["BioTech"],
  24:  ["Maritime"],
  27:  ["Sustainability"],
  29:  ["Quantum"],
  30:  ["Immersive Tech"],
  32:  ["Social Impact", "Sustainability"],
  36:  ["BioTech", "HealthTech"],
  37:  ["AgriTech"],
  38:  ["Maritime", "CleanTech"],
  40:  ["Maritime"],
  41:  ["Robotics"],
  42:  ["Life Sciences"],
  43:  ["Space & Aerospace"],
  49:  ["AgriTech"],
  50:  ["Cybersecurity"],
  52:  ["Maritime"],
  53:  ["HealthTech", "MedTech"],
  54:  ["AgriTech"],
  55:  ["Sustainability"],
  56:  ["Food & Nutrition"],
  57:  ["Quantum"],
  59:  ["Immersive Tech"],
  62:  ["Energy"],
  63:  ["Social Impact"],
  64:  ["Social Impact"],
  67:  ["AgriTech"],
  69:  ["AI"],
  70:  ["Cybersecurity"],
  73:  ["CleanTech"],
  74:  ["HealthTech"],
  75:  ["AgriTech"],
  76:  ["Space & Aerospace"],
  77:  ["Maritime"],
  78:  ["Maritime"],
  79:  ["MedTech"],
  80:  ["Energy"],
  85:  ["Drones & UAV"],
  89:  ["Cybersecurity"],
  90:  ["Space & Aerospace"],
  92:  ["Quantum"],
  93:  ["BioTech"],
  94:  ["Energy"],
  97:  ["BioTech"],
  98:  ["Food & Nutrition"],
  99:  ["Circular Economy"],
  100: ["Circular Economy"],
  101: ["Circular Economy"],
  102: ["Circular Economy"],
  106: ["Space & Aerospace"],
  112: ["Circular Economy"],
  114: ["Energy"],
  115: ["HealthTech"],
  117: ["Energy"],
  124: ["HealthTech"],
  141: ["AgriTech"],
  147: ["Space & Aerospace"],
  148: ["Space & Aerospace"],
  152: ["Robotics"],
  161: ["Energy"],
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
  const [claimOpen, setClaimOpen] = useState(false);
  const config = TYPE_CONFIG[initiative.type] || { icon: Globe, color: "#64748b", bg: "#f1f5f9" };
  const TypeIcon = config.icon;
  const accessColor = initiative.access === "Open to all" ? "#10b981" : "#f59e0b";
  const accessBg = initiative.access === "Open to all" ? "#d1fae5" : "#fef3c7";
  const industryTags = INDUSTRY_TAGS[initiative.id] || initiative.industries || [];

  const inner = (
    <div style={{
      background: "white", borderRadius: 16, padding: 0, overflow: "hidden",
      border: "1px solid #e8ecf2", height: "100%",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      transition: "all 0.2s ease", cursor: initiative.url ? "pointer" : "default",
      display: "flex", flexDirection: "column",
    }}
      onMouseEnter={e => { if (initiative.url) { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ padding: "20px 24px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px",
              background: config.bg, color: config.color, borderRadius: 20,
              fontSize: 12, fontWeight: 600, letterSpacing: "0.01em",
            }}>
              <TypeIcon size={13} /> {initiative.type}
            </span>
            {initiative.secondaryType && (
              <span style={{
                display: "inline-flex", alignItems: "center", padding: "4px 8px",
                background: "#f1f5f9", color: "#64748b", borderRadius: 20,
                fontSize: 11, fontWeight: 500,
              }}>
                {initiative.secondaryType}
              </span>
            )}
          </div>
          <span style={{
            fontSize: 11, color: accessColor, background: accessBg, padding: "3px 8px",
            borderRadius: 6, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0,
          }}>
            {initiative.access === "Open to all" ? "✓ Open to all" : "Application required"}
          </span>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 4px", lineHeight: 1.3 }}>
          {initiative.name}
        </h3>
        {initiative.organization && (
          <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "0 0 8px", fontWeight: 500 }}>
            {initiative.organization}
          </p>
        )}
        {industryTags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
            {industryTags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 500, padding: "2px 8px",
                background: "#f1f5f9", color: "#475569", borderRadius: 6,
              }}>{tag}</span>
            ))}
          </div>
        )}
        {initiative.notes ? (
          <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {initiative.notes}
          </p>
        ) : null}
      </div>
      <div style={{ padding: "0 24px 16px", marginTop: "auto" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: 12, borderTop: "1px solid #f1f5f9",
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: initiative.cost === "Free" ? "#10b981" : "#64748b" }}>
            {initiative.cost}
          </span>
          {initiative.url && <ExternalLink size={14} style={{ color: "#94a3b8" }} />}
        </div>
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); setClaimOpen(true); }}
          style={{
            marginTop: 10, width: "100%", padding: "7px 0",
            background: "none", border: "1px solid #e2e8f0", borderRadius: 8,
            fontSize: 12, color: "#94a3b8", cursor: "pointer", fontWeight: 500,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#4f6df5"; e.currentTarget.style.color = "#4f6df5"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; }}
        >
          Claim this listing
        </button>
      </div>
    </div>
  );

  if (!initiative.url) return (
    <>
      <div style={{ height: "100%" }}>{inner}</div>
      {claimOpen && <ClaimModal initiative={initiative} onClose={() => setClaimOpen(false)} />}
    </>
  );
  return (
    <>
      <a href={initiative.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
        {inner}
      </a>
      {claimOpen && <ClaimModal initiative={initiative} onClose={() => setClaimOpen(false)} />}
    </>
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
  const initiatives = useContext(InitiativesContext);
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
            Discover {initiatives.length} accelerators, incubators, campuses, communities, programs, and events across the Netherlands.
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
          <StatCard label="Initiatives" value={initiatives.length} icon={Rocket} />
          <StatCard label="Locations" value={initiatives.filter(i => i.type === "Campus / Coworking").length} icon={Building2} />
          <StatCard label="Events" value={initiatives.filter(i => i.type === "Event").length} icon={Mic} />
          <StatCard label="Communities" value={initiatives.filter(i => i.type === "Community / Network").length} icon={Users} />
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "48px auto", padding: "0 24px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Browse by type</h2>
        <p style={{ fontSize: 15, color: "#64748b", marginBottom: 24 }}>Find the right format for how you like to connect.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
            const Icon = cfg.icon;
            const count = initiatives.filter(i => i.type === type).length;
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

      {PROVINCES.length > 0 && (
        <div style={{ maxWidth: 960, margin: "48px auto 64px", padding: "0 24px" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>By province</h2>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 24 }}>See what's happening near you.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PROVINCES.map(p => {
              const count = initiatives.filter(i => i.province === p).length;
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
      )}
    </div>
  );
}

function DirectoryPage({ initialFilters }) {
  const initiatives = useContext(InitiativesContext);
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState(initialFilters?.province || "");
  const [city, setCity] = useState(initialFilters?.city || "");
  const [industry, setIndustry] = useState(initialFilters?.industry || "");
  const [type, setType] = useState(initialFilters?.type || "");
  const [format, setFormat] = useState(initialFilters?.format || "");
  const [access, setAccess] = useState(initialFilters?.access || "");
  const [cost, setCost] = useState(initialFilters?.cost || "");

  const filteredCities = useMemo(() => {
    if (!province) return CITIES;
    return [...new Set(initiatives.filter(i => i.province === province).map(i => i.city))].sort();
  }, [province, initiatives]);

  useEffect(() => {
    if (province && city) {
      const validCities = initiatives.filter(i => i.province === province).map(i => i.city);
      if (!validCities.includes(city)) setCity("");
    }
  }, [province, initiatives]);

  const filtered = useMemo(() => {
    return initiatives.filter(i => {
      if (search) {
        const s = search.toLowerCase();
        if (
          !i.name.toLowerCase().includes(s) &&
          !i.organization.toLowerCase().includes(s) &&
          !i.notes.toLowerCase().includes(s) &&
          !i.type.toLowerCase().includes(s) &&
          !(i.city && i.city.toLowerCase().includes(s))
        ) return false;
      }
      if (province && i.province !== province) return false;
      if (city && i.city !== city) return false;
      if (industry && !i.industries.includes(industry)) return false;
      if (type && i.type !== type) return false;
      if (format && i.format !== format) return false;
      if (access && i.access !== access) return false;
      if (cost && i.cost !== cost) return false;
      return true;
    });
  }, [search, province, city, industry, type, format, access, cost]);

  const activeFilters = [province, city, industry, type, format, access, cost].filter(Boolean).length;
  const clearAll = () => { setProvince(""); setCity(""); setIndustry(""); setType(""); setFormat(""); setAccess(""); setCost(""); setSearch(""); };

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
            type="text" placeholder="Search by name or organization..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", width: "100%", fontSize: 14, color: "#1e293b", background: "transparent" }}
          />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={16} style={{ color: "#94a3b8" }} /></button>}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32, alignItems: "center" }}>
        <Filter size={16} style={{ color: "#94a3b8" }} />
        <FilterDropdown icon={Users} options={TYPES} value={type} onChange={setType} placeholder="Type" />
        <FilterDropdown icon={Lock} options={ACCESS_OPTIONS} value={access} onChange={setAccess} placeholder="Access" />
        <FilterDropdown icon={DollarSign} options={COST_OPTIONS} value={cost} onChange={setCost} placeholder="Cost" />
        {PROVINCES.length > 0 && <FilterDropdown icon={MapPin} options={PROVINCES} value={province} onChange={setProvince} placeholder="Province" />}
        {CITIES.length > 0 && <FilterDropdown icon={Building2} options={filteredCities} value={city} onChange={setCity} placeholder="City" />}
        {ALL_INDUSTRIES.length > 0 && <FilterDropdown icon={Tag} options={ALL_INDUSTRIES} value={industry} onChange={setIndustry} placeholder="Industry" />}
        {FORMATS.length > 0 && <FilterDropdown icon={Globe} options={FORMATS} value={format} onChange={setFormat} placeholder="Format" />}
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
        We list accelerators, incubators, campuses, communities, support programs, and events — from Groningen to Maastricht and everywhere in between. Whether you're a first-time founder or a serial entrepreneur, there's something here for you.
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>How the data works</h2>
      <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 24 }}>
        All initiatives are manually curated and verified against organization websites. Data is sourced from the official regional startup ecosystem databases across the Netherlands.
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
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Submit an initiative</h1>
      <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 32 }}>
        Know of a founder initiative that should be in our directory? Fill out the form below and we'll review your submission within a week. Approved initiatives are added to the site on a rolling basis.
      </p>
      <div style={{
        background: "white", borderRadius: 16, border: "1px solid #e8ecf2",
        overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeCNUaWeaEqnVlxe5r4EH8fn_i4kNenTvKDpOX2CUGY-Oux7w/viewform?embedded=true"
          width="100%"
          height="1200"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          style={{ display: "block" }}
        >
          Loading form...
        </iframe>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [directoryFilters, setDirectoryFilters] = useState({});
  const [initiatives, setInitiatives] = useState(FALLBACK_INITIATIVES);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("initiatives")
      .select("*")
      .order("id")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setInitiatives(data);
      });
  }, []);

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
    <InitiativesContext.Provider value={initiatives}>
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
          FounderHub NL — Connecting Dutch founders
        </p>
        <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
          {initiatives.length} initiatives and counting. Data sourced from public ecosystem databases and organization websites.
        </p>
      </footer>
    </div>
    </InitiativesContext.Provider>
  );
}
