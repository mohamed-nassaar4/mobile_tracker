import { NextApiRequest, NextApiResponse } from "next";
import pool from '../config/config';
import moment from 'moment';
import nodemailer, { TransportOptions } from 'nodemailer';

const options:object = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: '587', // must be 587 for gmail
  auth: {
    user: 'mdnassaar4@gmail.com',
    pass: 'dtdzodybmhzlfjsx'
  },
}
let transporter = nodemailer.createTransport(options);
function random() {
  let floor = `${Math.floor(Math.random() * 8877223465)}`;
  let otp = floor.substring(0, 6);
  console.log(otp);
  return otp;
}

interface Arg {
  email_id: string;
  user_name: string;
}

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  let arg = req.body;
  try {
    let accounts = await pool.query(`select * from accounts where email_id='${arg.email_id}'`);
    let users = accounts.rows[0]
    let otp = random();
    let time = moment().format('YYYY-MM-DD HH:mm:ss')
    // let existEmail=accounts.rows[0].email_id;
    // console.log(existEmail);/
    if (arg.email_id && arg.user_name) {
      if (accounts.rowCount == 0) {
        console.log('success');
        let mailOptions = {
          from: 'mdnassaar4@gmail.com',
          to: `${arg.email_id}`,
          subject: 'Sending Email with MSEC mobile tracker',
          text: `your OTP  is ${otp}`
        };

        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log(error);
            return res.status(400).json({ msg: 'otp sending is failed please enter valid Email_id' })
          } else {
            let insert = await pool.query(`insert into accounts (email_id,user_name,otp,last_updated_time) values ('${arg.email_id}','${arg.user_name}','${otp}','${time}') returning *`);
            let obj = {
              msg: "otp sended successfully",
              data: arg,
              otp: otp
            }
            console.log('Email sent: ' + info.response);
            // res.send({msg:`${otp} send successfully to user`});
            return res.status(200).json(obj)
          }
        });
      }
      else if (users.email_id != null || users.email_id != undefined) {
        console.log('failure');
        let mailOptions = {
          from: 'mdnassaar4@gmail.com',
          to: `${users.email_id}`,
          subject: 'Sending Email with MSEC mobile tracker',
          text: `your OTP  is ${otp}`
        };

        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log(error);
            return res.status(400).json({ msg: 'otp sending is failed please enter valid Email_id' })
          } else {
            let update = await pool.query(`update accounts set otp='${otp}',last_updated_time='${time}' where email_id='${arg.email_id}'`);
            console.log('Email sent: ' + info.response);
            let obj = {
              msg: "otp sended successfully",
              data: arg,
              otp: otp
            }
            console.log(obj);
            // res.send({msg:`${otp} send successfully to user`})
            return res.status(200).json(obj)
          }
        });

      }
    }
    else {
      return res.status(400).json({ msg: 'enter BOTH email_id and user_name ' })
    }

  } catch (e: any) {
    console.log('daiii');
    console.log(e)
    return res.status(400).json({
      msg: 'internal server error',
      error: e.message
    })
  }
}
// export  login;
// module.exports = login;
