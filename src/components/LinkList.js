import React from 'react'
import Link from './Link';

//Imports useQuery hook from @apollo/client package
import { useQuery, gql } from '@apollo/client';

//A query is sent to the server using gql query string and then the resultant data is stored in FEED_QUERY
const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`

const LinkList = () => {
  //The data returned from the graphQL server is extracted so that it can be used to display links
  const {data} = useQuery(FEED_QUERY)

  return (
    <div>
      {
        data && (
          <>
            {data.feed.links.map((link) => {
              return <Link key={link.id} link={link}/>
            })}
          </>
        )
      }
    </div>
  )
}

export default LinkList
