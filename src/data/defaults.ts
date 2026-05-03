import type { PortalSettings, RoleLabel, ScriptTemplate, TrainingModule } from "../types";

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

export const defaultSettings: PortalSettings = {
  blipUrl: env.VITE_BLIP_URL || "https://gsia.blipcreativeworks.store/",
  chromonnoUrl: env.VITE_CHROMONNO_URL || "https://payhip.com/Chromonno",
  officialEmail: env.VITE_OFFICIAL_EMAIL || "ceo@blipcreativeworks.store",
  publicAppUrl: env.VITE_PUBLIC_APP_URL || "http://localhost:5173",
  commissionRates: {
    blip: 0.2,
    chromonno: 0.1
  },
  dailyTargets: {
    prospectsSourced: 500,
    peopleContacted: 350,
    conversations: 15,
    conversions: 1
  },
  aiHelperEnabled: true,
  inviteOnlyMode: true,
  trackNames: {
    blip: "Blip Creative Works",
    chromonno: "Chromonno"
  }
};

export const roleLabels: RoleLabel[] = [
  "Business Development Associate",
  "Startup Partnership Associate",
  "Growth Partner",
  "Account Executive",
  "Sales / referral partner"
];

export const trackCards = [
  {
    id: "blip",
    title: "Blip Creative Works",
    offer: "Startup Growth Infrastructure",
    summary:
      "For founders, startups, SMEs, student founders, and organizations that need practical growth systems, clearer positioning, operational support, and help moving from idea to market.",
    prospects: ["Startup founders", "Idea-stage founders", "Early-stage teams", "SMEs", "Student founders", "Local businesses"]
  },
  {
    id: "chromonno",
    title: "Chromonno",
    offer: "Creative retail clothing sales",
    summary:
      "For fashion buyers, shops, communities, gift buyers, Instagram audiences, WhatsApp groups, local businesses, and people interested in creative clothing collections.",
    prospects: ["Fashion buyers", "Local shops", "Student communities", "Gift buyers", "Instagram audiences", "Creative product buyers"],
    note:
      "Physical samples cannot be shipped to candidates because of shipping timing. Use the online brand page, product visuals, brochure, catalog, and approved scripts."
  }
] as const;

