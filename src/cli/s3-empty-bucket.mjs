import { S3Client } from '@aws-sdk/client-s3'

import commandLineArgs from 'command-line-args'
import { commandLineDocumentation } from 'command-line-documentation'
import commandLineUsage from 'command-line-usage'

import { cliSpec } from './lib/cli-spec'
import { getCredentials } from './lib/get-credentials'
import { emptyBucket } from '../lib/s3-empty-bucket'

const s3EmptyBucket = async () => {
  let options
  try {
    options = commandLineArgs(cliSpec.mainOptions)
  } catch (e) {
    handleError(e, false /* do not throw error */)
  }
  const { bucketName, document: doDocument, help, profile, quiet } = options
  const throwError = options['throw-error']

  if (help === true || Object.keys(options).length === 0) {
    handleHelp()
    return
  } else if (doDocument === true) {
    console.log(commandLineDocumentation(cliSpec, { sectionDepth : 2, title : 'CLI command reference' }))
    return
  }

  try {
    const credentials = getCredentials({ ssoProfile : profile })
    const s3Client = new S3Client({ credentials })

    await emptyBucket({ bucketName, s3Client, verbose : !quiet })
  } catch (e) {
    handleError(e, throwError)
  }
}

const handleError = (e, throwError) => {
  let errorCode = 2
  if (throwError === true) {
    throw e
  } else if (e.name === 'UNKNOWN_OPTION') {
    process.stderr.write(`Unknown option: ${e.optionName}\n\n`)
    handleHelp()
    errorCode = 2
  } else if (e.name === 'CredentialsProviderError') {
    process.stderr.write("Could not authenticate with AWS. You must either:\n\n1) (preferred) Create a user in the IAM Identity Center and use the command 'aws aws sso login' or 'aws sso login --profile your-profile-name' and excecute 's3-empty-bucket your-bucket-name --profile your-profile-name'.\n2) Generate API keys and place in the '~/.aws/credentials' file.\n\n")
    errorCode = 3
  } else {
    process.stderr.write(e.message + '\n')
    errorCode = 4
  }
  process.exit(errorCode) // eslint-disable-line no-process-exit
}

const handleHelp = () => {
  const sections = [
    { header : 's3-empty-bucket', content : 'Empties an AWS S3 bucket.' },
    {
      header  : 'Usage',
      content : 's3-empty-bucket <options> [s3-bucket-name]'
    },
    {
      header  : 'Options',
      content : cliSpec.mainOptions.map(({ name, description }) => ({ name, summary : description }))
    }
  ]
  process.stdout.write(commandLineUsage(sections) + '\n')
}

export { s3EmptyBucket }
