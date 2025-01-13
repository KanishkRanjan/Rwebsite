import { NextFunction , Request , Response } from "express";
import UserModel from "../models/user.model";
import CustomError from "../utils/error/custom.error";
import CustomResponse from "../utils/responder";

export const userProfile = async (req:Request , res : Response , next : NextFunction) =>{
    try {
        const {id} = req.params
        const userData = await UserModel.findById(id);
        if (!userData) {
            return next(new CustomError("User id was not found in Database" , 400));
        }
        return next(new CustomResponse("Problem deleted successfully" , 200));
    } catch (error) {
      console.error("Error during finding user by Id:", error);
      return next(new CustomError("Error during finding user by Id" , 500));
    }
}