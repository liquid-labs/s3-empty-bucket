# s3-empty-bucket

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
npm i s3-empty-bucket
```

To install the CLI:
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
##  API Reference
_API generated with [dmd-readme-api](https://www.npmjs.com/package/dmd-readme-api)._

<a id="emptyBucket"></a>
### `emptyBucket()`

Empties AWS S3 bucket.

**Parameter**: `string` options.bucketName - The name of the bucket to empty.  
**Parameter**: (object} options.s3Client) - Authenticated `S3Client`.  
**Parameter**: `boolean` options.verbose - When true, will report actions to `process.stdout`.  

[**Source code**](./src/lib/s3-empty-bucket.mjs#L10)

## CLI command reference

### Usage

`s3-empty-bucket <options> [bucketName]`

### Options

|Option|Description|
|------|------|
|`[bucketName]`|(_main argument_,_required_) The name of the bucket to empty.|
|`--document`|Generates command line documentation in Markdown format. All other options are ignored.|
|`--help`, `-?`|Prints command help.|
|`--profile`, `-p`|The SSO profile to use.|
|`--quiet`, `-q`|Suppresses output.|
|`--throw-error`|Instead of printing simple message, allows exceptions to bubble up to the user.|



## Contributing

Plase feel free to submit any [bug reports or feature suggestions](https://github.com/liquid-labs/s3-empty-bucket/issues). You're also welcome to submit patches of course. We don't have a full contributors policy yet, but you can post questions on [our discord channel](https://discord.gg/QWAav6fZ5C). It's not monitored 24/7, but you should hear back from us by next business day generally.

## Support and feature requests

The best way to get free support is to [submit a ticket](https://github.com/liquid-labs/s3-empty-bucket/issues). You can also become a patron for as little as $1/month and get priority support and request new feature on [all Liquid Labs open source software](https://github.com/liquid-labs). You can get these benefits and [support our work at patreon.com/zanecodes](https://www.patreon.com/zanecodes).