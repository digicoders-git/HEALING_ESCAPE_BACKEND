import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
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

    date: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    imagePublicId: {
      type: String,
      required: true
    },

    excerpt: {
      type: String,
      required: true
    },

    introduction: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true
    },

    whyThisMatters: {
      type: String,
      required: true
    },

    relatedIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
