import {
    getDistrictByCodeAndProvinceCodeService,
    getProvinceByCodeService,
    getWardByCodeAndDistrictCodeService,
} from "#src/modules/vietnam-provinces/vietnam-provinces.service";

export const validateShippingAddress = (provinceCode, districtCode, wardCode) => {
    const province = getProvinceByCodeService(provinceCode);

    const district = getDistrictByCodeAndProvinceCodeService(provinceCode, districtCode);

    const ward = getWardByCodeAndDistrictCodeService(districtCode, wardCode);

    const isValid = province && district && ward;

    if (!isValid) {
        return;
    }

    return {
        province,
        district,
        ward,
    }
}