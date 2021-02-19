import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as any,
  uri: null as unknown as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (this.client) {
      if (!this.client.isConnected) {
        await this.connect(this.uri)
      }
      return this.client.db().collection(name)
    } else {
      await this.connect(this.uri)
      return this.client.db().collection(name)
    }
  },

  mapObject: (collection: any): any => {
    if (collection) {
      const { _id, ...collectionWithoutId } = collection
      return Object.assign({}, collectionWithoutId, { id: _id })
    } else {
      return null
    }
  },

  mapArray: (collection: any[]): any => {
    if (collection) {
      return collection.map(c => MongoHelper.mapObject(c))
    } else {
      return null
    }
  }
}
