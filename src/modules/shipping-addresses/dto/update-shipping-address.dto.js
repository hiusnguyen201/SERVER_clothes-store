import Joi from "joi";
import { replaceMultiSpacesToSingleSpace } from "#src/utils/string.util";
import { REGEX_PATTERNS } from "#src/core/constant";
import {
  getDistrictByCodeService,
  getProvinceByCodeService,
  getWardByCodeService,
} from "#src/modules/divisions/divisions.service";

export const updateShippingAddressDto = Joi.object({
  address: Joi.string()
    .min(3)
    .max(100)
    .custom((value) => replaceMultiSpacesToSingleSpace(value)),
  province: Joi.string()
    .pattern(REGEX_PATTERNS.STRING_NUMBER)
    .custom((value, helpers) => {
      const province = getProvinceByCodeService(value);
      if (!province) {
        return helpers.message("Province is not found");
      }
      return province.name;
    }),
  district: Joi.string()
    .pattern(REGEX_PATTERNS.STRING_NUMBER)
    .custom((value, helpers) => {
      const { provinceCode } = helpers.state.ancestors[0];
      const district = getDistrictByCodeService(value);
      if (!district || district.province_code !== provinceCode) {
        return helpers.message("District is not found");
      }
      return district.name;
    }),
  ward: Joi.string()
    .pattern(REGEX_PATTERNS.STRING_NUMBER)
    .custom((value, helpers) => {
      const { districtCode } = helpers.state.ancestors[0];
      const ward = getWardByCodeService(value);
      if (!ward || ward.district_code !== districtCode) {
        return helpers.message("Ward is not found");
      }
      return ward.name;
    }),
});
