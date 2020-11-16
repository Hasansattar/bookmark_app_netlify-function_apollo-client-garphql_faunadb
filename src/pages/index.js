import React from "react";
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import './style.css'
import Card from '../components/card'

const GET_BOOKMARKS = gql`{
    bookmarks{
      id
      url
      title
    }
  }`;


const ADD_BOOKMARKS = gql`
  mutation addBookmark($url:String!, $title:String!){
    addBookmark(url:$url,title:$title){
      id
    }
  }
  `

export default function Home() {
  let titleField;
  let urlField;



  const [addBookmark] = useMutation(ADD_BOOKMARKS);

  const addbook = () => {
    console.log(titleField.value);
    console.log(urlField.value);
    addBookmark({
      variables: {
        url: urlField.value,
        title: titleField.value
      },
      refetchQueries: [{ query: GET_BOOKMARKS }]
    })
  }

  const { loading, error, data } = useQuery(GET_BOOKMARKS);

  console.log(data);

  if (loading)
    return <h2>loading...</h2>
  if (error)
    return <h2>error</h2>



  return <div className="container">
    <h2>ADD NEW BOOKMARK</h2>

    <label>
      ENTER BOOKMARK TITLE: <br />
      <input type="text" ref={node => titleField = node} />
    </label>

    <br />

    <label>
      ENTER BOOKMARK URL: <br />
      <input type="text" ref={node => urlField = node} />
    </label>

    <br />

    <button onClick={addbook}>ADD Bookmark</button>
    <h3>MY BOOKMARK LIST</h3>
    
    {/* {JSON.stringify(data.bookmarks)} */}

    <div className='card-container'>
      {data.bookmarks.map((bm) => <Card url={bm.url} title={bm.title} />)}
    </div>

  </div>

};