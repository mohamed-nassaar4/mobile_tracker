import type { NextApiRequest, NextApiResponse } from 'next'
import otpverify from '../../accounts/msec/otpverify';
type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try{
    return await otpverify(req,res);
  }catch(e){
    console.log(e);
    res.send({msg:'cannot load data'})
    
  }
}