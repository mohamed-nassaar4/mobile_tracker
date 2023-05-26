import pool from '../config/config';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import  env from 'dotenv'
env.config();
import type { NextApiRequest, NextApiResponse } from 'next'

interface Arg{
    email_id:string;
    user_name:string;
    otp:number;
  }
async function genToken(user:Arg) {
    let token = jwt.sign(user, `${process.env.jwt_secret_key}`, {
      expiresIn: "20h",
    });   
         return token;
  }


export default async function otpverify(req:NextApiRequest,res:NextApiResponse) {
        let arg=req.body
        try {
          let existOtp = await pool.query(`select * from accounts where otp='${arg.otp}'`);
          let existTime = existOtp.rows[0].last_updated_time;
          let mins5 = moment(existTime).add({ minutes: 5 })
            .format("YYYY-MM-DD HH:mm:ss");
          console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
          console.log(mins5);
          console.log(moment(mins5).isAfter(moment().format("YYYY-MM-DD HH:mm:ss")));
          if (existOtp.rowCount == 0) {
            let obj = {
              msg: "please enter valid otp",
              otp: arg.otp
            }
            return res.status(400).json(obj)
          }
          else {
            if (existOtp.rows[0].otp == arg.otp) {
              if (moment(mins5).isAfter(moment().format())) {
                // console.log('hii');
                let token = await genToken(arg);
                console.log(token);
                let obj = {
                  msg: "token created successfully",
                  data: arg,
                  token:token
                }
                return res.status(200).json(obj)
              }
              else {
                // await pool.query(`update accounts set otp=null,last_updated_time='${moment().format('YYYY-MM-DD HH:mm:ss')}' where otp='${arg.otp}'`);
                let obj = {
                  msg: "Your OTP is Expired",
                  data: arg
                }
                return res.status(400).json(obj)
              }
            } else {
              let obj = {
                msg: "please enter valid otp",
                otp: arg.otp
              }
              return res.status(400).json(obj)
            }
          }
        } catch (e:any) {
          console.log(e);
          return res.status(400).json({
            msg: 'please enter valid OTP',
            error: e.message
          }) 
        }
      }
