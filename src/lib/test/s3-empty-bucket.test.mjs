import { emptyBucket } from '../s3-empty-bucket'
// Not the greatest unit test, but wanted to knock it.
const contents = [
  { Key : 'foo' },
  { Key : 'bar' }
]

const mockS3Client = {
  callCount : 0,
  send      : (input) => {
    mockS3Client.callCount += 1

    if (mockS3Client.callCount === 1) {
      return {
        Contents : contents
      }
    } else if (mockS3Client.callCount === 2) {
      mockS3Client.deleteInput = input.input
    }
  }
}

describe('s3EmptyBucket', () => {
  test('generates correct/complete delete command input', async () => {
    await emptyBucket({ bucketName : 'foo-bar', s3Client : mockS3Client })
    expect(mockS3Client.deleteInput.Delete.Objects).toEqual(contents)
  })
})
