import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import './styles/index.css';
import App from './components/App';


//1. Import the required components from @apollo/client package
import {
  ApolloProvider, 
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';


//2. Expose the server link where the GraphQL server will be running
const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
})


//3. Create an instance of an ApolloClient
const client = new ApolloClient({
  link: httpLink,
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

