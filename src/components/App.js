import React from 'react';
import CreateLink from './CreateLink';
import Header from './Header';
import LinkList from './LinkList';
import Login from './Login'
import Search from './Search';
import { Route, Routes, Navigate } from 'react-router-dom';


const App = () => {
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Routes>
          {/* The base route navigates to the first page of the links*/}
          <Route path="/" element={<Navigate replace to="/new/1" />} />
          <Route
            path="/create"
            element={<CreateLink/>}
          />
          <Route path="/login" element={<Login />}/>
          <Route path="/search" element={<Search />} />
          {/*This Route displays the top voted links*/}
          <Route path="/top" element={<LinkList />} />
          {/*This route displays only limited links on a certain page and allows for pagination */}
          <Route 
            path="/new/:page"
            element={<LinkList />}
          />
        </Routes>
      </div>
    </div>
  )
}


export default App;
