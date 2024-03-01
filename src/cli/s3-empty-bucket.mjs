import { S3Client } from '@aws-sdk/client-s3'

import commandLineArgs from 'command-line-args'

import { getCredentials } from './lib/get-credentials'
import { emptyBucket } from '../lib/s3-empty-bucket'

const cliSpec = {
  mainCommand : 's3-empty-bucket',
  mainOptions : [
    { name : 'bucketName', defaultOption : true, description : 'The name of the bucket to empty.' },
    { name : 'profile', alias : 'p', description : 'The SSO profile to use.' },
    { name : 'quiet', alias : 'q', type : Boolean, description : 'Suppresses output.' },
    { 
      name : 'throw-error', 
      type: Boolean, 
      description: 'Instead of printing simple message, allows exceptions to bubble up to the user.'
    }
  ]
}

const s3EmptyBucket = async () => {
  const options = commandLineArgs(cliSpec.mainOptions)
  const { bucketName, profile, quiet } = options
  const throwError = options['throw-error']

  try {
    const credentials = getCredentials({ ssoProfile : profile })
    const s3Client = new S3Client({ credentials })

    await emptyBucket({ bucketName, s3Client, verbose : !quiet })
  }
  catch (e) {
    if (throwError === true) {
      throw e
    }
    else if (e.name === 'CredentialsProviderError') {
      process.stderr.write("Could not authenticate with AWS. You must either:\n\n1) (preferred) Create a user in the IAM Identity Center and use the command 'aws aws sso login' or 'aws sso login --profile your-profile-name' and excecute 's3-empty-bucket your-bucket-name --profile your-profile-name'.\n2) Generate API keys and place in the '~/.aws/credentials' file.\n\n")
    }
    else {
      process.stderr.write(e.message + '\n')
    }
  }
}

export { s3EmptyBucket }
