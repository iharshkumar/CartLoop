import mongoose from "mongoose"

const bannerV2Schema = new mongoose.Schema({
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
        default: ''
    },
    subCatId: {
        type: String,
        default: '',
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
    alignInfo: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)

const BannerV2Model = mongoose.model("BannerV2", bannerV2Schema)

export default BannerV2Model
