const express = require('express');
const app = express();
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion ,ObjectId } = require('mongodb');
dotenv.config();
const cors = require('cors')
const port = process.env.PORT;

app.use(cors());
app.use(express.json());





app.get('/', (req, res) => {
  res.send('Hello World!');
});






const client = new MongoClient(process.env.uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const ticketDb = await  client.db('ticketodb')
    const organizationsCollection = ticketDb.collection('organizations')
    const eventsCollection = ticketDb.collection('events')
    const usersCollection = ticketDb.collection('user')
    const bookingCollection = ticketDb.collection('bookings')
    const paymentsCollection = ticketDb.collection('payments')







app.get('/api/organizations/:email', async (req, res) => {
  const { email } = req.params;

  const result = await organizationsCollection.findOne({
    organizationEmail: email,
  });

  res.json(result);
});


app.delete('/api/manage-events/:id', async(req,res)=> {
  const {id} = req.params;

  const result = await eventsCollection.deleteOne({_id: new ObjectId(id)})
  console.log(result);

  res.send(result)






})


app.get('/api/events/:id', async(req,res)=> {

  const {id} = req.params ;

  const result = await eventsCollection.findOne({_id:new ObjectId(id)})
  console.log(result);
  res.send(result)




})



app.post('/api/events/booking', async(req,res)=> {


  const {amount, eventId, eventTitle, quantity, email, paymentType, transactionId} = req.body;
  console.log(req.body);

  const bookingData = {
    eventId,
    eventTitle,
    attendeeEmail: email,
    quantity,
    amount,
    transactionId,
    paymentType,
    bookingDate: new Date(),  

  }

  console.log(bookingData);



  // const bookingRes = await bookingCollection.insertOne(bookingData);

  // await eventsCollection.updateOne(
  //   {_id: new ObjectId(eventId)},
    
  //   {
  //     $inc:
  //      {
  //       eventSeats: -quantity
      
  //     }
    
  //   });

  //   const paymentData = {
  //     transactionId,
  //     paymentStatus,
  //     amount,
  //    userEmail: email,
  //    paymentType,
  //     createdAt: new Date()
  //   }

  //   await paymentsCollection.insertOne(paymentData);

  //   res.send(bookingRes)







})







app.get('/api/events/:email', async(req,res)=> {

  const {email} = req.params ;

  const result = await eventsCollection.find({organizer:email}).toArray()
  console.log(result);
  res.send(result)




})

app.get("/api/events", async (req, res) => {
  const search = req.query.search;
  const category = req.query.category;
  const location = req.query.location;

  const query = {};

  if (search) {
    query.eventTitle = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    query.eventCategory = category;
  }

  if (location) {
    query.eventLocation = location;
  }

  const result = await eventsCollection.find(query).toArray();

  res.send(result);
});


app.post('/api/events', async(req,res)=> {

  const data = req.body;

  // console.log(data);


  const organizer = await usersCollection.findOne({email: data?.organizer})

  // console.log(organizer);


  const organizerCount = await eventsCollection.countDocuments({organizer: data?.organizer})
  // console.log(organizerCount);

  if(!organizer?.isPremium && organizerCount>=3){

    return res.status(401).send({
      massage: "Your Free Limit is Over"
    })

  }else{

    
    const result = await eventsCollection.insertOne({
      ...data,
      status : 'pending'
      
    });
    
    console.log(result);
    res.send(result)
    
  }
    

})

app.patch('/api/organizations/:id', async(req,res)=> {
  const {id} = req.params ;



  const {organizationName, image , website, description , organizationEmail} = req.body ;

   const updateData = {

            organizationName,
            image , 
            website,
            description,
            organizationEmail,
            createdAt :  new Date(),
            status : "active"

        } 

        console.log(updateData);



  
        const result = await organizationsCollection.updateOne(

          {_id : new ObjectId(id)},
          {
            $set : {
              ...updateData

            }
          }
          

    



        );
        console.log(result);

        res.json(result)




})   


app.patch('/api/users/upgrade-premium/:email', async(req,res)=> {
  const {email} = req.params;



  const result = await usersCollection.updateOne({
    email
  },

  {

    $set: {
      isPremium: true
    }
  }
)


res.send(result)



})













    app.post('/api/organizations', async(req,res)=> {


        const {organizationName, image , website, description , organizationEmail} = req.body ;


        const addData = {

            organizationName,
            image , 
            website,
            description,
            organizationEmail,
            createdAt :  new Date(),
            status : "active"

        } 

        const result = await organizationsCollection.insertOne(addData);
        console.log(result);

        res.send(result)
    })












    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);














app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});