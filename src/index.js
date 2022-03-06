import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {setContext} from '@apollo/client/link/context';
import {split} from '@apollo/client';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import './styles/index.css';
import App from './components/App';


//1. Import the required components from @apollo/client package
import {
  ApolloProvider, 
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';
import { AUTH_TOKEN } from './constants';


//2. Expose the server link where the GraphQL server will be running
const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
})


//Create a WebSocketLink to represent the WebSocket connection
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
})

//Setting token obtained from local storage to authorize user requests by using the token
const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

//Using split to properly route the requests
//Split function takes in three arguments:
// The first is a test function which returns a boolean
// The second argument is the link where the request will be forwarded to if the function returns true
// the third argument is the link where the request will be forwarded to if the first argument returns false
const link = split(
  ({query}) => {
    const {kind, operation} = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' &&
      operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
)


//3. Create an instance of an ApolloClient
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