export const trainingModules: TrainingModule[] = [
  {
    id: "role-performance-standard",
    title: "Role and performance standard",
    minutes: 14,
    sourceMaterials: ["00_Welcome.pdf", "08_Job.txt"],
    body: [
      "You are entering a practical business development assessment. The work is remote, flexible, independent contractor work. The role labels are Business Development Associate, Startup Partnership Associate, Growth Partner, Account Executive, and Sales / referral partner.",
      "The test is not a theory quiz. It checks how you identify prospects, start professional conversations, match needs to the right offer, close valid commitments, and report evidence. The original test target is 2 successful consumers in 7 days, and the daily operating targets in this portal are built to push serious effort.",
      "A successful consumer is not a random lead. It is a person or organization with a real aligned need who completes a verified transaction, commitment, partnership step, or product usage intent. Admins evaluate quality, not only volume."
    ],
    keyActions: [
      "Use your assigned role label honestly.",
      "Explain that there is no joining fee and no purchase requirement.",
      "Focus every day on relevant prospects, quality communication, fit, follow-up, and proof."
    ],
    practice: [
      "Write a two-sentence explanation of your role without saying you are an employee.",
      "Write one sentence that explains the 7-day test in simple language."
    ],
    passStandard: "You can explain the role, test, no-fee rule, and valid-conversion standard clearly in under 60 seconds.",
    redFlags: [
      "Calling yourself an employee when you are a candidate or contractor.",
      "Counting interest as a conversion without proof.",
      "Using high activity as an excuse for spam."
    ],
    checklist: ["I understand the assessment standard.", "I can explain a valid conversion.", "I know speed matters, but honest proof matters more."]
  },
  {
    id: "source-material-workflow",
    title: "How to use the provided materials",
    minutes: 16,
    sourceMaterials: [
      "07_How to Use the Provided Materials.pdf",
      "00_Welcome.pdf",
      "04_Brosur_Chromonno.jpg",
      "05_Catalog_Chromonno.pdf",
      "06_Chromonno.xlsx",
      "Video Tutorial.mp4"
    ],
    body: [
      "Do not dump every file on a prospect. The materials have an order. First understand the mission and role. Then start with a light, relevant opener. Only send the brochure, catalog, official link, or operational details after the prospect shows fit.",
      "The brochure is for first-touch visual interest, especially for DMs and WhatsApp. The Chromonno catalog is for prospects who ask for details. The Chromonno workbook is an internal pricing and operational reference. The Blip relationship list and idea bank are research tools for finding and framing founder needs.",
      "Your value is positioning. You should decide which material is useful, explain why it matters, and guide the person toward a clear next step."
    ],
    keyActions: [
      "Use light material first, detailed material second.",
      "Ask a fit question before sending a long catalog or link.",
      "Log which material you sent and what response it created."
    ],
    practice: [
      "Choose one Blip founder prospect and write which material you would use first.",
      "Choose one Chromonno buyer prospect and write when you would send the brochure versus the catalog."
    ],
    passStandard: "You can name every source file, explain what it is for, and explain when not to send it.",
    redFlags: [
      "Sending the catalog before knowing whether the buyer cares about clothing or audience fit.",
      "Using the pricing workbook as a public sales sheet without context.",
      "Sending huge files instead of starting a conversation."
    ],
    checklist: ["I know the purpose of each source material.", "I will not send documents blindly.", "I can guide prospects from light material to a clear action."]
  },
  {
    id: "blip-offer",
    title: "Blip offer and founder pain",
    minutes: 18,
    sourceMaterials: ["08_Job.txt", "03_Insights_BlipCreativeWorks.pdf", "02_2000s_Ideas_BlipCreativeWorks.pdf"],
    body: [
      "Blip Creative Works sells Startup Growth Infrastructure. In simple words, Blip helps founders and organizations move from idea, draft, or confusion into clearer systems, better positioning, stronger operations, and practical go-to-market action.",
      "The best Blip prospects are founders, idea-stage teams, SMEs, student founders, startup clubs, operators, organizations, and local businesses that have a real problem: unclear offer, weak market readiness, no customer path, no operational system, no investor-ready story, or a product stuck in draft.",
      "When selling Blip, do not promise guaranteed growth. Your message should make the prospect feel understood: their asset, project, or idea may have value, but it needs structure and execution before the market can trust it."
    ],
    keyActions: [
      "Look for signs of draft status, unclear positioning, weak offer, or lack of launch discipline.",
      "Use the phrase Startup Growth Infrastructure only after you can explain it simply.",
      "Connect Blip to the prospect's real bottleneck, not a generic desire to grow."
    ],
    practice: [
      "Find three startup pages and write one likely pain for each.",
      "Rewrite 'we help startups grow' into a specific Blip fit statement."
    ],
    passStandard: "You can explain Blip as practical infrastructure for founders and name at least six founder pain signals.",
    redFlags: [
      "Selling Blip to anyone with a business page without identifying a business problem.",
      "Using heavy terms like valuation, node, or velocity before explaining them simply.",
      "Promising revenue, funding, or investor success."
    ],
    checklist: ["I can explain Blip in simple English.", "I can identify founder pain signals.", "I can avoid guaranteed-growth claims."]
  },
  {
    id: "blip-research-database",
    title: "Blip relationship list and idea bank",
    minutes: 18,
    sourceMaterials: ["01_Relation_BlipCreativeWorks.pdf", "02_2000s_Ideas_BlipCreativeWorks.pdf"],
    body: [
      "The Blip relationship document is a large prospect and ecosystem database. Use it to understand the type of companies, funds, studios, startups, and organizations that may belong in a growth ecosystem. Do not paste the list into messages.",
      "The 2000s idea document is an idea bank. It includes many possible AI, web, business, finance, health, education, logistics, public-sector, marketplace, climate, agriculture, and operations concepts. Use it to spot problems and start intelligent founder conversations.",
      "The correct use is research, not dumping. Read a prospect's product, match it to one idea category, then ask a question that shows you understand the opportunity or bottleneck."
    ],
    keyActions: [
      "Use the database to find company names and categories for research.",
      "Use the idea bank to create problem-based openers.",
      "Build prospect lists by category, not random names."
    ],
    practice: [
      "Pick five categories from the idea bank and write one prospect type for each.",
      "Turn one idea-bank line into a short discovery question for a founder."
    ],
    passStandard: "You can use the Blip source documents to generate targeted outreach angles without copying long text.",
    redFlags: [
      "Treating the relationship list as guaranteed warm contacts.",
      "Claiming Blip already works with a company unless admin confirms it.",
      "Sending idea-bank text as if it is a custom proposal."
    ],
    checklist: ["I can use the relationship list safely.", "I can use the idea bank for angles.", "I will not claim unverified partnerships."]
  },
  {
    id: "blip-insight-framing",
    title: "Blip strategic insight framing",
    minutes: 20,
    sourceMaterials: ["03_Insights_BlipCreativeWorks.pdf"],
    body: [
      "The Blip insight report teaches a useful sales narrative: many founders own assets, ideas, or early products that look valuable on paper but are not market-ready. The report calls this a gap between potential and readiness.",
      "Important concepts to translate into simple language: draft assets need activation, market readiness matters, technical and operational gaps reduce value, and speed of execution protects momentum. For candidates, the practical point is simple: find founders whose idea is stuck and offer a structured next step.",
      "Use this narrative carefully. It is not a promise that Blip will raise valuation. It is a way to ask better questions: What is still draft? What is blocking launch? What proof is missing? What system would help the founder move faster?"
    ],
    keyActions: [
      "Use readiness language: draft, stuck, unclear, not launched, low proof, weak system.",
      "Ask about time-to-value: what result would make the next 30 days useful?",
      "Offer the official Blip page only after the founder agrees the problem is real."
    ],
    practice: [
      "Write a cold opener for a founder whose app is launched but has weak positioning.",
      "Write a follow-up that asks about market readiness without sounding negative."
    ],
    passStandard: "You can turn the insight report into simple discovery questions and avoid exaggerated valuation claims.",
    redFlags: [
      "Telling a founder their equity will increase.",
      "Using private-sounding asset language as if you know their internal data.",
      "Making fear-based claims about losing momentum."
    ],
    checklist: ["I can explain market readiness simply.", "I can ask discovery questions from the insight report.", "I will not promise valuation growth."]
  },
  {
    id: "chromonno-brand-story",
    title: "Chromonno brand story and buyer fit",
    minutes: 18,
    sourceMaterials: ["04_Brosur_Chromonno.jpg", "05_Catalog_Chromonno.pdf", "Mockup_Img.zip"],
    body: [
      "Chromonno is a creative store focused on illustrated clothing and handmade-style products with artistic touch and humanitarian values. The catalog positions products around stories, values, personal meaning, and human connection.",
      "The visible campaign message is that the April batch is open, with authentic design and premium quality. The mockups show koala-themed apparel, shirts, hoodies, jerseys, sneakers, slippers, and lifestyle product visuals.",
      "Best prospects include fashion buyers, creative product buyers, student communities, gift buyers, local shops, Instagram audiences, WhatsApp groups, event communities, and people who like playful animal art, positive style, or limited creative collections."
    ],
    keyActions: [
      "Lead with style fit and audience fit.",
      "Use the brochure as a visual opener when the channel supports images.",
      "Use catalog details only after the prospect asks to see product options."
    ],
    practice: [
      "Write three audience-fit questions for Chromonno.",
      "Choose one mockup and describe the buyer it fits."
    ],
    passStandard: "You can explain Chromonno as creative clothing with visual products, not as a vague fashion link.",
    redFlags: [
      "Promising physical samples to candidates.",
      "Claiming all products are in stock locally.",
      "Selling the humanitarian angle without staying factual."
    ],
    checklist: ["I can explain the Chromonno story.", "I know the main product categories.", "I can ask whether the style fits before sending links."]
  },
  {
    id: "chromonno-catalog-products",
    title: "Chromonno catalog product knowledge",
    minutes: 22,
    sourceMaterials: ["05_Catalog_Chromonno.pdf", "06_Chromonno.xlsx"],
    body: [
      "The catalog includes a Koala Series with new arrivals, best sellers, special price products, and clearance items. Candidate-level product examples include shirts, nylon canvas shoes, polo shirts, breathable sneakers, pajama pants, hoodies, joggers, athletic apparel, zip hoodies, athletic tees, sweatshirts, pullover tops, letterman jackets, camp shirts, jerseys, sweatpants, fleece slippers, boxer briefs, and basketball jerseys.",
      "The catalog presents free shipping across many displayed items. Product prices in the catalog and workbook are in EUR. The workbook has 47 product rows, a visible price range from about EUR 33 to EUR 280, and operational columns for business development, operations, production, shipping, platform fees, return fees, and donation.",
      "When candidates explain products, they should be specific but careful. Use simple product benefits: casual wear, giftable style, playful koala design, comfortable fabric, active lifestyle, loungewear, sportswear, or shop/community fit. Do not invent fabric, stock, sizing, delivery date, or discounts beyond approved material."
    ],
    keyActions: [
      "Know at least 10 product categories before outreach.",
      "Use EUR prices only when you can point to the catalog or workbook reference.",
      "Send the official Chromonno page for current purchase details."
    ],
    practice: [
      "Pick three catalog products and write one buyer reason for each.",
      "Write a short reply to a shop owner asking, 'What kind of products are these?'"
    ],
    passStandard: "You can guide a buyer through product categories, price-range expectations, and official purchase next steps without inventing details.",
    redFlags: [
      "Quoting a price as final if the official brand page shows a different current price.",
      "Inventing sizes, materials, or shipping timing.",
      "Sending the internal workbook as a buyer-facing price sheet."
    ],
    checklist: ["I know the main Chromonno product types.", "I can explain the price reference carefully.", "I know the official page is the final purchase reference."]
  },
  {
    id: "track-selection-icp",
    title: "Track selection and ideal customer profile",
    minutes: 16,
    sourceMaterials: ["08_Job.txt", "05_Catalog_Chromonno.pdf", "02_2000s_Ideas_BlipCreativeWorks.pdf"],
    body: [
      "Choose Blip if your network includes founders, student founders, operators, startup clubs, SMEs, organizations, builders, local businesses, or people working on new digital/business ideas.",
      "Choose Chromonno if your network includes fashion buyers, creative communities, local shops, campus groups, social media audiences, gift buyers, lifestyle content pages, or people who react well to visual products.",
      "Choose both only if you can keep the logic separate. Blip conversations are problem and infrastructure conversations. Chromonno conversations are audience, style, product, and purchase conversations."
    ],
    keyActions: [
      "Write a target list for each selected track.",
      "Use separate scripts and evidence for each track.",
      "Change track only when your network or performance data supports it."
    ],
    practice: [
      "List 20 people or groups you could contact for Blip.",
      "List 20 people or groups you could contact for Chromonno."
    ],
    passStandard: "You can defend your track choice using your real network and prospect sources.",
    redFlags: [
      "Choosing both because it sounds bigger, then mixing the offers in one confusing message.",
      "Sending Chromonno to founders who have no buyer or audience relevance.",
      "Sending Blip to people who only asked about clothing."
    ],
    checklist: ["I know my track logic.", "I can separate Blip and Chromonno messages.", "I can change track with a reason."]
  },
  {
    id: "prospecting-system",
    title: "Prospecting system and list building",
    minutes: 22,
    sourceMaterials: ["08_Job.txt", "01_Relation_BlipCreativeWorks.pdf"],
    body: [
      "The 7-day test requires serious volume, but volume must be organized. Build lists by source and segment: startup directories, Product Hunt, Indie Hackers, LinkedIn, local business areas, student clubs, Instagram pages, WhatsApp groups, events, and warm referrals.",
      "For each prospect, capture name, company, website, contact, channel, need, offer fit, message sent, reply, status, and next follow-up. Missing data makes admin review harder and weakens your credibility.",
      "A qualified prospect is relevant, reachable through an acceptable channel, and has a possible need. If you cannot name the likely need, keep researching before messaging."
    ],
    keyActions: [
      "Build daily lists before outreach.",
      "Deduplicate by contact and company.",
      "Mark prospects as sourced, contacted, replied, qualified, follow-up, closed, not fit, or lost."
    ],
    practice: [
      "Create a 25-row sample list with at least 5 different channels.",
      "Write one possible need for each row before sending messages."
    ],
    passStandard: "Your prospect tracker can be reviewed by an admin without needing extra explanation.",
    redFlags: [
      "Sourcing names with no need field.",
      "Messaging duplicate contacts repeatedly.",
      "Using private or scraped personal data without permission."
    ],
    checklist: ["I can build segmented lists.", "I can log required fields.", "I can deduplicate my tracker."]
  },
  {
    id: "qualification-framework",
    title: "Qualification framework",
    minutes: 18,
    sourceMaterials: ["00_Welcome.pdf", "07_How to Use the Provided Materials.pdf"],
    body: [
      "Qualification means checking fit before asking for action. For Blip, qualify the business problem: offer clarity, operations, launch readiness, go-to-market, customer acquisition, or stuck idea. For Chromonno, qualify audience fit: buyer type, style preference, community interest, shop relevance, gift demand, or product category.",
      "Use simple questions. What are you trying to improve? Who is the product or audience for? What would make this useful now? Who decides? What next step would be realistic?",
      "A good prospect does not need to say yes immediately. A good prospect gives useful information that lets you choose the right next step."
    ],
    keyActions: [
      "Ask one qualifying question before sending detailed material.",
      "Record the answer in the need or notes field.",
      "Mark not fit when the need does not match."
    ],
    practice: [
      "Write five Blip qualification questions.",
      "Write five Chromonno qualification questions."
    ],
    passStandard: "You can show why each warm prospect is Blip fit, Chromonno fit, both, or not fit.",
    redFlags: [
      "Pushing a link before you understand the need.",
      "Treating a polite reply as a qualified conversation.",
      "Ignoring a clear no."
    ],
    checklist: ["I can qualify before pitching.", "I can record the need.", "I can mark not-fit prospects respectfully."]
  },
  {
    id: "material-sharing",
    title: "Material sharing sequence",
    minutes: 18,
    sourceMaterials: ["04_Brosur_Chromonno.jpg", "05_Catalog_Chromonno.pdf", "03_Insights_BlipCreativeWorks.pdf"],
    body: [
      "The correct sequence is conversation first, material second. Start with a short personal message. If the prospect replies, ask a qualifying question. If fit is clear, send the smallest useful material. If interest grows, send the official page or catalog.",
      "For Blip, use insight language lightly: draft assets, market readiness, operational gaps, time-to-value. For Chromonno, use visual materials: brochure first, catalog second, official brand page for purchase direction.",
      "Every material send should have a reason and a next step. Example: 'Because you said your shop audience likes playful casual wear, this catalog may help you judge fit. Which category would your customers notice first?'"
    ],
    keyActions: [
      "Ask permission before sending long information.",
      "Attach one material at a time.",
      "Follow each material with one question."
    ],
    practice: [
      "Write a permission ask before sending the Chromonno catalog.",
      "Write a Blip insight follow-up after a founder describes a launch problem."
    ],
    passStandard: "You can explain why you sent each material and what response you wanted.",
    redFlags: [
      "Sending all documents at once.",
      "Dropping official links without context.",
      "Using materials as a substitute for conversation."
    ],
    checklist: ["I can use a light-to-detailed material sequence.", "I can ask before sending long files.", "I can attach a next-step question."]
  },
  {
    id: "ten-step-sales-process",
    title: "10-step sales process",
    minutes: 24,
    sourceMaterials: ["07_How to Use the Provided Materials.pdf", "00_Welcome.pdf"],
    body: [
      "Step 1: choose a track. Step 2: define one prospect segment. Step 3: source prospects. Step 4: research one true detail. Step 5: send a short personal opener. Step 6: ask a qualifying question. Step 7: match the need to Blip or Chromonno. Step 8: send the right material or official page. Step 9: ask for a clear next step. Step 10: log outcome and proof.",
      "The process is a loop. If the prospect does not reply, follow up respectfully. If they object, answer honestly. If they are not fit, stop. If they are warm, move toward a commitment, transaction, referral, or handoff.",
      "Do not skip the research and qualification steps. They protect the brand and improve conversion quality."
    ],
    keyActions: [
      "Use the same 10 steps for every channel.",
      "Keep the next step clear: reply, review, choose, meet, purchase, refer, or submit proof.",
      "Review your own tracker every night."
    ],
    practice: [
      "Map one real prospect through all 10 steps.",
      "Write the next step you want before sending any message."
    ],
    passStandard: "Your outreach activity can be explained as a repeatable process, not random messaging.",
    redFlags: [
      "Only sourcing and never following up.",
      "Only messaging and never qualifying.",
      "Claiming a close without proof."
    ],
    checklist: ["I know the 10 steps.", "I can repeat the process daily.", "I can report outcomes clearly."]
  },
  {
    id: "channel-playbooks",
    title: "Channel playbooks",
    minutes: 24,
    sourceMaterials: ["08_Job.txt", "04_Brosur_Chromonno.jpg"],
    body: [
      "LinkedIn works best for founders, operators, organizations, and professional buyers. Email works when you have a public business contact and a clear subject. WhatsApp works for warm or local contacts when appropriate. Instagram works for Chromonno visual buyers and communities. Product Hunt, Indie Hackers, and startup directories work for Blip founder sourcing.",
      "Local business visits can work for shops, salons, community stores, school clubs, coworking spaces, and event organizers. Keep the first question short and ask for the owner, manager, buyer, or best contact method.",
      "Each channel has a different first step, but the rule is the same: relevant person, one true detail, short message, clear question, no pressure."
    ],
    keyActions: [
      "Choose channels based on the prospect segment.",
      "Test at least three variations on Day 2.",
      "Track conversation rate by channel."
    ],
    practice: [
      "Write one opener for LinkedIn, WhatsApp, email, Instagram, and local visit.",
      "Mark which channel should be used for five sample prospects."
    ],
    passStandard: "You can choose a channel for a prospect and explain why it is respectful and relevant.",
    redFlags: [
      "Using WhatsApp for cold contacts where it feels invasive.",
      "Posting public comments that look like spam.",
      "Ignoring community rules in forums or groups."
    ],
    checklist: ["I can match channels to prospects.", "I can test message variations.", "I can track channel performance."]
  },
  {
    id: "personalization-anti-spam",
    title: "Personalization and anti-spam",
    minutes: 20,
    sourceMaterials: ["07_How to Use the Provided Materials.pdf", "08_Job.txt"],
    body: [
      "High activity is not permission to spam. Every message must be personalized, honest, respectful, and relevant. Personalization does not need to be long. One real detail is enough if it proves you looked at the prospect.",
      "Useful personalization details include company name, launch, product category, founder post, local area, audience type, shop style, event, student club, pain point, or visible product feature.",
      "Respect opt-outs immediately. Do not message repeatedly after a no. Do not scrape private contact data. Do not use fake urgency, fake discounts, false guarantees, or exaggerated claims."
    ],
    keyActions: [
      "Use the message quality checklist before sending.",
      "Keep first messages short.",
      "Log the exact message sent."
    ],
    practice: [
      "Rewrite a generic message into three personalized versions.",
      "Find the one true detail in five prospect pages."
    ],
    passStandard: "An admin can read your message sample and see why it was relevant to that prospect.",
    redFlags: [
      "Same message sent to everyone.",
      "False scarcity or fake discount language.",
      "Pressure after no response or a no."
    ],
    checklist: ["I personalize with one real detail.", "I avoid false claims.", "I log messages in the tracker."]
  },
  {
    id: "faq-objection-handling",
    title: "FAQ and objection handling",
    minutes: 22,
    sourceMaterials: ["09_Faq.pdf", "08_Job.txt"],
    body: [
      "Common questions include: Can I try the product first? Which platform should I target? Do I build my own prospect list? Is compensation only customer-based? Are there tools provided? Is there commission for the first customers?",
      "Approved answers are simple. For Chromonno, physical samples cannot be shipped to candidates because of shipping timing, so use the online brand page, visuals, brochure, catalog, and approved materials. For Blip, focus on idea-stage startup founders and practical growth infrastructure. Build your own creative prospect list, but use provided sources for guidance.",
      "Compensation is performance-based. Blip conversions use a 20 percent performance incentive and Chromonno conversions use a 10 percent performance incentive, only after admin verification. Candidates should start with free outreach methods during the test."
    ],
    keyActions: [
      "Answer objections directly without arguing.",
      "Ask whether the person is focused on Blip or Chromonno before giving detailed guidance.",
      "Escalate unclear payment, legal, or official-policy questions to admin."
    ],
    practice: [
      "Write answers to sample requests, joining fee, tools, and compensation questions.",
      "Write a calm reply to a prospect who says 'I need to think about it.'"
    ],
    passStandard: "You can answer the top FAQ questions without inventing policy.",
    redFlags: [
      "Promising samples, paid tools, or guaranteed commission.",
      "Arguing with objections.",
      "Giving legal or payment policy answers beyond approved rules."
    ],
    checklist: ["I can answer common FAQ items.", "I know the no-sample rule.", "I know free outreach is recommended during testing."]
  },
  {
    id: "local-outreach-safety",
    title: "Local outreach safety",
    minutes: 16,
    sourceMaterials: ["08_Job.txt", "09_Faq.pdf"],
    body: [
      "Local outreach is allowed only in safe, public, business-appropriate settings. This is especially important for students and younger candidates. Do not enter private homes, unsafe locations, restricted areas, or places where you do not have permission.",
      "A local visit is not a hard pitch. It is a short request for the right contact. Ask whether the owner, manager, buyer, club leader, or organizer is available. If they are busy or not interested, thank them and leave.",
      "Do not block entrances, disturb customers, collect sensitive personal information, or keep pushing after being asked to stop."
    ],
    keyActions: [
      "Visit only public business locations.",
      "Keep the pitch under 30 seconds.",
      "Follow school, parent, guardian, local, and legal rules."
    ],
    practice: [
      "Practice the local business visit script out loud.",
      "Write a safe plan for a local outreach route."
    ],
    passStandard: "You can conduct local outreach without creating safety, legal, or brand risk.",
    redFlags: [
      "Going alone into unsafe areas.",
      "Entering private homes.",
      "Ignoring a request to leave."
    ],
    checklist: ["I know local outreach safety rules.", "I can keep the pitch short.", "I will follow local law and permission rules."]
  },
  {
    id: "tracker-proof-reporting",
    title: "Tracker, proof, and reporting",
    minutes: 22,
    sourceMaterials: ["06_Chromonno.xlsx", "00_Welcome.pdf"],
    body: [
      "The tracker is your proof of work. It should show what you sourced, who you contacted, what you said, what they replied, what status they are in, and what follow-up is next. Admins should be able to audit your work without guessing.",
      "Daily reports need numbers and learning. Report prospects sourced, people contacted, conversations, conversions, best channel, biggest objection, what worked, what needs help, proof files, and tracker link.",
      "Evidence can include screenshots, email replies, transaction proof, commitment proof, official link to updated tracker, or manager-verifiable notes. Do not upload sensitive personal data that is not needed."
    ],
    keyActions: [
      "Update the tracker before submitting the daily report.",
      "Attach proof for conversions and meaningful conversations.",
      "Keep notes factual and short."
    ],
    practice: [
      "Import or manually create five prospect rows.",
      "Submit a sample daily report with honest learning notes."
    ],
    passStandard: "Your tracker and daily report match each other and can support admin verification.",
    redFlags: [
      "Inflated numbers that do not match tracker evidence.",
      "Missing message samples.",
      "Proof files that expose unnecessary sensitive data."
    ],
    checklist: ["I can maintain the tracker.", "I can submit daily reports.", "I can provide clean proof."]
  },
  {
    id: "seven-day-execution",
    title: "7-day execution plan",
    minutes: 20,
    sourceMaterials: ["00_Welcome.pdf", "07_How to Use the Provided Materials.pdf"],
    body: [
      "Day 1 is setup: complete training, accept terms, choose track, download tracker, and build the first list. Day 2 is first outreach: test at least three variations, personalize every message, and log all contacts. Day 3 is follow-up and qualification.",
      "Day 4 is moving conversations forward: match need to offer, send relevant links only after fit is clear, and ask for a next step. Day 5 is closing: move warm conversations to commitment or transaction, submit proof, and ask for referrals. Day 6 is recovery: improve weak scripts and double down on the best channel. Day 7 is final report.",
      "The practical target is strong activity with quality. The original assessment asks for 2 successful consumers in 7 days. The portal daily goal is 500 prospects sourced, 350 people contacted, 15 real conversations, and 1 conversion goal per day. Treat these as serious operating targets, not permission to spam."
    ],
    keyActions: [
      "Plan each day before messaging.",
      "Review results every night.",
      "Submit final tracker, conversions, lessons learned, and pipeline on Day 7."
    ],
    practice: [
      "Write your Day 1 list-building plan.",
      "Write your Day 2 channel testing plan."
    ],
    passStandard: "You can run the 7 days as a structured test with daily evidence and a final submission.",
    redFlags: [
      "Waiting until Day 7 to organize proof.",
      "Only doing one channel with no testing.",
      "Treating sourced prospects as contacted prospects."
    ],
    checklist: ["I know what each day requires.", "I can hit activity targets safely.", "I can submit a complete final report."]
  },
  {
    id: "conversion-commission",
    title: "Conversion and commission rules",
    minutes: 18,
    sourceMaterials: ["08_Job.txt", "09_Faq.pdf", "06_Chromonno.xlsx"],
    body: [
      "A conversion is valid only when it can be verified. It may be a transaction, commitment, partnership step, or usage intent, but it must show real need and a clear next action. Interest alone is not a conversion.",
      "Blip conversions use a 20 percent performance incentive. Chromonno conversions use a 10 percent performance incentive. The Chromonno workbook shows internal business development and operational calculations, but candidate-facing commission status remains estimated until admin approval.",
      "No joining fee. No purchase requirement. No guaranteed income. Commission depends on verified conversion quality and admin review."
    ],
    keyActions: [
      "Submit conversion proof immediately after a real commitment.",
      "Separate estimated, submitted, pending, approved, paid, rejected, and disputed commission states.",
      "Ask admin for clarification before making payment promises."
    ],
    practice: [
      "Classify five outcomes as lead, conversation, qualified prospect, or conversion.",
      "Calculate the estimated incentive for a Blip and Chromonno example."
    ],
    passStandard: "You can explain commission rules without creating false income expectations.",
    redFlags: [
      "Showing guaranteed income.",
      "Calling unverified leads conversions.",
      "Promising payment timing without admin approval."
    ],
    checklist: ["I know conversion proof rules.", "I know commission rates.", "I know admin approval is required."]
  }
];

