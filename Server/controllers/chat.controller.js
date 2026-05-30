import { GoogleGenerativeAI } from "@google/generative-ai";
import ProductModel from "../models/product.model.js";

export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: true, message: "Message is required" });
        }

        // Basic keyword extraction for searching (split by space and remove small words)
        const keywords = message.toLowerCase().split(' ').filter(w => w.length > 3);
        
        // Search DB for related products based on keywords
        let products = [];
        if (keywords.length > 0) {
            // Construct regex for any of the keywords
            const regex = new RegExp(keywords.join('|'), 'i');
            products = await ProductModel.find({
                $or: [
                    { name: regex },
                    { description: regex },
                    { brand: regex },
                    { catName: regex }
                ]
            }).select('name description price brand catName').limit(10);
        } else {
            // If message is too short, just fetch some featured products
            products = await ProductModel.find({ isFeatured: true }).select('name description price brand catName').limit(5);
        }

        // Create context string
        const contextData = products.length > 0 
            ? products.map(p => `- ${p.name} (Brand: ${p.brand || 'N/A'}, Category: ${p.catName || 'N/A'}) - Price: ₹${p.price}. Description: ${p.description.substring(0, 100)}...`).join('\n')
            : "No specific products found for this query in the database. Tell the user you couldn't find exactly what they were looking for.";

        const prompt = `
You are a helpful, bilingual (English and Hindi) shopping assistant for the "ClassyShop" e-commerce store.
Your goal is to answer user questions politely and assist them in finding products.
CRITICAL RULE: You must ONLY answer questions based on the "Database Context" provided below. 
Do not invent or hallucinate products, prices, or features. 
If the user asks something not related to the store or products, politely decline to answer.
Always respond in the same language the user is speaking (English or Hindi).

DATABASE CONTEXT (Available Products):
${contextData}

User's message: "${message}"

Response:`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return res.status(200).json({
            success: true,
            error: false,
            message: responseText,
            contextUsed: products.length
        });
        
    } catch (error) {
        console.error("Chat API Error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: error.message || "Failed to process chat"
        });
    }
};
