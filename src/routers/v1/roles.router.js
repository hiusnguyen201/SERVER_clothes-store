import express from 'express';
const router = express.Router();

import {
  createRoleController,
  getAllRolesController,
  getRoleByIdController,
  updateRoleByIdController,
  removeRoleByIdController,
  isExistRoleNameController,
  activateRoleByIdController,
  deactivateRoleByIdController,
} from '#src/app/v1/roles/roles.controller';
import { createRoleDto } from '#src/app/v1/roles/dtos/create-role.dto';
import { updateRoleDto } from '#src/app/v1/roles/dtos/update-role.dto';
import { validateBody } from '#core/validations/request.validation';
import { checkExistRoleNameDto } from '#src/app/v1/roles/dtos/check-exist-role-name.dto';
import { isAuthorizedAndHasPermission } from '#src/middlewares/jwt-auth.middleware';

router.post('/is-exist-role-name', validateBody(checkExistRoleNameDto), isExistRoleNameController);

router.use([isAuthorizedAndHasPermission]);
router
  .get('/get-roles', getAllRolesController)
  .get('/get-role-by-id/:id', getRoleByIdController)
  .post('/create-role', validateBody(createRoleDto), createRoleController)
  .patch('/update-role-by-id/:id', validateBody(updateRoleDto), updateRoleByIdController)
  .delete('/remove-role-by-id/:id', removeRoleByIdController)
  .patch('/activate-role-by-id/:id', activateRoleByIdController)
  .patch('/deactivate-role-by-id/:id', deactivateRoleByIdController);

export default router;
