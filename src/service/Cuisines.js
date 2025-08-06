import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
//import * as Utilities from  '../helpers/Utilities';

export let getAll = async () => {
    try {
        const response = await
            fetch(UrlConstant.FoodTypeCuisine,
                {
                    method: 'GET',
                    headers: Config.headers,
                })
        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return JSON.parse(result.Dictionary.FoodTypeDictionary);
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}

export let Save = async (cuisineObj) => {
    try {
        const response = await
            fetch(UrlConstant.FoodTypeCuisine + "Save",
                {
                    method: 'POST',
                    headers: Config.headers,
                    body: JSON.stringify(cuisineObj),
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsSaved === true) {
                return '1';
            }
        }
        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '0';
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}

export let Update = async (cuisineObj) => {
    try {
        const response = await
            fetch(UrlConstant.FoodTypeCuisine + "Update",
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(cuisineObj),
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsUpdated === true) {
                return '1';
            }
        }
        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '0';
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}

export let Delete = async (cuisineObj) => {
    try {
        const response = await
            fetch(UrlConstant.FoodTypeCuisine + "Delete",
                {
                    method: 'DELETE',
                    headers: Config.headers,
                    body: JSON.stringify(cuisineObj),
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsDeleted === true) {
                return '1';
            }
        }
        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '0';
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}

export let AddPhoto = async (cuisineObj) => {
    try {
        const response = await
            fetch(UrlConstant.FoodTypeCuisine + "Photo",
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(cuisineObj),
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsUpdated === true) {
                return '1';
            }
        }
        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '0';
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}