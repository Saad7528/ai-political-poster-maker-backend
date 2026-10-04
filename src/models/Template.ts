import mongoose, { Document, Schema } from 'mongoose';

export type OccasionType =
  | 'bijoy_dibosh'
  | 'shadhinota_dibosh'
  | 'shok_dibosh'
  | 'election_campaign'
  | 'eid_celebration'
  | 'pohela_boishakh'
  | 'ekushey_february'
  | 'shuvechcha';

export interface ILayoutConfig {
  maxTopLeaders: number;
  topLeaderFrameStyle: 'oval' | 'circle' | 'arch';
  candidatePosition: 'bottom-center' | 'bottom-right' | 'center';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    footerBg: string;
    headerTextColor: string;
    bodyTextColor: string;
  };
  defaultHeadline: string;
  defaultSubheadline?: string;
  defaultSlogan?: string;
  bgMotifType: 'monument' | 'wreath' | 'campaign_crowd' | 'eid_crescent' | 'floral';
  borderStyle: 'golden_floral' | 'clean_double' | 'patriotic_ribbon' | 'islamic_arch';
}

export interface ITemplate extends Document {
  title: string;
  banglaTitle: string;
  occasionType: OccasionType;
  thumbnailUrl: string;
  layoutConfig: ILayoutConfig;
  isActive: boolean;
  recommendedParties?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const layoutConfigSchema = new Schema<ILayoutConfig>(
  {
    maxTopLeaders: { type: Number, default: 2 },
    topLeaderFrameStyle: { type: String, enum: ['oval', 'circle', 'arch'], default: 'circle' },
    candidatePosition: { type: String, enum: ['bottom-center', 'bottom-right', 'center'], default: 'bottom-right' },
    colorScheme: {
      primary: { type: String, default: '#006a4e' },
      secondary: { type: String, default: '#f42a41' },
      accent: { type: String, default: '#ffd700' },
      background: { type: String, default: '#0d3824' },
      footerBg: { type: String, default: '#062416' },
      headerTextColor: { type: String, default: '#ffffff' },
      bodyTextColor: { type: String, default: '#f9f9f9' },
    },
    defaultHeadline: { type: String, required: true },
    defaultSubheadline: { type: String, default: '' },
    defaultSlogan: { type: String, default: '' },
    bgMotifType: { type: String, enum: ['monument', 'wreath', 'campaign_crowd', 'eid_crescent', 'floral'], default: 'monument' },
    borderStyle: { type: String, enum: ['golden_floral', 'clean_double', 'patriotic_ribbon', 'islamic_arch'], default: 'golden_floral' },
  },
  { _id: false }
);

const templateSchema = new Schema<ITemplate>(
  {
    title: { type: String, required: true, trim: true },
    banglaTitle: { type: String, required: true, trim: true },
    occasionType: {
      type: String,
      required: true,
      enum: [
        'bijoy_dibosh',
        'shadhinota_dibosh',
        'shok_dibosh',
        'election_campaign',
        'eid_celebration',
        'pohela_boishakh',
        'ekushey_february',
        'shuvechcha',
      ],
      index: true,
    },
    thumbnailUrl: { type: String, default: '' },
    layoutConfig: { type: layoutConfigSchema, required: true },
    isActive: { type: Boolean, default: true },
    recommendedParties: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Template = mongoose.model<ITemplate>('Template', templateSchema);
