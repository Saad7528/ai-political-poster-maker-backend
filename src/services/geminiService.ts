import mongoose from 'mongoose';
import { geminiManager } from '../config/gemini';
import { GenerationLog } from '../models/GenerationLog';

export interface PoliticalCopyParams {
  promptText?: string;
  occasionType?: string;
  candidateName?: string;
  designation?: string;
  party?: string;
  district?: string;
  unionOrThana?: string;
  constituencyName?: string;
  customKeywords?: string;
}

export interface PoliticalCopyResult {
  candidateName?: string;
  designation?: string;
  organizationOrParty?: string;
  selectedPartyKey?: string;
  constituencyName?: string;
  unionOrThana?: string;
  district?: string;
  primaryHeadline: string;
  subheadline: string;
  slogan: string;
  quote: string;
  creditLine: string;
  wishingMessage: string;
  recommendedArchetype: string;
  suggestedFrameStyle?: string;
  topLeaders?: Array<{ name: string; title: string }>;
  colorThemeRecommendation?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export class GeminiService {
  static async generatePoliticalCopy(
    params: PoliticalCopyParams,
    userId?: string
  ): Promise<PoliticalCopyResult> {
    const startTime = Date.now();
    const prompt = `
You are an elite Bangladeshi political campaign master designer and copywriter.
Analyze the user's prompt and campaign details, and compose high-impact, authentic, grammatically flawless Bengali political poster text and complete visual layout configuration matching Bangladeshi political aesthetics:

${params.promptText ? `USER'S NATURAL PROMPT: "${params.promptText}"` : ''}
- Occasion / Event: ${params.occasionType || 'Political Campaign / Election / Festival'}
- Candidate Name: ${params.candidateName || 'Extract or suggest from prompt'}
- Designation: ${params.designation || 'মেয়র পদপ্রার্থী / চেয়ারম্যান পদপ্রার্থী / সংসদ সদস্য পদপ্রার্থী'}
- Political Party: ${params.party || 'বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)'}
- Area / Constituency: ${params.constituencyName || params.unionOrThana || ''}, ${params.district || ''}
- Additional Context / Keywords: ${params.customKeywords || 'None'}

Please return ONLY a valid JSON object matching this schema:
{
  "candidateName": "প্রার্থীর নাম",
  "designation": "পদবি",
  "organizationOrParty": "দলের নাম",
  "selectedPartyKey": "bnp | al | jamaat | jp | gono | independent",
  "constituencyName": "নির্বাচনী এলাকা বা আসন",
  "unionOrThana": "উপজেলা / থানা",
  "district": "জেলা",
  "primaryHeadline": "প্রধান আকর্ষণীয় ব্যানার হেডলাইন",
  "subheadline": "উপ-শিরোনাম বা দোয়া বার্তা",
  "slogan": "আকর্ষণীয় ও প্রভাবশালী নির্বাচনী স্লোগান",
  "quote": "আবেগঘন ছন্দোবদ্ধ কোটেশন",
  "creditLine": "প্রচারে: [প্রচার ও প্রকাশনায়: সমর্থকবৃন্দ / সচেতন নাগরিক]",
  "wishingMessage": "ভোটারদের প্রতি আন্তরিক নিবেদন বা দোয়ার বার্তা",
  "recommendedArchetype": "gemini_ai_masterpiece",
  "suggestedFrameStyle": "cutout",
  "topLeaders": [
    { "name": "বেগম খালেদা জিয়া", "title": "সাবেক তিনবারের সফল প্রধানমন্ত্রী" },
    { "name": "শহীদ রাষ্ট্রপতি জিয়াউর রহমান", "title": "স্বাধীনতার ঘোষক ও প্রতিষ্ঠাতা" }
  ],
  "colorThemeRecommendation": {
    "primary": "#042f2e",
    "secondary": "#064e3b",
    "accent": "#ffd700"
  }
}
`;

    try {
      const responseText = await geminiManager.executeWithFailover(async (ai) => {
        const candidateModels = [
          'gemini-3.8-flash',
          'gemini-3.7-flash',
          'gemini-3.6-flash',
          'gemini-3.5-flash',
          'gemini-3-flash-preview',
          'gemini-flash-latest',
          'gemini-pro-latest',
          'gemini-2.5-flash',
          'gemini-2.5-pro',
        ];

        let lastErr: Error | null = null;
        for (const modelName of candidateModels) {
          try {
            const model = ai.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return result.response.text();
          } catch (mErr: unknown) {
            const errObj = mErr instanceof Error ? mErr : new Error(String(mErr));
            lastErr = errObj;
            console.warn(`Model ${modelName} failed (${errObj.message}), trying next model...`);
            continue;
          }
        }
        throw lastErr || new Error('No models succeeded');
      });

      const latencyMs = Date.now() - startTime;
      const cleanJsonText = responseText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsed: PoliticalCopyResult = JSON.parse(cleanJsonText);

      GenerationLog.create({
        userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
        occasionType: params.occasionType,
        geminiPromptUsed: prompt,
        responsePreview: responseText.slice(0, 300),
        latencyMs,
        success: true,
      }).catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Log error';
        console.error('GenerationLog save error:', msg);
      });

      return parsed;
    } catch (error: unknown) {
      const latencyMs = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : 'Unknown AI error';
      console.error('Gemini AI Generation fallback mode activated:', errorMsg);

      GenerationLog.create({
        userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
        occasionType: params.occasionType,
        geminiPromptUsed: prompt,
        latencyMs,
        success: false,
        errorMessage: errorMsg,
      }).catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Log error';
        console.error('GenerationLog error:', msg);
      });

      return this.getFallbackCopy(params);
    }
  }

  static getFallbackCopy(params: PoliticalCopyParams): PoliticalCopyResult {
    const des = params.designation || '';
    const occ = params.occasionType || '';
    const pty = params.party || '';
    const prompt = params.promptText || '';

    const isParliament =
      des.includes('সংসদ') || des.includes('এমপি') || occ.includes('election') || prompt.includes('সংসদ');
    const isLocalElection =
      des.includes('চেয়ারম্যান') ||
      des.includes('মেয়র') ||
      des.includes('মেম্বার') ||
      des.includes('কাউন্সিলর') ||
      prompt.includes('মেয়র');
    const isEid = occ.includes('eid') || prompt.includes('ঈদ');
    const isJamaat = pty.includes('জামায়াত') || pty.includes('ইসলামী') || prompt.includes('জামায়াত');
    const isBNP =
      pty.includes('বিএনপি') ||
      pty.includes('জাতীয়তাবাদী') ||
      prompt.includes('বিএনপি') ||
      prompt.includes('ধানের শীষ');

    if (isParliament) {
      if (isBNP) {
        return {
          primaryHeadline: `আসন্ন জাতীয় সংসদ নির্বাচনে ${params.constituencyName || params.district || 'ঢাকা'} আসনে`,
          subheadline: `বিএনপি মনোনীত সংসদ সদস্য পদপ্রার্থী হিসেবে আপনাদের দোয়া ও সমর্থন চাই`,
          slogan: 'ধানের শীষে ভোট দিন — পরিবর্তনই অঙ্গীকার, এমপি হবে জনতার',
          quote: 'পরিবর্তন ও উন্নয়নের অঙ্গীকার নিয়ে জনতার পাশে',
          creditLine: `প্রচার ও প্রকাশনায়: ${params.constituencyName || params.district || 'এলাকার'} সর্বস্তরের দেশপ্রেমিক জনতা`,
          wishingMessage: 'ধানের শীষ মার্কায় ভোট দিয়ে এলাকার উন্নয়নের ধারা অব্যাহত রাখার সুযোগ দিন।',
          recommendedArchetype: 'gemini_ai_masterpiece',
          topLeaders: [
            { name: 'বেগম খালেদা জিয়া', title: 'সাবেক তিনবারের সফল প্রধানমন্ত্রী' },
            { name: 'শহীদ রাষ্ট্রপতি জিয়াউর রহমান', title: 'স্বাধীনতার ঘোষক ও প্রতিষ্ঠাতা' },
          ],
          colorThemeRecommendation: { primary: '#042f2e', secondary: '#064e3b', accent: '#ffd700' },
        };
      } else if (isJamaat) {
        return {
          primaryHeadline: `আসন্ন জাতীয় সংসদ নির্বাচনে সৎ ও যোগ্য নেতৃত্বের জয় হোক`,
          subheadline: `ইনসাফভিত্তিক কল্যাণ রাষ্ট্র ও বৈষম্যহীন সমাজ বিনির্মাণে`,
          slogan: 'দাঁড়িপাল্লায় ভোট দিন — আল্লাহর আইন চাই, সৎ লোকের শাসন চাই',
          quote: 'তারুণ্যের প্রথম ভোট, সত্য ও ন্যায়ের পক্ষে হোক',
          creditLine: `প্রচার ও প্রকাশনায়: ${params.district || 'এলাকার'} সর্বস্তরের তাওহীদি জনতা`,
          wishingMessage: 'আসন্ন জাতীয় নির্বাচনে ন্যায় ও ইনসাফের বাংলাদেশ গড়তে মূল্যবান ভোট দিন।',
          recommendedArchetype: 'gemini_ai_masterpiece',
          topLeaders: [
            { name: 'আমীরে জামায়াত', title: 'বাংলাদেশ জামায়াতে ইসলামী' },
            { name: 'সেক্রেটারি জেনারেল', title: 'বাংলাদেশ জামায়াতে ইসলামী' },
          ],
          colorThemeRecommendation: { primary: '#064e3b', secondary: '#0284c7', accent: '#facc15' },
        };
      } else {
        return {
          primaryHeadline: `আসন্ন নির্বাচনে যোগ্য প্রার্থী হিসেবে ভোট দিন`,
          subheadline: `আপনাদের দোয়া, সমর্থন ও মূল্যবান ভোট প্রত্যাশী`,
          slogan: 'যোগ্য প্রার্থীকে ভোট দিয়ে উন্নয়নের ধারা অব্যাহত রাখুন',
          quote: 'কাছে থাকার আশ্বাস নয়, পাশে থাকাই আমার অঙ্গীকার',
          creditLine: `প্রচার ও প্রকাশনায়: সর্বস্তরের দেশপ্রেমিক জনগণ, ${params.district || ''}`,
          wishingMessage: 'আপনার মূল্যবান ভোট দিয়ে এলাকাকে একটি আধুনিক মডেল রূপান্তরে সহযোগিতা করুন।',
          recommendedArchetype: 'gemini_ai_masterpiece',
          topLeaders: [
            { name: 'শীর্ষ নেতৃত্ব ১', title: 'দলীয় প্রতিষ্ঠাতা' },
            { name: 'শীর্ষ নেতৃত্ব ২', title: 'দলীয় প্রধান' },
          ],
          colorThemeRecommendation: { primary: '#006a4e', secondary: '#dc2626', accent: '#ffffff' },
        };
      }
    } else if (isLocalElection) {
      return {
        primaryHeadline: `আসন্ন ${params.constituencyName || params.unionOrThana || 'পৌরসভা ও উপজেলা'} নির্বাচনে মেয়র পদপ্রার্থী হিসেবে ${params.candidateName || 'আনোয়ার ভাইকে'} ভোট দিন`,
        subheadline: `যোগ্য ও আদর্শ নেতৃত্ব — আপনাদের দোয়া, সমর্থন ও মূল্যবান ভোট প্রত্যাশী`,
        slogan: `${params.party?.includes('বিএনপি') ? 'ধানের শীষ' : 'মনোনীত'} মার্কায় ভোট দিয়ে এলাকা ও জনগণের সেবা করার সুযোগ দিন`,
        quote: 'সুখে-দুঃখে পাশে ছিলাম, আজীবন পাশে থাকব — পরিবর্তনের অঙ্গীকার',
        creditLine: `প্রচার ও প্রকাশনায়: ${params.unionOrThana || params.district || 'এলাকার'} সচেতন নাগরিক ও সমর্থকবৃন্দ`,
        wishingMessage: 'গরীবের বন্ধু, নির্ভিক নিঃস্বার্থ কর্মী — আপনাদের দোয়া ও সমর্থন প্রত্যাশী।',
        recommendedArchetype: 'gemini_ai_masterpiece',
        topLeaders: [
          { name: 'বেগম খালেদা জিয়া', title: 'সাবেক তিনবারের সফল প্রধানমন্ত্রী' },
          { name: 'শহীদ রাষ্ট্রপতি জিয়াউর রহমান', title: 'স্বাধীনতার ঘোষক ও প্রতিষ্ঠাতা' },
        ],
        colorThemeRecommendation: { primary: '#042f2e', secondary: '#064e3b', accent: '#ffd700' },
      };
    } else if (isEid) {
      return {
        primaryHeadline: 'পবিত্র ঈদুল ফিতরের শুভেচ্ছা — ঈদ মোবারক',
        subheadline: 'শান্তি, সৌহার্দ্য ও সম্প্রীতির বার্তা ছড়িয়ে পড়ুক সবার মাঝে',
        slogan: 'ঐক্য ও সম্প্রীতির বন্ধনে গড়ে উঠুক নতুন বাংলাদেশ',
        quote: 'দূরের মানুষ আসুক কাছে, কাছের জন থাকুক পাশে',
        creditLine: `শুভেচ্ছান্তে: ${params.candidateName || 'আপনার নাম'}, ${params.designation || 'পদবি'}`,
        wishingMessage: 'ঈদ বয়ে আনুক সকল মানুষের জীবনে সুখ, সমৃদ্ধি ও অনাবিল আনন্দ।',
        recommendedArchetype: 'gemini_ai_masterpiece',
        topLeaders: [
          { name: 'শীর্ষ নেতৃত্ব ১', title: 'দলীয় প্রতিষ্ঠাতা' },
          { name: 'শীর্ষ নেতৃত্ব ২', title: 'দলীয় প্রধান' },
        ],
        colorThemeRecommendation: { primary: '#064e3b', secondary: '#047857', accent: '#facc15' },
      };
    } else {
      return {
        primaryHeadline: 'ঐতিহ্য, সংগ্রাম ও সাফল্যের প্রতিষ্ঠাবার্ষিকী সফল হোক',
        subheadline: 'টেক ব্যাক বাংলাদেশ — দেশ বাঁচাও, মানুষ বাঁচাও',
        slogan: 'তারুণ্যের প্রথম ভোট, অধিকার প্রতিষ্ঠার পক্ষে হোক',
        quote: 'স্বাধীনতার ঘোষকের আদর্শে নতুন বাংলাদেশ বিনির্মাণে',
        creditLine: `প্রচার ও প্রকাশনায়: ${params.party || 'দল'} ও সহযোগী সংগঠনের সর্বস্তরের নেতৃবৃন্দ`,
        wishingMessage: 'ঐতিহাসিক দিবসের রক্তিম শুভেচ্ছা ও আন্তরিক অভিনন্দন।',
        recommendedArchetype: 'gemini_ai_masterpiece',
        topLeaders: [
          { name: 'বেগম খালেদা জিয়া', title: 'সাবেক তিনবারের সফল প্রধানমন্ত্রী' },
          { name: 'শহীদ রাষ্ট্রপতি জিয়াউর রহমান', title: 'স্বাধীনতার ঘোষক ও প্রতিষ্ঠাতা' },
        ],
        colorThemeRecommendation: { primary: '#042f2e', secondary: '#064e3b', accent: '#ffd700' },
      };
    }
  }
}
