import { UserModel } from "#src/modules/users/schemas/user.schema";
import { NotFoundException } from "#src/http-exception";

async function createUser(
  email,
  avatar = "",
  name,
  phone,
  birthday,
  gender = null,
) {
  const newUser = await User.create({
    avatar,
    name,
    phone,
    birthday,
    gender,
  });
  return newUser;
}

async function checkExistedUser({ email, id }) {
  //handle some logic query here
  query = {};

  if (email) {
    query.email = email;
  }

  if (id) {
    query._id = id;
  }

  if (email && id) {
    query.$or = [{ email }, { _id: id }];
  }

  if (!email && !id) {
    return null;
  }

  const user = await UserModel.findOne({ query });
  return user;
}

async function findAllUsers(data) {
  let {
    keyword,
    sortBy = "name-atoz",
    status,
    itemPerPage = 10,
    page = 1,
  } = data;

  let filters = {};

  if (keyword) {
    const regEx = new RegExp(keyword, "i");
    filters = {
      $or: [{ name: regEx }, { email: regEx }],
    };
  }

  if (status) {
    filters.status = { $in: status };
  }

  let sort = {};

  switch (sortBy) {
    case "name-atoz":
      sort.name = 1;
      break;
    case "name-ztoa":
      sort.name = -1;
      break;
    default:
      sort.name = 1;
      break;
  }
  const totalItems = await UserModel.countDocuments(filters);
  const totalPages = Math.ceil(totalItems / itemPerPage);

  if (page <= 0 || !page) {
    page = 1;
  } else if (page > totalPages && totalPages >= 1) {
    page = totalPages;
  }

  const offSet = (page - 1) * itemPerPage;

  const users = await UserModel.find(filters).skip(offSet).limit(itemPerPage);

  return {
    list: users,
    meta: {
      offSet,
      itemPerPage,
      currentPage: page,
      totalPages,
      totalItems,
      isNext: page < totalPages,
      isPrevious: page > 1,
      isFirst: page > 1 && page <= totalPages,
      isLast: page >= 1 && page < totalPages,
    },
  };
}

async function findOneUserById(id) {
  if (!id) {
    throw new Error();
  }

  const user = await UserModel.findById(id);

  if (!user) {
    throw new Error();
  }

  return user;
}

async function updateUserById(id, data) {
  const { avatar, name, phone, birthday, gender } = data;

  if (!id) {
    throw new Error();
  }

  const user = await User.findByIdAndUpdate(
    id,
    { avatar, name, phone, birthday, gender },
    { new: true },
  );

  if (!user) {
  }
  return user;
}

async function removeUserById(id) {
  if (!id) {
    throw new Error();
  }
  const user = await UserModel.findByIdAndDelete(id);

  if (!user) {
    throw new Error();
  }

  return "Deleted";
}

//export move bottom of file
export {
  createUser,
  findAllUsers,
  findOneUserById,
  updateUserById,
  removeUserById,
  checkExistedUser,
};
