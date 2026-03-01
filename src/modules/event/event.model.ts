import { InferSchemaType, model, Schema } from 'mongoose'

const eventSchema = new Schema(
  {
    thumbnail: { type: String, required: true },
    thumbnailPublicId: { type: String, required: false },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
)

export type Event = InferSchemaType<typeof eventSchema>

const EventModel = model<Event>('Event', eventSchema)
export default EventModel
