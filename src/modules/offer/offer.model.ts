import { InferSchemaType, Schema, model } from 'mongoose'

const offerSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        thumbnail: { type: String, required: false },
        thumbnailPublicId: { type: String, required: false },
        discount: { type: Number, required: true },
        validUntil: { type: Date, required: true },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
)

export type Offer = InferSchemaType<typeof offerSchema>

const OfferModel = model<Offer>('Offer', offerSchema)

export default OfferModel
