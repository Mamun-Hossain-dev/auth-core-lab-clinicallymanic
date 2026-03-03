import { InferSchemaType, Schema, model } from 'mongoose'

const newsletterSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
)

export type Newsletter = InferSchemaType<typeof newsletterSchema>

const NewsletterModel = model<Newsletter>('Newsletter', newsletterSchema)

export default NewsletterModel
