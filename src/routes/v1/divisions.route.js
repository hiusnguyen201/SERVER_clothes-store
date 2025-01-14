import express from "express";
const router = express.Router();

import {
  getAllProvincesController,
  getAllDistrictsController,
  getAllWardsController,
  getProvinceByCodeController,
  getDistrictByCodeController,
  getWardByCodeController,
  getAllDistrictsByProvinceCodeController,
  getAllWardsByDistrictCodeController,
} from "#src/modules/divisions/divisions.controller";

router
  .get("/get-all-provinces", getAllProvincesController)
  .get("/get-all-districts", getAllDistrictsController)
  .get("/get-all-wards", getAllWardsController)
  .get(
    "/get-all-districts-by-province-code/:provinceCode",
    getAllDistrictsByProvinceCodeController
  )
  .get(
    "/get-all-wards-by-district-code/:districtCode",
    getAllWardsByDistrictCodeController
  )
  .get("/get-province-by-code/:code", getProvinceByCodeController)
  .get("/get-district-by-code/:code", getDistrictByCodeController)
  .get("/get-ward-by-code/:code", getWardByCodeController);

export default router;
