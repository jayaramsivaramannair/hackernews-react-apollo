import React from 'react'
import Link from './Link';
import {useLocation} from 'react-router-dom';
import {LINKS_PER_PAGE} from '../constants';

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


const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
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
      user {
        id
      }
    }
  }
`;

//A query is sent to the server using gql query string and then the resultant data is stored in FEED_QUERY
//skip argument determines the number of links we need to skip before we fetch the list
//Take argument determines the number of items which the list should be composed of. 
export const FEED_QUERY = gql`
  query FeedQuery(
    $take: Int
    $skip: Int
    $orderBy: LinkOrderByInput
  ) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
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
      count
    }
  }
`;

const LinkList = () => {
  const location = useLocation();
  const isNewPage = location.pathname.includes('new');
  const pageIndexParams = location.pathname.split('/')
  const page = parseInt(pageIndexParams[pageIndexParams.length - 1]);
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE: 0;
  const getQueryVariables = (isNewPage, page) => {
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const take = isNewPage ? LINKS_PER_PAGE: 100;
    const orderBy = {createdAt: 'desc'};
    return {take, skip, orderBy};
  }
  //The data returned from the graphQL server is extracted so that it can be used to display links
  const {
    data,
    loading,
    error,
    subscribeToMore
  } = 
  useQuery(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page),
    fetchPolicy: "cache-and-network"
  });

  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION
  });

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