export const dailyPlan = [
  {
    day: 1,
    title: "Learn and build list",
    tasks: [
      "Complete onboarding modules",
      "Accept terms and privacy notice",
      "Choose Blip, Chromonno, or both",
      "Download tracker template",
      "Build first prospect list",
      "Start with free channels"
    ]
  },
  {
    day: 2,
    title: "First outreach",
    tasks: ["Send first outreach messages", "Test at least 3 variations", "Log all contacts", "Do not spam", "Personalize every message"]
  },
  {
    day: 3,
    title: "Follow-up and qualification",
    tasks: ["Follow up on non-replies", "Ask qualifying questions", "Log replies", "Mark prospects by status"]
  },
  {
    day: 4,
    title: "Push conversations forward",
    tasks: ["Match prospect needs to the correct offer", "Send relevant link only after fit is clear", "Ask for a clear next step"]
  },
  {
    day: 5,
    title: "Close first commitment",
    tasks: ["Move warm conversations toward commitment or transaction", "Report conversion proof", "Ask for referral after a positive response"]
  },
  {
    day: 6,
    title: "Recover and improve",
    tasks: ["Follow up with warm leads", "Improve weak scripts", "Ask referrals", "Focus on best-performing channel"]
  },
  {
    day: 7,
    title: "Final report",
    tasks: ["Submit tracker", "Submit conversions", "Submit lessons learned", "Submit remaining pipeline", "Wait for admin evaluation"]
  }
];

