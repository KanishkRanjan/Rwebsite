import express ,{Router} from "express"
import { userProfile } from "../controllers/profile";

const router:Router = express.Router();

router.get('/:id' , userProfile)

export default router;