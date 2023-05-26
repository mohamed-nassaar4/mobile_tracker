import type { NextApiRequest, NextApiResponse } from 'next'
import login from '../../accounts/msec/login'
type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try{
    return await login(req,res)
  }catch(e){
    console.log(e);
    res.send({msg:'cannot load data'})
    
  }
}
