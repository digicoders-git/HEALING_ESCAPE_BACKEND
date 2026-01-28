import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true
    },

    category: {
      type: String,
    },

    thumbnail: {
      type: String,
    },

    thumbnailPublicId: {
      type: String,
    },

    videoUrl: {
      type: String,
    },

    videoPublicId: {
      type: String,
    },

    duration: {
      type: String,
      required: true
    },

    description: {
      type: String,
    },

    whatYouWillLearn: [
      {
        type: String,
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
