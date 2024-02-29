import { S3Client } from '@aws-sdk/client-s3'

import { getCredentials } from './lib/get-credentials'
import { emptyBucket } from '../lib/s3-empty-bucket'

const s3EmptyBucket = () => {
  const bucketName = process.argv[2]
  const ssoProfile = process.argv[3]

  const credentials = getCredentials({ ssoProfile })
  const s3Client = new S3Client({ credentials })

  emptyBucket({ bucketName, s3Client })
}

export { s3EmptyBucket }
