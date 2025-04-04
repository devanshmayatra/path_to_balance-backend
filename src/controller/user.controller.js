import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryServicse.js";


const signup = asyncHandler(async (req, res) => {

  // get user details through frontend
  // validation - details are not empty
  // check if user already exist : through username and email
  // check for images , check for avatar
  // upload them to cloudinary , avatar
  // create user object - create entry in db
  // remove password and refresh token from response
  //check for user creation
  //return response

  const {
    fullName,
    userName,
    email,
    password,
    authType,
    role,
  } = await req.body;

  if ([fullName, email, userName, password].some((field) => field?.trim() === undefined)) {
    throw new ApiError(400, "All Fields are Required");
  }

  if ([fullName, email, userName, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are Required");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "Username or Email already exist");
  }

  let avatarLocalPath;
  if (req.files && Array.isArray(req.files.avatra) && req.files.avatar.length > 0) {
    avatarLocalPath = req.files?.avatar[0]?.path;
  }

  let avatar;

  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath) || "";
  }

  // if (!avatar) {
  //   throw new ApiError(400, "Avatar upload failed");
  // }

  const user = await User.create({
    fullName,
    avatar: avatar?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
    authType,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Succesfully")
  );

});

const login = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;
  if (!userName && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }]
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  };

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  };

  const loggedInUser = await User.findByIdAndUpdate({ _id: user._id }, {
    $set: { isLoggedIn: true }
  }, {
    new: true
  }).select("-password")

  // const options = {
  //   httpOnly: true,
  //   secure: true
  // }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser
        },
        "User logged In Successfully"
      )
    )
});

const logout = asyncHandler(async (req, res) => {

  const id = req.body._id;

  const user = await User.findById(
    id
  );

  if (!user.isLoggedIn) {
    throw new ApiError(401, "Not Logged in");
  }

  await User.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        isLoggedIn: false,
      }
    }, {
    new: true,
  }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out succesfully"));
});

const getLoggedInUser = asyncHandler(
  async (req, res) => {
    const { id } = req.body;
    const user = await User.findById(id);

    if(!user){
      throw new ApiError(404, "User not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {user:user}, "User fetched succesfully."));
  }
)

export {
  signup,
  login,
  logout,
  getLoggedInUser
}