import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true
    },

    thumbnail: {
      type: String,
      required: true
    },

    thumbnailPublicId: {
      type: String,
      required: true
    },

    videoUrl: {
      type: String,
      required: true
    },

    videoPublicId: {
      type: String,
      required: true
    },

    duration: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    whatYouWillLearn: [
      {
        type: String,
        required: true
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
