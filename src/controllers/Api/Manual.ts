/**
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 * @desc Manual Upload controller
 * @access Public
 *
 */
import multer from "multer";
import { Request, Response } from "express"
import Log from "../../middlewares/Log"

// SET STORAGE
const storage = multer.diskStorage({
	destination (req, file, cb) {
		cb(null, '/tmp/uploads/manual/')
	},
	filename (req, file, cb) {
		cb(null, `${Date.now()}`+ file.originalname.replace(/\s+/g, "-").toLowerCase())
	}
})

const  upload = multer({ storage })

export default upload
