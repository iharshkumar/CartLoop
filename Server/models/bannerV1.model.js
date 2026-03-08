import mongoose from "mongoose"

const bannerV1Schema = new mongoose.Schema({
    bannerTitle: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    catId: {
        type: String,
        default: '',
        required: true
    },
    subCatId: {
        type: String,
        default: '',
        required: true
    },
    thirdsubCatId: {
        type: String,
        default: '',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
},
    { timestamps: true }
)

const BannerV1Model = mongoose.model("BannerV1", bannerV1Schema)

export default BannerV1Model
