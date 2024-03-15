import { v4 as uuid4 } from 'uuid'

import { emptyBucket } from '../s3-empty-bucket'
// Not the greatest unit test, but wanted to knock it.
const contents = [
  { Key : 'foo' },
  { Key : 'bar' }
]

const makeMockS3Client = (callsSpec) => {
  const mockS3Client = {
    callCount : 0,
    send      : (input) => {
      mockS3Client.callCount += 1
      const { callCount } = mockS3Client

      let result
      if (callCount % 2 === 1) { // list objects
        const callSpec = callsSpec[Math.floor(callCount / 2)]
        if (Array.isArray(callSpec)) {
          result = { Contents: callSpec }
        }
        else { // callSpec is an integer
          const objects = []
          for (let i = 0; i < callSpec; i += 1) {
            objects.push({ Contents: { Key: uuid4() }})
          }

          result = { Contents: objects }
        }

        mockS3Client.lastContents = result
        if (Math.ceil(callCount/2) < callsSpec.length) {
          result.IsTruncated = true
        }

        return result
      } else { // it's a 2nd call, so we capture the delete Input
        mockS3Client.deleteInput = input.input
      }
    }
  }

  return mockS3Client
}

describe('s3EmptyBucket', () => {
  test('generates correct/complete delete command input', async () => {
    const mockS3Client = makeMockS3Client([contents])
    await emptyBucket({ bucketName : 'foo-bar', s3Client : mockS3Client })
    expect(mockS3Client.deleteInput.Delete.Objects).toEqual(contents)
  })

  // as of 2024-03-15, the max number of items is 1,000
  test('handles large numbers of object (1500)', async() => {
    const mockS3Client = makeMockS3Client([1000,500])
    await emptyBucket({ bucketName: 'foo-bar', s3Client: mockS3Client, verbose: true /* DEBUG */ })
    expect(mockS3Client.deleteInput.Delete.Objects).toHaveLength(500) // we see the last one
    expect(mockS3Client.callCount).toBe(4) // page, delete , 2nd page, delete
  })
})

