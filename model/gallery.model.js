import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      trim: true
    },

    image: {
      type: String,
    },

    imagePublicId: {
      type: String,
    },

    caption: {
      type: String,
    },

    isActive: {
      type: Boolean,
    }
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
