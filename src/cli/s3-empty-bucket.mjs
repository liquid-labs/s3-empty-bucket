import { S3Client } from '@aws-sdk/client-s3'

import commandLineArgs from 'command-line-args'

import { getCredentials } from './lib/get-credentials'
import { emptyBucket } from '../lib/s3-empty-bucket'

const cliSpec = {
  mainCommand : 's3-empty-bucket',
  mainOptions : [
    { name : 'bucketName', defaultOption : true, description : 'The name of the bucket to empty.' },
    { name : 'profile', alias : 'p', description : 'The SSO profile to use.' },
    { name : 'quiet', alias : 'q', type : Boolean, description : 'Suppresses output.' }
  ]
}

const s3EmptyBucket = () => {
  const options = commandLineArgs(cliSpec.mainOptions)
  const { bucketName, profile, quiet } = options

  const credentials = getCredentials({ ssoProfile : profile })
  const s3Client = new S3Client({ credentials })

  emptyBucket({ bucketName, s3Client, verbose : !quiet })
}

export { s3EmptyBucket }
