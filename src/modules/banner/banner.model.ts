import { InferSchemaType, Schema, model } from 'mongoose'

const bannerSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    bannerImageUrl: { type: String, required: false },
    bannerImagePublicId: { type: String, required: false },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

export type Banner = InferSchemaType<typeof bannerSchema>

const BannerModel = model<Banner>('Banner', bannerSchema)

export default BannerModel
