import Joi from "joi";
import { replaceMultiSpacesToSingleSpace } from "#src/utils/string.util";
import { REGEX_PATTERNS } from "#src/core/constant";
import {
  getDistrictByCodeAndProvinceCodeService,
  getProvinceByCodeService,
  getWardByCodeAndDistrictCodeService,
} from "#src/modules/vietnam-provinces/vietnam-provinces.service";

export const createShippingAddressDto = Joi.object({
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
      const district = getDistrictByCodeAndProvinceCodeService(
        value,
        provinceCode
      );
      if (!district) {
        return helpers.message("District is not found");
      }
      return district.name;
    }),
  ward: Joi.string()
    .pattern(REGEX_PATTERNS.STRING_NUMBER)
    .custom((value, helpers) => {
      const { districtCode } = helpers.state.ancestors[0];
      const ward = getWardByCodeAndDistrictCodeService(
        value,
        districtCode
      );
      if (!ward) {
        return helpers.message("Ward is not found");
      }
      return ward.name;
    }),
});
