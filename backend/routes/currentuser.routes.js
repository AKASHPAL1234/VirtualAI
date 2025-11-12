import React from 'react';
import express from "express"
import { isAuth } from '../middleware/isAuth.js';
import { currentUser } from '../controllers/currentuser.controller.js';
import { asktoassistent, updateassistent } from '../controllers/user.contrller.js';
import { upload } from '../middleware/multer.js';

const curuserrouter=express.Router();

curuserrouter.get("/current",isAuth,currentUser)
curuserrouter.post("/update",isAuth,upload.single("assistentimage"),updateassistent)
curuserrouter.post("/asktoassistent",isAuth,asktoassistent)

export default curuserrouter;