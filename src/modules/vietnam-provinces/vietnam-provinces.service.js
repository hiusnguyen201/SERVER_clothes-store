import pkg from "vietnam-provinces";
const { provinces, districts, wards } = pkg;

const provincesMap = new Map(provinces.map((item) => [item.code, item]));
const districtsMap = new Map(districts.map((item) => [item.code, item]));
const wardsMap = new Map(wards.map((item) => [item.code, item]));

export const getProvinceByCodeService = (provinceCode) => {
  const province = provincesMap.get(provinceCode);
  return province ? province : null;
};

export const getDistrictByCodeAndProvinceCodeService = (
  districtCode,
  provinceCode
) => {
  const district = districtsMap.get(districtCode);
  if (!district || district.province_code !== provinceCode) {
    return null;
  }
  return district;
};

export const getWardByCodeAndDistrictCodeService = (
  wardCode,
  districtCode
) => {
  const ward = wardsMap.get(wardCode);
  if (!ward || ward.district_code !== districtCode) {
    return null;
  }
  return ward;
};
