import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["image", "video"],
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    video: {
        url: String,     
        provider: {
            type: String,
            enum: ["s3", "youtube", "vimeo", "other"]
        },
        duration: Number, // in seconds
        thumbnail: String
    }
}, { _id: false });


const newsArticleSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    views: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        required: true
    },
    content: {
        np: {
            title: { type: String, required: true },
            summary: { type: String, default: "" },
            body: { type: String, default: "" }
        },
        en: {
            title: { type: String, required: true },
            summary: { type: String, default: "" },
            body: { type: String, default: "" }
        }
    },
    media: mediaSchema
},
    { timestamps: true });


// Text index for search
newsArticleSchema.index({
    "content.np.title": "text",
    "content.np.body": "text",
    "content.en.title": "text",
    "content.en.body": "text"
}, {
    weights: {
        "content.np.title": 5,
        "content.en.title": 5,
        "content.np.body": 3,
        "content.en.body": 3,
        "content.en.body": 3
    }
});


// virtual comments

newsArticleSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "newsId",
    justOne: false
});

newsArticleSchema.set("toObject", { virtuals: true });
newsArticleSchema.set("toJSON", { virtuals: true })


const NewsArticle = mongoose.model("NewsArticle", newsArticleSchema);

export default NewsArticle;