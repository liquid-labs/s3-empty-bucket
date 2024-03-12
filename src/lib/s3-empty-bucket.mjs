import { DeleteBucketCommand, DeleteObjectsCommand, ListObjectsCommand } from '@aws-sdk/client-s3'

/**
 * Empties AWS S3 bucket.
 * @param {object} options - The destructured options object.
 * @param {string} options.bucketName - The name of the bucket to empty.
 * @param {boolean} options.doDelete - If true, then deletes the bucket after emptying it.
 * @param {object} options.s3Client - Authenticated `S3Client`.
 * @param {boolean} options.verbose - When true, will report actions to `process.stdout`.
 */
const emptyBucket = async ({ bucketName, doDelete, s3Client, verbose }) => {
  const objects = []
  let marker, isTruncated

  maybeSay('Cataloging files...\n', verbose)
  do {
    const listObjectsCommand = new ListObjectsCommand({ Bucket : bucketName, Marker : marker })
    const listObjectsResult = await s3Client.send(listObjectsCommand)

    const contents = listObjectsResult.Contents || [];
    ({ IsTruncated: isTruncated, Marker: marker } = listObjectsResult)

    objects.push(...contents)
  } while (isTruncated === true)

  if (objects.length === 0) {
    maybeSay('Bucket already empty.\n', verbose)
  } else {
    maybeSay(`Deleting ${objects.length} files...\n`, verbose)

    const input = {
      Bucket : bucketName,
      Delete : {
        Objects : objects.map(({ Key }) => ({ Key }))
      },
      Quiet : true
    }

    const deleteObjectsCommand = new DeleteObjectsCommand(input)
    await s3Client.send(deleteObjectsCommand)
  }

  if (doDelete === true) {
    maybeSay(`Deleting bucket '${bucketName}'...\n`)
    const deleteBucketCommand = new DeleteBucketCommand({ Bucket : bucketName })
    await s3Client.send(deleteBucketCommand)
  }

  maybeSay('Done!\n', verbose)
}

const maybeSay = (message, verbose) => {
  if (verbose === true) {
    process.stdout.write(message)
  }
}

export { emptyBucket }
