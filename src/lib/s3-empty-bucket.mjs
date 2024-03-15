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
  let marker, isTruncated
  do {
    maybeSay('Cataloging files...\n', verbose)
    const objects = []

    const listObjectsCommand = new ListObjectsCommand({ Bucket : bucketName, Marker : marker })
    const listObjectsResult = await s3Client.send(listObjectsCommand)

    const contents = listObjectsResult.Contents || [];
    ({ IsTruncated: isTruncated } = listObjectsResult)

    objects.push(...contents)

    maybeSay(`Deleting ${objects.length} files...\n`, verbose)

    const input = {
      Bucket : bucketName,
      Delete : {
        Objects : objects.map(({ Key }) => ({ Key }))
      },
      Quiet : true
    }

    if (objects.length === 0) { // this can only happen on the first call
      maybeSay('Bucket already empty.\n', verbose)
    } else {
      const deleteObjectsCommand = new DeleteObjectsCommand(input)
      await s3Client.send(deleteObjectsCommand)
    }

    marker = isTruncated === true ? objects[objects.length - 1].Key : undefined
  } while (isTruncated === true)

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
