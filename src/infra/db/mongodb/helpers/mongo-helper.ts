import { Collection, MongoClient } from 'mongodb'
import unknown from '../../../../../jest-integration-config'

export const MongoHelper = {
  client: unknown as MongoClient,
  uri: unknown as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = unknown
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client.isConnected) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  map: (collection: any): any => {
    if (collection) {
      const { _id, ...collectionWithoutId } = collection
      return Object.assign({}, collectionWithoutId, { id: _id })
    } else {
      return null
    }
  }
}
