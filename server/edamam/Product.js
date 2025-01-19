import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();

export const getProductDetails = async (foodId) => {
    const response = await axios.get(`https://api.edamam.com/search?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}&q=${foodId}`);
    return response.data;
}

export const filterDetails = async (product) => {
    const filteredRecipes = product.map((hit) =>{
        const { uri, label, source, url, ingredients } = hit.recipe;
        return { uri, label, source, url, ingredients };
    });
    return filteredRecipes;
}