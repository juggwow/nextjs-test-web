// mongodb.js

import { MongoClient } from 'mongodb'

const uri = "mongodb+srv://pmpeayala:Tobxu06Oa2M7qme3@s3madpm01.hltgsm5.mongodb.net/?retryWrites=true&w=majority"
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

let client = new MongoClient(uri, options)
let clientPromise = client.connect()


export default clientPromise