export const prospectingResources = [
  { title: "Launching Next", url: "https://www.launchingnext.com/", track: "Blip" },
  { title: "EU-Startups Directory", url: "https://www.eu-startups.com/directory/", track: "Blip" },
  { title: "StartupBase 2026 launches", url: "https://startupbase.io/launches/yearly/2026", track: "Blip" },
  { title: "AlternativeTo new apps", url: "https://alternativeto.net/browse/new-apps/", track: "Blip" },
  { title: "Peerlist Launchpad", url: "https://peerlist.io/launchpad/2026/week/1", track: "Blip" },
  { title: "DevHunt", url: "https://devhunt.org/", track: "Blip" },
  { title: "Marketing DB", url: "https://marketingdb.live/?sort=new", track: "Blip" },
  { title: "Uneed", url: "https://www.uneed.best/", track: "Blip" },
  { title: "Microlaunch", url: "https://microlaunch.net/", track: "Blip" },
  { title: "Indie Hackers products", url: "https://www.indiehackers.com/products", track: "Blip" },
  { title: "Product Hunt yearly leaderboard", url: "https://www.producthunt.com/leaderboard/yearly/2026/all", track: "Blip" },
  { title: "BetaList", url: "https://betalist.com/browse", track: "Blip" },
  { title: "SaaSHub", url: "https://www.saashub.com/", track: "Blip" },
  { title: "Fazier", url: "https://fazier.com/", track: "Blip" }
];

