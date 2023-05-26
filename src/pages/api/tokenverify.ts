import type { NextApiRequest, NextApiResponse } from 'next'
import tokenverify from '../../accounts/msec/tokenverify'
type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try{
    return await tokenverify(req,res);
  }catch(e){
    console.log(e);
    res.send({msg:'cannot load data'})
    
  }
}