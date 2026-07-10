import { Project, BrandVoice, ActivityLog } from '../types';

export const SEEDED_BRAND_VOICES: BrandVoice[] = [
  {
    id: "bv-desi-1",
    userId: "demo-user-id",
    name: "Tech Desi Hook",
    sample: "Suno dosto, agar tum bhi coding seekh rahe ho toh yeh growth hack tumhare liye hai! Simple hai, daily 1% better bano, consistency is the key.",
    vocabulary: "Hinglish, tech terms, friendly, high energy, punchy, creator-first",
    tone: "Engaging & Desi / Hinglish style",
    rules: "Start with an energetic hook using 'Dosto' or 'Suno'. Break down metrics in simple Indian rupee terms or percentage growth. Avoid long boring paras.",
    preferredPhrases: "Dosto, kamaal ka hack, dhandha, growth hack, fayda, simple hai",
    avoidedPhrases: "Furthermore, utilizing, leveraging, paradigm shift, nevertheless",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: "bv-corporate-1",
    userId: "demo-user-id",
    name: "SaaS Growth India",
    sample: "Indian SaaS is set to touch $30B by 2026. Here is the breakdown of how micro-SaaS founders in Bangalore are building lean with AI.",
    vocabulary: "Professional, data-rich, industry trends, precise, authoritative",
    tone: "Corporate & Informative",
    rules: "Include at least one specific metric or valuation. Use standard professional English. End with a question asking for readers' professional insights.",
    preferredPhrases: "Ecosystem, Bangalore founders, metrics, boot-strapped, ARR growth",
    avoidedPhrases: "bro, dosto, what's up guys, epic hack, crazy things",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const SEEDED_PROJECTS: Project[] = [
  {
    id: "proj-1",
    userId: "demo-user-id",
    title: "How I Built a 10 Lakh/Month Agency with No Code",
    sourceType: "youtube",
    sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tone: "Desi / Hinglish",
    brandVoiceId: "bv-desi-1",
    formatsSelected: ["LinkedIn Post", "X/Twitter Thread", "Instagram Caption"],
    status: "completed",
    outputs: {
      "LinkedIn Post": `### 🚀 How to build a ₹10 Lakh/Month No-Code Agency in India

Dosto, agency business badal chuka hai. You don't need a team of 50 developers anymore. Standard tools like Bubble, Webflow aur Make.com se single-handedly complete software products bana sakte ho!

Here is the exact framework we used to scale:

1. **Find high-ticket clients**: Focus on businesses in Mumbai/Bangalore looking for rapid MVP development.
2. **Use No-Code Stack**: Build custom MVPs in 2 weeks instead of 2 months using Webflow and Bubble.
3. **Automate everything**: Connect sales pipelines, billing, and developer assignment using Make.com and Airtable.

**Kamaal ka hack:** Client ko speed becho, code nahi! Most startups want their MVP launched *yesterday*.

Comment "NoCode" below and I will send you my personalized tech stack resource list for free! 👇

#IndianStartups #NoCode #AgencyGrowth #HinglishTech`,

      "X/Twitter Thread": `1/ ₹10 Lakh/month with No-Code. Sounds like clickbait, right? 

But dosto, over 50+ agencies in Bangalore are quietly doing this with just 2-3 founders and simple AI tools. 

Here is the step-by-step breakdown. 👇

2/ First, change your mindset. Startups don't care about the language you write. 
They care about SPEED to market. 

Traditional agency: 3 months, ₹5 Lakhs.
No-code agency: 2 weeks, ₹2 Lakhs. 
Who do you think wins?

3/ The Tech Stack you need:
- Frontend: Webflow (Stunning sites) or Bubble (Complex web apps)
- Automations: Make.com / Zapier
- Database: Airtable / Supabase
- AI Features: Gemini API

4/ How to get clients:
- Don't pitch 'no-code'. Pitch '2-Week MVP Delivery'.
- Target early-stage Indian founders on LinkedIn.
- Deliver mock-ups in 24 hours. The visual proof is undeniable.

5/ Margin calculation is super simple:
- Client pays: ₹2,00,000
- Software/API cost: ₹5,000
- Builder cost (if outsourced): ₹50,000
- Your Net Profit: ~₹1,45,000 (72% margin!)

6/ If you found this thread helpful:
1. Retweet the first tweet to help an Indian builder.
2. Follow me @IndianNoCoder for daily dhandha growth hacks! 🚀`,

      "Instagram Caption": `₹10 Lakhs/month. No heavy coding. No expensive team. Just simple brain-power and standard No-Code tools! 🤯

Dosto, high-income skill seekhni hai toh No-Code ecosystem aur AI integrations par focus karo. Aaj ke din custom products Bubble aur Make.com se generate ho rahe hain in record time!

Check out the complete breakdown in my bio link! 🔗

👉 Save this post for your next side hustle idea!

#nocode #startupindia #businesshacks #independentcreator #desiwork #sidehustle`
    },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "proj-2",
    userId: "demo-user-id",
    title: "The Ultimate Guide to Bootstrapped SaaS in 2026",
    sourceType: "transcript",
    sourceText: "Bootstrapping a software product in 2026 is all about lean ops. Startups are spending too much on infrastructure. By utilizing server-to-zero serverless backends and simple client-side SPAs, we can build for pennies and scale only when we reach product-market fit.",
    tone: "Corporate / B2B",
    brandVoiceId: "bv-corporate-1",
    formatsSelected: ["LinkedIn Post", "Blog Post"],
    status: "completed",
    outputs: {
      "LinkedIn Post": `### 💡 The 2026 Bootstrapped SaaS Blueprint: Build Lean, Scale Smarter

The Bangalore tech ecosystem is witnessing a silent shift. High burn rates are out. Extreme capital efficiency is in. 

If you are building software in 2026, stop paying thousands in monthly server bills before you even launch. Here is how bootstrapped SaaS founders are keeping infra costs to virtually ₹0/month:

1. **Zero-cold-start Serverless**: Move away from heavy persistent server instances. Use scale-to-zero microservices.
2. **Static SPA Frontend**: Serve your main client app via high-speed global CDNs.
3. **Database efficiency**: Utilize managed relational database clusters with developer free tiers.

**The result?** You can run your MVP on pennies and only scale costs in proportion to your MRR. Capital efficiency isn't just a metric; it's a structural advantage.

How are you optimizing your SaaS infrastructure stack this quarter? Let's discuss in the comments below.

#SaaSIndia #Bootstrapping #BangaloreStartups #CloudInfrastructure`,

      "Blog Post": `# The 2026 Guide to Capital-Efficient Bootstrapped SaaS

## Introduction
Building a software startup in 2026 looks fundamentally different from the VC-fueled hyper-growth models of the last decade. Today, the most successful SaaS founders in India are prioritizing **capital efficiency**, **lean operations**, and **zero-infrastructure overhead** to reach profitability before running out of runway.

## 1. The Death of the High-Burn MVP
Historically, launching a SaaS meant provisioning expensive cloud virtual machines, database servers, and queue handlers. In 2026, this is a recipe for early insolvency. Modern founders build their MVPs to cost virtually nothing when inactive.

### Key Lean Tactics:
* **Serverless Backend APIs**: Choose serverless runtimes that scale down to absolute zero when no requests are active.
* **CDN-Hosted Single Page Applications**: Frontends are compiled statically and served from serverless global edge networks, eliminating standard hosting fees.
* **Dynamic Database Provisioning**: Relay on databases that scale in real-time and provide substantial developer free tiers.

## 2. Leveraging the Indian Talent Advantage
With global remote work and advanced AI tools, a team of two developers in Bangalore or Pune can accomplish what used to require an entire engineering department. By keeping the core team extremely small and utilizing specialized contract builders, operations remain lean and focused.

## Conclusion
Bootstrapping is no longer a constraint; it is a structural competitive advantage. By keeping fixed infrastructure and payroll overhead near zero, founders can iterate indefinitely until they find product-market fit.

*What is your bootstrapped SaaS tech stack for 2026? Share your thoughts below!*`
    },
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "proj-3",
    userId: "demo-user-id",
    title: "Indian Content Economy Boom Breakdown",
    sourceType: "file",
    fileName: "economy_report.txt",
    tone: "Casual & Engaging",
    brandVoiceId: null,
    formatsSelected: ["Email Newsletter"],
    status: "failed",
    outputs: {},
    errorMsg: "Quota limit exceeded: Resource has been exhausted (e.g. API rate limit). Please try again or wait a minute.",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export const SEEDED_ACTIVITIES: ActivityLog[] = [
  {
    id: "act-1",
    userId: "demo-user-id",
    title: "Forged 'How I Built a 10 Lakh/Month Agency with No Code'",
    type: "project_completed",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "act-2",
    userId: "demo-user-id",
    title: "Created Brand Voice 'Tech Desi Hook'",
    type: "brand_voice_created",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "act-3",
    userId: "demo-user-id",
    title: "Forged 'The Ultimate Guide to Bootstrapped SaaS in 2026'",
    type: "project_completed",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "act-4",
    userId: "demo-user-id",
    title: "Generation Failed for 'Indian Content Economy Boom Breakdown'",
    type: "project_failed",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];
