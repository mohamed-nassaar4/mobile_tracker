import jwt from 'jsonwebtoken'
import env from 'dotenv';
import type { NextApiRequest, NextApiResponse } from 'next'
env.config()
interface Arg {

}
export default async function verifyToken(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.headers['authorization']) {
      console.log(req.headers['authorization'])
      console.log('tokkkkkkkk');
      let token = req.headers.authorization.replace(/Bearer /g, "");
      const decodedToken = jwt.decode(token);
      const newExpiration = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
      // decodedToken.exp = newExpiration;
      // console.log(decodedToken);
     jwt.verify(token, `${process.env.jwt_secret_key}`, (err, decoded) => {
        if (err instanceof jwt.TokenExpiredError) {
          console.log('expired');
          return res.status(400).json({ msg: "Token expired", expiredAt: err.expiredAt });
        } else if (err) {
          console.log(err);
          return res.status(400).json({ msg: "unauthorized" });
        } else {
          console.log(decoded, "decoded");
          return res.status(200).json({ msg: 'successfully token verified' })
          // res.redirect('/api/hello')
        }
      });
    } else {
      return res.status(400).json({ msg: "unauthorized user,,,," });
    }
  } catch (e: any) {
    console.log(e);
    return res.status(400).json({
      msg: 'internal server error',
      error: e.message
    })
    // res.send(e.message)

  }
}

    // module.exports=verifyToken;