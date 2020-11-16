const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;


const typeDefs = gql`
  type Query {    
 bookmarks: [Bookmark]
     }

  type Mutation{
    addBookmark(title:String!, url:String!): Bookmark
  }


  type Bookmark {
    id: ID!
    title: String!
    url: String!
  }
`



const resolvers = {
  Query: {

    bookmarks: async () => {
      try {
        var adminClient = new faunadb.Client({ secret: 'fnAD6USJAlACAZclbn1CG-tLg-lvV7mp_sCEwD9e' });


        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('bookmarkindex'))),
            q.Lambda(x => q.Get(x))
          )
        )
        console.log(result.data);
        // return result.data

        return result.data.map(d => {
          return {
            id: d.ts,
            title: d.data.title,
            url: d.data.url
          }
        })




        // return[{
        //   id:1,                   // <== this is for dammy data passing to check data is going through or not
        //   title:"temp title",
        //   url:"example.com"
        // }]

      }
      catch (error) {
        console.log(error);
      }

    },

  },

  Mutation: {
    addBookmark: async (_, { title, url }) => {
      // console.log("===========")
      // console.log(title,url)
      // return{                 //<===// <== this is for dammy data passing to check data is going through or not
      //   id:1,
      //   title,
      //   url

      // }
      try {
        var adminClient = new faunadb.Client({ secret: 'fnAD6USJAlACAZclbn1CG-tLg-lvV7mp_sCEwD9e' });


        const result = await adminClient.query(
          q.Create(
            q.Collection('bookmarkscollection'),
            {
              data: {
                title,
                url
              }
            },
          )
        )
        console.log(result.data);
        return result.data.data

      }
      catch (error) {
        console.log(error);
      }

    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
