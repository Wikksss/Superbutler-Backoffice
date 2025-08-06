import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';

export let getAllCountries = async () => {
    try {
        const response = await
            fetch(UrlConstant.COUNTRY,
                {
                    method: 'GET',
                    headers: Config.headers,
                })
        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return result
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}
export let getActiveCountries = async () => {
    try {
        const response = await
            fetch(UrlConstant.ACTIVE_COUNTRIES,
                {
                    method: 'GET',
                    headers: Config.headers,
                })
        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return result
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}
export let getCountry = async (countryId) => {
    try {
        const response = await
            fetch(UrlConstant.COUNTRY + "/" + countryId,
                {
                    method: 'GET',
                    headers: Config.headers,
                })
        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return result
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';
    }
    catch (e) {
        console.log('error: ', e);
        return {};
    }
}
export let updateCountryConfig = async (countryId, configuration) => {
    try {
        const response = await
            fetch(UrlConstant.UpdateConfig + "/" + countryId,
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(configuration),
                })
        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return result
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}

export let getCurrencyConversion = async () => {
  try {
    const response = await fetch(
      'https://v6.exchangerate-api.com/v6/e43ab50096d53e67563b701a/latest/EUR',
    );

    if (response.status === 200) {
      const result = await response.json();
      return result;
    }

    const result = await response.json();
    return {message: result[0]};
  } catch (e) {
    console.error(e);
  }
}