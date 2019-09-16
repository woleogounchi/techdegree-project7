import React, { Component } from 'react';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import axios from 'axios';

// Import components
import './style/App.css';
import apiKey from './config';
import SearchForm from './components/SearchForm';
import Nav from './components/Nav';
import PhotoContainer from './components/PhotoContainer';

export default class App extends Component {
  
  constructor() {
    super();
    this.state = {
      photos: [],
      loading: true
    };
  } 

  componentDidMount() {
    this.performSearch();
  }
  
  performSearch = (query = 'cats') => {
    axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${query}&per_page=24&format=json&nojsoncallback=1`)
      .then(response => {
        this.setState({
          photos: response.data.photos.photo,
          loading: false
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });    
  }
  
  render() { 
    console.log(this.state.photos);
    return (
      <BrowserRouter>
        <div>
          <div className="main-header">
            <div className="inner">
              <h1 className="main-title">Gallery App</h1>
              <SearchForm onSearch={this.performSearch} />      
              <Nav onClick={this.performSearch}/>      
            </div>   
          </div>    
          <div className="main-content">
            {
              (this.state.loading)
              ? <p>Loading...</p>
              : 
              <Switch>
                <Route exact path="/" render={ () => <Redirect to={`/search/cats`} />} />
                <Route exact path="/search/:query" render={(props) => <PhotoContainer {...props} photos={this.state.photos} />} />
                <Route />
              </Switch>
            }          
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
