import { Router } from "express";
import { login, signup , logout , getLoggedInUser } from "../controller/user.controller.js";
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

export default router;