export const localOutreachGuidance = [
  "Small businesses: ask for the owner or manager, then keep the pitch short.",
  "School clubs and startup clubs: ask permission from organizers before presenting.",
  "Coworking spaces and events: speak with public representatives and respect event rules.",
  "Local shops: do not block entrances, interrupt customers, or enter restricted areas.",
  "Door-to-door public business outreach: only visit public business locations, never private homes, and leave immediately if asked."
];

export const sourceMaterials = [
  {
    file: "00_Welcome.pdf",
    title: "Welcome and competency test",
    use: "Use first. It defines the 7-day practical assessment, valid conversion standard, no-fee rule, and evaluation criteria.",
    whenToShare: "Do not send to prospects. Use it to understand your own role and test requirements."
  },
  {
    file: "01_Relation_BlipCreativeWorks.pdf",
    title: "Blip relationship and ecosystem database",
    use: "Use as research material for startup, organization, investor, studio, and ecosystem prospecting.",
    whenToShare: "Do not paste or imply verified partnerships. Use it internally to learn prospect categories."
  },
  {
    file: "02_2000s_Ideas_BlipCreativeWorks.pdf",
    title: "Blip founder idea bank",
    use: "Use to spark problem-based conversations across AI, web, finance, operations, healthcare, education, logistics, public sector, environment, agriculture, and marketplace ideas.",
    whenToShare: "Do not send the full idea bank first. Convert one relevant idea into one simple question."
  },
  {
    file: "03_Insights_BlipCreativeWorks.pdf",
    title: "Blip strategic insight report",
    use: "Use to explain draft assets, market readiness, operational gaps, time-to-value, and why founders need structured execution.",
    whenToShare: "Share ideas from it only after a founder has described a matching problem."
  },
  {
    file: "04_Brosur_Chromonno.jpg",
    title: "Chromonno brochure image",
    use: "Use as a light visual opener for DMs, WhatsApp, Instagram, and warm retail conversations.",
    whenToShare: "Share after a short context message. Ask whether the style fits their audience."
  },
  {
    file: "05_Catalog_Chromonno.pdf",
    title: "Chromonno catalog",
    use: "Use when a prospect asks for product details, categories, visual options, or style examples.",
    whenToShare: "Send after fit is clear, not as the first cold message."
  },
  {
    file: "06_Chromonno.xlsx",
    title: "Chromonno operational/pricing reference",
    use: "Use internally for price range, product rows, business development calculation, operational cost, production, shipping, and donation reference.",
    whenToShare: "Do not treat as a public buyer quote sheet. Point buyers to the official brand page for current purchase details."
  },
  {
    file: "07_How to Use the Provided Materials.pdf",
    title: "Material workflow guide",
    use: "Use to follow the correct flow: identify, start conversation, qualify, introduce solution, share relevant material, guide toward conversion.",
    whenToShare: "Internal candidate guide."
  },
  {
    file: "09_Faq.pdf",
    title: "Candidate FAQ",
    use: "Use to answer product sample, prospecting channel, prospect list, compensation, first customers, and tool questions.",
    whenToShare: "Internal candidate guide. Use approved answers in your own words."
  },
  {
    file: "Video Tutorial.mp4",
    title: "Video tutorial",
    use: "Use as a walkthrough companion to the documents and product materials.",
    whenToShare: "Internal candidate training only unless admin approves sharing."
  },
  {
    file: "Mockup_Img.zip",
    title: "Chromonno mockup image package",
    use: "Use for approved product visuals: lifestyle, on-person apparel, shoes, slippers, and product context images.",
    whenToShare: "Share only relevant images. Do not send the full package unless the prospect requested visual options."
  }
];

