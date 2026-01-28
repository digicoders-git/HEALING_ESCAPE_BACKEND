import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true
    },

    category: {
      type: String,
    },

    date: {
      type: String,
    },

    image: {
      type: String,
    },

    imagePublicId: {
      type: String,
    },

    excerpt: {
      type: String,
    },

    introduction: {
      type: String,
    },

    content: {
      type: String,
    },

    whyThisMatters: {
      type: String,
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
