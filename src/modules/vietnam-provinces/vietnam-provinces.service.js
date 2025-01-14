import pkg from 'vietnam-provinces';
const {
    getProvinces,
    getDistricts,
    getWards } = pkg;

export const getProvinceByCodeService = (provinceCode) => {
    try {
        const provinces = getProvinces(provinceCode);
        const province = provinces.find(p => p.code == provinceCode)

        if (!province) {
            return {
                isValid: false,
                error: "Province is invalid"
            }
        }

        return {
            isValid: true,
            data: {
                name: province.name,
                code: province.code
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const getDistrictByCodeAndProvinceCodeService = (provinceCode, districtCode) => {
    try {
        const districts = getDistricts(provinceCode);
        const district = districts.find(d => d.code == districtCode);

        if (!district) {
            return {
                isValid: false,
                error: "District is invalid"
            };
        }

        return {
            isValid: true,
            data: {
                name: district.name,
                code: district.code
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const getWardByCodeAndDistrictCodeService = (districtCode, wardCode) => {
    try {
        const wards = getWards(districtCode);
        const ward = wards.find(w => w.code == wardCode);

        if (!ward) {
            return {
                isValid: false,
                error: "Ward is invalid"
            };
        }

        return {
            isValid: true,
            data: {
                name: ward.name,
                code: ward.code
            }
        }
    } catch (error) {
        console.log(error);
    }
}