export const blipIdeaCategories = [
  "AI websites and assistants for education, culture, counseling, and community guidance",
  "Startup dashboards for operational readiness, data injection, and market launch progress",
  "SME automation for office administration, bookkeeping, tax, inventory, scheduling, and customer service",
  "Finance and accounting systems for reporting, forecasting, fraud detection, investment risk, and sharia finance",
  "Health, hospital, triage, medical administration, and remote-care web systems",
  "Marketplace and e-commerce systems with AI recommendations, customer support, and export/import support",
  "Logistics, route optimization, supply chain, delivery tracking, and airport or transport efficiency",
  "Public sector, budget transparency, policy simulation, smart city, and asset management systems",
  "Agriculture, fisheries, food security, livestock, water quality, environment, and climate monitoring systems",
  "Manufacturing, construction, maintenance, quality control, energy, robotics, and industrial AI systems"
];

export const chromonnoProductGuide = [
  {
    category: "Entry visual item",
    products: "Humanity limited-edition shirt, Gildan shirt, comfort shirt",
    buyerFit: "Gift buyers, student communities, casual wear buyers, people who respond to mission and visual art",
    notes: "Catalog shows free shipping language. Use official page for live purchase details."
  },
  {
    category: "Casual apparel",
    products: "Koala polo shirt, camp shirt, baseball jersey, basketball jersey, athletic tee",
    buyerFit: "Campus groups, clubs, events, creative communities, local shops, social content audiences",
    notes: "Frame around playful koala art, casual outings, game days, summer style, and positive visual identity."
  },
  {
    category: "Comfort and loungewear",
    products: "Pajama pants, sweatpants, joggers, hoodies, zip hoodies, crewneck sweatshirt",
    buyerFit: "Gift buyers, comfort wear audiences, lifestyle communities, casual fashion shops",
    notes: "Use comfort language only from the catalog: soft, lightweight, cozy, relaxed, casual."
  },
  {
    category: "Footwear",
    products: "Nylon canvas shoes, breathable sneakers, classic sneakers, slide sandals, Deco slides, fleece slippers",
    buyerFit: "Fashion buyers, online style audiences, creative footwear buyers, shop owners testing visual products",
    notes: "Do not promise physical samples to candidates. Use mockups, product visuals, and official page."
  },
  {
    category: "Premium or special-price items",
    products: "Adidas fleece joggers, Adidas gym apparel, Adidas zip pullover, letterman jacket",
    buyerFit: "Buyers who want higher-ticket creative apparel, sportswear, or giftable fashion",
    notes: "Confirm current price and availability on the official brand page before asking for a purchase."
  }
];

