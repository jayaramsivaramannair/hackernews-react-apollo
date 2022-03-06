import React from 'react'
import Link from './Link';

//Imports useQuery hook from @apollo/client package
import { useQuery, gql } from '@apollo/client';

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

//A query is sent to the server using gql query string and then the resultant data is stored in FEED_QUERY
export const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const LinkList = () => {
  //The data returned from the graphQL server is extracted so that it can be used to display links
  const {
    data,
    loading,
    error,
    subscribeToMore
  } = 
  useQuery(FEED_QUERY)

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if(!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(
        ({id}) => id === newLink.id
      );
      if (exists) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename
        }
      })
    }
  })

  return (
    <div>
      {
        data && (
          <>
            {data.feed.links.map((link, index) => {
              return <Link key={link.id} link={link} index={index}/>
            })}
          </>
        )
      }
    </div>
  )
}

export default LinkList
