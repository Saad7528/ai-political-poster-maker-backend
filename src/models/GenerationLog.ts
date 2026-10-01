import mongoose, { Document, Schema } from 'mongoose';

export interface IGenerationLog extends Document {
  posterId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  occasionType: string;
  geminiPromptUsed: string;
  responsePreview?: string;
  tokensUsed?: number;
  keyIndexUsed: number;
  latencyMs: number;
  success: boolean;
  errorMessage?: string;
  createdAt: Date;
}

const generationLogSchema = new Schema<IGenerationLog>(
  {
    posterId: { type: Schema.Types.ObjectId, ref: 'Poster' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    occasionType: { type: String, default: 'general' },
    geminiPromptUsed: { type: String, required: true },
    responsePreview: { type: String },
    tokensUsed: { type: Number, default: 0 },
    keyIndexUsed: { type: Number, default: 0 },
    latencyMs: { type: Number, default: 0 },
    success: { type: Boolean, default: true },
    errorMessage: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const GenerationLog = mongoose.model<IGenerationLog>('GenerationLog', generationLogSchema);
