import type { VercelRequest, VercelResponse } from '@vercel/node'
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  region: 'eu-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { key } = req.query

  if (typeof key !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid key' })
  }

  const url = s3.getSignedUrl('getObject', {
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Expires: 60
  })

  res.status(200).json({ url })
}