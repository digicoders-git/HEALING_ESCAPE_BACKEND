import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      required: true
    },

    imagePublicId: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
