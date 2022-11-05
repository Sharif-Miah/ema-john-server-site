const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

require('dotenv').config({ encoding: 'latin1' })

// middle ware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Ema john server is Running')
})


const uri = `mongodb+srv://${process.env.EMAJOHN_NAME}:${process.env.EMAJOHN_PASSWORD}@cluster0.dfmvdpa.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const productCollection = client.db('emaJohn').collection('product');

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size);
            const query = {};
            const cursor = productCollection.find(query)
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count, products })
        })

        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectsIds = ids.map(id => ObjectId(id))
            const query = { _id: { $in: objectsIds } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray()
            res.send(products)
        })
    }
    finally {

    }
}
run().catch(err => console.error(err))



app.listen(port, () => {
    console.log('Server is Running on port', port);
})