// const URL = 'https://provinces.open-api.vn/api';
import mongoose from "mongoose";
const db = mongoose.connection;

export const validateProvinceCode = async (provinceCode) => {
    try {
        const result = await db.collection('provinces').findOne({code: provinceCode})

        if (!result) {
            return {
                isValid: false,
                error: "Provices not found"
            };
        }

        return {
            isValid: true,
            data: {
                name: result.name,
                code: result.code
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const validateDistrictCode = async (provinceCode, districtCode) => {
    try {
        const result = await db.collection('districts').findOne({code: districtCode})

        if (!result) {
            return {
                isValid: false,
                error: "District not found"
            };
        }

        if (result.province_code !== provinceCode) {
            return {
                isValid: false,
                error: "District is invalid"
            };
        }

        return {
            isValid: true,
            data: {
                name: result.name,
                code: result.code
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const validateWardCode = async (districtCode, wardCode) => {
    try {
        const result = await db.collection('wards').findOne({code: wardCode});
        
        if (!result) {
            return {
                isValid: false,
                error: "Ward not found"
            };
        }

        if (result.district_code !== districtCode) {
            return {
                isValid: false,
                error: "Ward is invalid"
            };
        }

        return {
            isValid: true,
            data: {
                name: result.name,
                code: result.code
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const validateAndGetAddress = async (provinceCode, districtCode, wardCode) => {
    try {
        const [provinceResult, districtResult, wardResult] = await Promise.all([
            validateProvinceCode(provinceCode),
            validateDistrictCode(provinceCode, districtCode),
            validateWardCode(districtCode, wardCode)
        ]);

        const isValid = provinceResult.isValid && districtResult.isValid && wardResult.isValid;

        if (!isValid) {
            return {
                isValid: false,
                errors: {
                    province: !provinceResult.isValid ? provinceResult.error : "OK",
                    district: !districtResult.isValid ? districtResult.error : "OK",
                    ward: !wardResult.isValid ? wardResult.error : "OK"
                }
            };
        }

        return {
            isValid: true,
            data: {
                province: provinceResult.data.name,
                district: districtResult.data.name,
                ward: wardResult.data.name
            }
        };

    } catch (error) {
        console.log(error);
    }
}