export const faqPlaybook = [
  {
    question: "Can I try the product before selling it?",
    answer: "For Chromonno, physical samples cannot be shipped to candidates because of shipping timing. Use the online brand page, product visuals, brochure, catalog, and approved materials."
  },
  {
    question: "Which platform should I target?",
    answer: "For Blip, start with idea-stage founders, startup directories, Product Hunt, Indie Hackers, LinkedIn, startup clubs, SMEs, and organizations. For Chromonno, use Instagram, WhatsApp, local shops, student communities, gift buyers, fashion buyers, and creative audiences."
  },
  {
    question: "Do I build my own prospect list?",
    answer: "Yes. Provided sources help you, but your own creative prospect list is part of the evaluation."
  },
  {
    question: "Is compensation only customer-based?",
    answer: "Compensation is performance-based and depends on verified conversions. Blip qualified conversions use 20 percent. Chromonno qualified conversions use 10 percent."
  },
  {
    question: "Are paid tools provided?",
    answer: "Use free outreach methods during the test. Paid tools are not required for the 7-day assessment."
  },
  {
    question: "Will first customers count?",
    answer: "Yes, valid verified conversions can be reviewed for commission. Nothing is guaranteed until admin verification and approval."
  }
];

const channelAdvice: Record<ScriptTemplate["channel"], string> = {
  linkedin: "Use a short professional note and mention one public detail from the profile or company page.",
  email: "Use a clear subject line, one specific detail, and one direct question.",
  whatsapp: "Use only appropriate contacts and keep the first message very short.",
  instagram: "Reference one real post, product, style, or audience detail.",
  product_hunt: "Keep comments useful and avoid dropping links without context.",
  indie_hackers: "Write like a helpful community member, not a pitch bot.",
  startup_directory: "Mention the launch, category, or product problem you noticed.",
  local_business: "Ask for the right contact before explaining the offer.",
  door_to_door: "Stay public, brief, safe, and respectful."
};

export const messageQualityChecklist = [
  "Is the prospect relevant?",
  "Did I add one specific detail?",
  "Did I ask a clear question?",
  "Is the message short?",
  "Is it honest?",
  "Did I avoid false promises?",
  "Did I log it in the tracker?"
];

