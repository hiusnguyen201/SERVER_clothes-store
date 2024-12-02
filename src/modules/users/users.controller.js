import HttpStatus from "http-status-codes";
import {
  createUser,
  findAllUsers,
  findOneUserById,
} from "#src/modules/users/users.service";

// Handle logical code from CONTROLLER
// In Controller function make clearly like loginController, registerController
// Don't write query database

// Don't create name a function very similar
// like create, findAll, findOne, update, remove
// Define clearly what each function does, what each function responsibility
// *change create => createUser
export const createUserController = async (req, res, next) => {
  try {
    //handle logic
    // don't write query database in here

    const { avatar = "", name, phone, birthday, gender, email } = req.body;

    if (!name) {
      throw new BadRequestException("Field name must be required");
    }

    checkExistedUser = await checkExistedUser({ email });

    if (checkExistedUser) {
      throw new BadRequestException("Email already exists");
    }

    const user = await createUser(email, avatar, name, phone, birthday, gender);

    return res.json({
      statusCode: HttpStatus.CREATED,
      message: "Create user successfully",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// *change findAll => getAllUsersController
export const getAllUsersController = async (req, res, next) => {
  try {
    const data = await findAllUsers(req.query);
    return res.json({
      statusCode: HttpStatus.OK,
      message: "Find all users successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    checkExistedUser = await checkExistedUser({ id });

    if (checkExistedUser) {
      throw new BadRequestException("Email already exists");
    }
    const user = await findOneUserById(req.params.identify);
    return res.json({
      statusCode: HttpStatus.OK,
      message: "Find one user successfully",
      data: {
        user: user,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserByIdController = async (req, res, next) => {
  try {
    const data = await updateUserById(req.params.identify, req.body);
    return res.json({
      statusCode: HttpStatus.OK,
      message: "Update user successfully",
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

export const removeUserByIdController = async (req, res, next) => {
  try {
    const data = await removeUserById(req.params.identify);
    return res.json({
      statusCode: HttpStatus.OK,
      message: "Remove user successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};
