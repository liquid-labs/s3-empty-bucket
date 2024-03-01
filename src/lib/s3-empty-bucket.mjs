import { DeleteObjectsCommand, ListObjectsCommand } from '@aws-sdk/client-s3'

const emptyBucket = async ({ bucketName, s3Client, verbose }) => {
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
    return
  }

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

  maybeSay('Done!\n', verbose)
}

const maybeSay = (message, verbose) => {
  if (verbose === true) {
    process.stdout.write(message)
  }
}

export { emptyBucket }
