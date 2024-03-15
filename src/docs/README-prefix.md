# s3-empty-bucket

___This is alpha software.___ As far as we know and have tested, everything works, but this is alpha software. At the same time, it is supported software so file a bug or get support on [our discord channel](https://discord.gg/QWAav6fZ5C).

--------

Library and CLI to quickly empty AWS S3 buckets.

While we expect this library to work in most cases, it has not been extensively tested. However, we actively support this library so please [submit any issues](https://github.com/liquid-labs/s3-empty-bucket/issues) and we'll be happy to look into it.

- [Installation](#installation)
- [Usage](#usage)
- [API reference](#api-reference)
- [CLI command reference](#cli-command-reference)
- [Contributing](#contributing)
- [Support and feature requests](#support-and-feature-requests)

## Installation

To install the library:
```bash
npm i --omit peer s3-empty-bucket # peer deps only needed for CLI
```

To install the CLI (globally):
```bash
npm i -g s3-empty-bucket
```

## Usage

### Library

```javascript
import { S3Client } from '@aws-sdk/client-s3'
import { fromIni } from '@aws-sdk/credential-providers'

import { emptyBucket } from 's3-empty-bucket' // ES6
// const { emptyBucket } = require('s3-empty-bucket') // cjs

// following works with API keys, include the profile when using SSO sessions
const credentials = fromIni(/* { profile : ssoProfile }*/)
const s3Client = new S3Client({ credentials })

emptyBucket({ bucketName, s3Client, verbose: false })
```

### CLI

```bash
# following works with API keys, include the profile when using SSO sessions
s3-empty-bucket my-bucket-name # --profile your-sso-profile
```