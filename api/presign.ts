import type { VercelRequest, VercelResponse } from '@vercel/node'
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  region: 'eu-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

const handler = async(req: VercelRequest, res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { key } = req.query

  if (typeof key !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid key' })
  }

  const url = s3.getSignedUrl('getObject', {
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Expires: 30
  })

  res.status(200).json({ url })
}

export default handler