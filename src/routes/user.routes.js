import { Router } from "express";
import { login, signup , logout , getLoggedInUser, updateUser } from "../controller/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.route('/signup').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    }
  ]),
  signup,
);

router.route('/login').post(
  login,
);


router.route('/logout').post(
  logout,
);

router.route('/get-logged-in-user').post(
  getLoggedInUser,
)

router.route('/update-user').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    }
  ]),
  updateUser,
)

export default router;