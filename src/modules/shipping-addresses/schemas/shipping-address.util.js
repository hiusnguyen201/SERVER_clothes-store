const URL = 'https://provinces.open-api.vn/api';

export const validateCityCode = async (cityCode) => {
    try {
        const response = await fetch(`${URL}/p/${cityCode}`);
        if (!response.ok) {
            return {
                isValid: false,
                error: "City not found"
            };
        }
        const json = await response.json();

        return {
            isValid: true,
            data: {
                name: json.name,
                code: json.code
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const validateDistrictCode = async (cityCode, districtCode) => {
    try {
        const response = await fetch(`${URL}/d/${districtCode}`);
        if (!response.ok) {
            return {
                isValid: false,
                error: "District not found"
            };
        }
        const json = await response.json();

        if (json.province_code !== cityCode) {
            return {
                isValid: false,
                error: "District is invalid"
            };
        }

        return {
            isValid: true,
            data: {
                name: json.name,
                code: json.code
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const validateWardCode = async (districtCode, wardCode) => {
    try {
        const response = await fetch(`${URL}/d/${wardCode}?depth=2`);
        if (!response.ok) {
            return {
                isValid: false,
                error: "Ward not found"
            };
        }
        const json = await response.json();

        const findWard = json.wards.find(ward => ward.code === wardCode);
        if (!findWard || findWard.district_code !== districtCode) {
            return {
                isValid: false,
                error: "Ward is invalid"
            };
        }

        return {
            isValid: true,
            data: {
                name: json.name,
                code: json.code
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const validateAndGetAddress = async (cityCode, districtCode, wardCode) => {
    try {
        const [cityResult, districtResult, wardResult] = await Promise.all([
            validateCityCode(cityCode),
            validateDistrictCode(cityCode, districtCode),
            validateWardCode(districtCode, wardCode)
        ]);

        const isValid = cityResult.isValid && districtResult.isValid && wardResult.isValid;

        if (!isValid) {
            return {
                isValid: false,
                errors: {
                    city: !cityResult.isValid ? cityResult.error : "OK",
                    district: !districtResult.isValid ? districtResult.error : "OK",
                    ward: !wardResult.isValid ? wardResult.error : "OK"
                }
            };
        }

        return {
            isValid: true,
            data: {
                city: cityResult.data.name,
                district: districtResult.data.name,
                ward: wardResult.data.name
            }
        };

    } catch (error) {
        console.log(error);
    }
} 