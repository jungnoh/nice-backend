declare module "mongoose" {
  /**
   * @description `mongoose.Document` with timestamps.
   * Add `{timestamps: true}` to options when creating the schema.
   */
  export interface TimestampedDocument extends Document {
    createdAt: Date;
    updatedAt: Date;
  }
}