const baseScripts: ScriptTemplate[] = [
  {
    id: "blip-founder-cold",
    track: "blip",
    channel: "linkedin",
    stage: "cold",
    title: "Blip cold founder outreach",
    template:
      "Hi [Name], I saw [specific detail about company/project]. I work with Blip Creative Works, helping early founders turn ideas into practical Startup Growth Infrastructure. Are you currently trying to improve your offer, operations, or go-to-market system?",
    explanation: "Names one specific detail and asks a fit question before sending a link.",
    active: true
  },
  {
    id: "blip-follow-up",
    track: "blip",
    channel: "email",
    stage: "follow_up",
    title: "Blip follow-up",
    template:
      "Hi [Name], just following up. If growth systems are not a priority right now, no worries. If you are working on offer clarity, early customers, or startup operations, I can send the most relevant Blip overview.",
    explanation: "Respectful follow-up with a clear opt-out and a relevant reason to continue.",
    active: true
  },
  {
    id: "blip-closing",
    track: "blip",
    channel: "email",
    stage: "closing",
    title: "Blip closing ask",
    template:
      "Based on what you shared, Blip may be a fit for [specific need]. Would you like to take the next step and review the official offer page here: [Blip link]?",
    explanation: "Connects the ask to the prospect's stated need and uses the official link.",
    active: true
  },
  {
    id: "chromonno-buyer-cold",
    track: "chromonno",
    channel: "instagram",
    stage: "cold",
    title: "Chromonno clothing buyer outreach",
    template:
      "Hi [Name], I thought your audience/shop/community might fit Chromonno's creative clothing collection. Would you be open to seeing the catalog and sharing what styles your customers usually like?",
    explanation: "Asks for permission and starts with audience fit.",
    active: true
  },
  {
    id: "chromonno-follow-up",
    track: "chromonno",
    channel: "whatsapp",
    stage: "follow_up",
    title: "Chromonno follow-up",
    template:
      "Hi [Name], following up on Chromonno. I can send a quick product view if you are interested. No pressure - I only want to share it if the style fits your audience.",
    explanation: "Keeps pressure low and confirms fit before sending more.",
    active: true
  },
  {
    id: "chromonno-closing",
    track: "chromonno",
    channel: "email",
    stage: "closing",
    title: "Chromonno closing ask",
    template:
      "If this collection fits your audience, the next step is to review the official brand page and choose the product direction you want to move forward with: [Chromonno link].",
    explanation: "Uses the official brand page and asks for a clear next step.",
    active: true
  },
  {
    id: "blip-idea-bank-opener",
    track: "blip",
    channel: "startup_directory",
    stage: "cold",
    title: "Blip idea-bank opener",
    template:
      "Hi [Name], I saw [specific product or launch detail]. It looks like you may be working on [problem category]. Blip Creative Works helps founders turn draft ideas into practical growth infrastructure. What is the biggest blocker right now: offer clarity, operations, or getting the first serious users?",
    explanation: "Uses the Blip idea bank as a problem angle, then asks a simple qualification question.",
    active: true
  },
  {
    id: "blip-market-readiness-follow-up",
    track: "blip",
    channel: "linkedin",
    stage: "follow_up",
    title: "Blip market-readiness follow-up",
    template:
      "Hi [Name], one useful way to check fit is market readiness. If [company/project] already has the idea but still needs clearer positioning, operations, or a stronger launch path, I can send the official Blip overview. Is that the kind of gap you are trying to close?",
    explanation: "Turns the Blip insight report into plain English without making valuation promises.",
    active: true
  },
  {
    id: "chromonno-brochure-permission",
    track: "chromonno",
    channel: "instagram",
    stage: "cold",
    title: "Chromonno brochure permission ask",
    template:
      "Hi [Name], I noticed [specific audience/shop/style detail]. Chromonno has a creative koala-themed clothing collection. Would it be okay if I sent one quick visual so you can judge whether the style fits your audience?",
    explanation: "Asks permission before sending the brochure and keeps the first step light.",
    active: true
  },
  {
    id: "chromonno-catalog-send",
    track: "chromonno",
    channel: "whatsapp",
    stage: "follow_up",
    title: "Chromonno catalog send",
    template:
      "Thanks, [Name]. Since you said [specific audience/style need], the catalog may help you review the product categories. It includes shirts, hoodies, jerseys, sneakers, slippers, and other creative apparel. Which category would your customers notice first?",
    explanation: "Sends detailed material after fit and asks a product-category question.",
    active: true
  },
  {
    id: "chromonno-price-clarity",
    track: "chromonno",
    channel: "email",
    stage: "objection",
    title: "Chromonno price clarity",
    template:
      "Good question. The catalog and internal pricing reference use EUR and include production, shipping, platform, operation, and donation considerations. For the current buyer-facing price and purchase step, please use the official Chromonno brand page: [Chromonno link].",
    explanation: "Keeps pricing careful and points to the official page instead of inventing a quote.",
    active: true
  },
  {
    id: "objection-samples",
    track: "chromonno",
    channel: "whatsapp",
    stage: "objection",
    title: "Objection: I need to try the product first.",
    template:
      "That makes sense. For Chromonno, physical samples cannot be shipped to candidates because of shipping timing. For outreach, we use the online product visuals, official brand page, brochure, and approved materials. I can still guide you through the product details clearly.",
    explanation: "Answers directly without inventing sample access.",
    active: true
  },
  {
    id: "objection-joining-fee",
    track: "both",
    channel: "email",
    stage: "objection",
    title: "Objection: Is there a joining fee?",
    template:
      "No. There is no joining fee and no purchase requirement. This is performance-based. The focus is on finding real prospects and valid conversions.",
    explanation: "States the fee rule clearly without promising income.",
    active: true
  },
  {
    id: "referral-ask",
    track: "both",
    channel: "linkedin",
    stage: "referral",
    title: "Referral ask",
    template:
      "Thank you. Is there one founder, buyer, or organization you know who might also benefit from this? A warm introduction would help me reach the right person respectfully.",
    explanation: "Asks for one relevant introduction instead of mass referrals.",
    active: true
  },
  {
    id: "local-visit",
    track: "both",
    channel: "local_business",
    stage: "cold",
    title: "Local business visit script",
    template:
      "Hi, my name is [Name]. I am part of a business development candidate program for Blip Creative Works and Chromonno. I am learning how to identify real business needs and connect people with the right solution. Is the owner or manager available for a quick question, or is there a better way to contact them?",
    explanation: "Keeps local outreach transparent, brief, and respectful.",
    active: true
  }
];

const channels = Object.keys(channelAdvice) as ScriptTemplate["channel"][];

const channelVariations = channels.flatMap((channel) => {
  const label = channel.replace(/_/g, " ");
  return [
    {
      id: `blip-${channel}-cold`,
      track: "blip" as const,
      channel,
      stage: "cold" as const,
      title: `Blip ${label} cold variation`,
      template:
        "Hi [Name], I noticed [specific detail]. I am in a business development candidate program with Blip Creative Works. Blip helps founders build practical Startup Growth Infrastructure. Is [need/problem] something you are working on now?",
      explanation: channelAdvice[channel],
      active: true
    },
    {
      id: `chromonno-${channel}-cold`,
      track: "chromonno" as const,
      channel,
      stage: "cold" as const,
      title: `Chromonno ${label} cold variation`,
      template:
        "Hi [Name], I noticed [specific detail about audience/shop/style]. Chromonno may fit people who like creative clothing collections. Would it be useful if I sent the official brand page for a quick look?",
      explanation: channelAdvice[channel],
      active: true
    },
    {
      id: `both-${channel}-follow-up`,
      track: "both" as const,
      channel,
      stage: "follow_up" as const,
      title: `Both tracks ${label} follow-up`,
      template:
        "Hi [Name], quick follow-up. If this is not relevant, no worries. If [specific need] is still active, I can send the most useful official page and keep it short.",
      explanation: channelAdvice[channel],
      active: true
    }
  ];
});

export const scriptTemplates: ScriptTemplate[] = [...baseScripts, ...channelVariations];

export const termsChecklist = [
  "I understand there is no joining fee.",
  "I understand there is no purchase requirement.",
  "I understand compensation is performance-based.",
  "I agree not to spam, harass, or misrepresent the company.",
  "I agree not to make fake promises, fake discounts, fake guarantees, or unauthorized claims.",
  "I agree to handle prospect/contact data responsibly.",
  "I agree to the privacy notice.",
  "I agree to the candidate code of conduct.",
  "If I am under the legal working age in my location, I confirm I have the required permission and will follow local laws."
];

export const legalCopy = {
  terms:
    "There is no joining fee and no purchase requirement. Compensation is performance-based and only applies to verified conversions. Candidates must not misrepresent Blip Creative Works, Chromonno, or their role. Candidates must not make fake promises, fake discounts, fake guarantees, unauthorized claims, guaranteed income claims, or guaranteed results claims. Candidates must respect opt-outs, handle prospect data responsibly, and submit honest reports.",
  privacy:
    "Candidate submissions, uploaded evidence, prospect trackers, and activity reports may be reviewed by admins and managers for evaluation, verification, coaching, and commission review. Uploaded files should only contain information needed to verify work. Do not upload sensitive personal data unless it is required and appropriate.",
  conduct:
    "Be honest, respectful, and professional. Do not spam. Do not pressure people. Do not use fake urgency. Do not contact people again after they say no. If you are under the legal working age in your location, follow local laws and get required permission."
};
