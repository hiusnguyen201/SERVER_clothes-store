import pkg from 'vietnam-provinces';
const {
    getProvinces,
    getDistricts,
    getWards } = pkg;

export const getProvinceByCodeService = (provinceCode) => {
    try {
        const provinces = getProvinces(provinceCode);
        const province = provinces.find(p => p.code == provinceCode)

        return province;
    }
    catch (error) {
        console.log(error);
    }
}

export const getDistrictByCodeAndProvinceCodeService = (provinceCode, districtCode) => {
    try {
        const districts = getDistricts(provinceCode);
        const district = districts.find(d => d.code == districtCode);

        return district;
    } catch (error) {
        console.log(error);
    }
}

export const getWardByCodeAndDistrictCodeService = (districtCode, wardCode) => {
    try {
        const wards = getWards(districtCode);
        const ward = wards.find(w => w.code == wardCode);

        return ward;
    } catch (error) {
        console.log(error);
    }
}