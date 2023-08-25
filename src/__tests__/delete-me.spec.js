const FirestoreAdapter = require('../adapters/gcp/firestore')

const fs = new FirestoreAdapter()

describe('Testing Cloud Firestore calls', () => {
   // test('should return array', async () => {
   //    const result = await fs.getDocs({ collection: 'tenants' })
   //    console.log('result', result)
   //    expect(result).toBeTruthy()
   // })
   test('should return array', async () => {
      const result = await fs.getDocs({
         collection: 'tenants',
         id: 'acmeisd',
         subcollection: 'providers',
      })
      console.log('result', result)
      expect(result).toBeTruthy()
   })
})
