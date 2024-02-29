import { DeleteObjectsCommand, ListObjectsCommand } from '@aws-sdk/client-s3'

const emptyBucket = async ({ bucketName, s3Client }) => {
  const objects = []
  let marker, isTruncated
  process.stdout.write('Cataloging files...')
  do {
    const listObjectsCommand = new ListObjectsCommand({ Bucket : bucketName, Marker : marker })
    const listObjectsResult = await s3Client.send(listObjectsCommand)

    const contents = listObjectsResult.Contents;
    ({ IsTruncated: isTruncated, Marker: marker } = listObjectsResult)

    objects.push(...contents)
  } while (isTruncated === true)
  process.stdout.write(`Deleting ${objects.length} files...\n`)

  const input = {
    Bucket : bucketName,
    Delete : {
      Objects : objects.map(({ Key }) => ({ Key }))
    },
    Quiet : true
  }

  const deleteObjectsCommand = new DeleteObjectsCommand(input)
  await s3Client.send(deleteObjectsCommand)

  process.stdout.write('Done!\n')
}

export { emptyBucket }
