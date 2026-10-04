import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidatePhotoAdjustments {
  scale: number;
  posX: number;
  posY: number;
  frameStyle: 'cutout' | 'circle' | 'clean_circle' | 'arch' | 'rounded_rect' | 'oval' | string;
  frameSize?: number;
  framePosX?: number;
  framePosY?: number;
  enableGlow: boolean;
}

export interface IPosterFormData {
  candidateName: string;
  designation: string;
  organizationOrParty: string;
  unionOrThana?: string;
  district?: string;
  constituencyName?: string;
  headline: string;
  subheadline?: string;
  slogan?: string;
  quote?: string;
  creditLine?: string;
  customPartySymbolUrl?: string;
  selectedPartyKey?: string;
  archetype?: string;
  candidatePosition?: string;
  showLeaderTitles?: boolean;
  leadersFrameSize?: number;
  leaderTextSize?: number;
  canvasBgTheme?: string;
  headlinePosX?: number;
  headlinePosY?: number;
  leftHeaderBadge?: string;
  rightHeaderBadge?: string;
  religiousHeader?: string;
  sloganFontSize?: number;
  sloganPosX?: number;
  sloganPosY?: number;
  symbolSize?: number;
  symbolPosX?: number;
  symbolPosY?: number;
  candidateNameFontSize?: number;
  designationFontSize?: number;
  footerPosX?: number;
  footerPosY?: number;
  candidateAdjustments?: ICandidatePhotoAdjustments;
}

export interface ITopLeaderPhoto {
  url: string;
  name?: string;
  title?: string;
  scale?: number;
  posX?: number;
  posY?: number;
}

export interface IPoster extends Document {
  userId: mongoose.Types.ObjectId;
  templateId: mongoose.Types.ObjectId;
  formData: IPosterFormData;
  topLeadersPhotos: ITopLeaderPhoto[];
  candidatePhotoUrl: string;
  candidateAdjustments?: ICandidatePhotoAdjustments;
  partySymbolUrl?: string;
  generatedImageUrl?: string;
  pdfExportUrl?: string;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  errorMessage?: string;
  retryCount: number;
  aiEnhanced: boolean;
  isFlagged?: boolean;
  flagReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const candidateAdjustmentsSchema = new Schema<ICandidatePhotoAdjustments>(
  {
    scale: { type: Number, default: 1.85 },
    posX: { type: Number, default: 0 },
    posY: { type: Number, default: 25 },
    frameStyle: { type: String, default: 'cutout' },
    frameSize: { type: Number, default: 460 },
    framePosX: { type: Number, default: 0 },
    framePosY: { type: Number, default: 0 },
    enableGlow: { type: Boolean, default: true },
  },
  { _id: false }
);

const posterFormDataSchema = new Schema<IPosterFormData>(
  {
    candidateName: { type: String, required: true },
    designation: { type: String, required: true },
    organizationOrParty: { type: String, required: true },
    unionOrThana: { type: String, default: '' },
    district: { type: String, default: '' },
    constituencyName: { type: String, default: '' },
    headline: { type: String, required: true },
    subheadline: { type: String, default: '' },
    slogan: { type: String, default: '' },
    quote: { type: String, default: '' },
    creditLine: { type: String, default: 'প্রচারে: সচেতন নাগরিক ও রাজনৈতিক নেতৃবৃন্দ' },
    customPartySymbolUrl: { type: String, default: '' },
    selectedPartyKey: { type: String, default: 'bnp' },
    archetype: { type: String, default: 'gemini_ai_masterpiece' },
    candidatePosition: { type: String, default: 'bottom-center' },
    showLeaderTitles: { type: Boolean, default: true },
    leadersFrameSize: { type: Number, default: 64 },
    leaderTextSize: { type: Number, default: 9 },
    canvasBgTheme: { type: String, default: 'dark_green' },
    headlinePosX: { type: Number, default: 0 },
    headlinePosY: { type: Number, default: 0 },
    leftHeaderBadge: { type: String, default: '' },
    rightHeaderBadge: { type: String, default: '' },
    religiousHeader: { type: String, default: 'বিসমিল্লাহির রাহমানির রাহিম' },
    sloganFontSize: { type: Number, default: 13 },
    sloganPosX: { type: Number, default: 0 },
    sloganPosY: { type: Number, default: 0 },
    symbolSize: { type: Number, default: 80 },
    symbolPosX: { type: Number, default: 0 },
    symbolPosY: { type: Number, default: 0 },
    candidateNameFontSize: { type: Number, default: 22 },
    designationFontSize: { type: Number, default: 11 },
    footerPosX: { type: Number, default: 0 },
    footerPosY: { type: Number, default: 0 },
    candidateAdjustments: { type: candidateAdjustmentsSchema, default: null },
  },
  { _id: false, strict: false }
);

const topLeaderPhotoSchema = new Schema<ITopLeaderPhoto>(
  {
    url: { type: String, default: '' },
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    scale: { type: Number, default: 1 },
    posX: { type: Number, default: 0 },
    posY: { type: Number, default: 0 },
  },
  { _id: false }
);

const posterSchema = new Schema<IPoster>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
    formData: { type: posterFormDataSchema, required: true },
    topLeadersPhotos: [topLeaderPhotoSchema],
    candidatePhotoUrl: { type: String, default: '' },
    candidateAdjustments: { type: candidateAdjustmentsSchema, default: null },
    partySymbolUrl: { type: String, default: '' },
    generatedImageUrl: { type: String, default: '' },
    pdfExportUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'generating', 'completed', 'failed'],
      default: 'draft',
      index: true,
    },
    errorMessage: { type: String, default: '' },
    retryCount: { type: Number, default: 0 },
    aiEnhanced: { type: Boolean, default: false },
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const Poster = mongoose.model<IPoster>('Poster', posterSchema);
