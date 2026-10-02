import mongoose, { Document, Schema } from 'mongoose';

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
  partySymbolUrl?: string;
  generatedImageUrl?: string;
  pdfExportUrl?: string;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  errorMessage?: string;
  retryCount: number;
  aiEnhanced: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
  },
  { _id: false }
);

const topLeaderPhotoSchema = new Schema<ITopLeaderPhoto>(
  {
    url: { type: String, required: true },
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
  },
  {
    timestamps: true,
  }
);

export const Poster = mongoose.model<IPoster>('Poster', posterSchema);
