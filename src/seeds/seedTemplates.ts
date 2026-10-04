import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Template } from '../models/Template';

dotenv.config();

const sampleTemplates = [
  {
    title: 'National Mourning & Condolence Tribute',
    banglaTitle: 'জাতীয় শোক দিবস ও স্মরণসভা / দোয়া মাহফিল',
    occasionType: 'shok_dibosh',
    thumbnailUrl: '/templates/thumbnails/mourning.svg',
    layoutConfig: {
      maxTopLeaders: 2,
      topLeaderFrameStyle: 'oval',
      candidatePosition: 'bottom-right',
      colorScheme: {
        primary: '#18181b',
        secondary: '#27272a',
        accent: '#ffffff',
        background: '#09090b',
        footerBg: '#000000',
        headerTextColor: '#ffffff',
        bodyTextColor: '#e4e4e7',
      },
      defaultHeadline: 'জাতীয় শোক দিবস ও দোয়া মাহফিল সফল হোক',
      defaultSubheadline: 'মরহুমের বিদেহী আত্মার মাগফিরাত কামনায় শোকসভা ও দোয়া মাহফিল',
      defaultSlogan: 'জাতির শ্রেষ্ঠ সন্তানদের প্রতি বিনম্র শ্রদ্ধা ও ভালোবাসা',
      bgMotifType: 'wreath',
      borderStyle: 'clean_double',
    },
    isActive: true,
    recommendedParties: ['bnp', 'al', 'jamaat', 'jp', 'general'],
  },
  {
    title: 'Pohela Boishakh & Bangla New Year Festivity',
    banglaTitle: 'শুভ নববর্ষ — শুভ পহেলা বৈশাখ',
    occasionType: 'pohela_boishakh',
    thumbnailUrl: '/templates/thumbnails/boishakh.svg',
    layoutConfig: {
      maxTopLeaders: 2,
      topLeaderFrameStyle: 'circle',
      candidatePosition: 'bottom-right',
      colorScheme: {
        primary: '#991b1b',
        secondary: '#ffffff',
        accent: '#f59e0b',
        background: '#7f1d1d',
        footerBg: '#450a0a',
        headerTextColor: '#ffffff',
        bodyTextColor: '#fef08a',
      },
      defaultHeadline: 'শুভ নববর্ষ ১৪৩১ — পহেলা বৈশাখের শুভেচ্ছা',
      defaultSubheadline: 'মুছে যাক গ্লানি, ঘুচে যাক জরা — এসো হে বৈশাখ এসো এসো',
      defaultSlogan: 'বাঙালির প্রাণের উৎসবে শান্তি ও সমৃদ্ধি আসুক সবার ঘরে',
      bgMotifType: 'floral',
      borderStyle: 'golden_floral',
    },
    isActive: true,
    recommendedParties: ['all', 'al', 'bnp', 'gono_odhikar', 'general'],
  },
  {
    title: 'Eid Mubarak & Islamic Festive Greetings',
    banglaTitle: 'পবিত্র ঈদুল ফিতর ও ঈদুল আজহার শুভেচ্ছা',
    occasionType: 'eid_celebration',
    thumbnailUrl: '/templates/thumbnails/eid.svg',
    layoutConfig: {
      maxTopLeaders: 2,
      topLeaderFrameStyle: 'arch',
      candidatePosition: 'bottom-right',
      colorScheme: {
        primary: '#064e3b',
        secondary: '#d97706',
        accent: '#facc15',
        background: '#022c22',
        footerBg: '#011712',
        headerTextColor: '#ffffff',
        bodyTextColor: '#fef3c7',
      },
      defaultHeadline: 'পবিত্র ঈদুল ফিতরের রক্তিম শুভেচ্ছা — ঈদ মোবারক',
      defaultSubheadline: 'শান্তি, সৌহার্দ্য ও ভ্রাতৃত্বের বার্তা ছড়িয়ে পড়ুক সবার মাঝে',
      defaultSlogan: 'ঐক্য ও সম্প্রীতির বন্ধনে গড়ে উঠুক ন্যায়ভিত্তিক সমাজ',
      bgMotifType: 'eid_crescent',
      borderStyle: 'islamic_arch',
    },
    isActive: true,
    recommendedParties: ['all', 'bnp', 'al', 'jamaat', 'jp', 'general'],
  },
  {
    title: 'Victory Day Patriotic Banner',
    banglaTitle: 'মহান বিজয় দিবস — বীর শহীদদের বিনম্র শ্রদ্ধা',
    occasionType: 'bijoy_dibosh',
    thumbnailUrl: '/templates/thumbnails/bijoy_dibosh.svg',
    layoutConfig: {
      maxTopLeaders: 3,
      topLeaderFrameStyle: 'circle',
      candidatePosition: 'bottom-right',
      colorScheme: {
        primary: '#006a4e',
        secondary: '#f42a41',
        accent: '#ffd700',
        background: '#022c22',
        footerBg: '#011c15',
        headerTextColor: '#ffffff',
        bodyTextColor: '#f8fafc',
      },
      defaultHeadline: 'মহান বিজয় দিবস সফল হোক — ১৬ই ডিসেম্বর',
      defaultSubheadline: 'লাখো শহীদের রক্তে ভেজা লাল-সবুজের পতাকা আমাদের অহংকার',
      defaultSlogan: 'স্বাধীনতার চেতনায় উদ্বুদ্ধ হয়ে দেশ গড়ার প্রত্যয়ে ঐক্যবদ্ধ হোন',
      bgMotifType: 'monument',
      borderStyle: 'golden_floral',
    },
    isActive: true,
    recommendedParties: ['bnp', 'al', 'jamaat', 'jp', 'gono_odhikar', 'ab_party'],
  },
  {
    title: 'Independence Day Tribute',
    banglaTitle: 'মহান স্বাধীনতা ও জাতীয় দিবস — ২৬শে মার্চ',
    occasionType: 'shadhinota_dibosh',
    thumbnailUrl: '/templates/thumbnails/independence.svg',
    layoutConfig: {
      maxTopLeaders: 3,
      topLeaderFrameStyle: 'circle',
      candidatePosition: 'bottom-right',
      colorScheme: {
        primary: '#006a4e',
        secondary: '#f42a41',
        accent: '#ffd700',
        background: '#042f2e',
        footerBg: '#021e1d',
        headerTextColor: '#ffffff',
        bodyTextColor: '#f1f5f9',
      },
      defaultHeadline: 'মহান স্বাধীনতা ও জাতীয় দিবসে বীর মুক্তিযোদ্ধাদের বিনম্র শ্রদ্ধা',
      defaultSubheadline: 'সার্বভৌমত্ব রক্ষা ও সাম্য প্রতিষ্ঠার দৃঢ় অঙ্গীকার',
      defaultSlogan: 'গণতন্ত্র ও ন্যায়বিচারের পথে অপ্রতিরোধ্য অগ্রযাত্রা',
      bgMotifType: 'monument',
      borderStyle: 'golden_floral',
    },
    isActive: true,
    recommendedParties: ['all', 'bnp', 'al', 'jamaat', 'jp', 'gono_odhikar'],
  },
  {
    title: 'International Mother Language Day (21st Feb)',
    banglaTitle: 'আন্তর্জাতিক মাতৃভাষা দিবস ও শহীদ দিবস',
    occasionType: 'ekushey_february',
    thumbnailUrl: '/templates/thumbnails/ekushey.svg',
    layoutConfig: {
      maxTopLeaders: 2,
      topLeaderFrameStyle: 'oval',
      candidatePosition: 'bottom-right',
      colorScheme: {
        primary: '#111827',
        secondary: '#dc2626',
        accent: '#f3f4f6',
        background: '#030712',
        footerBg: '#000000',
        headerTextColor: '#ffffff',
        bodyTextColor: '#e5e7eb',
      },
      defaultHeadline: 'আমার ভাইয়ের রক্তে রাঙানো একুশে ফেব্রুয়ারি — আমি কি ভুলিতে পারি',
      defaultSubheadline: 'মহান ভাষা আন্দোলনের বীর শহীদদের স্মরণে বিনম্র শ্রদ্ধাঞ্জলি',
      defaultSlogan: 'রক্তে কেনা বর্ণমালা, গর্ব মোদের বাংলা ভাষা',
      bgMotifType: 'monument',
      borderStyle: 'clean_double',
    },
    isActive: true,
    recommendedParties: ['all', 'bnp', 'al', 'jamaat', 'gono_odhikar', 'general'],
  },
  {
    title: 'Parliament & Mayor Election Campaign',
    banglaTitle: 'জাতীয় সংসদ ও মেয়র পদে নির্বাচনী প্রচারণা',
    occasionType: 'election_campaign',
    thumbnailUrl: '/templates/thumbnails/mayor_election.svg',
    layoutConfig: {
      maxTopLeaders: 3,
      topLeaderFrameStyle: 'circle',
      candidatePosition: 'bottom-right',
      colorScheme: {
        primary: '#0f3a63',
        secondary: '#dc2626',
        accent: '#fbbf24',
        background: '#071f36',
        footerBg: '#030f1c',
        headerTextColor: '#ffffff',
        bodyTextColor: '#ffffff',
      },
      defaultHeadline: 'আসন্ন নির্বাচনে আপনার মূল্যবান ভোট ও দোয়া প্রার্থনা',
      defaultSubheadline: 'এলাকার সামগ্রিক উন্নয়ন, সুশাসন ও নাগরিক সেবার অঙ্গীকার',
      defaultSlogan: 'সুখে-দুঃখে পাশে ছিলাম, ভবিষ্যতেও জনগণের সেবায় থাকব ইনশাআল্লাহ',
      bgMotifType: 'campaign_crowd',
      borderStyle: 'patriotic_ribbon',
    },
    isActive: true,
    recommendedParties: ['bnp', 'al', 'jamaat', 'jp', 'islami_andolan', 'gono_odhikar'],
  },
  {
    title: 'Union Parishad & Upazila Election Campaign',
    banglaTitle: 'ইউনিয়ন ও উপজেলা পরিষদ চেয়ারম্যান নির্বাচন',
    occasionType: 'election_campaign',
    thumbnailUrl: '/templates/thumbnails/union_election.svg',
    layoutConfig: {
      maxTopLeaders: 3,
      topLeaderFrameStyle: 'circle',
      candidatePosition: 'bottom-right',
      colorScheme: {
        primary: '#14532d',
        secondary: '#b91c1c',
        accent: '#fbbf24',
        background: '#052e16',
        footerBg: '#021a0c',
        headerTextColor: '#ffffff',
        bodyTextColor: '#ffffff',
      },
      defaultHeadline: 'চেয়ারম্যান পদপ্রার্থী হিসেবে দোয়া, ভালোবাসা ও ভোট চাই',
      defaultSubheadline: 'দুর্নীতিমুক্ত সমাজ ও মডেল ইউনিয়ন গড়ার দীপ্ত অঙ্গীকার',
      defaultSlogan: 'জনগণের ভালোবাসাই আমার রাজনীতির প্রেরণা ও শক্তি',
      bgMotifType: 'campaign_crowd',
      borderStyle: 'clean_double',
    },
    isActive: true,
    recommendedParties: ['bnp', 'al', 'jamaat', 'independent'],
  },
  {
    title: 'Student & Youth Assembly Rally',
    banglaTitle: 'ছাত্র ও যুব সম্মেলন / কর্মী সমাবেশ',
    occasionType: 'shuvechcha',
    thumbnailUrl: '/templates/thumbnails/youth_rally.svg',
    layoutConfig: {
      maxTopLeaders: 3,
      topLeaderFrameStyle: 'circle',
      candidatePosition: 'bottom-right',
      colorScheme: {
        primary: '#1e3a8a',
        secondary: '#b91c1c',
        accent: '#facc15',
        background: '#0f172a',
        footerBg: '#020617',
        headerTextColor: '#ffffff',
        bodyTextColor: '#e2e8f0',
      },
      defaultHeadline: 'বিশাল কর্মী সমাবেশ ও ছাত্র-যুব সম্মেলন সফল হোক',
      defaultSubheadline: 'তারুণ্যের শক্তিতে সমৃদ্ধ বাংলাদেশ গড়ার প্রত্যয়',
      defaultSlogan: 'ঐক্যের শক্তিতে এগিয়ে চলো — ন্যায়ের পথে লড়াই করো',
      bgMotifType: 'campaign_crowd',
      borderStyle: 'patriotic_ribbon',
    },
    isActive: true,
    recommendedParties: ['bnp', 'al', 'jamaat', 'gono_odhikar'],
  },
  {
    title: 'Party Foundation Anniversary & Struggle',
    banglaTitle: 'দলের প্রতিষ্ঠাবার্ষিকী ও গৌরবোজ্জ্বল সম্মেলন',
    occasionType: 'shuvechcha',
    thumbnailUrl: '/templates/thumbnails/anniversary.svg',
    layoutConfig: {
      maxTopLeaders: 3,
      topLeaderFrameStyle: 'circle',
      candidatePosition: 'bottom-right',
      colorScheme: {
        primary: '#78350f',
        secondary: '#dc2626',
        accent: '#fbbf24',
        background: '#381404',
        footerBg: '#1f0902',
        headerTextColor: '#ffffff',
        bodyTextColor: '#fef3c7',
      },
      defaultHeadline: 'গৌরব, ঐতিহ্য ও সংগ্রামের প্রতিষ্ঠাবার্ষিকী সফল হোক',
      defaultSubheadline: 'গণতন্ত্র পুনরুদ্ধার ও দেশ গড়ার দীপ্ত শপথ',
      defaultSlogan: 'জনগণের অধিকার আদায়ে আপসহীন নেতৃত্বের সাথে এগিয়ে চলুন',
      bgMotifType: 'monument',
      borderStyle: 'golden_floral',
    },
    isActive: true,
    recommendedParties: ['bnp', 'al', 'gono_odhikar', 'jp'],
  },
  {
    title: 'Happy Birthday & Leadership Tribute',
    banglaTitle: 'প্রিয় নেতার শুভ জন্মদিন ও ফুলেল শুভেচ্ছা',
    occasionType: 'shuvechcha',
    thumbnailUrl: '/templates/thumbnails/birthday.svg',
    layoutConfig: {
      maxTopLeaders: 2,
      topLeaderFrameStyle: 'circle',
      candidatePosition: 'bottom-right',
      colorScheme: {
        primary: '#581c87',
        secondary: '#be185d',
        accent: '#fde047',
        background: '#2e1065',
        footerBg: '#19063b',
        headerTextColor: '#ffffff',
        bodyTextColor: '#fae8ff',
      },
      defaultHeadline: 'জননন্দিত প্রিয় নেতার শুভ জন্মদিনে প্রাণঢালা শুভেচ্ছা ও অভিনন্দন',
      defaultSubheadline: 'আপনার দীর্ঘায়ু, সুস্বাস্থ্য ও উত্তরোত্তর সাফল্য কামনা করি',
      defaultSlogan: 'জনগণের হৃদয়ে চিরভাস্বর থাকুক আপনার আপসহীন ও ত্যাগী নেতৃত্ব',
      bgMotifType: 'floral',
      borderStyle: 'golden_floral',
    },
    isActive: true,
    recommendedParties: ['bnp', 'al', 'jamaat', 'jp', 'general'],
  },
];

const seedDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined');
    }

    console.log('🔄 Connecting to MongoDB for seeding templates...');
    await mongoose.connect(mongoURI);

    console.log('🧹 Clearing existing templates...');
    await Template.deleteMany({});

    console.log(`🌱 Inserting ${sampleTemplates.length} Authentic Bangladeshi Political Templates...`);
    await Template.insertMany(sampleTemplates);

    console.log(`✅ Successfully seeded ${sampleTemplates.length} templates!`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Seeding failed';
    console.error('❌ Seeding failed:', errorMsg);
    process.exit(1);
  }
};

seedDB();
